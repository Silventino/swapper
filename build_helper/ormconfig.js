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
  entities: ["./db/entity/**/*.js"],
  migrations: ["./db/migration/**/*.js"],
  subscribers: ["./db/subscriber/**/*.js"],
  cli: {
    entitiesDir: "./db/entity",
    migrationsDir: "./db/migration",
    subscribersDir: "./db/subscriber",
  },
  bigNumberStrings: false,
};
