import React from "react";
import classNames from "classnames";
import "./Loading.scss";

// 2 2 3 2 2
// 1 4 1 4 1
// 11
// 11
// 1 9 1
// 2 7 2
// 3 5 3
// 4 3 4
// 5 1 5

const heartBlockRows = [
  [false, [2, 2, 3, 2, 2]],
  [false, [1, 4, 1, 4, 1]],
  [true, [11]],
  [true, [11]],
  [false, [1, 9, 1]],
  [false, [2, 7, 2]],
  [false, [3, 5, 3]],
  [false, [4, 3, 4]],
  [false, [5, 1, 5]]
];

const generateBlocks = () => {
  return heartBlockRows.reduce((rows, rowInfo) => {
    let isVisible = rowInfo[0];
    const row = [];
    rowInfo[1].forEach(blockCount => {
      for (let i = 0; i < blockCount; i++) {
        row.push(
          <div className={`loading__block${isVisible ? " visible" : ""}`} />
        );
      }

      isVisible = !isVisible;
    });

    rows.push(<div className="loading__row">{row}</div>);
    return rows;
  }, []);
};

export default () => <div className="loading">{generateBlocks()}</div>;
