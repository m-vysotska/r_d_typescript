import { sequelize } from '../config/database.js';
import { Task } from '../models/Task.model.js';
import { User } from '../models/User.model.js';

beforeAll(async () => {
  await sequelize.authenticate();
  await sequelize.sync({ force: true });
});

beforeEach(async () => {
  await Task.destroy({ where: {}, truncate: true, cascade: true });
  await User.destroy({ where: {}, truncate: true, cascade: true });
});

afterAll(async () => {
  await sequelize.close();
});

