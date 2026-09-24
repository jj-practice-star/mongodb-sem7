
const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
    name: { type: String,required: true    },
    email: {type: String, required: true},
    profile: {type: Object},

    enrolledCourses: [
        {
            courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course",required: true},
            marks: {type: Number,min: 0,max: 100 }
        }
    ]
});
const Student = mongoose.model("Student", studentSchema);
module.exports = Student;

