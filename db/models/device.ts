import { DataTypes, Sequelize, Model, Optional } from 'sequelize';
require('dotenv').config();

interface DeviceAttributes {
  id: number;
  name: string;
  description?: string | null;
  code?: string | null;
  constant?: number | null;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}

interface DeviceCreationAttributes extends Optional<DeviceAttributes, 'id' | 'description' | 'code' | 'constant' | 'deletedAt'> {}

class Device extends Model<DeviceAttributes, DeviceCreationAttributes> implements DeviceAttributes {
  public id!: number;
  public name!: string;
  public description?: string | null;
  public code?: string | null;
  public constant?: number | null;
  public active!: boolean;
  public createdAt!: Date;
  public updatedAt!: Date;
  public deletedAt?: Date | null;
}

const sequelize = new Sequelize(process.env.DB_NAME!, process.env.DB_USERNAME!, process.env.DB_PASSWORD!, {
  dialect: 'mysql',
  host: process.env.DB_HOST,
});

Device.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    code: {
      type: DataTypes.STRING(50),
      unique: true,
      allowNull: true,
    },
    constant: {
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
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'Device',
    tableName: 'devices',
    timestamps: true,
    paranoid: true,
  }
);

export default Device;
