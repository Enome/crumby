import { beforeEach, describe, expect, test, it } from "vitest";
import { store, dispatch, actions, Percentage, Flour } from "./state";

beforeEach(() => {
  dispatch(actions.reset());
});

test("initial state", () => {
  expect(store.getState()).toMatchSnapshot();
});

describe("Percentages", () => {
  describe("add", () => {
    it("adds a percentage", () => {
      dispatch(actions.addPercentage("test", 10));

      expect(store.getState().percentages).toEqual(
        expect.arrayContaining([
          {
            id: expect.any(Number),
            name: "test",
            percentage: 10,
            base: false,
          },
        ]),
      );
    });
  });

  describe("update", () => {
    it("updates the name or percentage", () => {
      dispatch(actions.addPercentage("test", 10));

      const test = store
        .getState()
        .percentages.find((p) => p.name === "test") as Percentage;

      dispatch(actions.updatePercentage(test.id, "test-name", undefined));

      expect(store.getState().percentages).toEqual(
        expect.arrayContaining([
          {
            id: test.id,
            name: "test-name",
            percentage: 10,
            base: false,
          },
        ]),
      );

      dispatch(actions.updatePercentage(test.id, undefined, 20));

      expect(store.getState().percentages).toEqual(
        expect.arrayContaining([
          {
            id: test.id,
            name: "test-name",
            percentage: 20,
            base: false,
          },
        ]),
      );
    });
  });

  describe("remove", () => {
    it("removes a percentage", () => {
      dispatch(actions.addPercentage("test", 10));

      const test = store
        .getState()
        .percentages.find((p) => p.name === "test") as Percentage;

      expect(store.getState().percentages).length(5);
      dispatch(actions.removePercentage(test.id));
      expect(store.getState().percentages).length(4);

      expect(store.getState().percentages).not.toEqual(
        expect.arrayContaining([
          {
            id: test.id,
            name: "test",
            percentage: 10,
            base: false,
          },
        ]),
      );
    });
  });
});

describe("Flour", () => {
  describe("add", () => {
    it("adds a flour", () => {
      dispatch(actions.addFlour("test", 10));
      expect(store.getState().flours).toEqual(
        expect.arrayContaining([
          {
            id: expect.any(Number),
            name: "test",
            percentage: 10,
          },
        ]),
      );
    });
  });

  describe("update", () => {
    it("updates a flour", () => {
      dispatch(actions.addFlour("test", 10));

      const test = store
        .getState()
        .flours.find((f) => f.name === "test") as Flour;

      dispatch(actions.updateFlour(test.id as number, "test-name", 20));

      expect(store.getState().flours).toEqual(
        expect.arrayContaining([
          {
            id: test?.id,
            name: "test-name",
            percentage: 20,
          },
        ]),
      );
    });
  });

  describe("remove", () => {
    it("removes a flour", () => {
      dispatch(actions.addFlour("test", 10));

      const test = store
        .getState()
        .flours.find((f) => f.name === "test") as Flour;

      expect(store.getState().flours).length(2);
      dispatch(actions.removeFlour(test.id));
      expect(store.getState().flours).length(1);
      expect(store.getState().flours).not.toEqual(
        expect.arrayContaining([
          {
            id: test.id,
            name: "test",
            percentage: 10,
          },
        ]),
      );
    });
  });
});

describe("updateValue", () => {
  it("updates a value", () => {
    dispatch(actions.updateValue("name", "Pizza"));
    expect(store.getState().name).toEqual("Pizza");
  });

  it("throws when you try to change the type", () => {
    expect(() => {
      dispatch(actions.updateValue("name", false));
    }).toThrowError("Type mismatch: string !== boolean");
  });
});
