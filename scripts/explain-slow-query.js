const mongoose = require("mongoose");
const Tour = require("../models/tourModel");
const dotenv = require("dotenv");
const path = require("path");

// Load environment variables first
dotenv.config({ path: path.join(__dirname, "../.env") });

async function analyzeTourQueries() {
  try {
    if (!process.env.DATABASE || !process.env.DATABASE_PASSWORD) {
      throw new Error("DATABASE or DATABASE_PASSWORD not found in environment variables");
    }
    const DB = process.env.DATABASE.replace(
      "<PASSWORD>",
      process.env.DATABASE_PASSWORD,
    );

    // Connect to your database
    await mongoose.connect(DB);
    console.log("Connected to database");

    // SCENARIO 1: Price + Rating + Difficulty query (common filtering)
    console.log(
      "\n🔍 Analyzing: Tours with price <= 500, rating >= 4.5, difficulty easy",
    );
    const query1 = Tour.find({
      price: { $lte: 500 },
      ratingsAverage: { $gte: 4.5 },
      difficulty: "easy",
    }).sort("-ratingsAverage");

    const explain1 = await query1.explain("executionStats");

    // Save to file
    const fs = require("fs");
    fs.writeFileSync(
      "explain-output-1.json",
      JSON.stringify(explain1, null, 2),
    );

    // Log key metrics
    console.log("📊 Metrics:");
    console.log(
      `- Execution time: ${explain1.executionStats.executionTimeMillis}ms`,
    );
    console.log(`- Documents returned: ${explain1.executionStats.nReturned}`);
    console.log(
      `- Documents examined: ${explain1.executionStats.totalDocsExamined}`,
    );
    console.log(
      `- Index keys examined: ${explain1.executionStats.totalKeysExamined}`,
    );
    console.log(`- Stage: ${explain1.queryPlanner.winningPlan.stage}`);

    // SCENARIO 2: Geospatial query (if you have location data)
    console.log("\n🔍 Analyzing: Tours near New York");
    const query2 = Tour.find({
      startLocation: {
        $near: {
          $geometry: { type: "Point", coordinates: [-74.006, 40.7128] },
          $maxDistance: 50000, // 50km
        },
      },
    });

    const explain2 = await query2.explain("executionStats");
    fs.writeFileSync(
      "explain-output-2.json",
      JSON.stringify(explain2, null, 2),
    );

    console.log("📊 Metrics:");
    console.log(
      `- Execution time: ${explain2.executionStats?.executionTimeMillis || "N/A"}ms`,
    );

    // SCENARIO 3: Aggregation pipeline with lookup (reviews)
    console.log("\n🔍 Analyzing: Tour stats with review data");
    const pipeline = [
      {
        $match: { ratingsAverage: { $gte: 4.0 } },
      },
      {
        $lookup: {
          from: "reviews",
          localField: "_id",
          foreignField: "tour",
          as: "reviews",
        },
      },
      {
        $project: {
          name: 1,
          price: 1,
          ratingsAverage: 1,
          reviewCount: { $size: "$reviews" },
        },
      },
      {
        $sort: { reviewCount: -1 },
      },
      {
        $limit: 10,
      },
    ];

    const explain3 = await mongoose.connection.db.command({
      aggregate: 'tours',
      pipeline: pipeline,
      explain: true
    });
    fs.writeFileSync(
      "explain-output-3.json",
      JSON.stringify(explain3, null, 2),
    );

    console.log("Aggregation explain saved to explain-output-3.json");

    console.log("\n✅ All explain outputs saved!");
    await mongoose.disconnect();
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

analyzeTourQueries();


////////////////////////////////////////////

// MONGODB EXPLAIN ANALYSIS - TOURS BASIC QUERY

// QUERY CONTEXT:
// This explain output is from a MongoDB query in my Natours application that:
// - Finds tours with: price <= 500, ratingsAverage >= 4.5, difficulty = 'easy'
// - Sorts by ratingsAverage in descending order
// - Uses the Tours collection

// CURRENT METRICS:
// - Execution time: 0ms
// - Documents returned: 1
// - Documents examined: 2
// - Index keys examined: 3
// - Query stage: SORT

// TASK:
// Analyze this MongoDB explain output and provide a detailed performance report.

// PLEASE ANSWER:
// 1. EXECUTIVE SUMMARY: Is this query performing well? (2-3 sentences)

// 2. INDEX ANALYSIS:
//    - Which indexes are currently being used?
//    - Are they optimal for this query?
//    - Why is there a SORT stage even with indexes?

// 3. PERFORMANCE METRICS INTERPRETATION:
//    - What do 0ms, 2 documents examined, and 3 keys examined tell us?
//    - Is the SORT stage a concern with only 2 documents?

// 4. RECOMMENDATIONS:
//    - Can we eliminate the SORT stage?
//    - Would a compound index on {price:1, ratingsAverage:-1, difficulty:1} help?
//    - Provide the EXACT createIndex() command if needed
//    - Would this make the query a "covered query"?

// 5. ESTIMATED IMPROVEMENT:
//    - How much would your recommended index improve performance?
//    - What metrics would change?

// FORMAT:
// Return the analysis as a professional markdown report with clear headings,
// bullet points, and code blocks for any MongoDB commands.

// ANALYSIS:

/////////////////////////////////////////////////////////////////////////////////////////////

// MONGODB EXPLAIN ANALYSIS - TOURS GEOSPATIAL QUERY
// 
// QUERY CONTEXT:
// This explain output is from a geospatial query in my Natours application that:
// - Finds tours near New York City coordinates: [-74.006, 40.7128]
// - Uses $near with $maxDistance
// - Should use the 2dsphere index on startLocation field
//
// CURRENT METRICS:
// - Execution time: N/Ams
// - Query type: Geospatial ($near)
// - Collection: Tours
//
// TASK:
// Analyze this MongoDB explain output and provide a detailed performance report.
//
// PLEASE ANSWER:
// 1. EXECUTIVE SUMMARY: Is the geospatial query performing well? (2-3 sentences)
//
// 2. INDEX ANALYSIS:
//    - Is the 2dsphere index being used? (Look for "stage": "IXSCAN" with "indexName")
//    - If not, why isn't the index being used?
//    - Is the index properly defined on startLocation?
//
// 3. PERFORMANCE ISSUES:
//    - Why is execution time showing as "N/Ams"? Is this normal for geospatial explains?
//    - Are there any red flags in the execution stats?
//    - Check for "COLLSCAN" which would be bad for geospatial queries
//
// 4. RECOMMENDATIONS:
//    - Provide the exact command to create/verify the 2dsphere index
//    - Should there be additional indexes for geospatial queries?
//    - Are there any query optimizations needed?
//
// 5. BEST PRACTICES:
//    - What are the best practices for geospatial indexing in MongoDB?
//    - How can I verify the index is working correctly?
//
// FORMAT:
// Return the analysis as a professional markdown report with clear headings,
// bullet points, and code blocks for any MongoDB commands.
//
// ANALYSIS:

/////////////////////////////////////////////////////////////////////////////////////

// MONGODB EXPLAIN ANALYSIS - TOURS AGGREGATION PIPELINE

// QUERY CONTEXT:
// This explain output is from an aggregation pipeline in my Natours application that:
// 1. $match: Tours with ratingsAverage >= 4.0
// 2. $lookup: Join with reviews collection to get reviews for each tour
// 3. $addFields: Calculate reviewCount (size of reviews array)
// 4. $project: Select name, price, ratingsAverage, reviewCount
// 5. $sort: Sort by reviewCount descending, then ratingsAverage descending
// 6. $limit: Return only top 10 results

// Collections:
// - tours (main collection)
// - reviews (joined collection via $lookup)

// TASK:
// Analyze this MongoDB aggregation explain output and provide a detailed performance report.

// PLEASE ANSWER:
// 1. EXECUTIVE SUMMARY: How well is this aggregation performing? (2-3 sentences)

// 2. STAGE-BY-STAGE ANALYSIS:
//    - $match stage: Is an index being used? Which one? (Look for IXSCAN)
//    - $lookup stage: How is the join being executed? Is it efficient?
//    - $sort stage: Is sort happening in memory or using an index?
//    - Which stage is the most expensive?

// 3. PERFORMANCE METRICS:
//    - Total execution time
//    - Documents scanned vs returned at each stage
//    - Any blocking stages (like SORT or GROUP)

// 4. INDEX RECOMMENDATIONS:
//    - What indexes would help the $match stage? (Provide exact createIndex commands)
//    - What indexes would help the $lookup stage? (Look at foreignField)
//    - What indexes would help the $sort stage?
//    - Would a compound index on {ratingsAverage: -1} help?

// 5. SCHEMA OPTIMIZATION:
//    - Would denormalizing reviewCount into the tours collection improve performance?
//    - What are the trade-offs of denormalization vs $lookup?

// 6. SPECIFIC COMMANDS:
//    - Provide ALL createIndex commands needed to optimize this aggregation
//    - Provide any alternative aggregation pipeline suggestions if applicable

// FORMAT:
// Return the analysis as a professional markdown report with clear headings,
// bullet points, code blocks for MongoDB commands, and a summary table.

// ANALYSIS: