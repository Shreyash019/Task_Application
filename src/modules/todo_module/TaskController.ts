// import mongoose from "mongoose";
import { Request, Response, NextFunction } from "express";
import TaskModel from "./TaskModel";

export default class UserAccountController {
    constructor() { }
    async newTask(req: Request, res: Response, next: NextFunction) {
        try {
            const decoded: any = req.user;
            // Checking request body
            const { title, description } = req.body;
            if (!title || !description) {
                return res.status(400).json({ message: "Please provide all the required fields" });
            }
            await TaskModel.create({
                user: decoded._id,
                title: req.body.title.trim(),
                description: req.body.description.trim(),
                taskStatus: "todo"
            })

            // Sending Success response
            res.status(200).json({
                success: true,
                message: "Task created successfully",
            })
        } catch (err: any) {
            return res.status(500).json({
                success: false,
                message: err.toString()
            })
        }
    }
    async editTask(req: Request, res: Response, next: NextFunction) {
        try {
            const decoded: any = req.user
            // Checking request body
            const { title, description } = req.body;
            const { id } = req.params;
            if (!title || !description) {
                return res.status(400).json({ message: "Please provide all the required fields" });
            }
            const task: any = await TaskModel.findOneAndUpdate(
                { _id: id, user: decoded._id },
                { title: req.body.title.trim(), description: req.body.description.trim() },
                { new: true }
            )
            if (!task) {
                return res.status(404).json({
                    success: false,
                    error: `Task not found`
                })
            }
            // Sending Success response
            res.status(200).json({
                success: true,
                message: "Task updated successfully",
            })
        } catch (err: any) {
            return res.status(500).json({
                success: false,
                message: err.toString()
            })
        }
    }
    async fetchAllTasks(req: Request, res: Response, next: NextFunction) {
        try {
            const decoded: any = req.user;
            const { sort = 'default', search } = req.query;
            console.log(req.query)
            let query: any = {};
            if (req.query.search && search) {
                query.title = { $regex: new RegExp(String(search), "i") };
            }
            const sortObject: any = sort == "default" ? { taskIndex: 1 } : { createdAt: -1 }
            const query1 = TaskModel.find({ user: decoded._id, taskStatus: 'todo', ...query })
                .sort(sortObject);
            const query2 = TaskModel.find({ user: decoded._id, taskStatus: 'progress', ...query })
                .sort(sortObject);
            const query3 = TaskModel.find({ user: decoded._id, taskStatus: 'completed', ...query })
                .sort(sortObject);

            const [todo, progress, completed] = await Promise.all([query1, query2, query3]);

            res.status(200).json({
                success: true,
                message: "All Tasks",
                todo: todo || [],
                progress: progress || [],
                completed: completed || []
            })
        } catch (err: any) {
            return res.status(500).json({
                success: false,
                message: err.toString(),
            })
        }
    }
    async singleTask(req: Request, res: Response, next: NextFunction) {
        try {
            const decoded: any = req.user
            if (!req.params.id) {
                return res.status(400).json({
                    success: false,
                    error: `Bad request`
                })
            }
            const task = await TaskModel.findOne({ _id: req.params.id, user: decoded._id });
            if (!task) {
                return res.status(404).json({
                    success: false,
                    error: `Task not found`
                })
            }
            res.status(200).json({
                success: true,
                message: "Task Details",
                task
            })
        } catch (err: any) {
            return res.status(500).json({
                success: false,
                message: err.toString(),
            })
        }
    }
    async deleteTask(req: Request, res: Response, next: NextFunction) {
        try {
            const decoded: any = req.user
            if (!req.params.id) {
                return res.status(400).json({
                    success: false,
                    error: `Bad request`
                })
            }
            const task = await TaskModel.findOneAndDelete({ _id: req.params.id, user: decoded._id });
            if (!task) {
                return res.status(404).json({
                    success: false,
                    error: `Task not found`
                })
            }
            res.status(200).json({
                success: true,
                message: "Task Deleted",
            })
        } catch (err: any) {
            return res.status(500).json({
                success: false,
                message: err.toString(),
            })
        }
    }
    async taskStatusUpdate(req: Request, res: Response, next: NextFunction) {
        try {
            const decoded: any = req.user
            const { status, tasks } = req.body;
            if (!status || !tasks || tasks.length <= 0) {
                return res.status(400).json({
                    success: false,
                    message: "Bad request"
                });
            }
            const updateTasks = tasks.map((task: any, index: number) => ({
                updateOne: { // Use updateOne within each operation
                    filter: { _id: task._id, user: decoded._id },
                    update: { $set: { taskStatus: status.toLowerCase().trim(), taskIndex: index } }
                }
            }));

            const result = await TaskModel.bulkWrite(updateTasks);

            if (result.modifiedCount !== tasks.length) {
                return res.status(403).json({
                    success: false,
                    message: "Error updating tasks"
                });
            }
            res.status(200).json({
                success: true,
                message: "Status Changed",
            })
        } catch (err: any) {
            return res.status(500).json({
                success: false,
                message: err.toString(),
            })
        }
    }
}