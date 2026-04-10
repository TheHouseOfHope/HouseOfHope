using System.Globalization;
using System.Text.Json;
using HouseOfHope.API.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.ML.OnnxRuntime;
using Microsoft.ML.OnnxRuntime.Tensors;

namespace HouseOfHope.API.Services;

public sealed class SafehousePerformancePredictionRow
{
    public bool ModelAvailable { get; set; }
    public string ModelVersion { get; set; } = "safehouse-ridge-benchmark-v2";
    public string ScoredAtUtc { get; set; } = "";

    public int SafehouseId { get; set; }
    public string SafehouseName { get; set; } = "";

    // Observed / actual
    public double OutcomeIndexActual { get; set; }

    // Model expected outcome index for this safehouse’s operational profile
    public double OutcomeIndexExpected { get; set; }

    // Actual - Expected
    public double BenchmarkGap { get; set; }

    public string TierLabel { get; set; } = "unknown";
    public List<string> TopDrivers { get; set; } = [];
    public List<string> RecommendedActions { get; set; } = [];
}

internal sealed class SafehousePreprocessingMetadata
{
    [System.Text.Json.Serialization.JsonPropertyName("model_version")]
    public string ModelVersion { get; set; } = "";

    [System.Text.Json.Serialization.JsonPropertyName("feature_names")]
    public List<string> FeatureNames { get; set; } = [];

    [System.Text.Json.Serialization.JsonPropertyName("imputer_medians")]
    public List<double> ImputerMedians { get; set; } = [];

    [System.Text.Json.Serialization.JsonPropertyName("network_means")]
    public Dictionary<string, double> NetworkMeans { get; set; } = new();

    [System.Text.Json.Serialization.JsonPropertyName("tier_strong_cut")]
    public double TierStrongCut { get; set; }

    [System.Text.Json.Serialization.JsonPropertyName("tier_attention_cut")]
    public double TierAttentionCut { get; set; }
}

public sealed class SafehousePerformancePredictionService : IDisposable
{
    private readonly LighthouseDbContext _db;
    private readonly ILogger<SafehousePerformancePredictionService> _logger;
    private readonly InferenceSession? _session;
    private readonly SafehousePreprocessingMetadata? _meta;
    private readonly bool _modelAvailable;
    private bool _disposed;

    private const string ModelFileName = "safehouse_performance_model.onnx";
    private const string MetadataFileName = "safehouse_performance_preprocessing.json";

    public SafehousePerformancePredictionService(
        LighthouseDbContext db,
        IWebHostEnvironment env,
        ILogger<SafehousePerformancePredictionService> logger)
    {
        _db = db;
        _logger = logger;

        try
        {
            var basePath = env.ContentRootPath;
            var modelPath = Path.Combine(basePath, "Models", ModelFileName);
            var metaPath = Path.Combine(basePath, "Models", MetadataFileName);

            if (!File.Exists(modelPath) || !File.Exists(metaPath))
            {
                _logger.LogWarning(
                    "Safehouse ONNX model or metadata not found. model={ModelPath} meta={MetaPath}",
                    modelPath, metaPath);
                _modelAvailable = false;
                return;
            }

            _session = new InferenceSession(modelPath);
            var metaJson = File.ReadAllText(metaPath);
            _meta = JsonSerializer.Deserialize<SafehousePreprocessingMetadata>(
                metaJson,
                new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

            if (_meta == null || _meta.FeatureNames.Count == 0)
            {
                _logger.LogWarning("Failed to deserialize safehouse preprocessing metadata.");
                _modelAvailable = false;
                return;
            }

            _modelAvailable = true;
            _logger.LogInformation(
                "SafehousePerformancePredictionService initialized. Features={Count}",
                _meta.FeatureNames.Count);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to initialize SafehousePerformancePredictionService.");
            _modelAvailable = false;
        }
    }

    public async Task<List<SafehousePerformancePredictionRow>> ScoreAllSafehousesAsync(CancellationToken ct)
    {
        // Fail-soft: return an empty list rather than breaking core analytics pages.
        if (!_modelAvailable || _session == null || _meta == null)
            return [];

        var now = DateTime.UtcNow;

        // Pull minimal rows; compute aggregates in-memory (safehouses are small N).
        var safehouses = await _db.Safehouses.AsNoTracking().ToListAsync(ct);
        var residents = await _db.Residents.AsNoTracking().ToListAsync(ct);
        var ids = residents.Select(r => r.ResidentId).ToList();

        var processRows = await _db.ProcessRecordings.AsNoTracking()
            .Where(x => ids.Contains(x.ResidentId))
            .ToListAsync(ct);
        var visitRows = await _db.HomeVisitations.AsNoTracking()
            .Where(x => ids.Contains(x.ResidentId))
            .ToListAsync(ct);
        var planRows = await _db.InterventionPlans.AsNoTracking()
            .Where(x => ids.Contains(x.ResidentId))
            .ToListAsync(ct);
        var eduRows = await _db.EducationRecords.AsNoTracking()
            .Where(x => ids.Contains(x.ResidentId))
            .ToListAsync(ct);
        var healthRows = await _db.HealthWellbeingRecords.AsNoTracking()
            .Where(x => ids.Contains(x.ResidentId))
            .ToListAsync(ct);

        var outList = new List<SafehousePerformancePredictionRow>();
        foreach (var sh in safehouses)
        {
            var group = residents.Where(r => r.SafehouseId == sh.SafehouseId).ToList();
            if (group.Count == 0) continue;

            var residentIds = group.Select(r => r.ResidentId).ToHashSet();

            var pr = processRows.Where(x => residentIds.Contains(x.ResidentId)).ToList();
            var hv = visitRows.Where(x => residentIds.Contains(x.ResidentId)).ToList();
            var ip = planRows.Where(x => residentIds.Contains(x.ResidentId)).ToList();
            var edu = eduRows.Where(x => residentIds.Contains(x.ResidentId) && x.ProgressPercent.HasValue).ToList();
            var health = healthRows.Where(x => residentIds.Contains(x.ResidentId) && x.GeneralHealthScore.HasValue).ToList();

            var actual = ComputeOutcomeIndexActual(group, edu, health);
            var features = BuildFeatures(group.Count, group, pr, hv, ip, edu, health);

            var expected = ScoreExpectedOutcome(features);
            var gap = actual - expected;

            var tier = actual >= _meta.TierStrongCut
                ? "Strong outcomes"
                : actual <= _meta.TierAttentionCut
                    ? "Needs attention"
                    : "Stable";

            var row = new SafehousePerformancePredictionRow
            {
                ModelAvailable = true,
                ModelVersion = _meta.ModelVersion ?? "safehouse-ridge-benchmark-v3",
                ScoredAtUtc = now.ToString("O", CultureInfo.InvariantCulture),
                SafehouseId = sh.SafehouseId,
                SafehouseName = sh.Name ?? $"Safehouse {sh.SafehouseId}",
                OutcomeIndexActual = Math.Round(actual, 2),
                OutcomeIndexExpected = Math.Round(expected, 2),
                BenchmarkGap = Math.Round(gap, 2),
                TierLabel = tier,
            };

            row.TopDrivers = BuildTopDrivers(features);
            row.RecommendedActions = BuildRecommendedActions(features);
            outList.Add(row);
        }

        // Most useful ordering: biggest negative gaps first.
        return outList.OrderBy(r => r.BenchmarkGap).ToList();
    }

    private double ScoreExpectedOutcome(double[] features)
    {
        if (_session == null || _meta == null)
            return 0;

        var expectedLen = _meta.FeatureNames.Count;
        if (features.Length != expectedLen)
        {
            _logger.LogWarning(
                "Safehouse feature length mismatch. expected={Expected} got={Got}",
                expectedLen, features.Length);
            return 0;
        }

        // ONNX exported as a single float tensor input named "float_input"
        var input = new DenseTensor<float>(new[] { 1, expectedLen });
        for (var i = 0; i < expectedLen; i++)
            input[0, i] = (float)features[i];

        var inputs = new List<NamedOnnxValue>
        {
            NamedOnnxValue.CreateFromTensor("float_input", input)
        };
        using var outputs = _session.Run(inputs);
        var v = outputs.First().AsEnumerable<float>().FirstOrDefault();
        return Math.Clamp(v, 0, 100);
    }

    // Feature order must match safehouse_performance_preprocessing.json
    private static double[] BuildFeatures(
        int nResidents,
        List<Resident> residents,
        List<ProcessRecording> processRows,
        List<HomeVisitation> visitRows,
        List<InterventionPlan> planRows,
        List<EducationRecord> eduRows,
        List<HealthWellbeingRecord> healthRows)
    {
        var processPerResident = processRows.Count / (double)Math.Max(1, nResidents);
        var visitsPerResident = visitRows.Count / (double)Math.Max(1, nResidents);

        var plans = planRows.Count;
        var achieved = planRows.Count(x => IsAchieved(x.Status));
        var interventionAchieveRate = plans == 0 ? 0.0 : achieved / (double)plans;

        var complexityMean = residents.Count == 0 ? 0.0 : residents.Average(SubcatSum);
        var pctHighCritical = residents.Count == 0 ? 0.0 : 100.0 * residents.Count(r => IsHighOrCritical(r.CurrentRiskLevel)) / residents.Count;

        var avgEdu = eduRows.Count == 0 ? 0.0 : eduRows.Average(x => x.ProgressPercent ?? 0);
        var avgHealth = healthRows.Count == 0 ? 3.0 : healthRows.Average(x => x.GeneralHealthScore ?? 3);

        return
        [
            processPerResident,
            visitsPerResident,
            interventionAchieveRate,
            complexityMean,
            pctHighCritical,
            nResidents,
            avgEdu,
            avgHealth
        ];
    }

    private static double ComputeOutcomeIndexActual(
        List<Resident> residents,
        List<EducationRecord> eduRows,
        List<HealthWellbeingRecord> healthRows)
    {
        var pctReint = residents.Count == 0 ? 0.0 : 100.0 * residents.Count(r => EqualsIgnoreCase(r.ReintegrationStatus, "Completed")) / residents.Count;
        var pctLow = residents.Count == 0 ? 0.0 : 100.0 * residents.Count(r => EqualsIgnoreCase(r.CurrentRiskLevel, "Low")) / residents.Count;

        var avgEdu = eduRows.Count == 0 ? 0.0 : eduRows.Average(x => x.ProgressPercent ?? 0);
        var avgHealth = healthRows.Count == 0 ? 3.0 : healthRows.Average(x => x.GeneralHealthScore ?? 3);
        var healthTerm = (avgHealth - 1.0) / 4.0 * 100.0;

        // NOTE: Runtime schema does not include initial_risk_level; do not include risk-improvement terms.
        var outcomeIndex = 0.35 * pctReint
            + 0.25 * Math.Min(100.0, avgEdu)
            + 0.20 * healthTerm
            + 0.20 * pctLow;

        return Math.Clamp(outcomeIndex, 0, 100);
    }

    private List<string> BuildTopDrivers(double[] features)
    {
        if (_meta == null) return [];
        // Simple explanatory layer: compare against network mean (from training panel).
        var outList = new List<string>();
        for (var i = 0; i < _meta.FeatureNames.Count && i < features.Length; i++)
        {
            var name = _meta.FeatureNames[i];
            if (!_meta.NetworkMeans.TryGetValue(name, out var mu)) continue;
            var delta = features[i] - mu;
            if (Math.Abs(delta) < 0.25) continue;
            outList.Add($"{Humanize(name)} {(delta >= 0 ? "above" : "below")} network average");
        }
        return outList.Take(4).ToList();
    }

    private List<string> BuildRecommendedActions(double[] features)
    {
        if (_meta == null) return ["Review safehouse operations against network baseline."];

        var map = _meta.FeatureNames.Zip(features, (k, v) => (k, v)).ToDictionary(x => x.k, x => x.v);
        var actions = new List<string>();

        if (map.TryGetValue("intervention_achieve_rate", out var achieve) && achieve < 0.15)
            actions.Add("Increase closure discipline on intervention plans (set targets, follow-ups, and mark achieved/closed).");
        if (map.TryGetValue("process_per_resident", out var pr) && _meta.NetworkMeans.TryGetValue("process_per_resident", out var muPr) && pr < muPr)
            actions.Add("Increase counseling documentation cadence per resident (more consistent process recordings).");
        if (map.TryGetValue("visits_per_resident", out var hv) && _meta.NetworkMeans.TryGetValue("visits_per_resident", out var muHv) && hv < muHv)
            actions.Add("Increase family/home visit follow-through where appropriate (raise visit cadence).");
        if (map.TryGetValue("avg_education_progress", out var edu) && edu < 75)
            actions.Add("Strengthen education acceleration plan (tutoring, attendance support, milestone tracking).");
        if (map.TryGetValue("avg_health_score", out var health) && health < 3.1)
            actions.Add("Prioritize preventive health check-ins and referrals (raise average health score).");
        if (map.TryGetValue("pct_high_critical_risk", out var hi) && hi > 25)
            actions.Add("High-risk caseload: increase supervision touchpoints and early intervention triggers.");

        if (actions.Count == 0)
            actions.Add("Maintain current service intensity; monitor month-over-month outcome index.");

        return actions.Take(5).ToList();
    }

    private static string Humanize(string feature) => feature.Replace('_', ' ');

    private static bool EqualsIgnoreCase(string? a, string b) =>
        string.Equals((a ?? "").Trim(), b, StringComparison.OrdinalIgnoreCase);

    private static bool IsAchieved(string? status) =>
        string.Equals((status ?? "").Trim(), "Achieved", StringComparison.OrdinalIgnoreCase)
        || string.Equals((status ?? "").Trim(), "Completed", StringComparison.OrdinalIgnoreCase)
        || string.Equals((status ?? "").Trim(), "Closed", StringComparison.OrdinalIgnoreCase);

    private static bool IsHighOrCritical(string? risk) =>
        string.Equals((risk ?? "").Trim(), "High", StringComparison.OrdinalIgnoreCase)
        || string.Equals((risk ?? "").Trim(), "Critical", StringComparison.OrdinalIgnoreCase);

    private static int SubcatSum(Resident r)
    {
        // Mirrors the CSV sub_cat_* count used in training.
        var sum = 0;
        if (r.SubCatOrphaned != 0) sum++;
        if (r.SubCatTrafficked != 0) sum++;
        if (r.SubCatChildLabor != 0) sum++;
        if (r.SubCatPhysicalAbuse != 0) sum++;
        if (r.SubCatSexualAbuse != 0) sum++;
        if (r.SubCatOsaec != 0) sum++;
        if (r.SubCatCicl != 0) sum++;
        if (r.SubCatAtRisk != 0) sum++;
        if (r.SubCatStreetChild != 0) sum++;
        if (r.SubCatChildWithHiv != 0) sum++;
        return sum;
    }

    private static double? RiskToNumNullable(string? level)
    {
        var v = (level ?? "").Trim();
        if (v == "") return null;
        return v switch
        {
            "Low" => 0,
            "Medium" => 1,
            "High" => 2,
            "Critical" => 3,
            _ => 1
        };
    }

    public void Dispose()
    {
        if (_disposed) return;
        _session?.Dispose();
        _disposed = true;
        GC.SuppressFinalize(this);
    }
}

