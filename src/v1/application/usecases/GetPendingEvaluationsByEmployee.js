export class GetPendingEvaluationsByEmployee {
    repository;

    constructor(repository) {
        this.repository = repository;
    }

    async execute(user, dto) {
        this.preprocessData(user, dto);
        const pendingEvaluations = await this.getByEmployeeId(dto);
        //console.dir(empleado);
        return pendingEvaluations;
    }

    preprocessData(user, empleado, dto) {
        //if (user.role !== "manager")
        //    throw new Error("User role is not granted to create employee");
    }

    async getByEmployeeId(id) {
        return await this.repository.employees.searchPendingEvaluationsByEmployeeId(
            id
        );
    }
}

