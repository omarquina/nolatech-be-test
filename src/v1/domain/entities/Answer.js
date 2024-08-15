import { Entity } from "./Entity.js";

export class Answer extends Entity {
    answer;
    type;
    points;

    constructor(values) {
        super(values);
        this.setValues(values);
    }

    setValues(values) {
        this.answer = this.answer === values.answer ? this.answer : values.answer;
        this.points = this.points === values.points ? this.points : values.points;
        this.type = this.type === values.type ? this.type : values.type;
    }
}

