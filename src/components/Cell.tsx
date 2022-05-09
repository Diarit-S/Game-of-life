import "bulma/css/bulma.min.css";


export const UiCell = ({isAlive}: {isAlive: boolean}) => {
  return (
    <div
      style={{
        width: 20,
        height: 20,
        backgroundColor: isAlive ? "#000000" : undefined,
        border: "1px solid #595959",
      }}
    ></div>
  );
};

