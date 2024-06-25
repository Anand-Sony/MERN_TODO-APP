const express = require("express");
const PORT = 8000;

const app = express();          // init app
app.set("view engine" , "ejs"); // view profile

// listen server :
app.listen(PORT ,()=>{
    console.log(`Server is running on port ${PORT}`);
});