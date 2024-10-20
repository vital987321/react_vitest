// db.js
import { factory, manyOf, oneOf, primaryKey } from "@mswjs/data";
import { faker } from "@faker-js/faker";
import { generateProductName, generateCategoryName } from "../utils"; 


// const generateProductName1=()=>{
//   const allproducts=db.product.getAll()
//   const productsNames=allproducts.map(product=>product.name)
//   while (true){
//     const name =faker.commerce.productName
//     if (!productsNames.inctudes(name)){
//       return name
//     }
//   }
// }

export const db = factory({
  product: {
    id: primaryKey(faker.number.int),
    name:generateProductName,
    price: () => faker.number.int({ min: 1, max: 100 }),
    categoryId:faker.number.int,
    category: oneOf('category')
  },
  category: {
    id: primaryKey(faker.number.int),
    name: generateCategoryName,
    products: manyOf('product')
  },
});