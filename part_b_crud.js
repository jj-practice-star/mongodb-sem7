const { MongoClient, ObjectId } = require("mongodb");
const uri = "mongodb+srv://practicework0102_db_user:p0wNle2powPcgBo1@clusterjahanvi.hf52krt.mongodb.net/?appName=ClusterJahanvi";

const client = new MongoClient(uri);

async function main() {
    try {
        await client.connect();

        console.log("Connected to MongoDB Atlas");

        const db = client.db("campus_enrollment");
        const students = db.collection("students");
        // 1. FIND WITH $elemMatch
        console.log("\n========== 1. $elemMatch ==========");

        const result1 = await students.find({
            enrolledCourses: {
                $elemMatch: {
                    marks: { $gt: 75 }
                }
            }
        }).toArray();

        console.log(result1);


        // 2. FIND WITH $in

        console.log("\n========== 2. $in ==========");

        const courseId1 = new ObjectId("6aab5e38eefb2c17b05c2232");
        const courseId2 = new ObjectId("6aab5e38eefb2c17b05c2233");

        const result2 = await students.find({
            "enrolledCourses.courseId": {
                $in: [courseId1, courseId2]
            }
        }).toArray();

        console.log(result2);

        // 3. UPDATE ONE STUDENT'S MARKS

        console.log("\n========== 3. UPDATE MARKS ==========");
        const result3 = await students.updateOne(
            {
                email: "jahanvi@gmail.com",
                "enrolledCourses.courseId": courseId1
            },
            {
                $set: {
                    "enrolledCourses.$.marks": 90
                }
            }
        );

        console.log(result3);


        // 4. ADD 1 BONUS MARK TO MARKS BELOW 50
    

        console.log("\n========== 4. $inc BONUS MARK ==========");

        const result4 = await students.updateMany(
            {
                "enrolledCourses.marks": {
                    $lt: 50
                }
            },
            {
                $inc: {
                    "enrolledCourses.$[enrollment].marks": 1
                }
            },
            {
                arrayFilters: [
                    {
                        "enrollment.marks": {
                            $lt: 50
                        }
                    }
                ]
            }
        );

        console.log(result4);


        // 5. DELETE ONE ENROLLMENT USING $pull


        console.log("\n========== 5. $pull ==========");

        const result5 = await students.updateOne(
            {
                email: "jahanvi@gmail.com"
            },
            {
                $pull: {
                    enrolledCourses: {
                        courseId: courseId2
                    }
                }
            }
        );

        console.log(result5);
        // DISPLAY FINAL DATA
       

        console.log("\n========== FINAL STUDENT DATA ==========");

        const finalData = await students.find().toArray();

        console.log(finalData);

        console.log("\nPart B completed successfully!");

    } catch (error) {
        console.error("Error:", error);

    } finally {
        await client.close();

        console.log("MongoDB connection closed");
    }
}

main();