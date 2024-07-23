"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: "./config/project.env" });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const passport_1 = __importDefault(require("./utils/passport"));
const Database_Connection_1 = __importDefault(require("./Database_Connection"));
const UserRoutes_1 = __importDefault(require("./modules/user_module/UserRoutes"));
const TaskRoutes_1 = __importDefault(require("./modules/todo_module/TaskRoutes"));
const PORT = parseInt(process.env.PORT || "5000");
const app = (0, express_1.default)();
const corsOptions = {
    origin: 'https://task-application-client-1.onrender.com', // frontend URL
    optionsSuccessStatus: 200,
};
app.use((0, cors_1.default)(corsOptions));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
app.use(passport_1.default.initialize());
// Database instance creation then connecting database
const databaseConnection = new Database_Connection_1.default();
databaseConnection.mongodbConnection();
app.use("/user", UserRoutes_1.default);
app.use("/task", TaskRoutes_1.default);
app.get("/user/hello", (req, res) => {
    res.status(200).json({
        message: "Welcome to user service"
    });
});
app.all("*", (req, res) => {
    res.status(404).json({
        error: "Resource not found"
    });
});
app.listen(PORT, () => {
    console.log("Server is running on port ${PORT}...");
});
