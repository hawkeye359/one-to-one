require("sqlite3");
const path = require("path");
const knex = require("knex");
const remote = require("@electron/remote");
const database = knex({
  client: "sqlite3",
  connection: path.join(app.getPath("userData")),
});
