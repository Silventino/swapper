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
  entities: ["./src/shared/entity/**/*.ts"],
  migrations: ["./src/shared/migration/**/*.ts"],
  subscribers: ["./src/shared/subscriber/**/*.ts"],
  cli: {
    entitiesDir: "./src/shared/entity",
    migrationsDir: "./src/shared/migration",
    subscribersDir: "./src/shared/subscriber",
  },
  bigNumberStrings: false,
};
