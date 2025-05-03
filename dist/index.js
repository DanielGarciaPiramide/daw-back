"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const usuarios_rest_1 = __importDefault(require("./usuarios/infrastructure/rest/usuarios.rest"));
const transacciones_rest_1 = __importDefault(require("./transacciones/infrastructure/rest/transacciones.rest"));
dotenv_1.default.config();
const port = process.env.PORT;
const allowedOrigins = ["http://localhost:5173"];
const options = {
    origin: allowedOrigins,
};
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)(options));
//routers
const api = "/api";
app.use(api + `/usuarios`, usuarios_rest_1.default);
app.use(api + `/transacciones`, transacciones_rest_1.default);
//despliegue http
app.listen(port, () => {
    console.log(`Application started on port ${port}`);
});
//despliegue https
//keys
/*
const key = fs.readFileSync("./key-rsa.pem");
const cert = fs.readFileSync("cert.pem");
const server = https.createServer({ key, cert }, app);

server.listen(process.env.PORT, () => {
  console.log(`Application started on port ${port}`);
});
*/
//check
