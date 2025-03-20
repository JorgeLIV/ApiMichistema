import { Request, Response } from 'express';
import Environment from '../db/models/environment';

class EnvironmentsController {
  public async getAll(req: Request, res: Response): Promise<void> {
    try {
      const environments = await Environment.findAll();
      res.json(environments);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener los entornos' });
    }
  }

  public async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const environment = await Environment.findByPk(id);
      if (!environment) {
        res.status(404).json({ error: 'Entorno no encontrado' });
        return;
      }
      res.json(environment);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener el entorno' });
    }
  }

  public async create(req: Request, res: Response): Promise<void> {
    try {
      const newEnvironment = await Environment.create(req.body);
      res.status(201).json(newEnvironment);
    } catch (error) {
      res.status(500).json({ error: 'Error al crear el entorno' });
    }
  }

  public async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const environment = await Environment.findByPk(id);
      if (!environment) {
        res.status(404).json({ error: 'Entorno no encontrado' });
        return;
      }

      await environment.update(req.body);
      res.json(environment);
    } catch (error) {
      res.status(500).json({ error: 'Error al actualizar el entorno' });
    }
  }

  public async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const environment = await Environment.findByPk(id);
      if (!environment) {
        res.status(404).json({ error: 'Entorno no encontrado' });
        return;
      }

      await environment.destroy();
      res.json({ message: 'Entorno eliminado correctamente' });
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar el entorno' });
    }
  }
}

export default new EnvironmentsController();
