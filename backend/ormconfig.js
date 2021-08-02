require("dotenv").config();
fs = require("fs");
path = require("path");

module.exports = {
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  username: process.env.DB_USER,
  port: process.env.DB_PORT,
  host: process.env.DB_HOST,
  type: process.env.DB_DIALECT,
  synchronize: true,
  migrationsRun: true,
  logging: false,
  entities: ["./src/db/entity/**/*.ts"],
  migrations: ["./src/db/migration/**/*.ts"],
  subscribers: ["./src/db/subscriber/**/*.ts"],
  cli: {
    entitiesDir: "./src/db/entity",
    migrationsDir: "./src/db/migration",
    subscribersDir: "./src/db/subscriber",
  },
  bigNumberStrings: false,
};
