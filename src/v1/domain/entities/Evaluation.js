import { Entity } from "./Entity.js";

export class Evaluation extends Entity {
    name;
    periodo;
    estado;
    tipo;
    questions;

    constructor(values) {
        super(values);
        this.setValues(values);
    }

    setValues(values) {
        this.name = this.name === values.name ? this.name : values.name;
        this.periodo =
            this.periodo === values.periodo ? this.periodo : values.periodo;
        this.tipo = this.tipo === values.tipo ? this.tipo : values.tipo;
        this.estado = this.estado === values.estado ? this.estado : values.estado;
    }

    setQuestions(questions) {
        this.questions = questions.map((q) => {
            q.evaluation = new Evaluation({ id: this.id });
            return q;
        });
    }
}

