"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const attachUserToRequest = (req, res, next) => {
    req.user = req.user;
    next();
};
exports.default = attachUserToRequest;
