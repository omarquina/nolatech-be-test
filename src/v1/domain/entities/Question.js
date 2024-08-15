import { Entity } from "./Entity.js";

export class Question extends Entity {
    evaluation;
    question;
    answers;

    constructor(values) {
        super(values);
        this.setValues(values);
        this.answers = []
    }

    setValues(values) {
        this.question =
            this.question === values.question ? this.question : values.question;
        this.evaluation =
            this.evaluation === values.evaluation
                ? this.evaluation
                : values.evaluation;
    }
}

