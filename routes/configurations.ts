import express from "express";
import ConfigurationsController from "../Controllers/ConfigurationsController";
import { verifyToken } from "../db/middlewares/authMiddleware";

import dotenv from "dotenv";

dotenv.config();

const routes = express.Router();
console.log("Rutas de configuraciones cargadas correctamente");


routes.get('/', ConfigurationsController.getAll);
routes.get('/:id', ConfigurationsController.getById);
routes.post('/', ConfigurationsController.create);
routes.put('/:id', ConfigurationsController.update);
routes.delete('/:id', ConfigurationsController.delete);


export default routes;


