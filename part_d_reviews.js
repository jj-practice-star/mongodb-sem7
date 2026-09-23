const { MongoClient } = require("mongodb");

const uri = "mongodb+srv://practicework0102_db_user:p0wNle2powPcgBo1@clusterjahanvi.hf52krt.mongodb.net/?appName=ClusterJahanvi";


const client = new MongoClient(uri);

async function main() {
    try {
        await client.connect();

        console.log("Connected to MongoDB Atlas");

        const db = client.db("campus_enrollment");

        const courses = db.collection("courses");
        const students = db.collection("students");
        const reviews = db.collection("reviews");

        // Get one existing course
        const course = await courses.findOne({});

        if (!course) {
            throw new Error("No course found in courses collection.");
        }

        // Get two existing students
        const studentList = await students
            .find({})
            .limit(2)
            .toArray();

        if (studentList.length < 2) {
            throw new Error("At least 2 students are required.");
        }

        // Insert 2 sample reviews
        const result = await reviews.insertMany([
            {
                courseId: course._id,
                studentId: studentList[0]._id,
                rating: 5,
                comment: "Very useful course and easy to understand."
            },
            {
                courseId: course._id,
                studentId: studentList[1]._id,
                rating: 4,
                comment: "Good course with useful practical examples."
            }
        ]);

        console.log("\n2 reviews inserted successfully.");

        console.log("\nInserted Review IDs:");
        console.log(result.insertedIds);

        // Display the reviews
        console.log("\nReviews:");

        const allReviews = await reviews
            .find({ courseId: course._id })
            .toArray();

        console.log(allReviews);

    } catch (error) {
        console.error("Error:", error);
    } finally {
        await client.close();
    }
}

main();