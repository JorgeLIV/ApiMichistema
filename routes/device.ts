import express from "express";
import DeviceController from "../Controllers/DeviceController";
import { verifyToken } from "../db/middlewares/authMiddleware";

import dotenv from "dotenv";

dotenv.config();

const routes = express.Router();
console.log("Rutas de dispositivos cargadas correctamente");

routes.get('/devices', DeviceController.getAllDevices);
routes.get('/devices/:id', DeviceController.getDeviceById);
routes.post('/devices', DeviceController.createDevice);
routes.put('/devices/:id', DeviceController.updateDevice);
routes.delete('/devices/:id', DeviceController.deleteDevice);


export default routes;
