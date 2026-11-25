import { describe, expect, it } from "vitest";
import { wrapText } from "./wrapText";

const context = {
  // Each character is one unit wide, making line breaks predictable.
  measureText: (text: string) => ({ width: text.length }),
} as unknown as CanvasRenderingContext2D;

describe("wrapText", () => {
  it("moves a word to the next line when it does not fit", () => {
    expect(wrapText(context, "red blue", 4)).toEqual(["red", "blue"]);
  });

  it("breaks a word that is wider than the available width", () => {
    expect(wrapText(context, "abcdefg", 3)).toEqual(["abc", "def", "g"]);
  });

  it("preserves intentional empty lines", () => {
    expect(wrapText(context, "one\n\nthree", 10)).toEqual([
      "one",
      "",
      "three",
    ]);
  });
});