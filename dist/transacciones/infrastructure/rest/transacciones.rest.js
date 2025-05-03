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
const transacciones_usecases_1 = __importDefault(require("../../application/transacciones.usecases"));
const auth_1 = require("../../../context/auth");
const transacciones_postgres_1 = __importDefault(require("../db/transacciones.postgres"));
const usuarios_usecases_1 = __importDefault(require("../../../usuarios/application/usuarios.usecases"));
const usuarios_postgres_1 = __importDefault(require("../../../usuarios/infrastructure/db/usuarios.postgres"));
const router = express_1.default.Router();
const transaccionesUseCases = new transacciones_usecases_1.default(new transacciones_postgres_1.default());
const usuariosUseCases = new usuarios_usecases_1.default(new usuarios_postgres_1.default());
router.get("/", auth_1.isAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const transacciones = yield transaccionesUseCases.get(req.body.auth);
        res.status(200).send(transacciones);
    }
    catch (error) {
        res.status(400).send({ message: error.message });
    }
}));
router.get("/todas", auth_1.isAuth, auth_1.isConserje, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const transacciones = yield transaccionesUseCases.getAll();
        res.status(200).send(transacciones);
    }
    catch (error) {
        res.status(400).send({ message: error.message });
    }
}));
router.get("/conserje", auth_1.isAuth, auth_1.isConserje, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const transacciones = yield transaccionesUseCases.getConserje(req.body.auth);
        res.status(200).send(transacciones);
    }
    catch (error) {
        res.status(400).send({ message: error.message });
    }
}));
router.post("/recargar", auth_1.isAuth, auth_1.isConserje, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const exists = yield usuariosUseCases.findByEmail(req.body.usuario);
        if (!exists) {
            throw new Error("El usuario no existe");
        }
        const transaccionEntrada = {
            concepto: "Recarga de saldo",
            importe: req.body.importe,
            usuario: {
                email: req.body.usuario,
            },
            conserje: { email: req.body.auth.email },
        };
        const transaccion = yield transaccionesUseCases.crear(transaccionEntrada);
        res.status(200).send(transaccion);
    }
    catch (error) {
        res.status(400).send({ message: error.message });
    }
}));
router.post("/transaccion", auth_1.isAuth, auth_1.isConserje, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const exists = yield usuariosUseCases.findByEmail(req.body.usuario);
        if (!exists) {
            throw new Error("El usuario no existe");
        }
        if (exists.saldo && req.body.importe > exists.saldo) {
            throw new Error(`Saldo insuficiente, saldo actual: ${exists.saldo}`);
        }
        const transaccionEntrada = {
            concepto: req.body.concepto,
            importe: -req.body.importe,
            usuario: {
                email: req.body.usuario,
            },
            conserje: { email: req.body.auth.email },
        };
        const transaccion = yield transaccionesUseCases.crear(transaccionEntrada);
        res.status(200).send(transaccion);
    }
    catch (error) {
        res.status(400).send({ message: error.message });
    }
}));
exports.default = router;
