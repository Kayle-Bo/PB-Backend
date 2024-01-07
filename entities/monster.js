var EntitySchema = require("typeorm").EntitySchema

module.exports = new EntitySchema({
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
        health: {
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