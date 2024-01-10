import { EntitySchema } from "typeorm";

const Battle = new EntitySchema({
    name: "battle",
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true,
        },
        user1Id: {
            type: "int",
            nullable: false,
        },
        user2Id: {
            type: "int",
            nullable: false,
        },
        winnerId: {
            type: "int",
            nullable: false,
        },
    },
    relations: {
        user1: {
            target: "user",
            type: "many-to-one",
            joinColumn: {
                name: "user1Id",
                referencedColumnName: "id",
            },
            cascade: true,
        },
        user2: {
            target: "user",
            type: "many-to-one",
            joinColumn: {
                name: "user2Id",
                referencedColumnName: "id",
            },
            cascade: true,
        },
        winner: {
            target: "user",
            type: "many-to-one",
            joinColumn: {
                name: "winnerId",
                referencedColumnName: "id",
            },
            cascade: true,
        },
    },
});

export default Battle;
