"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const TaskModel_1 = __importDefault(require("./TaskModel"));
class UserAccountController {
    constructor() { }
    newTask(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const decoded = req.user;
                // Checking request body
                const { title, description } = req.body;
                if (!title || !description) {
                    return res.status(400).json({ message: "Please provide all the required fields" });
                }
                yield TaskModel_1.default.create({
                    user: decoded._id,
                    title: req.body.title.trim(),
                    description: req.body.description.trim(),
                    taskStatus: "todo"
                });
                // Sending Success response
                res.status(200).json({
                    success: true,
                    message: "Task created successfully",
                });
            }
            catch (err) {
                return res.status(500).json({
                    success: false,
                    message: err.toString()
                });
            }
        });
    }
    editTask(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const decoded = req.user;
                // Checking request body
                const { title, description } = req.body;
                const { id } = req.params;
                if (!title || !description) {
                    return res.status(400).json({ message: "Please provide all the required fields" });
                }
                const task = yield TaskModel_1.default.findOneAndUpdate({ _id: id, user: decoded._id }, { title: req.body.title.trim(), description: req.body.description.trim() }, { new: true });
                if (!task) {
                    return res.status(404).json({
                        success: false,
                        error: `Task not found`
                    });
                }
                // Sending Success response
                res.status(200).json({
                    success: true,
                    message: "Task updated successfully",
                });
            }
            catch (err) {
                return res.status(500).json({
                    success: false,
                    message: err.toString()
                });
            }
        });
    }
    fetchAllTasks(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const decoded = req.user;
                const { sort = 'default', search } = req.query;
                console.log(req.query);
                let query = {};
                if (req.query.search && search) {
                    query.title = { $regex: new RegExp(String(search), "i") };
                }
                const sortObject = sort == "default" ? { taskIndex: 1 } : { createdAt: -1 };
                const query1 = TaskModel_1.default.find(Object.assign({ user: decoded._id, taskStatus: 'todo' }, query))
                    .sort(sortObject);
                const query2 = TaskModel_1.default.find(Object.assign({ user: decoded._id, taskStatus: 'progress' }, query))
                    .sort(sortObject);
                const query3 = TaskModel_1.default.find(Object.assign({ user: decoded._id, taskStatus: 'completed' }, query))
                    .sort(sortObject);
                const [todo, progress, completed] = yield Promise.all([query1, query2, query3]);
                res.status(200).json({
                    success: true,
                    message: "All Tasks",
                    todo: todo || [],
                    progress: progress || [],
                    completed: completed || []
                });
            }
            catch (err) {
                return res.status(500).json({
                    success: false,
                    message: err.toString(),
                });
            }
        });
    }
    singleTask(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const decoded = req.user;
                if (!req.params.id) {
                    return res.status(400).json({
                        success: false,
                        error: `Bad request`
                    });
                }
                const task = yield TaskModel_1.default.findOne({ _id: req.params.id, user: decoded._id });
                if (!task) {
                    return res.status(404).json({
                        success: false,
                        error: `Task not found`
                    });
                }
                res.status(200).json({
                    success: true,
                    message: "Task Details",
                    task
                });
            }
            catch (err) {
                return res.status(500).json({
                    success: false,
                    message: err.toString(),
                });
            }
        });
    }
    deleteTask(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const decoded = req.user;
                if (!req.params.id) {
                    return res.status(400).json({
                        success: false,
                        error: `Bad request`
                    });
                }
                const task = yield TaskModel_1.default.findOneAndDelete({ _id: req.params.id, user: decoded._id });
                if (!task) {
                    return res.status(404).json({
                        success: false,
                        error: `Task not found`
                    });
                }
                res.status(200).json({
                    success: true,
                    message: "Task Deleted",
                });
            }
            catch (err) {
                return res.status(500).json({
                    success: false,
                    message: err.toString(),
                });
            }
        });
    }
    taskStatusUpdate(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const decoded = req.user;
                const { status, tasks } = req.body;
                if (!status || !tasks || tasks.length <= 0) {
                    return res.status(400).json({
                        success: false,
                        message: "Bad request"
                    });
                }
                const updateTasks = tasks.map((task, index) => ({
                    updateOne: {
                        filter: { _id: task._id, user: decoded._id },
                        update: { $set: { taskStatus: status.toLowerCase().trim(), taskIndex: index } }
                    }
                }));
                const result = yield TaskModel_1.default.bulkWrite(updateTasks);
                if (result.modifiedCount !== tasks.length) {
                    return res.status(403).json({
                        success: false,
                        message: "Error updating tasks"
                    });
                }
                res.status(200).json({
                    success: true,
                    message: "Status Changed",
                });
            }
            catch (err) {
                return res.status(500).json({
                    success: false,
                    message: err.toString(),
                });
            }
        });
    }
}
exports.default = UserAccountController;
