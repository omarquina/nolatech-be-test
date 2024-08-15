import { Entity } from "./Entity.js";

export class Usuario extends Entity {
    username;
    password;
    role;
    status;

    constructor(values) {
        super(values);
        this.setValues(values);
    }

    setValues(values) {
        if (!["administrador", "manager", "empleado"].includes(values.role))
            throw new Error("Role is not valid");

        this.role =
            this.role || this.role === values.role ? this.role : values.role;
        this.status =
            this.status || this.status === values.status ? this.status : "PENDING";
    }
}

