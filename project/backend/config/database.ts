import { Sequelize } from 'sequelize';

const isTest = process.env.NODE_ENV === 'test';

const databasePath = isTest ? './test-database.sqlite' : './database.sqlite';

export const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: databasePath,
  logging: !isTest ? console.log : false,
});

export const initializeDatabase = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');

    // Sync all models
    await sequelize.sync({ force: isTest });
    console.log('Database synchronized.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    throw error;
  }
};

export const closeDatabase = async (): Promise<void> => {
  await sequelize.close();
};
