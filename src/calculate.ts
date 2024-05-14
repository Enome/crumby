import { State } from "./state";

type PercentageAndWeight = {
  id: number;
  name: string;
  percentage: number;
  weight: number;
  base: boolean;
};

type Flour = {
  id: number;
  name: string;
  percentage: number;
  weight: number;
};

type Output = {
  targetWeight: number;
  percentagesAndWeights: PercentageAndWeight[];
  flours: Flour[];
  flourWeight: number;
  floursWeight: number;
  dough: PercentageAndWeight[];
  totalPercentagesWeight: number;
  sourdough: { starter: number; flour: number; water: number; total: number };
  preferment: {
    flour: number;
    water: number;
    yeast: number;
    total: number;
  };
};

export default function calculate(state: State): Output {
  const targetWeight = state.doughballWeight * state.doughballCount;

  const totalPercentage = state.percentages
    .filter((p) => typeof p.percentage === "number" && !isNaN(p.percentage))
    .reduce((acc, p) => acc + p.percentage, 0);

  const percentagesAndWeights = state.percentages.map((p) => ({
    id: p.id,
    name: p.name,
    percentage: p.percentage,
    weight: (p.percentage / totalPercentage) * targetWeight,
    base: p.base,
  }));

  const flourWeight = (100 / totalPercentage) * targetWeight;

  const flours = state.flours.map((f) => ({
    id: f.id,
    name: f.name,
    percentage: f.percentage,
    weight: (f.percentage / 100) * flourWeight,
  }));

  const floursWeight = flours.reduce(
    (acc: number, f: { weight: number }) => acc + f.weight,
    0,
  );

  let dough = state.percentages.map((p) => ({
    id: p.id,
    name: p.name,
    percentage: p.percentage,
    weight: (p.percentage / totalPercentage) * targetWeight,
    base: p.base,
  }));

  const totalPercentagesWeight = dough.reduce(
    (acc: number, p: { weight: number }) => acc + p.weight,
    0,
  );

  let sourdough = {
    starter: 0,
    flour: 0,
    water: 0,
    total: 0,
  };

  if (state.sourdough) {
    const parts = state.sourdoughRatio.split(":").map((p) => parseInt(p, 10));
    const partsSum = parts.reduce((acc, p) => acc + p, 0);
    const weight = targetWeight * (state.sourdoughTarget / 100);
    const weightPart = weight / partsSum;

    sourdough.starter = weightPart * parts[0];
    sourdough.flour = weightPart * parts[1];
    sourdough.water = weightPart * parts[2];
    sourdough.total = sourdough.starter + sourdough.flour + sourdough.water;

    dough = dough.map((p) => {
      if (p.name === "Flour") {
        return {
          ...p,
          weight: p.weight - (sourdough.flour + sourdough.starter / 2),
        };
      }

      if (p.name === "Water") {
        return {
          ...p,
          weight: p.weight - (sourdough.water + sourdough.starter / 2),
        };
      }

      return p;
    });
  }

  let preferment = {
    flour: 0,
    water: 0,
    yeast: 0,
    total: 0,
  };

  if (state.preferment) {
    const parts = state.prefermentRatio.split(":").map((p) => parseInt(p, 10));
    const partsSum = parts.reduce((acc, p) => acc + p, 0);
    const weight = targetWeight * (state.prefermentTarget / 100);
    const weightPart = weight / partsSum;

    preferment.flour = weightPart * parts[0];
    preferment.water = weightPart * parts[1];
    preferment.yeast = percentagesAndWeights[3].weight;
    preferment.total = preferment.flour + preferment.water + preferment.yeast;

    dough = dough
      .filter((p) => p.name !== "Yeast")
      .map((p) => {
        if (p.name === "Flour") {
          return {
            ...p,
            weight: p.weight - preferment.flour,
          };
        }

        if (p.name === "Water") {
          return {
            ...p,
            weight: p.weight - preferment.water,
          };
        }

        return p;
      });
  }

  return {
    targetWeight,
    percentagesAndWeights,
    flours,
    flourWeight,
    floursWeight,
    dough,
    totalPercentagesWeight,
    sourdough: sourdough,
    preferment: preferment,
  };
}
