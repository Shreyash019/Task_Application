"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
const TaskController_1 = __importDefault(require("./TaskController"));
const taskController = new TaskController_1.default();
const router = express_1.default.Router();
router.route("/")
    .get(passport_1.default.authenticate('jwt', { session: false }), taskController.fetchAllTasks)
    .post(passport_1.default.authenticate('jwt', { session: false }), taskController.newTask);
router.route("/:id")
    .get(passport_1.default.authenticate('jwt', { session: false }), taskController.singleTask)
    .put(passport_1.default.authenticate('jwt', { session: false }), taskController.editTask)
    .delete(passport_1.default.authenticate('jwt', { session: false }), taskController.deleteTask);
router.route('/status-update')
    .post(passport_1.default.authenticate('jwt', { session: false }), taskController.taskStatusUpdate);
exports.default = router;
