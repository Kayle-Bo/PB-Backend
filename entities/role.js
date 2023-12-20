var EntitySchema = require("typeorm").EntitySchema

module.exports = new EntitySchema({
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