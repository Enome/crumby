import { createStore } from "redux";

/* State */

export type Percentage = {
  id: number;
  name: string;
  percentage: number;
  base: boolean;
};

export type Flour = {
  id: number;
  name: string;
  percentage: number;
};

export type State = {
  name: string;
  doughballCount: number;
  doughballWeight: number;
  percentages: Percentage[];
  flours: Flour[];
  sourdough: boolean;
  preferment: boolean;

  sourdoughTarget: number;
  sourdoughRatio: string;

  prefermentType: string;
  prefermentTarget: number;
  prefermentRatio: string;
};

const initialState: State = {
  name: "Recipe",
  doughballCount: 1,
  doughballWeight: 850,
  percentages: [
    { id: 1, name: "Flour", percentage: 100.0, base: true },
    { id: 2, name: "Water", percentage: 58.0, base: true },
    { id: 3, name: "Salt", percentage: 2.5, base: true },
    { id: 4, name: "Yeast", percentage: 2.0, base: true },
  ],
  flours: [{ id: 1, name: "White", percentage: 100.0 }],
  sourdough: false,
  preferment: false,

  sourdoughTarget: 10.0,
  sourdoughRatio: "1:1:1",

  prefermentType: "Poolish",
  prefermentTarget: 10.0,
  prefermentRatio: "1:1",
};

/* Reducer */

export function reducer(state: State = initialState, action: Action): State {
  switch (action.type) {
    case "RESET":
      return initialState;

    case "LOAD":
      return action.state;

    // Percentages
    case "ADD_PERCENTAGE":
      return {
        ...state,
        percentages: [
          ...state.percentages,
          {
            id: Date.now(),
            name: action.name,
            percentage: action.percentage,
            base: false,
          },
        ],
      };

    case "UPDATE_PERCENTAGE":
      return {
        ...state,
        percentages: state.percentages.map((p) => {
          if (action.id === p.id) {
            return {
              id: p.id,
              name: action.name ?? p.name,
              percentage: action.percentage ?? p.percentage,
              base: p.base,
            };
          }
          return p;
        }),
      };

    case "REMOVE_PERCENTAGE":
      return {
        ...state,
        percentages: state.percentages.filter((p) => p.id !== action.id),
      };

    // Flours

    case "ADD_FLOUR":
      return {
        ...state,
        flours: [
          ...state.flours,
          {
            id: Date.now(),
            name: action.name,
            percentage: action.percentage,
          },
        ],
      };

    case "UPDATE_FLOUR":
      return {
        ...state,
        flours: state.flours.map((f) => {
          if (action.id === f.id) {
            return {
              id: f.id,
              name: action.name ?? f.name,
              percentage: action.percentage ?? f.percentage,
            };
          }
          return f;
        }),
      };

    case "REMOVE_FLOUR":
      return {
        ...state,
        flours: state.flours.filter((f) => f.id !== action.id),
      };

    // Values
    case "UPDATE_VALUE":
      if (!Object.keys(state).includes(action.name)) {
        throw new Error(`Unknown key: ${action.name}`);
      }

      if (typeof state[action.name] !== typeof action.value) {
        throw new Error(
          `Type mismatch: ${typeof state[action.name]} !== ${typeof action.value}`,
        );
      }

      return { ...state, [action.name]: action.value };

    default:
      return state;
  }
}

/* Actions */

type ResetAction = {
  type: "RESET";
};

function reset(): ResetAction {
  return {
    type: "RESET",
  };
}

type LoadAction = {
  type: "LOAD";
  state: State;
};

function load(state: State): LoadAction {
  return {
    type: "LOAD",
    state,
  };
}

// Percentages

type AddPercentageAction = {
  type: "ADD_PERCENTAGE";
  name: string;
  percentage: number;
};

function addPercentage(name: string, percentage: number): AddPercentageAction {
  return {
    type: "ADD_PERCENTAGE",
    name,
    percentage,
  };
}

type UpdatePercentageAction = {
  type: "UPDATE_PERCENTAGE";
  id: number;
  name?: string;
  percentage?: number;
};

function updatePercentage(
  id: number,
  name: string | undefined,
  percentage: number | undefined,
): UpdatePercentageAction {
  return {
    type: "UPDATE_PERCENTAGE",
    id,
    name,
    percentage,
  };
}

type RemovePercentageAction = {
  type: "REMOVE_PERCENTAGE";
  id: number;
};

function removePercentage(id: number): RemovePercentageAction {
  return {
    type: "REMOVE_PERCENTAGE",
    id,
  };
}

// Flours

type AddFlourAction = {
  type: "ADD_FLOUR";
  name: string;
  percentage: number;
};

function addFlour(name: string, percentage: number): AddFlourAction {
  return {
    type: "ADD_FLOUR",
    name,
    percentage,
  };
}

type UpdateFlourAction = {
  type: "UPDATE_FLOUR";
  id: number;
  name?: string;
  percentage?: number;
};

function updateFlour(
  id: number,
  name: string | undefined,
  percentage: number | undefined,
): UpdateFlourAction {
  return {
    type: "UPDATE_FLOUR",
    id,
    name,
    percentage,
  };
}

type RemoveFlourAction = {
  type: "REMOVE_FLOUR";
  id: number;
};

function removeFlour(id: number): RemoveFlourAction {
  return {
    type: "REMOVE_FLOUR",
    id,
  };
}

// Value

type UpdateValueAction = {
  type: "UPDATE_VALUE";
  name: keyof Omit<State, "percentages">;
  value: string | number | boolean;
};

function updateValue(
  name: keyof Omit<State, "percentages">,
  value: string | number | boolean,
): UpdateValueAction {
  return {
    type: "UPDATE_VALUE",
    name,
    value,
  };
}

type Action =
  | ResetAction
  | LoadAction
  | UpdatePercentageAction
  | AddPercentageAction
  | RemovePercentageAction
  | AddFlourAction
  | UpdateFlourAction
  | RemoveFlourAction
  | UpdateValueAction;

export const actions = {
  reset,
  load,
  addPercentage,
  updatePercentage,
  removePercentage,
  addFlour,
  updateFlour,
  removeFlour,
  updateValue,
};

/* Selectors */

/* Store */

export const store = createStore(reducer);

export function dispatch(action: Action) {
  store.dispatch(action);
}
