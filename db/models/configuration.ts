import { DataTypes, Sequelize, Model, Optional } from 'sequelize';
require('dotenv').config();

interface ConfigurationAttributes {
  id: number;
  custom_name?: string | null;
  weight?: number | null;
  intervalo?: number | null;
  createdAt: Date;
  updatedAt: Date;
}

interface ConfigurationCreationAttributes extends Optional<ConfigurationAttributes, 'id'> {}

class Configuration extends Model<ConfigurationAttributes, ConfigurationCreationAttributes> implements ConfigurationAttributes {
  public id!: number;
  public custom_name?: string | null;
  public weight?: number | null;
  public intervalo?: number | null;
  public createdAt!: Date;
  public updatedAt!: Date;
}

const sequelize = new Sequelize(process.env.DB_NAME!, process.env.DB_USERNAME!, process.env.DB_PASSWORD!, {
  dialect: 'mysql',
  host: process.env.DB_HOST,
});

Configuration.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    custom_name: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    weight: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    intervalo: {
      type: DataTypes.INTEGER,
      allowNull: true,
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
    modelName: 'Configuration',
    tableName: 'configurations',
    timestamps: true,
  }
);

export default Configuration;
