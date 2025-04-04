// db/models/user_device.ts
import { 
  DataTypes, 
  Model, 
  Optional, 
  BelongsToGetAssociationMixin,
  BelongsToSetAssociationMixin
} from 'sequelize';
import sequelize from '../db';

interface UserDeviceAttributes {
  id: number;
  assigned_at: Date;
  config_id?: number | null;
  user_id: number;
  device_id?: number | null;
  environment_id?: number | null; // Nueva columna
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface UserDeviceAttributesWithIncludes extends UserDeviceAttributes {
  user?: User;
  device?: Device;
  configuration?: Configuration;
  environment?: Environment; // Asociación con Environment
}

interface UserDeviceCreationAttributes extends Optional<UserDeviceAttributes, 'id' | 'config_id' | 'device_id' | 'environment_id' | 'createdAt' | 'updatedAt'> {}

export class UserDevice extends Model<UserDeviceAttributesWithIncludes, UserDeviceCreationAttributes> 
  implements UserDeviceAttributes {
  public id!: number;
  public assigned_at!: Date;
  public config_id?: number | null;
  public user_id!: number;
  public device_id?: number | null;
  public environment_id?: number | null;
  public active!: boolean;
  public createdAt!: Date;
  public updatedAt!: Date;

  public user?: User;
  public device?: Device;
  public configuration?: Configuration;
  public environment?: Environment;

  public getUser!: BelongsToGetAssociationMixin<User>;
  public setUser!: BelongsToSetAssociationMixin<User, number>;
  public getDevice!: BelongsToGetAssociationMixin<Device>;
  public setDevice!: BelongsToSetAssociationMixin<Device, number>;
  public getConfiguration!: BelongsToGetAssociationMixin<Configuration>;
  public setConfiguration!: BelongsToSetAssociationMixin<Configuration, number>;
  public getEnvironment!: BelongsToGetAssociationMixin<Environment>;
  public setEnvironment!: BelongsToSetAssociationMixin<Environment, number>;

  public static associate(models: {
    User: typeof User;
    Device: typeof Device;
    Configuration: typeof Configuration;
    Environment: typeof Environment;
  }) {
    console.log('Configurando asociaciones en UserDevice');
    UserDevice.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user',
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT'
    });

    UserDevice.belongsTo(models.Device, {
      foreignKey: 'device_id',
      as: 'device',
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });

    UserDevice.belongsTo(models.Configuration, {
      foreignKey: 'config_id',
      as: 'configuration',
      onDelete: 'SET NULL'
    });

    UserDevice.belongsTo(models.Environment, {
      foreignKey: 'environment_id',
      as: 'environment',
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    });
  }
}

UserDevice.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    assigned_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    config_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    device_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    environment_id: { // Nueva columna
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: 'UserDevice',
    tableName: 'user_device',
    timestamps: true,
    underscored: false,
  }
);

export class User extends Model {}
export class Device extends Model {}
export class Configuration extends Model {}
export class Environment extends Model {}

export default UserDevice;