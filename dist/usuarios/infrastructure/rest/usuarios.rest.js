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
const express_1 = __importDefault(require("express"));
const usuarios_usecases_1 = __importDefault(require("../../application/usuarios.usecases"));
const usuarios_postgres_1 = __importDefault(require("../db/usuarios.postgres"));
const auth_1 = require("../../../context/auth");
const conserjes_postgres_1 = __importDefault(require("../db/conserjes.postgres"));
const conserjes_usecases_1 = __importDefault(require("../../application/conserjes.usecases"));
const router = express_1.default.Router();
const conserjesUseCases = new conserjes_usecases_1.default(new conserjes_postgres_1.default());
const usuariosUseCases = new usuarios_usecases_1.default(new usuarios_postgres_1.default());
router.post("/registro", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield usuariosUseCases.save(req.body.email, req.body.password);
        res.status(201).send({ message: "Usuario creado" });
    }
    catch (error) {
        res.status(400).send({ message: error.message });
    }
}));
router.post("/entrar", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield conserjesUseCases.login(req.body.email, req.body.password);
        if (result) {
            res.status(200).send({
                message: "Credenciales correctas",
                result,
            });
        }
        else {
            const result = yield usuariosUseCases.login(req.body.email, req.body.password);
            if (result) {
                res.status(200).send({
                    message: "Credenciales correctas",
                    result,
                });
            }
            else {
                res.status(401).send({ message: "Credenciales inválidas" });
            }
        }
    }
    catch (error) {
        res.status(400).send({ message: error.message });
    }
}));
router.get("/saldo", auth_1.isAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const saldo = yield usuariosUseCases.getSaldo(req.body.auth.email);
        res.status(200).send({ saldo });
    }
    catch (error) {
        res.status(400).send({ message: error.message });
    }
}));
exports.default = router;
