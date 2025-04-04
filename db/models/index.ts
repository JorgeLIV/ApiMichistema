// db/models/index.ts
import UserDevice from './user_device';
import User from './user';
import Device from './device';
import Configuration from './configuration';
import Environment from './environment';
import sequelize from '../db';

interface Models {
  User: typeof User;
  Device: typeof Device;
  Configuration: typeof Configuration;
  UserDevice: typeof UserDevice;
  Environment: typeof Environment;
  sequelize: typeof sequelize;
}

const models: Models = {
  User,
  Device,
  Configuration,
  UserDevice,
  Environment,
  sequelize,
};

Object.values(models).forEach((model: any) => {
  if (model.associate) {
    console.log(`Ejecutando associate para ${model.name}`);
    model.associate(models);
  }
});

export type { Models };
export default models;