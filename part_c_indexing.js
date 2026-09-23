const { MongoClient } = require("mongodb");

// Use the same URI from your database.js
const uri = "mongodb+srv://practicework0102_db_user:p0wNle2powPcgBo1@clusterjahanvi.hf52krt.mongodb.net/?appName=ClusterJahanvi";
const client = new MongoClient(uri);

async function main() {
    try {
        await client.connect();
        console.log("Connected to MongoDB Atlas");

        const db = client.db("campus_enrollment");
        const students = db.collection("students");
        const courses = db.collection("courses");
        // 1. CREATE UNIQUE INDEX ON students.email
        console.log("\n1. Creating unique index on email...");

        await students.createIndex({ email: 1 },{ unique: true });
        console.log("Unique email index created.");
        // Get two course IDs for the Part B $in query
        const courseList = await courses.find({}).limit(2).toArray();

        if (courseList.length < 2) {
            throw new Error("At least 2 courses are required in the courses collection.");
        }

        const courseId1 = courseList[0]._id;
        const courseId2 = courseList[1]._id;

        console.log("\nCourse IDs used:");
        console.log(courseId1);
        console.log(courseId2);
        // Find students enrolled in either of these courses
        const query = {"enrolledCourses.courseId": {$in: [courseId1, courseId2]}};
        // 2. EXPLAIN BEFORE COURSE INDEX
        console.log("\n========================================");
        console.log("BEFORE COURSE INDEX");
        console.log("========================================");

        const before = await students.find(query).explain("executionStats");

        console.log("Winning Plan Stage:",before.queryPlanner.winningPlan.stage );
        console.log("Total Documents Examined:",before.executionStats.totalDocsExamined);
        // 3. CREATE INDEX ON enrolledCourses.courseId
        console.log("\nCreating index on enrolledCourses.courseId...");
        await students.createIndex({"enrolledCourses.courseId": 1});

        console.log("Course ID index created.");
        // 4. EXPLAIN AFTER COURSE INDEX
       
        console.log("\n========================================");
        console.log("AFTER COURSE INDEX");
        console.log("========================================");

        const after = await students.find(query).explain("executionStats");

        console.log("Winning Plan Stage:",after.queryPlanner.winningPlan.stage);
        console.log("Total Documents Examined:",after.executionStats.totalDocsExamined);

        // 5. DISPLAY ALL INDEXES
        

        console.log("\n========================================");
        console.log("ALL STUDENT INDEXES");
        console.log("========================================");

        const indexes = await students.listIndexes().toArray();

        console.log(indexes);

    } catch (error) {
        console.error("\nError:", error);
    } finally {
        await client.close();
    }
}

main();