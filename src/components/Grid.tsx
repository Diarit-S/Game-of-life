import "bulma/css/bulma.min.css";
import { useState, useCallback } from "react";
import useInterval from "../useInterval";
import { getNextGeneration, LivingCells, formatToStringPosition } from '../GameEngine/index'
import { UiCell } from "./Cell";
import { lifePattern } from '../GameEngine/baseLifePattern'

const numCols = 40;

type Cell = number
type Row = Cell[]
type Grid = Row[]


const computeGrid = (livingCellsCoordinates: string[]): Grid => {
  const grid: Grid = [];
  for (let i = 0; i < numCols; i++) {
    const row: Row = []
    for (let j = 0; j < numCols; j++) {
      const cellStatus = livingCellsCoordinates.includes(formatToStringPosition({x: j, y: i})) ? 1 : 0
      row.push(cellStatus)
    }
    grid.push(row);
  }
  return grid;
};

export const UiGrid = ({isRunning}: {isRunning: boolean}) => {
  
  const [currentLivingCells, setCurrentLivingCells] = useState(lifePattern)

  const [grid, setGrid] = useState(() => {
    return computeGrid(currentLivingCells);
  });

  const runLife = useCallback(() => {
    if (!isRunning) {
      return;
    }

    const livingCellsSet: LivingCells = new Set(currentLivingCells) as LivingCells;
    const nextGenerationLivingCells = Array.from(getNextGeneration(livingCellsSet));
    setCurrentLivingCells(nextGenerationLivingCells);

    setGrid(computeGrid(currentLivingCells));
  }, [currentLivingCells, isRunning]);

  useInterval(() => {
    runLife();
  }, 100);

  return (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${numCols}, 20px)`,
          width: "fit-content",
          margin: "0 auto",
        }}
      >
        {grid.map((rows: Row, i: number) =>
          rows.map((col, k) => (
            <UiCell isAlive={Boolean(grid[i][k])} key={`${i}-${k}`}/>
          ))
        )}
      </div>
  );
};
