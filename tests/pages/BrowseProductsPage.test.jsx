import { getByRole, render, screen, waitForElementToBeRemoved } from "@testing-library/react";
import { expect } from "vitest";
import { server } from "../mocks/server";
import { http, HttpResponse } from "msw";
import { Theme } from "@radix-ui/themes";
import BrowseProducts from "../../src/pages/BrowseProductsPage";

describe("BrowseProductsPage", () => {
    const renderComponent = () => {
      render(
        <Theme>
          <BrowseProducts />
        </Theme>
      );
    };

    it('should show loading skeleton when fetching categories', () => {
        server.use(http.get('/categories', () => HttpResponse.json([]) ))
        renderComponent();
        const skeleton =screen.getByRole('progressbar', { name: 'categories' })
        expect(skeleton).toBeInTheDocument()
    })
    it('should hide loading skeleton after fetchig catagories', async () => {
        server.use(http.get('/categories', () => HttpResponse.json([])))
        renderComponent();
        const skeleton = ()=>screen.getByRole("progressbar", {
          name: "categories",
        });
        await waitForElementToBeRemoved(skeleton);
    })
    it("should show loading skeleton when fetching products", () => {
      server.use(http.get("/products", () => HttpResponse.json([])));
      renderComponent();
      const skeleton = screen.getByRole("progressbar", { name: "products" });
      expect(skeleton).toBeInTheDocument();
    });
    it("should hide loading skeleton after fetchig products", async () => {
      server.use(http.get("/products", () => HttpResponse.json([])));
      renderComponent();
      const skeleton = () =>
        screen.getByRole("progressbar", {
          name: "products",
        });
      await waitForElementToBeRemoved(skeleton);
    });
    it('should not render categories when category fetching fails', async () => {
      server.use(http.get('/categories', () => HttpResponse.error()))
      renderComponent()
      const categorySkeleton =screen.getByRole('progressbar', { name: 'categories' })
      await waitForElementToBeRemoved(categorySkeleton)
      expect(screen.queryByText(/error/i)).not.toBeInTheDocument()
      expect(screen.queryByText(/filter by category/i)).not.toBeInTheDocument()
    })
    it('should render Error message when products fetching fails', async () => {
      server.use(http.get('/products', () => HttpResponse.error()))
      renderComponent()
      const messageElement=await screen.findByRole('errorMessage')
      expect(messageElement).toBeInTheDocument()
      expect(messageElement).toHaveTextContent(/error/i)
    })
});