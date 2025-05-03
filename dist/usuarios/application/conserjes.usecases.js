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
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = require("bcrypt");
const auth_1 = require("../../context/auth");
class ConserjesUseCases {
    constructor(repository) {
        this.repository = repository;
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
}
exports.default = ConserjesUseCases;
