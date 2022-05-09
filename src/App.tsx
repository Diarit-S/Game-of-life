import "bulma/css/bulma.min.css";
import { FC, useState, useRef } from "react";
import "./App.css";
import { UiGrid } from "./components/Grid";

const App: FC = () => {
  const [running, setRunning] = useState(false);

  const toggleGameRunStatus = () => {
    setRunning(!running);
    if (!running) {
      runningRef.current = true;
    }
  }

  const runningRef = useRef(running);
  runningRef.current = running;

  return (
    <div className="container has-text-centered py-5">
      <UiGrid isRunning={runningRef.current}></UiGrid>

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
