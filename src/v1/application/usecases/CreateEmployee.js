import { Empleado } from "../../domain/entities/Empleado.js";

export class CreateEmployee {
    repository;

    constructor(repository) {
        this.repository = repository;
    }

    async execute(user, dto) {
        this.preprocessData(user, dto);
        const empleado = new Empleado(dto);
        this.save(empleado);
        return empleado;
    }

    preprocessData(user, dto) {
        if (user.role !== "manager")
            throw new Error("User role is not granted to create employee");
    }

    async save(empleado) {
        await this.repository.employees.save(empleado);
    }
}

