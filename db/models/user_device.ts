import { DataTypes, Sequelize, Model, Optional } from 'sequelize';
require('dotenv').config();

interface UserDeviceAttributes {
  id: number;
  assigned_at: Date;
  config_id?: number | null;
  user_id?: number | null;
  device_id?: number | null;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface UserDeviceCreationAttributes extends Optional<UserDeviceAttributes, 'id' | 'config_id' | 'user_id' | 'device_id'> {}

class UserDevice extends Model<UserDeviceAttributes, UserDeviceCreationAttributes> implements UserDeviceAttributes {
  public id!: number;
  public assigned_at!: Date;
  public config_id?: number | null;
  public user_id?: number | null;
  public device_id?: number | null;
  public active!: boolean;
  public createdAt!: Date;
  public updatedAt!: Date;
}

const sequelize = new Sequelize(process.env.DB_NAME!, process.env.DB_USERNAME!, process.env.DB_PASSWORD!, {
  dialect: 'mysql',
  host: process.env.DB_HOST,
});

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
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    },
    config_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    device_id: {
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
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'UserDevice',
    tableName: 'user_device',
    timestamps: true,
  }
);

export default UserDevice;
