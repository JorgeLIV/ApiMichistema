import { Request, Response } from 'express';
import Configuration from '../db/models/configuration';

class ConfigurationsController {
  public async getAll(req: Request, res: Response): Promise<void> {
    try {
      const configurations = await Configuration.findAll();
      res.json(configurations);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener las configuraciones' });
    }
  }

  public async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const configuration = await Configuration.findByPk(id);
      if (!configuration) {
        res.status(404).json({ error: 'Configuración no encontrada' });
        return;
      }
      res.json(configuration);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener la configuración' });
    }
  }

  public async create(req: Request, res: Response): Promise<void> {
    try {
      const newConfiguration = await Configuration.create(req.body);
      res.status(201).json(newConfiguration);
    } catch (error) {
      res.status(500).json({ error: 'Error al crear la configuración' });
    }
  }

  public async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const configuration = await Configuration.findByPk(id);
      if (!configuration) {
        res.status(404).json({ error: 'Configuración no encontrada' });
        return;
      }

      await configuration.update(req.body);
      res.json(configuration);
    } catch (error) {
      res.status(500).json({ error: 'Error al actualizar la configuración' });
    }
  }

  public async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const configuration = await Configuration.findByPk(id);
      if (!configuration) {
        res.status(404).json({ error: 'Configuración no encontrada' });
        return;
      }

      await configuration.destroy();
      res.json({ message: 'Configuración eliminada correctamente' });
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar la configuración' });
    }
  }
}

export default new ConfigurationsController();
