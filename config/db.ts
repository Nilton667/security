import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('horizon', 'root', '', {
    host: 'localhost',
    dialect: 'mysql'
});

try {
    //sequelize.authenticate();
} catch (error) {
    console.error('Unable to connect to the database:', error);
}

export default sequelize;