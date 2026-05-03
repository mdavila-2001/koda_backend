class Ticket {
    constructor({ id, project_id, title, description, status, assigned_user_id, created_at }) {
        this.id = id;
        this.project_id = project_id;
        this.title = title;
        this.description = description;
        this.status = status;
        this.assigned_user_id = assigned_user_id;
        this.created_at = created_at;
    }
}

module.exports = Ticket;
