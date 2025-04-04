import { 
  DataTypes, 
  Model, 
  Optional, 
  HasManyGetAssociationsMixin,
  HasManyAddAssociationMixin
} from 'sequelize';
import sequelize from '../db'; // Importa la instancia centralizada desde db.ts

// Interfaces para los atributos
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

interface DeviceAttributesWithIncludes extends DeviceAttributes {
  userDevices?: UserDevice[]; // Asociación con UserDevice
}

interface DeviceCreationAttributes extends Optional<DeviceAttributes, 'id' | 'description' | 'code' | 'constant' | 'deletedAt' | 'createdAt' | 'updatedAt'> {}

// Clase del modelo
export class Device extends Model<DeviceAttributesWithIncludes, DeviceCreationAttributes> implements DeviceAttributes {
  public id!: number;
  public name!: string;
  public description?: string | null;
  public code?: string | null;
  public constant?: number | null;
  public active!: boolean;
  public createdAt!: Date;
  public updatedAt!: Date;
  public deletedAt?: Date | null;

  // Propiedad de la asociación
  public userDevices?: UserDevice[];

  // Mixins para las asociaciones
  public getUserDevices!: HasManyGetAssociationsMixin<UserDevice>;
  public addUserDevice!: HasManyAddAssociationMixin<UserDevice, number>;

  // Método estático para definir asociaciones
  public static associate(models: {
    UserDevice: typeof UserDevice;
    // Añade otros modelos relacionados si los tienes
  }) {
    console.log('Configurando asociaciones en Device'); // Depuración
    Device.hasMany(models.UserDevice, {
      foreignKey: 'device_id',
      as: 'userDevices',
      onDelete: 'SET NULL', // Coincide con UserDevice
      onUpdate: 'CASCADE',
    });
  }
}

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
      defaultValue: DataTypes.NOW, // Cambié a DataTypes.NOW para consistencia
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW, // Cambié a DataTypes.NOW
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

// Tipo básico para UserDevice (debería estar en su propio archivo)
export class UserDevice extends Model {}

export default Device;