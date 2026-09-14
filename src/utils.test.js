



import { expect, test } from "vitest";
import { getTotalPages } from "./utils.js";

test("считает количество страниц", () => {
  expect(getTotalPages(10, 5)).toBe(2);
});