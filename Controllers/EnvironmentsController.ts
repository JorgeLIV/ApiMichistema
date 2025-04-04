import { Request, Response } from 'express';
import models from '../db/models'; // Importa todos los modelos con asociaciones configuradas

class EnvironmentController {
  // Crear un Environment
  public async create(req: Request, res: Response): Promise<Response> {
    try {
      const { name, color, active, userId } = req.body;

      if (!userId) {
        return res.status(400).json({ message: 'userId es requerido' });
      }

      const environment = await models.Environment.create({
        name,
        color,
        active,
        user_id: userId, // Asegúrate de incluir el user_id
      });

      return res.status(201).json({
        message: 'Environment created successfully',
        environment,
      });
    } catch (error) {
      return res.status(500).json({
        message: 'Error creating environment',
        error: error instanceof Error ? error.message : 'Error desconocido',
      });
    }
  }

  // Obtener todos los Environments
  public async getAll(req: Request, res: Response): Promise<Response> {
    try {
      const environments = await models.Environment.findAll({
        include: [
          { model: models.User, as: 'user' }, // Opcional: incluir info del usuario
        ],  
      });
      return res.status(200).json(environments);
    } catch (error) {
      return res.status(500).json({
        message: 'Error fetching environments',
        error: error instanceof Error ? error.message : 'Error desconocido',
      });
    }
  }

  // Obtener un Environment por ID
  public async getById(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const environment = await models.Environment.findByPk(id, {
        include: [
          { model: models.User, as: 'user' },
          { model: models.UserDevice, as: 'userDevices', include: [{ model: models.Device, as: 'device' }] },
        ],
      });

      if (!environment) {
        return res.status(404).json({
          message: 'Environment not found',
        });
      }

      return res.status(200).json(environment);
    } catch (error) {
      return res.status(500).json({
        message: 'Error fetching environment',
        error: error instanceof Error ? error.message : 'Error desconocido',
      });
    }
  }

  // Actualizar un Environment
  public async update(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const { name, color, active } = req.body;

      const environment = await models.Environment.findByPk(id);

      if (!environment) {
        return res.status(404).json({
          message: 'Environment not found',
        });
      }

      environment.name = name || environment.name;
      environment.color = color || environment.color;
      environment.active = active !== undefined ? active : environment.active;

      await environment.save();

      return res.status(200).json({
        message: 'Environment updated successfully',
        environment,
      });
    } catch (error) {
      return res.status(500).json({
        message: 'Error updating environment',
        error: error instanceof Error ? error.message : 'Error desconocido',
      });
    }
  }

  // Eliminar un Environment
  public async delete(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const environment = await models.Environment.findByPk(id);

      if (!environment) {
        return res.status(404).json({
          message: 'Environment not found',
        });
      }

      await environment.destroy();

      return res.status(200).json({
        message: 'Environment deleted successfully',
      });
    } catch (error) {
      return res.status(500).json({
        message: 'Error deleting environment',
        error: error instanceof Error ? error.message : 'Error desconocido',
      });
    }
  }

  // Asignar un UserDevice a un Environment
  public async assignUserDevice(req: Request, res: Response): Promise<Response> {
    try {
      const { environmentId, userDeviceId } = req.body;

      const environment = await models.Environment.findByPk(environmentId);
      const userDevice = await models.UserDevice.findByPk(userDeviceId);

      if (!environment) {
        return res.status(404).json({ message: 'Environment not found' });
      }
      if (!userDevice) {
        return res.status(404).json({ message: 'UserDevice not found' });
      }

      // Actualiza el environment_id en UserDevice
      userDevice.environment_id = environment.id;
      await userDevice.save();

      return res.status(200).json({
        message: 'UserDevice assigned to Environment successfully',
        userDevice,
      });
    } catch (error) {
      return res.status(500).json({
        message: 'Error assigning UserDevice to Environment',
        error: error instanceof Error ? error.message : 'Error desconocido',
      });
    }
  }

  // Obtener todos los Environments de un usuario por userId
  public async getByUserId(req: Request, res: Response): Promise<Response> {
    try {
      const { userId } = req.params;

      // Validar que userId sea un número válido
      const userIdNum = parseInt(userId, 10);
      if (isNaN(userIdNum)) {
        return res.status(400).json({
          message: 'userId debe ser un número válido',
        });
      }

      const environments = await models.Environment.findAll({
        where: {
          user_id: userIdNum, // Filtrar por user_id
        },
        include: [
          { model: models.User, as: 'user' }, // Opcional: incluir info del usuario
        ],
      });

      if (!environments || environments.length === 0) {
        return res.status(404).json({
          message: 'No environments found for this user',
        });
      }

      return res.status(200).json(environments);
    } catch (error) {
      return res.status(500).json({
        message: 'Error fetching environments by userId',
        error: error instanceof Error ? error.message : 'Error desconocido',
      });
    }
  }

  // Obtener todos los UserDevices de un Environment
  public async getUserDevices(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;

      const environment = await models.Environment.findByPk(id, {
        include: [
          {
            model: models.UserDevice,
            as: 'userDevices',
            include: [{ model: models.Device, as: 'device' }],
          },
        ],
      });

      if (!environment) {
        return res.status(404).json({
          message: 'Environment not found',
        });
      }

      return res.status(200).json(environment.userDevices || []);
    } catch (error) {
      return res.status(500).json({
        message: 'Error fetching UserDevices',
        error: error instanceof Error ? error.message : 'Error desconocido',
      });
    }
  }
}

export default new EnvironmentController();