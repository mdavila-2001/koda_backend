CREATE TYPE ticket_status AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED');

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL, -- Hash de Bcrypt
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);

CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_projects_owner ON projects(owner_id);

CREATE TABLE project_members (
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (project_id, user_id)
);

CREATE TABLE tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    status ticket_status NOT NULL DEFAULT 'PENDING',
    assigned_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Índices para optimizar las consultas del tablero Kanban
CREATE INDEX idx_tickets_project_status ON tickets(project_id, status);
CREATE INDEX idx_tickets_assigned ON tickets(assigned_user_id);

CREATE OR REPLACE FUNCTION fn_validate_ticket_logic()
RETURNS TRIGGER AS $$
BEGIN
    -- 1. Validar transición de estado lineal
    -- Permitidos: PENDING <-> IN_PROGRESS y IN_PROGRESS <-> COMPLETED
    IF OLD.status = 'PENDING' AND NEW.status = 'COMPLETED' THEN
        RAISE EXCEPTION 'Transición no permitida: de Pendiente a Completado directamente.';
    END IF;
    
    IF OLD.status = 'COMPLETED' AND NEW.status = 'PENDING' THEN
        RAISE EXCEPTION 'Transición no permitida: de Completado a Pendiente directamente.';
    END IF;

    -- 2. Validar que no se inicie sin responsable
    -- El ticket se inicia cuando pasa a "En Progreso"
    IF NEW.status = 'IN_PROGRESS' AND NEW.assigned_user_id IS NULL THEN
        RAISE EXCEPTION 'No se puede iniciar un ticket sin un responsable asignado.';
    END IF;

    -- 3. Validar que el responsable pertenezca al proyecto
    IF NEW.assigned_user_id IS NOT NULL THEN
        IF NOT EXISTS (
            SELECT 1 FROM project_members 
            WHERE project_id = NEW.project_id AND user_id = NEW.assigned_user_id
        ) AND NOT EXISTS (
            SELECT 1 FROM projects WHERE id = NEW.project_id AND owner_id = NEW.assigned_user_id
        ) THEN
            RAISE EXCEPTION 'El usuario asignado debe ser miembro del proyecto.';
        END IF;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_validate_ticket
BEFORE UPDATE ON tickets
FOR EACH ROW
EXECUTE FUNCTION fn_validate_ticket_logic();