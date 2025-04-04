import { Request, Response } from 'express';
import Device from '../db/models/device';
import User from '../db/models/user';
import UserDevice from '../db/models/user_device';
import Environment from '../db/models/environment';

export default class DeviceController {

  static async getDeviceEnvironment(req: Request, res: Response) {
    try {
      const { userId, deviceId } = req.params;
      console.log("ID de usuario recibido:", userId);
      console.log("ID de dispositivo recibido:", deviceId);
  
      // Buscar la relación entre el usuario y el dispositivo, y obtener el entorno asociado
      const userDevice = await UserDevice.findOne({
        where: {
          user_id: userId,
          device_id: deviceId,
          active: true, // Asegurarse de que la relación esté activa
        },
        include: [
          {
            model: Device,
            as: 'device', // Incluye la información del dispositivo
          },
          {
            model: Environment,
            as: 'environment', // Incluye la información del entorno
          },
        ],
        order: [['createdAt', 'DESC']], // Ordenar por la relación más reciente
      });
  
      if (!userDevice || !userDevice.environment) {
        return res.status(404).json({ error: 'El dispositivo no está vinculado a ningún entorno' });
      }
  
      // Responder con el entorno del dispositivo
      res.json({
        message: 'Entorno del dispositivo obtenido correctamente',
        environment: userDevice.environment,
      });
    } catch (error) {
      res.status(500).json({
        error: 'Error al obtener el entorno del dispositivo',
        details: error.message,
      });
    }
  }
  
  

  static async assignDeviceToUser(req: Request, res: Response) {
    try {
      const { userId, deviceId, environmentId } = req.params;
  
      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
  
      const device = await Device.findByPk(deviceId);
      if (!device) {
        return res.status(404).json({ error: 'Dispositivo no encontrado' });
      }
  
      const environment = await Environment.findByPk(environmentId);
      if (!environment) {
        return res.status(404).json({ error: 'Entorno no encontrado' });
      }
  
      const userDevice = await UserDevice.create({
        user_id: userId,
        device_id: deviceId,
        environment_id: environmentId,
        active: true,
      });
  
      res.status(201).json({
        message: 'Dispositivo asignado correctamente al usuario y entorno',
        userDevice,
      });
    } catch (error) {
      res.status(500).json({
        error: 'Error al asignar el dispositivo al usuario',
        details: error.message,
      });
    }
  }
  

  static async enableDevice(req: Request, res: Response) {
    try {
      const { id } = req.params;
  
      const device = await Device.findByPk(id);
      if (!device) {
        return res.status(404).json({ error: 'Dispositivo no encontrado' });
      }
      await device.update({ active: true });
  
      res.json({ message: 'Dispositivo habilitado correctamente', device });
    } catch (error) {
      res.status(500).json({ error: 'Error al habilitar el dispositivo', details: error.message });
    }
  }

  static async disableDevice(req: Request, res: Response) {
    try {
      const { id } = req.params;
  
      const device = await Device.findByPk(id);
      if (!device) {
        return res.status(404).json({ error: 'Dispositivo no encontrado' });
      }
      await device.update({ active: false });
  
      res.json({ message: 'Dispositivo deshabilitado correctamente', device });
    } catch (error) {
      res.status(500).json({ error: 'Error al deshabilitar el dispositivo', details: error.message });
    }
  }

  static async getDevicesByUser(req: Request, res: Response) {
    try {
      const { userId } = req.params;

      if (isNaN(Number(userId))) {
        return res.status(400).json({ error: 'ID de usuario no válido' });
      }

      console.log('userId recibido:', userId);

      const userDevices = await UserDevice.findAll({
        where: { 
          user_id: Number(userId), 
          active: true 
        },
        include: [
          {
            model: Device,
            as: 'device',
            required: true, // Solo incluye registros con dispositivos válidos
          },
        ],
      });

      if (!userDevices.length) {
        const user = await User.findOne({ where: { id: Number(userId) } });
        const userName = user ? user.name : 'Usuario no encontrado';
        return res.status(404).json({ 
          error: `No se encontraron dispositivos vinculados al usuario: ${userName}` 
        });
      }

      // Mapear solo los dispositivos para la respuesta
      const devices = userDevices.map((userDevice) => userDevice.device);

      return res.status(200).json(devices);
    } catch (error) {
      console.error('Error al obtener dispositivos:', error);
      return res.status(500).json({ 
        error: 'Error interno del servidor', 
        details: error instanceof Error ? error.message : 'Error desconocido' 
      });
    }
  }

  static async getAllDevices(req: Request, res: Response) {
    try {
      const devices = await Device.findAll();
      res.json(devices);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener los dispositivos', details: error.message });
    }
  }

  static async getDeviceById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const device = await Device.findByPk(id);
      if (!device) return res.status(404).json({ error: 'Dispositivo no encontrado' });
      res.json(device);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener el dispositivo', details: error.message });
    }
  }

  static async createDevice(req: Request, res: Response) {
    try {
      const { name, description, code, constant, active } = req.body;
      if (!name || typeof name !== 'string' || !active) {
        return res.status(400).json({ error: 'El nombre y el estado activo son requeridos.' });
      }

      if (code) {
        const existingDevice = await Device.findOne({ where: { code } });
        if (existingDevice) {
          return res.status(400).json({ error: 'El código del dispositivo ya está en uso.' });
        }
      }

      const newDevice = await Device.create({ name, description, code, constant, active });
      return res.status(201).json(newDevice);
    } catch (error) {
      console.error('Error al crear el dispositivo:', error);
      return res.status(500).json({ error: 'Error al crear el dispositivo', details: error.message });
    }
  }

  static async updateDevice(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name, description, code, constant, active } = req.body;

      const device = await Device.findByPk(id);
      if (!device) return res.status(404).json({ error: 'Dispositivo no encontrado' });

      await device.update({ name, description, code, constant, active });

      res.json(device);
    } catch (error) {
      res.status(500).json({ error: 'Error al actualizar el dispositivo', details: error.message });
    }
  }

  static async deleteDevice(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const device = await Device.findByPk(id);
      if (!device) return res.status(404).json({ error: 'Dispositivo no encontrado' });

      await device.destroy();
      res.json({ message: 'Dispositivo eliminado correctamente' });
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar el dispositivo', details: error.message });
    }
  }
}
