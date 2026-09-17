const { MongoClient, ObjectId } = require("mongodb");
const uri = "mongodb+srv://practicework0102_db_user:p0wNle2powPcgBo1@clusterjahanvi.hf52krt.mongodb.net/?appName=ClusterJahanvi";

const client = new MongoClient(uri);

async function main() {
    try {
        await client.connect();

        console.log("Connected to MongoDB Atlas");
        const db = client.db("campus_enrollment");
        const courses = db.collection("courses");
        const students = db.collection("students");

     
        // 1. INSERT COURSES
        const courseResult = await courses.insertMany([
            {
                title: "Database Management Systems",
                credits: 4
            },
            {
                title: "Web Development",
                credits: 3
            },
            {
                title: "Data Structures",
                credits: 4
            }
        ]);

        console.log("Courses inserted:");
        console.log(courseResult.insertedIds);

        // Store the real MongoDB ObjectIds
        const dbmsId = courseResult.insertedIds[0];
        const webDevId = courseResult.insertedIds[1];
        const dataStructuresId = courseResult.insertedIds[2];
        // 2. INSERT STUDENTS
        const studentResult = await students.insertMany([
            {
                name: "Jahanvi",
                email: "jahanvi@gmail.com",
                profile: {
                    skills: ["JavaScript", "MongoDB"],
                    city: "Surat"
                },

                enrolledCourses: [
                    {
                        courseId: dbmsId,
                        marks: 85
                    },
                    {
                        courseId: webDevId,
                        marks: 72
                    }
                ]
            },

            {
                name: "Hiral",
                email: "hiral@gmail.com",

                // Different profile fields
                profile: {
                    skills: ["Python", "Java"],
                    github: "github.com/hiral"
                },

                enrolledCourses: [
                    {
                        courseId: dbmsId,
                        marks: 68
                    },
                    {
                        courseId: dataStructuresId,
                        marks: 91
                    }
            ]
            },

            {
                name: "Ummul",
                email: "ummul@gmail.com",

                // Different profile structure again
                profile: {
                    skills: ["C++", "Data Structures"],
                    city: "Ahmedabad",
                    linkedin: "linkedin.com/in/ummul"
                },

                enrolledCourses: [
                    {
                        courseId: webDevId,
                        marks: 48
                    },
                    {
                        courseId: dataStructuresId,
                        marks: null
                    }
                ]
            },

            {
                name: "Rahul",
                email: "rahul@gmail.com",

                profile: {
                    skills: ["React", "Node.js"],
                    city: "Mumbai"
                },

                enrolledCourses: [
                    {
                        courseId: dbmsId,
                        marks: 78
                    }
                ]
            },

            {
                name: "Priya",
                email: "priya@gmail.com",

                profile: {
                    skills: ["MongoDB", "Express"],
                    github: "github.com/priya",
                    city: "Vadodara"
                },

                enrolledCourses: [
                    {
                        courseId: webDevId,
                        marks: 88
                    }
                ]
            }
        ]);

        console.log("Students inserted:");
        console.log(studentResult.insertedIds);

        // 3. DISPLAY INSERTED DATA
        console.log("\nCourses:");
        console.log(
            await courses.find().toArray()
        );

        console.log("\nStudents:");
        console.log(
            await students.find().toArray()
        );

        console.log("\nPart A completed successfully!");

    } catch (error) {
        console.error("Error:", error);
    } finally {
        await client.close();
        console.log("MongoDB connection closed");
    }
}

main();
