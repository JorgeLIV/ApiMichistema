import express from "express";
import EnvironmentsController from '../Controllers/EnvironmentsController';
import { verifyToken } from "../db/middlewares/authMiddleware";

import dotenv from "dotenv";

dotenv.config();

const routes = express.Router();
console.log("Rutas de entornos cargadas correctamente");

routes.get('/environments', EnvironmentsController.getAll);
routes.get('/environments/:id', EnvironmentsController.getById);
routes.post('/environments', EnvironmentsController.create);
routes.put('/environments/:id', EnvironmentsController.update);
routes.delete('/environments/:id', EnvironmentsController.delete);


export default routes;
