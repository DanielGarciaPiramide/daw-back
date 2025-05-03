"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importStar(require("bcrypt"));
const auth_1 = require("../../context/auth");
class UsuariosUseCases {
    constructor(repository) {
        this.repository = repository;
    }
    save(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            if (yield this.repository.findByEmail(email)) {
                throw new Error("El email ya está en uso");
            }
            if (password.length < 6) {
                throw new Error("La contraseña debe tener al menos 6 caracteres");
            }
            if (!email.includes("@")) {
                throw new Error("El email no es válido");
            }
            if (isNaN(Number(email.split("@")[0]))) {
                throw new Error("El email no es válido");
            }
            const hashedPassword = yield bcrypt_1.default.hash(password.toString(), 10);
            yield this.repository.save(email, hashedPassword);
        });
    }
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.repository.findByEmail(email);
        });
    }
    login(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.repository.findByEmail(email);
            if (user &&
                user.password &&
                (yield (0, bcrypt_1.compare)(password.toString(), user.password.toString()))) {
                const token = (0, auth_1.createToken)(user);
                return { user: { email: user.email }, token };
            }
            return false;
        });
    }
    getSaldo(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.repository.findByEmail(email);
            if (user) {
                return user.saldo || 0;
            }
            throw new Error("Usuario no encontrado");
        });
    }
}
exports.default = UsuariosUseCases;
