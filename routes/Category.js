const { Router } = require("express");
const { TodoCategory, Todo } = require("../db");
const categoryRoute = Router();

categoryRoute.post("/createCategory", async (req, res) => {
  const { name } = req.body;
  try {
    const category = await TodoCategory.create({
      name: name,
      todos: [],
    });

    res.status(201).json({
      category: category,
    });
  } catch (error) {
    res.status(500).json({
      error: error,
    });
  }
});

categoryRoute.get("/getAll", async (req, res) => {
  const categories = await TodoCategory.find();

  res.status(200).json({
    categories: categories,
  });
});

categoryRoute.get("/get", async (req, res) => {
  const id = req.query.id;
  try {
    const category = await TodoCategory.findById(id).populate("todos");
    res.status(200).json({
      category: category,
    });
  } catch (err) {
    res.status(400).json({
      err: err,
    });
  }
});

categoryRoute.put("/unlinkTodo", async (req, res) => {
  const catId = req.query.catId;
  const todoId = req.query.todoId;
  try {
    console.log("OLD: ", catId);
    const newCategory = await TodoCategory.findByIdAndUpdate(
      catId,
      { $pull: { todos: todoId } },
      { new: true }
    );
    console.log("New: ", newCategory);
    res.status(200).json({
      category: newCategory,
    });
  } catch (err) {
    res.status(400).json({
      err: err,
    });
  }
});

categoryRoute.put("/linkTodo", async (req, res) => {
  const categoryId = req.query.catId;
  const todoId = req.query.todoId;

  try {
    const category = await TodoCategory.findByIdAndUpdate(
      categoryId,
      { $push: { todos: todoId } },
      { new: true }
    );
    res.status(200).json({
      category: category,
    });
  } catch (err) {
    res.status(400).json({
      err: err,
    });
  }
});

categoryRoute.delete("/deleteCategory", async (req, res) => {
  const { _id, todos } = req.body;
  try {
    await Todo.deleteMany({ _id: { $in: todos } }, { new: true });
    const deleteTodo = await TodoCategory.deleteOne({ _id: _id });
    if (deleteTodo.deletedCount === 0) {
      return res.status(404).json({
        error: "Cat not found",
      });
    }

    res.status(200).json({
      message: "Cat deleted successfully",
      resp: deleteTodo,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Internal Server Error",
    });
  }
});
module.exports = categoryRoute;
