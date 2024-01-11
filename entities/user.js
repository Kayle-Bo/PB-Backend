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
        roleId: { // Foreign key column
            type: "int",
            nullable: true,
          },
    },
    relations: {
        role: {
          target: "role", 
          type: "many-to-one",
          joinColumn: { name: "roleId" }, 
          cascade: true,
        },
    },
});

export default User;
