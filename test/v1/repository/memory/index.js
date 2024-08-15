import { EmployeeRepository } from "./EmployeeRepository.js";
import { EvaluationRepository } from "./EvaluationRepository.js";
import { QuestionsRepository } from "./QuestionsRepository.js";

export const data = {
  evaluations: [],
  questions: [],
  users: [],
  reports: [],
  employees: [],
};

export const Repository = {
  evaluations: new EvaluationRepository(data),
  questions: new QuestionsRepository(data),
  employees: new EmployeeRepository(data),
};
