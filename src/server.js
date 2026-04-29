const app = require('./app');
const db = require('./infrastructure/database/db');

const PORT = process.env.PORT || 3000

const startServer = async () => {
    try {
        const res = await db.query('SELECT NOW()');
        console.log('Conexión a la base de datos exitosa:', res.rows[0].now);
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