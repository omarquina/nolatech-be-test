import { Role } from "../../../../src/v1/domain/enums/Role.js"
import { Status } from "../../domain/enums/Status.js";

export class RespondEvaluation {
  repository;
  notifier;

  constructor(repository, notifier) {
    this.repository = repository;
    this.notifier = notifier;
  }

  async execute(employee, answersOfEmployee) {
    this.preprocessData(employee, answersOfEmployee);
    const evaluationBeenAnsweringByEmployee =
      await this.getEvaluationToBeAnsweredByEmployeeId(
        employee.id,
        answersOfEmployee.evaluationId,
      );
    const originalEvaluation = await this.getEvaluationById(answersOfEmployee.evaluationId);
    await this.validateAnswers(
      originalEvaluation,
      evaluationBeenAnsweringByEmployee,
      answersOfEmployee,
    );
    const evaluationOfEmployee = this.assignAnswersToEvaluation(answersOfEmployee, evaluationBeenAnsweringByEmployee)
    await this.saveEvaluation(answersOfEmployee, evaluationOfEmployee);
    this.notify(evaluationOfEmployee)
    return evaluationOfEmployee;
  }

  preprocessData(user, dto) {
    if (user.role !== Role.Empleado)
      throw new Error("User is not granted to respond this question");
  }

  async getEmployeeById(id) {
    return await this.repository.employees.getById(id);
  }

  async validateAnswers(
    originalEvaluation,
    evaluationBeenAnsweringByEmployee,
    answersOfEmployee,
  ) {
    if (!evaluationBeenAnsweringByEmployee)
      throw new Error("Evaluation is not valid to respond");

    const errors = []
    answersOfEmployee.questions.forEach((answerOfEmployee) => {
      const questionBeenAnswered = originalEvaluation.questions.filter((originalQuestion) => answerOfEmployee.questionId === originalQuestion.id)[0]

      if (!questionBeenAnswered) { errors.push(`Question ${answerOfEmployee.id} is not a valid question`); return; }
      
      const isValidAnswer = questionBeenAnswered.answers.map((a) => a.id ).includes(answerOfEmployee.answerId);
      if (!isValidAnswer) errors.push(`Answer ${answerOfEmployee.answerId} is not valid for Question #{answerOfEmployee.id} `)
    });
    if (errors.length) throw new Error(errors.join(", "));
  }

  async getEvaluationById(id) {
    return await this.repository.evaluations.searchById(id)
  }

  async saveEvaluation(employee, evaluation ) {
    await this.repository.employees.saveEvaluation(employee, evaluation);
  }

  async getEvaluationToBeAnsweredByEmployeeId(employeeId, evaluationId){
    return await this.repository.employees.getEvaluationToBeAnsweredByEmployeeId(employeeId,evaluationId);
  }

  assignAnswersToEvaluation(answersOfEmployee, evaluationOfEmployee) {
    const questionsToUpdate = evaluationOfEmployee.questions
    questionsToUpdate.forEach( questionToUpdate => {
      const _a = answersOfEmployee.questions.filter(answerOfEmployee => questionToUpdate.id === answerOfEmployee.questionId )[0]
      questionToUpdate.answerId = _a.answerId
      if (_a.customAnswer)
        questionToUpdate.customAnswer = _a.customAnswer 
    })
    evaluationOfEmployee.status = Status.Answered
    return evaluationOfEmployee;
  }

  async notify(evaluationOfEmployee, employee){
    if (!this.notifier) return;
    await this.notifier.notifyToEmployee(evaluationOfEmployee, employee)
  }
}
