const { pool } = require('./db');
const bcrypt = require('bcryptjs');

async function seedDatabase() {
    try {
        console.log('Iniciando el proceso de seeding...');

        // 1. Limpiar la base de datos (CASCADE borra todo en cascada)
        console.log('Limpiando tablas existentes...');
        await pool.query('TRUNCATE TABLE users, projects, project_members, tickets CASCADE;');

        // 2. Insertar Usuarios
        console.log('Insertando usuarios...');
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash('password123', salt);

        const usersResult = await pool.query(
            `INSERT INTO users (name, email, password) VALUES 
            ('Juan Pérez', 'juan@koda.com', $1),
            ('María López', 'maria@koda.com', $1),
            ('Carlos Ruiz', 'carlos@koda.com', $1)
            RETURNING id;`,
            [passwordHash]
        );
        const users = usersResult.rows;
        console.log(`${users.length} usuarios creados.`);

        // 3. Insertar Proyectos
        console.log('Insertando proyectos...');
        const projectsResult = await pool.query(
            `INSERT INTO projects (name, description, owner_id) VALUES 
            ('Koda Backend Refactor', 'Migrar a Arquitectura Limpia', $1),
            ('Koda Frontend React', 'Crear el panel Kanban', $2)
            RETURNING id;`,
            [users[0].id, users[1].id]
        );
        const projects = projectsResult.rows;
        console.log(`${projects.length} proyectos creados.`);

        // 4. Asignar Miembros a Proyectos
        console.log('Asignando miembros a los proyectos...');
        // Juan (owner) y María están en el proyecto 1
        // María (owner) y Carlos están en el proyecto 2
        await pool.query(
            `INSERT INTO project_members (project_id, user_id) VALUES 
            ($1, $2), ($3, $4),
            ($5, $6), ($7, $8);`,
            [
                projects[0].id, users[0].id, projects[0].id, users[1].id,
                projects[1].id, users[1].id, projects[1].id, users[2].id
            ]
        );
        console.log('Miembros asignados.');

        // 5. Insertar Tickets
        console.log('Insertando tickets...');
        await pool.query(
            `INSERT INTO tickets (project_id, title, description, status, assigned_user_id) VALUES 
            -- Proyecto 1 (Juan y María)
            ($1, 'Configurar DB', 'Crear scripts iniciales', 'COMPLETED', $2),
            ($1, 'Implementar Auth', 'Login con JWT', 'IN_PROGRESS', $3),
            ($1, 'Crear Middleware de Errores', 'Validar leaks', 'PENDING', NULL),
            
            -- Proyecto 2 (María y Carlos)
            ($4, 'Diseñar Login', 'Maquetar pantalla de login en Tailwind', 'COMPLETED', $5),
            ($4, 'Integrar API Auth', 'Conectar con endpoint /api/auth/login', 'IN_PROGRESS', $6),
            ($4, 'Componente Kanban', 'Crear el tablero de arrastrar y soltar', 'PENDING', NULL);`,
            [
                projects[0].id, users[0].id, users[1].id, // Proyecto 1 asignaciones
                projects[1].id, users[1].id, users[2].id  // Proyecto 2 asignaciones
            ]
        );
        console.log('Tickets creados.');

        console.log('Seeding completado exitosamente.');
    } catch (error) {
        console.error('Error durante el seeding:', error);
    } finally {
        // Cerrar la conexión del pool para que el script termine
        await pool.end();
    }
}

seedDatabase();
