import { v4 as uuidv4 } from "uuid";

export class Entity {
    id;
    errors;

    constructor(values) {
        this.id = values.id ?? uuidv4();
    }
}

