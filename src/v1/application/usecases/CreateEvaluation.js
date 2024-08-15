import { Evaluation } from "../../domain/entities/Evaluation.js"
import { Question } from "../../domain/entities/Question.js";
import { Answer } from "../../domain/entities/Answer.js";

export class CreateEvaluation {
    repository;

    constructor(repository) {
        this.repository = repository;
    }

    async execute(user, dto) {
        this.preprocessData(user, dto);
        const evaluation = new Evaluation(dto);
        evaluation.setQuestions(this.processQuestions(dto.questions));
        this.save(evaluation);
        return evaluation;
    }

    preprocessData(user, dto) {
        if (user.role !== "manager")
            throw new Error("User role is not granted to crate evaluations");
    }

    processQuestions(questions) {
        this.questions = [];
        let _questionEntity, _answerEntity;
        this.questions = questions.map((question) => {
            _questionEntity = new Question(question);
            question.answers.forEach((answer) => {
                _answerEntity = new Answer(answer);
                _questionEntity.answers.push(_answerEntity);
            });
            return _questionEntity;
        });
        return this.questions;
    }

    async save(evaluation) {
        await this.repository.evaluations.save(evaluation);
    }
}

