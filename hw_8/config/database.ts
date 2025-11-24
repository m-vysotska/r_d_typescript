import { Sequelize } from 'sequelize';

const isTest = process.env.NODE_ENV === 'test';

const databasePath = isTest
  ? './test-database.sqlite'
  : './database.sqlite';

export const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: databasePath,
  logging: !isTest
});

export const initializeDatabase = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
    
    if (!isTest) {
      await sequelize.sync({ alter: true });
      console.log('Database synchronized.');
    }
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    throw error;
  }
};




