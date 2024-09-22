import { Database } from "bun:sqlite";
const db = new Database("mydb.sqlite");
db.exec("DROP TABLE IF EXISTS users");
db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      number_of_dependents NUMBER
    )
`);

db.exec("INSERT INTO users (name, number_of_dependents) VALUES ('Alice', 123)");
db.exec("INSERT INTO users (name, number_of_dependents) VALUES ('Alice', 123)");
db.exec("INSERT INTO users (name, number_of_dependents) VALUES ('Alice', 123)");

("INSERT INTO");
export { db };
