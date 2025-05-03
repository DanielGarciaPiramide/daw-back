"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isConserje = exports.isAuth = exports.createToken = exports.decode = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
dotenv_1.default.config();
const SECRET_KEY = String(process.env.SECRET_KEY);
const decode = (token) => {
    return jsonwebtoken_1.default.decode(token);
};
exports.decode = decode;
const createToken = (user) => {
    const payload = {
        email: user.email,
    };
    return jsonwebtoken_1.default.sign(payload, SECRET_KEY, { expiresIn: "1 years" });
};
exports.createToken = createToken;
const isAuth = (req, response, next) => {
    try {
        const authHeader = req.headers["authorization"];
        const token = authHeader && authHeader.split(" ")[1];
        if (token) {
            const decoded = jsonwebtoken_1.default.verify(token, SECRET_KEY);
            req.body.auth = decoded;
            next();
        }
    }
    catch (err) {
        console.error(err);
        response.status(401).json({ message: "No autorizado" });
    }
};
exports.isAuth = isAuth;
const isConserje = (req, response, next) => {
    try {
        const authHeader = req.headers["authorization"];
        const token = authHeader && authHeader.split(" ")[1];
        if (token) {
            const decoded = jsonwebtoken_1.default.verify(token, SECRET_KEY);
            if (isNaN(decoded.email.split("@")[0])) {
                req.body.auth = decoded;
                next();
            }
            else {
                response.status(401).json({ message: "No autorizado" });
            }
            //check
        }
    }
    catch (err) {
        console.error(err);
        response.status(401).json({ message: "No autorizado" });
    }
};
exports.isConserje = isConserje;
