import { describe, it, expect } from "vitest";
import subject from "./calculate";

describe("calculate", () => {
  it("calculates the output", () => {
    const state = {
      name: "Recipe",
      doughballCount: 2,
      doughballWeight: 850,
      percentages: [
        { id: 1, name: "Flour", percentage: 100.0, base: true },
        { id: 2, name: "Water", percentage: 67.0, base: true },
        { id: 3, name: "Salt", percentage: 2.0, base: true },
        { id: 4, name: "Yeast", percentage: 0.05, base: true },
      ],
      flours: [
        { id: 1, name: "White", percentage: 90.0 },
        { id: 2, name: "Wholemeal", percentage: 10.0 },
      ],
      sourdough: true,
      preferment: true,

      sourdoughTarget: 12.0,
      sourdoughRatio: "1:2:2",

      prefermentType: "Poolish",
      prefermentTarget: 12.0,
      prefermentRatio: "1:2",
    };

    expect(subject(state)).toMatchSnapshot();
  });
});
