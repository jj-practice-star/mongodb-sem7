const mongoose = require("mongoose");
require("dotenv").config();

const Student = require("./models/Student");
const Course = require("./models/Course");

const MONGO_URI = process.env.MONGO_URI;
const DB_NAME = process.env.DB_NAME;

async function main() {
    try {
        // CONNECT TO MONGODB ATLAS
        await mongoose.connect(MONGO_URI, { dbName: DB_NAME });
        console.log("Connected to MongoDB Atlas");

        const course = await Course.create({
            title: "Advanced Database Technologies",
            credits: 4
        });

        console.log("\nCourse created:");
        console.log(course);
        // Create a new student enrolled in course

        const student = await Student.create({
            name: "Test Student",
            email: "teststudent@example.com",

            profile: {
                semester: 1,
                department: "MSc IT"
            },

            enrolledCourses: [
                {
                    courseId: course._id,
                    marks: 75
                }
            ]
        });

        console.log("\nStudent created:");
        console.log(student);
        // Find student by email
    
        const foundStudent = await Student.findOne({
            email: "teststudent@example.com"
        });

        console.log("\nStudent found by email:");

        if (foundStudent) {
            console.log("Name:", foundStudent.name);
            console.log("Email:", foundStudent.email);

            console.log("Enrolled Courses:");
            console.log(foundStudent.enrolledCourses);
        }
        // UPDATE
    
        const updatedStudent = await Student.findByIdAndUpdate(
            student._id,

            {
                $set: {
                    "enrolledCourses.$[course].marks": 90
                }
            },

            {
                arrayFilters: [
                    {
                        "course.courseId": course._id
                    }
                ],

                new: true,
                runValidators: true
            }
        );

        console.log("\nStudent after marks update:");
        console.log(updatedStudent);

        // Remove one student

        const deletedStudent = await Student.findByIdAndDelete(
            student._id
        );

        console.log("\nDeleted student:");

        if (deletedStudent) {
            console.log(deletedStudent.name);
        }

        // Try to save a student without name

        try {
            const invalidStudent = new Student({
                email: "invalid@example.com",

                enrolledCourses: [
                    {
                        courseId: course._id,
                        marks: 50
                    }
                ]
            });

            await invalidStudent.save();

        } catch (error) {

            if (error instanceof mongoose.Error.ValidationError) {

                console.log("\nValidation Error caught successfully.");

                console.log(
                    "Student could not be saved because name is required."
                );

                console.log("Message:", error.message);

            } else {
                throw error;
            }
        }


        // ----------------------------------------
        // CLOSE CONNECTION
        // ----------------------------------------

        await mongoose.connection.close();

        console.log("\nMongoDB connection closed.");

    } catch (error) {

        console.error("\nError:", error);

        await mongoose.connection.close();
    }
}

main();

