import React, { useState, useEffect } from "react";
import Node from "./Node";
import Astar from "../astarAlgo/astar";
import "./PathFind.css";
const cols = 45;
const rows = 15;

const PathFind = () => {
  const [NODE_START_ROW, setNODE_START_ROW] = useState(0);
  const [NODE_START_COL, setNODE_START_COL] = useState(0);
  const [NODE_END_ROW, setNODE_END_ROW] = useState(rows - 1);
  const [NODE_END_COL, setNODE_END_COL] = useState(cols - 1);
  const [Grid, setGrid] = useState([]);
  const [Path, setPath] = useState([]);
  const [Start, setStart] = useState(false);
  const [End, setEnd] = useState(false);
  const [VisitedNodes, setVisitedNodes] = useState([]);
  let walls = [];

  useEffect(() => {
    initalizeGrid();
  }, []);

  // CREATES THE GRID
  const initalizeGrid = () => {
    const Grid = new Array(rows);

    for (let i = 0; i < cols; i++) {
      Grid[i] = new Array(cols);
    }
    createSpot(Grid);
    setGrid(Grid);
    addNeighbours(Grid);
    // const startNode = Grid[NODE_START_ROW][NODE_START_COL];
    // const endNode = Grid[NODE_END_ROW][NODE_END_COL];
    // let path = Astar(startNode, endNode);
    // startNode.isWall = false;
    // endNode.isWall = false;
    // setPath(path.path);
    // if(path.error){
    //   console.log("no path");
    // }
    // setVisitedNodes(path.visitedNodes);
  };

  // CREATES THE SPOT
  const createSpot = (Grid) => {
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        Grid[i][j] = new Spot(i, j);
      }
    }
  };
  // ADD NEIGHBOURS
  const addNeighbours = (grid) => {
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        grid[i][j].addneighbours(grid);
      }
    }
  };

  // CONSTRUCTOR OF SPOT
  function Spot(i, j) {
    this.x = i;
    this.y = j;
    this.g = 0;
    this.f = 0;
    this.h = 0;
    this.isStart = this.x === NODE_START_ROW && this.y === NODE_START_COL;
    this.isEnd = this.x === NODE_END_ROW && this.y === NODE_END_COL;
    this.neighbors = [];
    this.isWall = false;
    if (Math.random(1) < 0.2) {
      this.isWall = true;
      walls.push(this.x + this.y + "");
    }
    this.previous = undefined;
    this.addneighbours = function (grid) {
      let i = this.x;
      let j = this.y;
      if (i > 0) this.neighbors.push(grid[i - 1][j]);
      if (i < rows - 1) this.neighbors.push(grid[i + 1][j]);
      if (j > 0) this.neighbors.push(grid[i][j - 1]);
      if (j < cols - 1) this.neighbors.push(grid[i][j + 1]);
    };
  }

  const toggleWall = (row, col, isWall) => {
    const updatedGrid = Grid.slice();
    updatedGrid[row][col].isWall = !updatedGrid[row][col].isWall;
    if (isWall) {
      walls.push(row + col + "");
    } else {
      walls = walls.filter((x) => x !== row + col + "");
    }
    setGrid(updatedGrid);
  };
  const chooseStart = (row, col) => {
    setEnd(false)
    document.getElementById(`node-${NODE_START_ROW}-${NODE_START_COL}`).className ="node";
    setNODE_START_ROW(row)
    setNODE_START_COL(col)
  };
  const chooseEnd = (row, col) => {
    setStart(false)
    document.getElementById(`node-${NODE_END_ROW}-${NODE_END_COL}`).className ="node";
    setNODE_END_ROW(row)
    setNODE_END_COL(col)
  };

  // GRID WITH NODES
  const gridWithNodes = (
    <div>
      {Grid.map((row, rowIndex) => {
        return (
          <div key={rowIndex} className="rowWrapper">
            {row.map((col, colIndex) => {
              const { isStart, isEnd, isWall } = col;
              return (
                <Node
                  key={colIndex}
                  isStart={isStart}
                  isEnd={isEnd}
                  row={rowIndex}
                  col={colIndex}
                  isWall={isWall}
                  toggleWall={toggleWall}
                  chooseStart={chooseStart}
                  start={Start}
                  end={End}
                  chooseEnd={chooseEnd}
                />
              );
            })}
          </div>
        );
      })}
    </div>
  );

  const visualizeShortestPath = (shortestPathNodes) => {
    for (let i = 0; i < shortestPathNodes.length; i++) {
      setTimeout(() => {
        const node = shortestPathNodes[i];
        document.getElementById(`node-${node.x}-${node.y}`).className =
          "node node-shortest-path";
      }, 10 * i);
    }
  };

  const visualizePath = () => {
    const startNode = Grid[NODE_START_ROW][NODE_START_COL];
    const endNode = Grid[NODE_END_ROW][NODE_END_COL];
    let path = Astar(startNode, endNode, walls);
    startNode.isWall = false;
    endNode.isWall = false;
    setPath(path.path);
    if (path.error) {
      console.log("no path");
    }
    setVisitedNodes(path.visitedNodes);
    for (let i = 0; i <= VisitedNodes.length; i++) {
      if (i === VisitedNodes.length) {
        setTimeout(() => {
          visualizeShortestPath(Path);
        }, 20 * i);
      } else {
        setTimeout(() => {
          const node = VisitedNodes[i];
          document.getElementById(`node-${node.x}-${node.y}`).className =
            "node node-visited";
        }, 20 * i);
      }
    }
  };

  return (
    <div className="wrapper">
      <button onClick={visualizePath}>Visualize Path</button>
      <button className="start" onClick={() => setStart(!Start)}>choose start node</button>
      <button className="end" onClick={() => setEnd(!End)}>choose end node</button>
      <h1>Find The Shortest Path</h1>
      {gridWithNodes}
    </div>
  );
};
export default PathFind;
