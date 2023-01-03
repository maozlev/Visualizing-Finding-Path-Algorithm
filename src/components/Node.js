import { React, useState, useEffect } from "react";
import "./Node.css";

const Node = ({
  isStart,
  isEnd,
  row,
  col,
  isWall,
  toggleWall,
  chooseStart,
  start,
  chooseEnd,
  end,
}) => {
  // console.log(5, Node);
  const [wall, setWall] = useState([]);
  const [classes, setClasses] = useState("");
  const [buttonClicked, setButtonClicked] = useState(false);

  useEffect(() => {
    if (buttonClicked) {
      if (start) {
        setClasses("node-start")
        chooseStart(row, col);
    } else if (end) {
        setClasses("node-end")
        chooseEnd(row, col);
      } else if (!classes.includes("start") && !classes.includes("end")) {
        if (classes === "" || classes.includes("node")) {
          toggleWall(row, col, true);
          setClasses("isWall");
        } else {
          setClasses("node");
          toggleWall(row, col, false);
        }
        setButtonClicked(false);
      }
    }
  }, [buttonClicked]);

  useEffect(() => {
    setClasses(
      isStart ? "node-start" : isWall ? "isWall" : isEnd ? "node-end" : ""
    );
  }, [],buttonClicked);

  return (
    <div className={`node ${classes}`} id={`node-${row}-${col}`}>
      <button
        className="nodeButton"
        onClick={() => setButtonClicked(true)}
      ></button>{" "}
    </div>
  );
};
export default Node;
