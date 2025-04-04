import { DataTypes, Sequelize, Model, Optional } from 'sequelize';
require('dotenv').config();

// Define the attributes interface
interface StatsAttributes {
  id: number;
  userDeviceId?: number | null; // Changed to camelCase for consistency
  title: string;
  message: string;
  value: string;
  recordedAt: Date; // Changed to camelCase
  createdAt: Date;
  updatedAt: Date;
}

// Define creation attributes with optional fields
interface StatsCreationAttributes extends Optional<StatsAttributes, 'id' | 'userDeviceId'> {}

// Define the Stats class
class Stats extends Model<StatsAttributes, StatsCreationAttributes> implements StatsAttributes {
  public id!: number;
  public userDeviceId?: number | null; // Changed to camelCase
  public title!: string;
  public message!: string;
  public value!: string;
  public recordedAt!: Date; // Changed to camelCase
  public createdAt!: Date;
  public updatedAt!: Date;
}

// Initialize Sequelize instance
const sequelize = new Sequelize(
  process.env.DB_NAME!,
  process.env.DB_USERNAME!,
  process.env.DB_PASSWORD!,
  {
    dialect: 'mysql',
    host: process.env.DB_HOST,
  }
);

// Initialize the Stats model
Stats.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userDeviceId: { // Changed to camelCase
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    message: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    value: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    recordedAt: { // Changed to camelCase
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
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
    modelName: 'Stats',
    tableName: 'stats',
    timestamps: true,
  }
);

export default Stats;