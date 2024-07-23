import express from 'express';
import passport from 'passport';
import TaskController from "./TaskController";
const taskController = new TaskController();
const router = express.Router();

router.route("/")
    .get(passport.authenticate('jwt', { session: false }), taskController.fetchAllTasks)
    .post(passport.authenticate('jwt', { session: false }), taskController.newTask);

router.route("/:id")
    .get(passport.authenticate('jwt', { session: false }), taskController.singleTask)
    .put(passport.authenticate('jwt', { session: false }), taskController.editTask)
    .delete(passport.authenticate('jwt', { session: false }), taskController.deleteTask);

router.route('/status-update')
    .post(passport.authenticate('jwt', { session: false }), taskController.taskStatusUpdate)


export default router;