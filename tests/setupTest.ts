import "@testing-library/jest-dom/vitest";
import ResizeObserver from "resize-observer-polyfill";
import {server} from "./mocks/server"

import { afterAll, beforeAll } from "vitest";
import { cleanup } from "@testing-library/react";

beforeAll(() => server.listen());
afterEach(() => {
  server.resetHandlers()
  cleanup()
});
afterAll(()=>server.close())

global.ResizeObserver = ResizeObserver;

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

window.HTMLElement.prototype.scrollIntoView = vi.fn();
window.HTMLElement.prototype.hasPointerCapture = vi.fn();
window.HTMLElement.prototype.releasePointerCapture = vi.fn();
