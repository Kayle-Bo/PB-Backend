var EntitySchema = require("typeorm").EntitySchema

module.exports = new EntitySchema({
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
})