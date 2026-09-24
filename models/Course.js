const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
    title: {type: String,required: true} ,
    credits: {type: Number,required: true,min: 1}
});

const Course = mongoose.model("Course", courseSchema);
module.exports = Course;

