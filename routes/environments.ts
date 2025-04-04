import express from "express";
import EnvironmentsController from '../Controllers/EnvironmentsController';
import { verifyToken } from "../db/middlewares/authMiddleware";
import { addDeviceToEnvironment } from '../Controllers/UserDeviceController';

import dotenv from "dotenv";

dotenv.config();

const routes = express.Router();
console.log("Rutas de entornos cargadas correctamente");

routes.get('/', EnvironmentsController.getAll);
routes.get('/user/:userId', EnvironmentsController.getByUserId);
routes.post('/', EnvironmentsController.create);
routes.get('/:id', EnvironmentsController.getById);
routes.put('/:id', EnvironmentsController.update);
routes.delete('/:id', EnvironmentsController.delete);


//vincular dispositivo y entorno
routes.post('/assign', EnvironmentsController.assignUserDevice);

//todos los dispositivos de un entorno
routes.get('/:id/user-devices', EnvironmentsController.getUserDevices);


export default routes;
