import { expect } from "chai";
import { Repository, data } from "../../repository/memory/index.js";
import { CreateEvaluation } from "../../../../src/v1/application/usecases/CreateEvaluation.js";
import { UpdateEvaluation } from "../../../../src/v1/application/usecases/UpdateEvaluation.js"
import { CreateEmployee } from "../../../../src/v1/application/usecases/CreateEmployee.js";
import { AssignEvaluationToEmployee } from "../../../../src/v1/application/usecases/AssignEvaluationToEmployee.js";
import { UpdateQuestion} from "../../../../src/v1/application/usecases/UpdateQuestion.js"
import { GetPendingEvaluationsByEmployee } from "../../../../src/v1/application/usecases/GetPendingEvaluationsByEmployee.js";
import { RespondEvaluation } from "../../../../src/v1/application/usecases/RespondEvaluation.js";
import { Role } from "../../../../src/v1/domain/enums/Role.js";
import { Status } from "../../../../src/v1/domain/enums/Status.js";

describe("Evaluations", async () => {
  it("should create a Satisfaction Evaluation with two questions and 2 posible responses per each", async () => {
    const user = { role: "manager" };
    const createEvaluation = new CreateEvaluation(Repository);
    const evaluation = await createEvaluation.execute(user, {
      name: "Satisfaction Evaluation",
      questions: [
        {
          question: "How do you feel during the work day?",
          answers: [
            { answer: "excelent", points: 1 },
            { answer: "bad", points: 1 },
            { answer: "other", type: "open", points: 1 },
          ],
        },
        {
          question: "How do you do to recharge energy at weekends",
          answers: [{ answer: "other", type: "open", points: 1 }],
        },
      ],
    });
    expect(evaluation.name).to.equal("Satisfaction Evaluation");
    expect(evaluation.questions.length).to.equal(2);

    expect(evaluation.questions[0].question).to.not.be.empty;
    expect(evaluation.questions[0].answers).to.not.empty;
  });

  it("shuold edit an evaluation", async () => {
    const data = {
      name: "Satisfaction Evaluation",
      questions: [
        {
          question: "How do you feel during the work day?",
          answers: [
            { answer: "excelent", points: 1 },
            { answer: "bad", points: 1 },
            { answer: "other", type: "open", points: 1 },
          ],
        },
        {
          question: "How do you do to recharge energy at weekends",
          answers: [{ answer: "other", type: "open", points: 1 }],
        },
      ],
    };

    const createEvaluation = new CreateEvaluation(Repository);
    const user = { role: "manager" };
    const evaluation = await createEvaluation.execute(user, data);

    const newEvaluationData = {
      id: evaluation.id,
      name: "Old Satisfaction Evaluation",
      questions: evaluation.questions,
    };
    const updateEvaluationOperation = new UpdateEvaluation(Repository);
    const updatedEvaluation = await updateEvaluationOperation.execute(
      user,
      newEvaluationData,
    );
    expect(evaluation.id).to.be.eql(updatedEvaluation.id);
    expect(updatedEvaluation.name).to.eql("Old Satisfaction Evaluation");
  });

  describe("Empleados", async () => {
    it("As a manager should assign an evaluation to an employee", async () => {
      const manager = { role: "manager" };
      const evaluationData = {
        name: "Satisfaction Evaluation",
        questions: [
          {
            question: "How do you feel during the work day?",
            answers: [
              { answer: "excelent", points: 1 },
              { answer: "bad", points: 1 },
              { answer: "other", type: "open", points: 1 },
            ],
          },
          {
            question: "How do you do to recharge energy at weekends",
            answers: [{ type: "open", points: 1 }],
          },
        ],
      };

      const createEvaluation = new CreateEvaluation(Repository);
      const user = { role: "manager" };
      const employeeData = {
        name: "Test User",
        surename: "TEST",
        role: Role.Empleado,
        position: "ingeniero",
      };
      //const employee = new Empleado(employeeData);
      const createEmployeeOperation = new CreateEmployee(Repository);
      const employee = await createEmployeeOperation.execute(
        user,
        employeeData,
      );
      expect(employee.id).to.not.empty;
      expect(employee.role).to.eql(Role.Empleado);
      //const getEmployeOperation = new GetEmployee(Repository);
      //const employeeCreated = await getEmployeOperation.execute(employee.id)

      const evaluation = await createEvaluation.execute(user, evaluationData);
      expect(evaluation.id).to.not.empty
      expect(evaluation.questions[0].id).to.not.empty
      expect(evaluation.questions[1].id).to.not.empty
      const sendEvaluationOperation = new AssignEvaluationToEmployee(Repository);
      const employeeNotified = await sendEvaluationOperation.execute(
        manager,
        evaluation.id,
        employee.id,
      );
      expect(employeeNotified.evaluations).to.have.lengthOf(1);
      expect(employee.id).to.be.eql(employeeNotified.id);
      const getPendinEvaluationsByEmployeeOperation =
        new GetPendingEvaluationsByEmployee(Repository);
      const pendingEvaluationsByEmployee =
        await getPendinEvaluationsByEmployeeOperation.execute(
          user,
          employeeNotified.id,
        );
      expect(pendingEvaluationsByEmployee).to.have.lengthOf(1);

      const question1 = evaluation.questions[0];
      const question2 = evaluation.questions[1];
      // Answer evaluation
      const answerData = {
        evaluationId: evaluation.id,
        questions: [{
            questionId: question1.id,
            answerId: question1.answers[1].id,
            customAnswer: ""
          },
          {
            questionId: question2.id,
            answerId: question2.answers[0].id,
            customAnswer: "My custom response",
          },
        ],
      };
      const respondEvaluationOperation = new RespondEvaluation(Repository);
      const evaluationOfEmployee = await respondEvaluationOperation.execute(
        employee,
        answerData,
      );

      expect(evaluationOfEmployee.questions).to.have.lengthOf(2);
      expect(evaluationOfEmployee.questions[0].id).to.not.be.empty;
      expect(evaluationOfEmployee.questions[0].answerId).to.not.be.empty;
      expect(evaluationOfEmployee.questions[1].id).to.not.be.empty;
      expect(evaluationOfEmployee.questions[1].answerId).to.not.be.empty;
      expect(evaluationOfEmployee.questions[1].customAnswer).to.not.be.empty;
      expect(evaluationOfEmployee.status).to.be.eql(Status.Answered);



      // Get complete evaluarios by employee
      /* const getCompletedEvaluationsByEmployeeOperation =
        new GetCompletedEvaluationsByEmployeeOperation(Repository);
      const completedEvaluations =
        await getCompletedEvaluationsByEmployeeOperation.execute(
          user,
          employee.id,
        );
      expect(completedEvaluations).to.have.lengthOf(2); */
    });

    xit("An employee should responds an evaluation sent to him", async () => {
      expect(1).to.eql(0);
    });
  });
});

describe("Questions", async () => {
  it("should update a question", async () => {
    const evaluationData = {
      name: "Satisfaction Evaluation",
      questions: [
        {
          question: "How do you feel during the work day?",
          answers: [
            { answer: "excelent", points: 1 },
            { answer: "bad", points: 1 },
            { answer: "other", type: "open", points: 1 },
          ],
        },
        {
          question: "How do you do to recharge energy at weekends",
          answers: [{ answer: "other", type: "open", points: 1 }],
        },
      ],
    };

    const createEvaluationOperation = new CreateEvaluation(Repository);
    const user = { role: "manager" };
    const evaluation = await createEvaluationOperation.execute(user, evaluationData);

    const operation = new UpdateQuestion(Repository);
    const questionDataToUpdate = evaluation.questions[0];
    questionDataToUpdate.question = "Question changed";
    const updatedQuestion = await operation.execute(user, questionDataToUpdate);
    expect(updatedQuestion.question).to.eql("Question changed");
  });
});
