const zod = require("zod");

const todoZodSchema = zod.object({
title: zod.string(),
description: zod.string(),
isCompleted: zod.boolean(),
createdAt: zod.string(),
dueAt: zod.string(),
category: zod.string().optional().refine((value) => {
    // Allow empty string or valid ObjectId
    return value === '' || mongoose.Types.ObjectId.isValid(value);
})
})

const idSchema = zod.string();
module.exports = {
    todoZodSchema,
    idSchema
}