import { render, screen, waitForElementToBeRemoved } from "@testing-library/react";
import ProductList from "../../src/components/ProductList";
import { server } from "../mocks/server";
import { delay, http, HttpResponse } from "msw";
import { afterAll, beforeAll } from "vitest";
import { db } from "../mocks/db";


describe('ProductList with Moked db', () => {
    const productsIds=[]
    beforeAll(() => {
        [1, 2, 3].forEach(() => {
            const product = db.product.create()
            productsIds.push(product.id)
        })
    })
    afterAll(() => {
        db.product.deleteMany({where:{id:{in: productsIds}}})
    })

    it("should render a list of fetched products", async () => {
      render(<ProductList />);
      const products = await screen.findAllByRole("listitem");
      expect(products.length).toBeGreaterThan(0);
    });
    it('should render "no products" if empty array is fetched', async () => {
      server.use(http.get("/products", () => HttpResponse.json([])));
      render(<ProductList />);
      const message = await screen.findByText(/no products/i);
      expect(message).toBeInTheDocument();
    });
    it('shoud render error',  async () => {
        server.use(http.get("/products", () => HttpResponse.error([])));
        render(<ProductList />);
        const message = await screen.findByText(/error/i);
        expect(message).toBeInTheDocument();
    })
    it('should render a loading indicator when fetching data', async () => {
        server.use(http.get("/products", async ()=>{
            await delay()
            return HttpResponse.json([])
        }))
        render(<ProductList/>)
        expect(await screen.findByText(/loading/i)).toBeInTheDocument()
    })
    it('should removed the loading indicator after data is fetched', async  () => {
        render(<ProductList/>)
        await waitForElementToBeRemoved(()=>screen.queryByText(/loading/i))
    })
    it('should removed the loading indicator if data fetching fails', async () => {
        server.use(http.get("/products", () => HttpResponse.error([])));
        render(<ProductList/>)
        await waitForElementToBeRemoved(()=>screen.queryByText(/loading/i))
    })
})


// describe('ProductList without Moked db', () => {
//     it('should render a list of fetched products', async () => {
//         render(<ProductList />)
//         const products = await screen.findAllByRole('listitem')
//         expect(products.length).toBeGreaterThan(0)
//     })
//     it('should render "no products" if empty array is fetched', async () => {
//         server.use(http.get('/products', ()=>HttpResponse.json([])))
//         render(<ProductList />)
//         const message = await screen.findByText(/no products/i);
//         expect(message).toBeInTheDocument()
//     })
// })