import { EntitySchema } from "typeorm";

const Role = new EntitySchema({
    name: "role",
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true,
        },
        name: {
            type: "varchar",
        },
        authNumber: {
            type: "int",
        },
    },
})

export default Role;