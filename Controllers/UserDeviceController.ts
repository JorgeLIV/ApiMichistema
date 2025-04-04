import { Request, Response } from 'express';
import Environment from '../db/models/environment';
import UserDevice from '../db/models/user_device';

export const addDeviceToEnvironment = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { user_id, device_id, environment_id, config_id } = req.body;

    // Verificar que el entorno exista
    const environment = await Environment.findByPk(environment_id);
    if (!environment) {
      return res.status(404).json({ message: 'Entorno no encontrado' });
    }

    // Crear un nuevo dispositivo de usuario
    const newUserDevice = await UserDevice.create({
      user_id,
      device_id,
      assigned_at: new Date(),
      config_id,
      active: true,
    });

    // Asociar el dispositivo al entorno
    await environment.addUserDevice(newUserDevice);

    return res.status(201).json({
      message: 'Dispositivo añadido al entorno exitosamente',
      userDevice: newUserDevice,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Error al añadir el dispositivo', error });
  }
};
