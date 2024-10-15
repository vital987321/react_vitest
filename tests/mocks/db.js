// db.js
import { factory, primaryKey } from "@mswjs/data";
import { faker } from "@faker-js/faker";

export const db = factory({
  product: {
    id: primaryKey(faker.number.int),
    name: faker.food.dish,
    price: () => faker.number.int({ min: 1, max: 100 }),
  },
  category: {
    id: primaryKey(faker.number.int),
    name: faker.food.ethnicCategory
  },
});