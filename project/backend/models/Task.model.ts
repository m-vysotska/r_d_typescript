import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database.js';
import { Status, Priority } from '../types/task.types.js';

export interface TaskAttributes {
  id: string;
  title: string;
  description: string;
  status: Status;
  priority: Priority;
  deadline: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export type TaskCreationAttributes = Optional<TaskAttributes, 'id' | 'createdAt' | 'updatedAt'>;

export class Task extends Model<TaskAttributes, TaskCreationAttributes> implements TaskAttributes {
  public id!: string;
  public title!: string;
  public description!: string;
  public status!: Status;
  public priority!: Priority;
  public deadline!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Task.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [1, 100],
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [1, 1000],
      },
    },
    status: {
      type: DataTypes.ENUM(...Object.values(Status)),
      allowNull: false,
      defaultValue: Status.Todo,
    },
    priority: {
      type: DataTypes.ENUM(...Object.values(Priority)),
      allowNull: false,
      defaultValue: Priority.Medium,
    },
    deadline: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        isDate: true,
        isAfter: new Date().toISOString().split('T')[0], // Must be today or future
      },
    },
  },
  {
    sequelize,
    modelName: 'Task',
    tableName: 'tasks',
    timestamps: true,
  }
);
