// db/models/environment.ts
import { 
  DataTypes, 
  Model, 
  Optional, 
  BelongsToGetAssociationMixin,
  BelongsToSetAssociationMixin,
  HasManyGetAssociationsMixin,
  HasManyAddAssociationMixin
} from 'sequelize';
import sequelize from '../db';

interface EnvironmentAttributes {
  id: number;
  name: string;
  color?: string | null;
  user_id: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface EnvironmentAttributesWithIncludes extends EnvironmentAttributes {
  user?: User;
  userDevices?: UserDevice[];
}

interface EnvironmentCreationAttributes extends Optional<EnvironmentAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

export class Environment extends Model<EnvironmentAttributesWithIncludes, EnvironmentCreationAttributes> 
  implements EnvironmentAttributes {
  public id!: number;
  public name!: string;
  public color?: string | null;
  public user_id!: number;
  public active!: boolean;
  public createdAt!: Date;
  public updatedAt!: Date;

  public user?: User;
  public userDevices?: UserDevice[];

  public getUser!: BelongsToGetAssociationMixin<User>;
  public setUser!: BelongsToSetAssociationMixin<User, number>;
  public getUserDevices!: HasManyGetAssociationsMixin<UserDevice>;
  public addUserDevice!: HasManyAddAssociationMixin<UserDevice, number>;

  public static associate(models: {
    User: typeof User;
    UserDevice: typeof UserDevice;
  }) {
    console.log('Configurando asociaciones en Environment');
    Environment.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });

    Environment.hasMany(models.UserDevice, {
      foreignKey: 'environment_id',
      as: 'userDevices',
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    });
  }
}

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
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
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
    modelName: 'Environment',
    tableName: 'environments',
    timestamps: true,
  }
);

export class User extends Model {}
export class UserDevice extends Model {}

export default Environment;