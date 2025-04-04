import express from "express";
import DeviceController from "../Controllers/DeviceController";
import { verifyToken } from "../db/middlewares/authMiddleware";

import dotenv from "dotenv";

dotenv.config();

const routes = express.Router();
console.log("Rutas de dispositivos cargadas correctamente");

routes.put('/disable/:id', DeviceController.disableDevice);
routes.put('/enable/:id', DeviceController.enableDevice);

//en que entorno se encuentra el dispositivo
routes.get('/:userId/device/:deviceId/entorno', DeviceController.getDeviceEnvironment);



//vincular usuario y dispositivo 
routes.post('/asignar/:userId/:deviceId/:environmentId', DeviceController.assignDeviceToUser);

// Obtener dispositivos por usuario
routes.get('/:userId/devices', DeviceController.getDevicesByUser);

routes.get('/', DeviceController.getAllDevices);
routes.get('/:id', DeviceController.getDeviceById);
routes.post('/', DeviceController.createDevice);
routes.put('/:id', DeviceController.updateDevice);
routes.delete('/:id', DeviceController.deleteDevice);


export default routes;
