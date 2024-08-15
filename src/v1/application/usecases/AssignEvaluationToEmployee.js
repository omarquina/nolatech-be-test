import { Status } from "../../domain/enums/Status.js";

export class AssignEvaluationToEmployee {
  repository;

  constructor(repository) {
    this.repository = repository;
  }

  async execute(user, evaluationId, _employeeId) {
    this.preprocessData(user);
    const employee = await this.findEmployeeById(_employeeId);
    const evaluation = await this.findEvaluationById(evaluationId);
    const questions = evaluation.questions.map((question) => ({
      id: question.id,
      points: question.points,
      answerId: "",
      answer: "",
    }));
    employee.evaluations.push({
      userId: _employeeId,
      status: Status.Pending,
      senderId: user.id,
      evaluationId: evaluationId,
      questions: questions,
    });
    this.save(employee);
    return employee;
  }

  async findEmployeeById(id) {
    return await this.repository.employees.searchById(id);
  }

  async findEvaluationById(id) {
    return await this.repository.evaluations.searchById(id);
  }

  preprocessData(user) {
    if (user.role !== "manager")
      throw new Error("User role is not granted to create evaluations");
  }

  async save(objeto) {
    return await this.repository.employees.save(objeto);
  }
}
