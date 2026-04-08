using CsvHelper;
using CsvHelper.Configuration;
using Microsoft.EntityFrameworkCore;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Collections.Generic;
// TODO: Add the 'using' statement for your Models folder here! (e.g., using HouseOfHope.API.Models;)

namespace HouseOfHope.API.Data;

public static class DataSeeder
{
    public static void Seed(LighthouseDbContext context)
    {
        // PHASE 1: Parent Tables (No dependencies)
        if (!context.Safehouses.Any() && File.Exists("SeedData/safehouses.csv"))
        {
            var safehouses = ReadCsv<Safehouse>("SeedData/safehouses.csv");
            SeedWithIdentityInsert(context, "safehouses", safehouses);
        }

        if (!context.Supporters.Any() && File.Exists("SeedData/supporters.csv"))
        {
            var supporters = ReadCsv<Supporter>("SeedData/supporters.csv");
            SeedWithIdentityInsert(context, "supporters", supporters);
        }

        // PHASE 2: Core Entities (Rely on Phase 1)
        if (!context.Residents.Any() && File.Exists("SeedData/residents.csv"))
        {
            var residents = ReadCsv<Resident>("SeedData/residents.csv");
            SeedWithIdentityInsert(context, "residents", residents);
        }

        // Add more Phase 2/3 tables here using the exact same pattern!
    }

    // Helper method to read the CSV file
    private static List<T> ReadCsv<T>(string filePath)
    {
        using var reader = new StreamReader(filePath);
        using var csv = new CsvReader(reader, CultureInfo.InvariantCulture);
        return csv.GetRecords<T>().ToList();
    }

    // Helper method to force Azure SQL to keep YOUR IDs from the CSV
    private static void SeedWithIdentityInsert<T>(LighthouseDbContext context, string tableName, List<T> entities) where T : class
    {
        if (!entities.Any()) return;

        context.Set<T>().AddRange(entities);
        
        // Open connection and temporarily allow custom IDs
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