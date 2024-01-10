import { EntitySchema } from "typeorm";

const Monster = new EntitySchema({
    name: "monster",
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true,
        },
        name: {
            type: "varchar",
        },
        type: {
            type: "varchar",
        },
        maxHealth: {
            type: "int",
        },
        attack: {
            type: "int",
        },
        defense: {
            type: "int",
        },
        speed: {
            type: "int",
        },
    },
})

export default Monster;