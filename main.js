const express = require("express");
const todoRoute= require("./routes/Todo");
const app = express();
const cors = require("cors");
const categoryRoute = require("./routes/Category");


app.use(express.json())
app.use(cors());
app.use("/api/v1",todoRoute);
app.use("/api/v1/category", categoryRoute)
const port = 3000;

app.get('/',(req,res)=>{
res.status(200).json({message: "Sucess"})
})

app.listen(port, ()=>{
    console.log(`App is listening on port ${port}`);
})