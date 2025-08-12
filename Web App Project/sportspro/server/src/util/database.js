// Configures PostgreSQL connection
const Sequelize = require('sequelize');

// Log the environment variables as soon as they are accessed
console.log('--- Environment Variables at database.js load ---');
console.log(`  process.env.PG_DB: ${process.env.PG_DB}`);
console.log(`  process.env.PG_USER: ${process.env.PG_USER}`);
console.log(`  process.env.PG_PASSWORD: ${process.env.PG_PASSWORD ? '********' : 'NOT SET'}`); 
console.log(`  process.env.PG_HOST: ${process.env.PG_HOST}`);
console.log(`  process.env.PG_PORT: ${process.env.PG_PORT}`);
console.log('--------------------------------------------------');


const sequelize = new Sequelize(
    process.env.PG_DB,
    process.env.PG_USER,
    process.env.PG_PASSWORD,
    {
        host: process.env.PG_HOST,
        dialect: 'postgres',
        port: process.env.PG_PORT,
        schema: 'sportspro', 
        logging: console.log, 
    }
);

module.exports = sequelize;