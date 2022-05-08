import "bulma/css/bulma.min.css";
import { FC, useState, useRef, useCallback } from "react";
import "./App.css";
import useInterval from "./useInterval";
import { getNextGeneration, LivingCells, formatToStringPosition } from './GameEngine/index'
import { UiCell } from "./components/Cell";
import { lifePattern } from './GameEngine/baseLifePattern'

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

const App: FC = () => {
  
  const [currentLivingCells, setCurrentLivingCells] = useState(lifePattern)

  const [grid, setGrid] = useState(() => {
    return computeGrid(currentLivingCells);
  });
  const [running, setRunning] = useState(false);

  const toggleGameRunStatus = () => {
    setRunning(!running);
    if (!running) {
      runningRef.current = true;
    }
  }

  const runningRef = useRef(running);
  runningRef.current = running;

  const runLife = useCallback(() => {
    if (!runningRef.current) {
      return;
    }

    const livingCellsSet: LivingCells = new Set(currentLivingCells) as LivingCells;
    const nextGenerationLivingCells = Array.from(getNextGeneration(livingCellsSet));
    setCurrentLivingCells(nextGenerationLivingCells);

    setGrid(computeGrid(currentLivingCells));
  }, [currentLivingCells]);

  useInterval(() => {
    runLife();
  }, 150);

  return (
    <div className="container has-text-centered py-5">
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
            <div onClick={() => console.log(k, i)}>
              <UiCell isAlive={Boolean(grid[i][k])} key={`${i}-${k}`}/>
            </div>
            
          ))
        )}
      </div>

      <div className="buttons is-centered pt-5">
        <button
          className="button start-game mx-2"
          onClick={toggleGameRunStatus}
        >
          <span>{running ? "Stop" : "Start"}</span>
        </button>
      </div>
    </div>
  );
};

export default App;
