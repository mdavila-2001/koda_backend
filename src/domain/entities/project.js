class Project {
    constructor({ id, name, description, owner_id, created_at }) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.owner_id = owner_id;
        this.created_at = created_at;
    }
}

module.exports = Project;
