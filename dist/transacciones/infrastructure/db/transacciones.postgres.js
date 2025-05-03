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
const postgres_connector_1 = __importDefault(require("../../../context/postgres.connector"));
class TransaccionesRepositoryPostgres {
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `SELECT * from transacciones order by id desc`;
            const result = yield (0, postgres_connector_1.default)(query);
            return result.map((transaccion) => {
                return {
                    id: transaccion.id,
                    timestamp: transaccion.timestamp,
                    concepto: transaccion.concepto,
                    importe: transaccion.importe,
                    usuario: {
                        email: transaccion.usuario,
                    },
                    conserje: {
                        email: transaccion.conserje,
                    },
                };
            });
        });
    }
    get(usuario) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `SELECT * from transacciones WHERE usuario = '${usuario.email}' order by id desc`;
            const result = yield (0, postgres_connector_1.default)(query);
            return result.map((transaccion) => {
                return {
                    id: transaccion.id,
                    timestamp: transaccion.timestamp,
                    concepto: transaccion.concepto,
                    importe: transaccion.importe,
                    usuario: {
                        email: transaccion.usuario,
                    },
                    conserje: {
                        email: transaccion.conserje,
                    },
                };
            });
        });
    }
    getConserje(conserje) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `SELECT * from transacciones WHERE conserje = '${conserje.email}' order by id desc`;
            const result = yield (0, postgres_connector_1.default)(query);
            return result.map((transaccion) => {
                return {
                    id: transaccion.id,
                    timestamp: transaccion.timestamp,
                    concepto: transaccion.concepto,
                    importe: transaccion.importe,
                    usuario: {
                        email: transaccion.usuario,
                    },
                    conserje: {
                        email: transaccion.conserje,
                    },
                };
            });
        });
    }
    crear(transaccion) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `INSERT INTO transacciones (timestamp, concepto, importe, usuario, conserje) VALUES (now(), '${transaccion.concepto}', ${transaccion.importe}, '${transaccion.usuario.email}', '${transaccion.conserje.email}') RETURNING id, timestamp`;
            const results = yield (0, postgres_connector_1.default)(query);
            transaccion.id = results[0].id;
            transaccion.timestamp = results[0].timestamp;
            const queryUpdate = `UPDATE usuarios SET saldo = saldo + ${transaccion.importe} WHERE email = '${transaccion.usuario.email}'`;
            yield (0, postgres_connector_1.default)(queryUpdate);
            return transaccion;
        });
    }
}
exports.default = TransaccionesRepositoryPostgres;
