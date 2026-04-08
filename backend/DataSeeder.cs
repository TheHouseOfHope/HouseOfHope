using System.Globalization;
using System.Runtime.CompilerServices;
using CsvHelper;
using CsvHelper.Configuration;
using Microsoft.EntityFrameworkCore;

namespace HouseOfHope.API.Data;

public static class DataSeeder
{
    public static void Seed(LighthouseDbContext context)
    {
        var baseDir = AppContext.BaseDirectory;

        // PHASE 1: Parent Tables (No dependencies)
        if (!context.Safehouses.Any() && File.Exists(CsvPath(baseDir, "safehouses.csv")))
        {
            var safehouses = ReadCsv<Safehouse>(CsvPath(baseDir, "safehouses.csv"));
            SeedWithIdentityInsert(context, "safehouses", safehouses);
        }

        if (!context.Supporters.Any() && File.Exists(CsvPath(baseDir, "supporters.csv")))
        {
            var supporters = ReadCsv<Supporter>(CsvPath(baseDir, "supporters.csv"));
            SeedWithIdentityInsert(context, "supporters", supporters);
        }

        // PHASE 2: Core Entities (Rely on Phase 1)
        if (!context.Residents.Any() && File.Exists(CsvPath(baseDir, "residents.csv")))
        {
            var residents = ReadCsv<Resident>(CsvPath(baseDir, "residents.csv"));
            SeedWithIdentityInsert(context, "residents", residents);
        }

        if (!context.EducationRecords.Any() && File.Exists(CsvPath(baseDir, "education_records.csv")))
        {
            var educationRecords = ReadCsv<EducationRecord>(CsvPath(baseDir, "education_records.csv"));
            SeedWithIdentityInsert(context, "education_records", educationRecords);
        }

        if (!context.HealthWellbeingRecords.Any() && File.Exists(CsvPath(baseDir, "health_wellbeing_records.csv")))
        {
            var healthRecords = ReadCsv<HealthWellbeingRecord>(CsvPath(baseDir, "health_wellbeing_records.csv"));
            SeedWithIdentityInsert(context, "health_wellbeing_records", healthRecords);
        }
    }

    [MethodImpl(MethodImplOptions.AggressiveInlining)]
    private static string CsvPath(string baseDirectory, string fileName) =>
        Path.Combine(baseDirectory, "SeedData", fileName);

    private static List<T> ReadCsv<T>(string filePath)
    {
        var config = new CsvConfiguration(CultureInfo.InvariantCulture)
        {
            PrepareHeaderForMatch = args => SnakeToPascalHeader(args.Header)
        };
        using var reader = new StreamReader(filePath);
        using var csv = new CsvReader(reader, config);
        return csv.GetRecords<T>().ToList();
    }

    /// <summary>Maps CSV headers like education_record_id to EducationRecordId for CsvHelper.</summary>
    private static string SnakeToPascalHeader(string header)
    {
        var parts = header.Split('_', StringSplitOptions.RemoveEmptyEntries);
        return string.Concat(parts.Select(static p =>
            p.Length == 0 ? string.Empty : char.ToUpperInvariant(p[0]) + p[1..].ToLowerInvariant()));
    }

    private static void SeedWithIdentityInsert<T>(LighthouseDbContext context, string tableName, List<T> entities) where T : class
    {
        if (!entities.Any()) return;

        context.Set<T>().AddRange(entities);

        context.Database.OpenConnection();
        try
        {
            context.Database.ExecuteSqlRaw($"SET IDENTITY_INSERT {tableName} ON");
            context.SaveChanges();
            context.Database.ExecuteSqlRaw($"SET IDENTITY_INSERT {tableName} OFF");
        }
        finally
        {
            context.Database.CloseConnection();
        }
    }
}
