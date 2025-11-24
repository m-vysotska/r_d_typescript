import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database.js';
import { User } from './User.model.js';
import { Status, Priority } from '../types/task.schema.js';

export interface TaskAttributes {
  id: string;
  title: string;
  description: string;
  status: Status;
  priority: Priority;
  deadline: string;
  assigneeId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface TaskCreationAttributes extends Optional<TaskAttributes, 'id' | 'status' | 'priority' | 'createdAt' | 'updatedAt'> { }

export class Task extends Model<TaskAttributes, TaskCreationAttributes> implements TaskAttributes {
  public id!: string;
  public title!: string;
  public description!: string;
  public status!: Status;
  public priority!: Priority;
  public deadline!: string;
  public assigneeId!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public assignee?: User;
}

Task.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('todo', 'in_progress', 'done'),
      allowNull: false,
      defaultValue: 'todo'
    },
    priority: {
      type: DataTypes.ENUM('low', 'medium', 'high', 'urgent'),
      allowNull: false,
      defaultValue: 'medium'
    },
    deadline: {
      type: DataTypes.STRING,
      allowNull: false
    },
    assigneeId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: User,
        key: 'id'
      }
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  },
  {
    sequelize,
    tableName: 'tasks',
    timestamps: true
  }
);

// Define associations
Task.belongsTo(User, {
  foreignKey: 'assigneeId',
  as: 'assignee'
});

User.hasMany(Task, {
  foreignKey: 'assigneeId',
  as: 'tasks'
});




