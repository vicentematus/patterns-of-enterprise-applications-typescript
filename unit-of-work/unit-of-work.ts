import { db } from "../db-initialize";
import { generateMockUsers } from "../mocks/user.mock";
import type { User } from "../models";
import { GREEN_TEXT } from "../utils";

// Unit of Work
// Maintains a list of objects affected by a business transaction and coordinates the writing out of changes and the resolution of concurrency problems.
// https://martinfowler.com/eaaCatalog/unitOfWork.html

class UnitOfWork {
  private newUsers: Set<User> = new Set();
  private dirtyUsers: Set<User> = new Set(); // On the book Fowler refers to 'dirty' as 'edited'.

  private removedUsers: Set<User> = new Set();
  private identityMap: Map<number, User> = new Map();

  registerIdentityMap(user: User) {
    if (!this.identityMap.has(user.id)) {
      this.identityMap.set(user.id, user);
      return;
    }

    console.error("User is already on the map.");
    return;
  }
  registerNewUser(user: User) {
    if (this.identityMap.has(user.id)) {
      console.error(
        `The user [ID ${user.id}, ${user.name}] already exist on the map.`
      );
      return this.identityMap.get(user.id);
    }

    if (this.dirtyUsers.has(user)) {
      console.error("This user is already modified.");
      return;
    }

    if (this.removedUsers.has(user)) {
      console.error("This user is going to be removed.");
    }

    if (this.newUsers.has(user)) {
      console.warn("this user is already created.");
      return;
    }

    console.log(GREEN_TEXT, "Looks good, i'm going to create it.");
  }

  commit() {}

  createUsers() {}

  editUsers() {}

  removeUsers() {}
}

const unitOfWork = new UnitOfWork();

function tryCreatingExistingUsers() {
  const users = db.query("SELECT * FROM users").all() as User[];
  for (let user of users) {
    unitOfWork.registerNewUser(user);
  }
}

function createMockUsers() {
  const mockUsers = generateMockUsers({ count: 5 });
  for (let user of mockUsers) {
    unitOfWork.registerNewUser(user);
  }
}

function main() {
  const users = db.query("SELECT * FROM users").all() as User[];
  for (const user of users) {
    // Identity Map
    // Ensures that each object gets loaded only once by keeping every loaded object in a map. Looks up objects using the map when referring to them.
    // https://martinfowler.com/eaaCatalog/identityMap.html
    unitOfWork.registerIdentityMap(user);
  }

  // For example demostration let's try creating the same users we get from the database.
  tryCreatingExistingUsers();

  // Let's create some fake users on memory to see if they are created
  createMockUsers();
}

main();
