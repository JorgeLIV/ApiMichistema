import express from "express";
import ConfigurationsController from "../Controllers/ConfigurationsController";
import { verifyToken } from "../db/middlewares/authMiddleware";

import dotenv from "dotenv";

dotenv.config();

const routes = express.Router();
console.log("Rutas de configuraciones cargadas correctamente");


routes.get('/configurations', ConfigurationsController.getAll);
routes.get('/configurations/:id', ConfigurationsController.getById);
routes.post('/configurations', ConfigurationsController.create);
routes.put('/configurations/:id', ConfigurationsController.update);
routes.delete('/configurations/:id', ConfigurationsController.delete);


export default routes;


