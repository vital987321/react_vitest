import {
  getByRole,
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import { afterAll, beforeAll, expect } from "vitest";
import { server } from "../mocks/server";
import { delay, http, HttpResponse } from "msw";
import { Theme } from "@radix-ui/themes";
import BrowseProducts from "../../src/pages/BrowseProductsPage";
import userEvent from "@testing-library/user-event";
import { db } from "../mocks/db";
import { CartProvider } from "../../src/providers/CartProvider";
import { getServerEndpoint } from "../utils";

describe("BrowseProductsPage", () => {
  var products = [];
  var categories = [];
  beforeAll(() => {
    [1, 2, 3].forEach(() => {
      const category = db.category.create();
      categories.push(category);
      [1, 2, 3].forEach(() => {
        const product = db.product.create({
          category: category,
          categoryId: category.id,
        });
        products.push(product);
      });
    });
  });

  afterAll(() => {
    const productsIds = products.map((product) => product.id);
    db.product.deleteMany({ where: { id: { in: productsIds } } });
    const categoriesIds = categories.map((category) => category.id);
    db.category.deleteMany({ where: { id: { in: categoriesIds } } });
    products = [];
    categories = [];
  });

  const renderComponent = () => {
    render(
      <CartProvider>
        <Theme>
          <BrowseProducts />
        </Theme>
      </CartProvider>
    );
    return {
      getProductsSkeleton: () =>
        screen.getByRole("progressbar", { name: "products" }),
      getCategoriesSkeleton: () =>
        screen.getByRole("progressbar", { name: "categories" }),
    };
  };

  it("should show loading skeleton when fetching categories", () => {
    getServerEndpoint("/categories");
    const { getCategoriesSkeleton: getCategoriesSeleton } = renderComponent();
    const skeleton = getCategoriesSeleton();
    expect(skeleton).toBeInTheDocument();
  });
  it("should hide loading skeleton after fetchig catagories", async () => {
    getServerEndpoint("/categories");
    renderComponent();
    const skeleton = () =>
      screen.getByRole("progressbar", {
        name: "categories",
      });
    await waitForElementToBeRemoved(skeleton);
  });
  it("should show loading skeleton when fetching products", () => {
    getServerEndpoint("/products");
    const { getProductsSkeleton: getProductsSeleton } = renderComponent();
    const skeleton = getProductsSeleton();
    expect(skeleton).toBeInTheDocument();
  });
  it("should hide loading skeleton after fetchig products", () => {
    getServerEndpoint("/products");
    const { getProductsSkeleton: getProductsSeleton } = renderComponent();
    waitForElementToBeRemoved(getProductsSeleton());
  });
  it("should not render categories when category fetching fails", async () => {
    server.use(
      http.get("/categories", async () => {
        // await delay()
        HttpResponse.error();
      })
    );
    const { getCategoriesSkeleton } = renderComponent();
    const categoriesSkeleton = getCategoriesSkeleton();
    expect(categoriesSkeleton).toBeInTheDocument();
    await waitForElementToBeRemoved(categoriesSkeleton);
    expect(categoriesSkeleton).not.toBeInTheDocument();
    expect(screen.queryByText(/error/i)).not.toBeInTheDocument();
  });
  it("should render Error message when products fetching fails", async () => {
    server.use(http.get("/products", () => HttpResponse.error()));
    renderComponent();
    const messageElement = await screen.findByRole("errorMessage");
    expect(messageElement).toBeInTheDocument();
    expect(messageElement).toHaveTextContent(/error/i);
  });
  it("should render caregories", async () => {
    renderComponent();
    const combobox = await screen.findByRole("combobox");
    expect(combobox).toBeInTheDocument();
    const user = userEvent.setup();
    await user.click(combobox);
    const allOption = screen.getByRole("option", { name: /all/i });
    expect(allOption).toBeInTheDocument();
    categories.forEach((category) => {
      const categoryName = screen.getByRole("option", { name: category.name });
      expect(categoryName).toBeInTheDocument();
    });
  });
  it("should render products", async () => {
    const { getProductsSkeleton } = renderComponent();
    await waitForElementToBeRemoved(getProductsSkeleton);
    products.forEach(async (product) => {
      const productName = screen.getByText(product.name);
      expect(productName).toBeInTheDocument();
    });
  });
  it("should render products from selected category", async () => {
    renderComponent();
    const combobox = await screen.findByRole("combobox");
    const user = userEvent.setup();
    await user.click(combobox);
    categories.forEach(async (category) => {
      const categoryOption = screen.getByRole("option", {
        name: category.name,
      });
      expect(categoryOption).toBeInTheDocument();
      await user.click(categoryOption);
      const productsWithinCategory = products.filter(
        (product) => product.category == category
      );
      productsWithinCategory.forEach(async (product) => {
        const productOnPage = await screen.findByText(product.name);
        expect(productOnPage).toBeInTheDocument();
      });
    });
  });
  it("should render all products if category All is selected", async () => {
    const { getCategoriesSkeleton } = renderComponent();
    await waitForElementToBeRemoved(getCategoriesSkeleton);

    const combobox = screen.queryByRole("combobox");
    expect(combobox).toBeInTheDocument();
    const user = userEvent.setup();
    await user.click(combobox);

    const categoryOption = screen.getByRole("option", {
      name: /all/i,
    });
    expect(categoryOption).toBeInTheDocument();
    await user.click(categoryOption);

    products.forEach(async (product) => {
      const productName = screen.getByText(product.name);
      expect(productName).toBeInTheDocument();
    });
  });
});
