const path = require("path");

const source = path.join(__dirname, "./src/");
const target1 = path.join(__dirname, "../backend/src/shared/");
const target2 = path.join(__dirname, "../frontend/src/shared/");

const watcher1 = require("sync-directory")(source, target1, { watch: true });
const watcher2 = require("sync-directory")(source, target2, { watch: true });

console.log(
  "Pasta shared ativada! Estamos monitorando todas as mudanças dentro dela."
);
