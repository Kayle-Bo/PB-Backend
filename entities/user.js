import { EntitySchema } from "typeorm";

const User = new EntitySchema({
    name: "user",
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true,
        },
        username: {
            type: "varchar",
        },
        password: {
            type: "varchar",
        },
        email: {
            type: "varchar",
        },
        wins: {
            type: "int",
        },
        losses: {
            type: "int",
        },
    },
    relations: {
        role: {
            target: "role",
            type: "many-to-one", // many users can have one role while a user has one role
            joinColumn: true,
            cascade: true,
        },
    },
});

export default User;
