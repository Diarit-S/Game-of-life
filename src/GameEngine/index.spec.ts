// @ts-ignore see https://github.com/jest-community/jest-extended#setup
import * as matchers from "jest-extended";
import {
  getPotentiallyLivingCellsPositions,
  getNeighboursPositions,
  getNextGeneration,
  getLivingNeighboursNumber,
  checkIfCellShouldLive,
  Position,
  LivingCells,
  StringPosition,
} from ".";

expect.extend(matchers);

describe("checkIfCellShouldLive()", function () {
  test("With no neighbours, the cell should die", function () {
    const result = checkIfCellShouldLive(0, true);
    expect(result).toEqual(false);
  });

  test("With 2 neighbours, the cell should live", function () {
    const result = checkIfCellShouldLive(2, true);
    expect(result).toEqual(true);
  });

  test("With 3 neighbours, the cell should live", function () {
    const result = checkIfCellShouldLive(3, true);
    expect(result).toEqual(true);
  });

  test("A dead cell cannot wake up with only 2 living neighbours", function () {
    const result = checkIfCellShouldLive(2, false);
    expect(result).toEqual(false);
  });

  test("A dead cell should wake up with 3 living neighbours", function () {
    const result = checkIfCellShouldLive(3, false);
    expect(result).toEqual(true);
  });
});

describe("getNeighboursPositions()", function () {
  test("Should add x and y to each base positions", function () {
    const coordinates: Position = {
      x: 10,
      y: 5,
    };
    const result = getNeighboursPositions(coordinates);
    const expected: Position[] = [
      { x: 9, y: 4 },
      { x: 10, y: 4 },
      { x: 11, y: 4 },
      { x: 11, y: 5 },
      { x: 11, y: 6 },
      { x: 10, y: 6 },
      { x: 9, y: 6 },
      { x: 9, y: 5 },
    ];
    expect(result).toEqual(expected);
  });
});

describe("getLivingNeighboursNumber()", function () {
  test("Without living cells around, should return 0", function () {
    const livingCells: LivingCells = new Set([]);
    const coordinates: Position = {
      x: 0,
      y: 0,
    };
    const result = getLivingNeighboursNumber(livingCells, coordinates);
    const expected: number = 0;
    expect(result).toEqual(expected);
  });

  test("With some living cells around, should compute the number of cells", function () {
    const livingCells: LivingCells = new Set<StringPosition>(["1|0", "1|1", "2|1"]);
    const coordinates: Position = {
      x: 0,
      y: 0,
    };
    const result = getLivingNeighboursNumber(livingCells, coordinates);
    const expected: number = 2;
    expect(result).toEqual(expected);
  });
});

describe("getPotentiallyLivingCellsPositions", function () {
  test("when no cell is alive", function () {
    const livingCells: LivingCells = new Set<StringPosition>([]);
    const result = getPotentiallyLivingCellsPositions(livingCells);
    const expected: Position[] = [];
    expect(result).toEqual(expected);
  });

  test("when there is one cell", function () {
    const livingCells: LivingCells = new Set<StringPosition>(["0|0"]);
    const result = getPotentiallyLivingCellsPositions(livingCells);
    const expected: Position[] = [
      { x: 1, y: 0 },
      { x: 1, y: 1 },
      { x: 0, y: 1 },
      { x: -1, y: 1 },
      { x: -1, y: 0 },
      { x: -1, y: -1 },
      { x: 0, y: -1 },
      { x: 1, y: -1 },
    ];
    expect(result).toIncludeAllMembers(expected);
  });

  test("When the are many cells", function () {
    const livingCells: LivingCells = new Set<StringPosition>(["0|0", "1|0"]);
    const result = getPotentiallyLivingCellsPositions(livingCells);
    const expected: Position[] = [
      { x: -1, y: 1 },
      { x: 0, y: 1 },
      { x: 1, y: 1 },
      { x: 2, y: 1 },
      { x: -1, y: 0 },
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 2, y: 0 },
      { x: -1, y: -1 },
      { x: 0, y: -1 },
      { x: 1, y: -1 },
      { x: 2, y: -1 },
    ];
    expect(result).toIncludeAllMembers(expected);
  });
});

describe("getNextGeneration()", function () {
  test("Should return an empty list of living cells", function () {
    const livingCells: LivingCells = new Set<StringPosition>([]);
    const result = getNextGeneration(livingCells);
    const expected = new Set<StringPosition>([]);
    expect(result).toEqual(expected);
  });

  test("Should return the next living cells according to GameOfLife rules", function () {
    const livingCells: LivingCells = new Set<StringPosition>(["-1|0", "0|0", "1|0"]);
    const result = getNextGeneration(livingCells);
    const expected = new Set<StringPosition>(["0|-1", "0|0", "0|1"]);
    expect(result).toEqual(expected);
  });
});