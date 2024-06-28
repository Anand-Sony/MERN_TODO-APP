const mongoose = require("mongoose");
// todo model schema
const todoSchema = new mongoose.Schema({
    title: {type:String , required:true},
    desc:String
    } , {timestamps:true} );

const Todo = mongoose.model("todo",todoSchema);

module.exports = Todo;