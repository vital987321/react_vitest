import { http, HttpResponse } from "msw";
import { products } from "./data";
import { db } from "./db";


export const handlers = [
  //? I expect that the single row
  //? ...db.product.toHandlers('rest'),
  //? should be enouph, but ProductDetail component does not follow the logic of db.
  //? Thst is whay I added extra handler

  http.get("/products/:id", ({ params }) => {
    const { id } = params;
    const product = db.product.findFirst({
      where: { id: { equals: parseInt(id) } },
    });
    if (!product) return HttpResponse.json(null);
    return HttpResponse.json(product);
  }),
  ...db.product.toHandlers("rest"),
];

//* Old representation
// export const handlers = [
//   http.get("/categories", () => {
//     return HttpResponse.json([
//       { id: 1, name: "Electronics" },
//       { id: 2, name: "Beauty" },
//       { id: 3, name: "Gardening" },
//     ]);
//   }),
//   http.get("/products", () => {
//     return HttpResponse.json(products);
//   }),
//   http.get("/products/:id", ({ params }) => {
//     const { id } = params
//     const product = products.find((item) => item.id === parseInt(id))
//     if (!product) return HttpResponse.json(null);

//     return HttpResponse.json(product);

//   }),
// ];

