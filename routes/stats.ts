
import express from "express";
import StatsController from "../Controllers/StatsController";
import { verifyToken } from "../db/middlewares/authMiddleware";

import dotenv from "dotenv";

dotenv.config();

const routes = express.Router();
console.log("Rutas de stats cargadas correctamente");


routes.get('/stats', StatsController.getAll);
routes.get('/stats/:id', StatsController.getById);
routes.post('/stats', StatsController.create);
routes.put('/stats/:id', StatsController.update);
routes.delete('/stats/:id', StatsController.delete);


export default routes;