const zod = require("zod");
const mongoose = require('mongoose')
const todoZodSchema = zod.object({
    title: zod.string(),
    description: zod.string(),
    isCompleted: zod.boolean(),
    createdAt: zod.string(),
    dueAt: zod.string(),
    category: zod.nullable(
      zod.object({
        _id: zod.string(),
        name: zod.string(),
        // Add any additional properties as needed
      }).refine((value) => value === null || mongoose.Types.ObjectId.isValid(value._id)),
      zod.array(zod.string())
    ).optional(),
  });

const idSchema = zod.string();
module.exports = {
    todoZodSchema,
    idSchema
}