const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const bodyParser = require("body-parser");
const moment = require("moment");
const PORT = 8000;
const app = express();          // init app
const connectMongodb = require("./init/mongodb")
const Todo = require("./models/Todo")


// mongodb connection in file : mongodb.js
connectMongodb();



app.set("view engine" , "ejs"); // view profile
app.use(express.static(path.join(__dirname , "public")))
app.use(bodyParser.urlencoded({extended:true}));

// for index.ejs
app.get("/", async(req,res,next)=>{
    try{
        const todos = await Todo.find({}).sort({createdAt:-1});
        res.locals.moment = moment;
        
        res.render("index" ,{title:"List Todo" , todos});
    }
    catch(error){
        res.status(500).json({message:error.message});
    }
});

//for newTodo.ejs
app.get("/add-todo" , (req,res,next)=>{
    try{
        res.render("newTodo" , {title:"New Todo"});
    }
    catch(error){
        res.status(500).json({message:error.message});
    }
});

//for updateTodo.ejs
app.get("/update-todo",async (req,res,next)=>{
    try{
        const {id} = req.query;
        const todo = await Todo.findById(id)
        res.render("updateTodo" , {title:"Update Todo" , todo});
    }
    catch(error){
        res.status(500).json({message:error.message});
    }
});

//for deleteTodo.ejs
app.get("/delete-todo", (req,res,next)=>{
    try{
        const {id} = req.query;
        res.render("deleteTodo" , {title:"Delete Todo" , id});
    }
    catch(error){
        res.status(500).json({message:error.message});
    }
});

// add todo
app.post("/add-todo" , async(req,res,next)=>{
    try{
        const {title,desc} = req.body;
        
        if (!title) {
            return res.status(400).json({message:"Title is Required"});
        }

        const newTodo = new Todo({title,desc});
        await newTodo.save();
        res.redirect("/");
    }
    catch(error){
        res.status(500).json({message:error.message});
    }
})

// new route for update to edit : 
app.post("/update-todo/:id" , async(req,res,next)=>{
    try{
        const {id} = req.params;
        const {title, desc} = req.body;
        const todo = await Todo.findById(id);

        if(!title){
            return res.status(400).json({message:"Todo Not found"});
        }
        todo.title = title;
        todo.desc = desc;
        await todo.save();
        res.redirect("/");
    }
    catch(error){
        res.status(500).json({message:error.message});
    }
})

// new route for delete confirm 
app.get("/confirm-delete", async(req,res,next)=>{
    try{
        const {id , confirm} = req.query;
        if(confirm === "yes"){
            await Todo.findByIdAndDelete(id);
        }
        res.redirect("/");
    }
    catch(error){
        res.status(500).json({message:error.message});
    }
});

// listen server :
app.listen(PORT ,()=>{
    console.log(`Server is running on port ${PORT}`);
});