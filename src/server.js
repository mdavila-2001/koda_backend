const app = require('./app');
const sequelize = require('./infrastructure/database/sequelize');

const PORT = process.env.PORT || 3000

const startServer = async () => {
    try {
        await sequelize.authenticate();
        console.log('Conexión a la base de datos (Sequelize) exitosa');
        app.listen(PORT, () => {
            console.log(`Servidor corriendo en el puerto ${PORT}`);
        });
    } catch (error) {
        console.error('Error al conectar a la base de datos:', error.message);
        console.error(error.stack);
        process.exit(1);
    }
};

startServer();