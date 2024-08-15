class GetEmployee {
    repository;

    constructor(repository) {
        this.repository = repository;
    }

    async execute(user, dto) {
        this.preprocessData(user, empleado, dto);
        const empleado = this.getById(dto.id);
        this.save(empleado);
        //console.dir(empleado);
        return empleado;
    }

    preprocessData(user, empleado, dto) {
        //if (user.role !== "manager")
        //    throw new Error("User role is not granted to create employee");
    }

    async getById(id) {
        return await this.repository.employees.searchById(id);
    }
}

