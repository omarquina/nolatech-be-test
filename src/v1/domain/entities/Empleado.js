import { Entity } from "./Entity.js";

export class Empleado extends Entity {
    personalData;
    professionalData;
    name;
    surename;
    birthDate;
    position;
    evaluations;
    usuario;
    role;

    constructor(values) {
        super(values);
        this.setValues(values);
        this.evaluations = [];
    }

    setValues(values) {
        this.personalData = values.personalData;
        this.profesionalData = values.professionalData;
        this.name =
            this.name || this.name === values.name ? this.name : values.name;
        this.surename =
            this.surename || this.surename === values.surename
                ? this.surename
                : values.surename;
        this.position =
            this.position || this.position === values.position
                ? this.position
                : values.position;
        this.role = this.role || this.role === values.role
                ? this.role
                : values.role;
    }
}

