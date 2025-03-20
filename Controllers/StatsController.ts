import { Request, Response } from 'express';
import Stat from '../db/models/stats';

class StatsController {
  public async getAll(req: Request, res: Response): Promise<void> {
    try {
      const stats = await Stat.findAll();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener las estadísticas' });
    }
  }

  public async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const stat = await Stat.findByPk(id);
      if (!stat) {
        res.status(404).json({ error: 'Estadística no encontrada' });
        return;
      }
      res.json(stat);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener la estadística' });
    }
  }

  public async create(req: Request, res: Response): Promise<void> {
    try {
      const newStat = await Stat.create(req.body);
      res.status(201).json(newStat);
    } catch (error) {
      res.status(500).json({ error: 'Error al crear la estadística' });
    }
  }

  public async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const stat = await Stat.findByPk(id);
      if (!stat) {
        res.status(404).json({ error: 'Estadística no encontrada' });
        return;
      }

      await stat.update(req.body);
      res.json(stat);
    } catch (error) {
      res.status(500).json({ error: 'Error al actualizar la estadística' });
    }
  }

  public async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const stat = await Stat.findByPk(id);
      if (!stat) {
        res.status(404).json({ error: 'Estadística no encontrada' });
        return;
      }

      await stat.destroy();
      res.json({ message: 'Estadística eliminada correctamente' });
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar la estadística' });
    }
  }
}

export default new StatsController();
