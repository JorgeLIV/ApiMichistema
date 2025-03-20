import { DataTypes, Sequelize, Model, Optional } from 'sequelize';
require('dotenv').config();

interface EnvironmentAttributes {
  id: number;
  name: string;
  color?: string | null;
  user_device_id?: number | null;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface EnvironmentCreationAttributes extends Optional<EnvironmentAttributes, 'id' | 'color' | 'user_device_id'> {}

class Environment extends Model<EnvironmentAttributes, EnvironmentCreationAttributes> implements EnvironmentAttributes {
  public id!: number;
  public name!: string;
  public color?: string | null;
  public user_device_id?: number | null;
  public active!: boolean;
  public createdAt!: Date;
  public updatedAt!: Date;
}

const sequelize = new Sequelize(process.env.DB_NAME!, process.env.DB_USERNAME!, process.env.DB_PASSWORD!, {
  dialect: 'mysql',
  host: process.env.DB_HOST,
});

Environment.init(
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
    color: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    user_device_id: {
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
    modelName: 'Environment',
    tableName: 'environments',
    timestamps: true,
  }
);

export default Environment;
