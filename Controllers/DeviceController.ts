import { Request, Response } from 'express';
import Device from '../db/models/device';

export default class DeviceController {
  static async getAllDevices(req: Request, res: Response) {
    try {
      const devices = await Device.findAll();
      res.json(devices);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener los dispositivos' });
    }
  }

  static async getDeviceById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const device = await Device.findByPk(id);
      if (!device) return res.status(404).json({ error: 'Dispositivo no encontrado' });
      res.json(device);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener el dispositivo' });
    }
  }

  static async createDevice(req: Request, res: Response) {
    try {
      const { name, description, code, constant, active } = req.body;
      const newDevice = await Device.create({ name, description, code, constant, active });
      res.status(201).json(newDevice);
    } catch (error) {
      res.status(500).json({ error: 'Error al crear el dispositivo' });
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
      res.status(500).json({ error: 'Error al actualizar el dispositivo' });
    }
  }

  // borrado lógico
  static async deleteDevice(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const device = await Device.findByPk(id);
      if (!device) return res.status(404).json({ error: 'Dispositivo no encontrado' });

      await device.destroy();
      res.json({ message: 'Dispositivo eliminado correctamente' });
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar el dispositivo' });
    }
  }
}
