import express from "express";
import AuthController from "../Controllers/Auth";
import { verifyToken } from "../db/middlewares/authMiddleware";

import dotenv from "dotenv";

dotenv.config();

const routes = express.Router();
console.log("Rutas de auth cargadas correctamente");

routes.post("/register", AuthController.registerUser);
routes.post("/login", AuthController.loginUser);
routes.post("/logout", AuthController.logoutUser);

export default routes;
