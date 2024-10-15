// import { it, expect, describe } from 'vitest'
import { render, screen, waitFor } from "@testing-library/react"
import BrowseProducts from "../../src/pages/BrowseProductsPage"
import { expect } from "vitest"
import { Theme } from "@radix-ui/themes"
import { db } from "../mocks/db"
import delay from "delay"
import { server } from "../mocks/server"
import { http, HttpResponse } from "msw"


describe('BrowseProducts', () => {
    const productsIds = [];
    const categoriesIds = [];
    beforeAll(() => {
      [1, 2, 3].forEach(() => {
        const product = db.product.create();
        productsIds.push(product.id);
      });
      [1, 2, 3].forEach(() => {
        const category = db.category.create();
          categoriesIds.push(category.id);
      });  
    });
    afterAll(() => {
        db.product.deleteMany({ where: { id: { in: productsIds } } });
        db.category.deleteMany({ where: { id: { in: categoriesIds } } });
    });

    const renderComponent = async () => {
        render( 
            <Theme>
                <BrowseProducts/>
            </Theme>
        )
    }
    it('should render loading skeleton for categories', () => {
        renderComponent()
        const text = String.fromCodePoint('8204') // '&zwnj;'  &zwnj; or &#8204
        const allSkeletons = screen.getAllByText(text, {
          selector: "span",
          className: "react-loading-skeleton",
        });
        const categorySkeleton = allSkeletons.filter(
          (item) => item.parentNode.parentNode.className === "max-w-xs"
        );
        expect(categorySkeleton).toHaveLength(1)
    })
    it("should render loading skeletons for products", () => {
        
      renderComponent();
      const text = String.fromCodePoint("8204");
      const allSkeletons = screen.getAllByText(text, {
        selector: "span",
        className: "react-loading-skeleton",
      });
      const productSkeletons = allSkeletons.filter(
        (item) => item.parentNode.parentNode.className === "rt-TableCell"
        );
      expect(productSkeletons.length).toBeGreaterThan(1);
    });
    // it('should render category filter button', async () => {
    //   renderComponent();
    //   const button = await screen.findByRole("combobox", {
    //     text: new RegExp(/category/i),
    //   });
    //   expect(button).toBeInTheDocument()
    // })
    it('should render a table of products', async () => {
        renderComponent();
        
        const table = await screen.findByRole('table')
        expect(table).toBeInTheDocument()
    })
    it('should render a product', () => {
        console.log(db.product.getAll()[0])
    })
})