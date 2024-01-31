const { Router } = require("express");
const express = require("express");
const { Todo } = require("../db");
const { todoZodSchema, idSchema } = require("../validations/inputValidation");

const todoRoute = Router();

todoRoute.use(express.json())

todoRoute.get("/AllTodos",async(req,res)=>{
    const todos = await Todo.find().populate('category','name');
    res.status(200).json({
        todos: todos
    })
});

todoRoute.post("/createTodo",async(req,res)=>{
    try{
        const {title, description, isCompleted, createdAt, dueAt, category } = req.body;
        let todo = await Todo.create({
            title: title,
            description: description,
            isCompleted: isCompleted,
            createdAt: createdAt,
            dueAt: dueAt, 
            category: category
        })
        res.status(201).json({
          todo: todo
        })
    } catch(error){
         res.status(400).json({error: error})
    }
});
//useSWR
todoRoute.put("/updateTodo",async(req,res)=>{
    try{
        const {title, description, isCompleted, createdAt, dueAt,_id} = req.body;
       
        const  validateId  =  idSchema.parse(_id);
        
        const validateTodo = todoZodSchema.parse({
            title, description, isCompleted, createdAt, dueAt
        })
        console.log("TODO: ", validateTodo);
        const updatedTodo = await Todo.findByIdAndUpdate(
            validateId,
            validateTodo,
            { new: true }
        );
        if (!updatedTodo) {
            return res.status(404).json({
              error: 'Todo not found'
            });
          }
        res.status(200).json({
        todo: updatedTodo
        })
        } catch(error){
            res.status(400).json({error: error})
        }

});

todoRoute.delete("/deleteTodo", async (req, res) => {
    try {
      const id =  idSchema.parse(req.query.id);
      const deleteTodo = await Todo.deleteOne({ _id: id });
  
      if (deleteTodo.deletedCount === 0) {
        return res.status(404).json({
          error: 'Todo not found'
        });
      }
  
      res.status(200).json({
        message: 'Todo deleted successfully'
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        error: 'Internal Server Error'
      });
    }
  });
module.exports = todoRoute;