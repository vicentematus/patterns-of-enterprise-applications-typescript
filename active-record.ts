import { db } from "./db-initialize";
import type { User } from "./models";

// # Active Record
// An object that wraps a row in a database table or view, encapsulates the database access, and adds domain logic on that data.
// https://martinfowler.com/eaaCatalog/activeRecord.html
// A popular implementation is Active Record of Ruby On Rails. See: https://guides.rubyonrails.org/active_record_basics.html

class ActiveRecord {
  private user: User;
  constructor(user: User) {
    this.user = user;
  }
  find({ id }: { id: string }) {
    db.exec(`
        SELECT users
        FROM users
        WHERE id = ${id}
        `);
  }
  update({
    name,
    number_of_dependents,
  }: {
    name?: string;
    number_of_dependents?: number;
  }) {
    db.exec(`UPDATE users
          SET name = '${name}'

          WHERE id = ${this.user.id}
         `);
  }

  delete() {
    db.exec(`
        DELETE FROM users
        WHERE id = ${this.user.id}
        `);
  }
}

function generateActiveRecords(): ActiveRecord[] {
  const users = db.query("SELECT * FROM users").all() as User[];
  const usersActiveRecords: ActiveRecord[] = [];
  for (const row of users) {
    console.log({ userRow: row });
    usersActiveRecords.push(
      new ActiveRecord({
        id: row.id,
        name: row.name,
        number_of_dependents: row.number_of_dependents,
      })
    );
  }

  return usersActiveRecords;
}

const activeRecords = generateActiveRecords();
activeRecords.at(0)?.update({ name: "hola" });
activeRecords.at(0)?.delete();

const all = db.query("SELECT * FROM users").all() as User[];
