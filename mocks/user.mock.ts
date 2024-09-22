import type { User } from "../models";

export function generateMockUsers({ count }: { count: number }) {
  const mockUsers = [];

  const names = ["Alice", "Bob", "Charlie", "Diana", "Eve"];

  for (let i = 0; i < count; i++) {
    const user: User = {
      id: 123,
      name: names[i % names.length],
      number_of_dependents: Math.floor(Math.random() * 5),
    };
    mockUsers.push(user);
  }

  return mockUsers;
}
