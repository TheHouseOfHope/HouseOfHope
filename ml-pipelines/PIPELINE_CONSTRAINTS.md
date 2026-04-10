## ML pipeline constraints (do not break Azure)

These rules exist because a prior ML iteration caused Azure HTTP 500s by introducing Entity Framework schema drift (code expected columns that Azure SQL did not have). Treat this file as **non-negotiable** for any future pipeline.

### Source-of-truth: `backend/SeedData/*.csv`

- **Training must use CSVs** in `backend/SeedData` (or `ML_SEED_DATA_DIR` override).
- **Feature definitions must be expressible from SeedData columns** and their real-world value patterns (empty strings, inconsistent casing, `True/False` vs `0/1`, etc.).
- **Do not train from SQLite files** and **do not train from Azure SQL**.

### Runtime safety (Azure)

- **Inference is read-only**:
  - no database writes
  - no schema changes
  - no “store predictions in DB”
- **No migrations / no entity changes for ML**:
  - do not add EF properties/DbSets “just for ML features”
  - do not add columns/tables to support ML outputs
- **Fail-soft**: ML failures must not take down core endpoints.
  - If model files are missing or the model contract does not match runtime data, return `ModelAvailable=false` and a safe fallback payload.
  - Do not throw unhandled exceptions that can bubble into HTTP 500.

### Model contract discipline

- Every model must ship with:
  - `backend/Models/<model>.onnx`
  - `backend/Models/<model>_preprocessing.json` (feature order, defaults, version)
  - optional: `backend/Models/<MODEL>_CONTRACT.md`
- **The ONNX input names and feature order are a contract.** If the contract changes, version bump the model and deploy both ONNX + JSON together.

### Data contract discipline (CSV patterns)

- Treat CSV headers as canonical. If a runtime table doesn’t exist in Azure, **do not** depend on its CSV (example: a CSV may exist for offline analysis but the corresponding table may not exist in production).
- Prefer features that can be computed from tables that already exist in `InitialCreate` (or otherwise verified to exist on Azure).

### Repo hygiene (avoid build artifact scares)

- Only commit intentional ML artifacts:
  - `.onnx` model(s)
  - small `.json` metadata
  - notebooks/scripts/docs
- Never commit:
  - `bin/`, `obj/`, temp build directories
  - ad-hoc DLL drops
  - large generated JSON dumps (unless explicitly required and reviewed)

### Deployment checklist (must pass before merge)

- `dotnet build` succeeds.
- No new EF migrations were created.
- No changes to `backend/Data/Entities.cs` or `backend/Migrations/*` were required for ML.
- API returns successfully even if the model files are removed (ML returns unavailable, API stays up).

