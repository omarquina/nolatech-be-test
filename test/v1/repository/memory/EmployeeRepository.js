import { Empleado } from "../../../../src/v1/domain/entities/Empleado.js"
import { Status } from "../../../../src/v1/domain/enums/Status.js";

export class EmployeeRepository {
    collectionName = "employees";

    constructor(data) {
        this.entityClass = Empleado;
        this.data = data;
        this.collection = this.data[this.collectionName];
    }

    async save(objeto) {
        const entityClass = this.entityClass;
        const collectionName = this.collectionName;
        const found = this.collection.findIndex((o) => o.id === objeto.id);
        if (found === -1) this.collection.push(objeto);
        else {
            this.collection[found] = objeto;
        }
    }

    async searchById(id) {
        const found = await this.data[this.collectionName].filter(
            (o) => o.id === id
        )[0];

        if (!found) throw new Error("Employee not found");
        // Map data
        const objeto = new this.entityClass(found);
        return objeto;
    }

    async searchPendingEvaluationsByEmployeeId(id) {
        const found = this.collection.findIndex((o) => o.id === id);
        if (found === -1) throw new Error("Employee not found with id ", id);
        return this.collection[found].evaluations.filter(
            (e) => e.status === Status.Pending
        );
    }

    async getEvaluationToBeAnsweredByEmployeeId(employeeId,evaluationId){
      const employee = this.collection.filter( _e => _e.id === employeeId )[0]
      const evaluationOfEmployee = employee.evaluations.filter( _evaluation => _evaluation.evaluationId === evaluationId)[0]
      return evaluationOfEmployee;
    }

    async saveEvaluation(evaluarion, employee) {
      // update evaluation in employee or in his specific colection
      return true;
    }
}

