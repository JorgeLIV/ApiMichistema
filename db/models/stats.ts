import { DataTypes, Sequelize, Model, Optional } from 'sequelize';
require('dotenv').config();

interface StatsAttributes {
  id: number;
  user_device_id?: number | null;
  title: string;
  message: string;
  value: string;
  recorded_at: Date;
  createdAt: Date;
  updatedAt: Date;
}

interface StatsCreationAttributes extends Optional<StatsAttributes, 'id' | 'user_device_id'> {}

class Stats extends Model<StatsAttributes, StatsCreationAttributes> implements StatsAttributes {
  public id!: number;
  public user_device_id?: number | null;
  public title!: string;
  public message!: string;
  public value!: string;
  public recorded_at!: Date;
  public createdAt!: Date;
  public updatedAt!: Date;
}

const sequelize = new Sequelize(process.env.DB_NAME!, process.env.DB_USERNAME!, process.env.DB_PASSWORD!, {
  dialect: 'mysql',
  host: process.env.DB_HOST,
});

Stats.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_device_id: {
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
    recorded_at: {
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
