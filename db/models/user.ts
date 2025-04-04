import { 
  DataTypes, 
  Model, 
  Optional, 
  HasManyGetAssociationsMixin,
  HasManyAddAssociationMixin
} from 'sequelize';
import sequelize from '../db'; // Ajusta la ruta según tu estructura (por ejemplo, '../../db' si está en db/models)

// Interfaces para los atributos
interface UserAttributes {
  id: number;
  name: string;
  email: string;
  password: string;
  activo?: boolean;
  jwt_token?: string | null;
  role_id: number;
  deletedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

interface UserAttributesWithIncludes extends UserAttributes {
  userDevices?: UserDevice[]; // Asociación con UserDevice
  environments?: Environment[]; // Asociación con Environment
}

interface UserCreationAttributes extends Optional<UserAttributes, 'id' | 'jwt_token' | 'deletedAt' | 'createdAt' | 'updatedAt'> {}

// Clase del modelo
export class User extends Model<UserAttributesWithIncludes, UserCreationAttributes> implements UserAttributes {
  public id!: number;
  public name!: string;
  public email!: string;
  public password!: string;
  public activo?: boolean;
  public jwt_token?: string | null;
  public role_id!: number;
  public deletedAt?: Date | null;
  public createdAt!: Date;
  public updatedAt!: Date;

  // Propiedades de las asociaciones
  public userDevices?: UserDevice[];
  public environments?: Environment[];

  // Mixins para las asociaciones
  public getUserDevices!: HasManyGetAssociationsMixin<UserDevice>;
  public addUserDevice!: HasManyAddAssociationMixin<UserDevice, number>;
  public getEnvironments!: HasManyGetAssociationsMixin<Environment>;
  public addEnvironment!: HasManyAddAssociationMixin<Environment, number>;

  // Método estático para definir asociaciones
  public static associate(models: {
    UserDevice: typeof UserDevice;
    Environment: typeof Environment;
  }) {
    console.log('Configurando asociaciones en User');
    User.hasMany(models.UserDevice, {
      foreignKey: 'user_id',
      as: 'userDevices',
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE',
    });
    User.hasMany(models.Environment, {
      foreignKey: 'user_id',
      as: 'environments',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  }
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    activo: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: true,
    },
    jwt_token: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    role_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
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
    modelName: 'User',
    tableName: 'users',
    paranoid: true,
    timestamps: true,
  }
);

// Tipos básicos para las asociaciones (deberían estar en sus propios archivos)
export class UserDevice extends Model {}
export class Environment extends Model {}

export default User;