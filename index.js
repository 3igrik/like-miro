import {
  changeLineSection,
  drawExistingLines,
  drawSelectedLine
} from "./line/line.js";
import { drawExistingRects, drawSelectedRect } from "./rectangle/rectangle.js";
import { clickedOnRectLine, checkSide } from "./utils/clickedOnRectLine.js";
import { createRectangleDiv } from "./utils/createRectangleDiv.js";
import { selectAndActiveCursor } from "./utils/selectAndActiveCursor.js";
import { selectWithKeyBoard } from "./inventory/inventory.js";
import { checkClickIsOnLine } from "./utils/checkClickIsOnLine.js";
import { createSVGLine } from "./utils/createSVGLine.js";

"use strict"

let canvas = document.getElementById("canvas");
let cursor = document.querySelector(".inventory__cursor");
let line = document.querySelector(".inventory__line");
let rectangle = document.querySelector(".inventory__rectangle");
let inventory = document.querySelector(".inventory");
let inventoryChildrenArr = Array.from(inventory.children);

const RECTANGLES_ARR = [];
const LINES_ARR = [];
const LINE_COORDS = [];

let selectedInventoryItem = {selectedItem: cursor };
let frame = null;
let ctx = canvas.getContext("2d")

let selectedRect = {rectIndex: -1};
let rectIndex = 0;

let differenceX = 0, differenceY = 0;
let x1 = 0, y1 = 0, x2 = 0, y2 = 0;
let canDrawSelection = false;
let needRemoveSelectedRect = false;
let needCreateDiv = false;

let fromRect = null,
    toRect = null,
    fromSide = null,
    toSide = null;
let lineX1 = 0, lineY1 = 0, lineX2 = 0, lineY2 = 0;
let needCreateSVGLine = false;
let needRemoveSelectedSVGLine = false;
let selectedLine = null;
let needChangeLine = false;
let selectedLinesIndex = null;
let sectionPoint = null;
let dontTouchRect = false;
const changedLines = [];

function drawLine(e) {
  lineX2 = e.clientX;
  lineY2 = e.clientY;
}

function drawRect(e) {
  x2 = e.clientX;
  y2 = e.clientY;
}

const changeBeginPoint = (e) => {
  document.querySelectorAll(".selected-line").forEach(el => el.remove());

  needChangeLine = true;
  selectedLine.x1 = e.clientX;
  selectedLine.y1 = e.clientY;
};

const changeEndPoint = (e) => {
  document.querySelectorAll(".selected-line").forEach(el => el.remove());

  needChangeLine = true;
  selectedLine.x2 = e.clientX;
  selectedLine.y2 = e.clientY;
};

const changePoint = (e) => {
  if (needRemoveSelectedSVGLine) {
    document.querySelectorAll(".selected-line").forEach(el => el.remove());
    needRemoveSelectedSVGLine = false;
  }
  
  changeLineSection(ctx, selectedLine, e, sectionPoint);
  render();
};

selectWithKeyBoard(inventoryChildrenArr, cursor, line, rectangle, selectedInventoryItem);

const moveSelectedRect = (e) => {
  selectedRect.x = e.clientX - differenceX;
  selectedRect.y = e.clientY - differenceY;
  selectedRect.x2 = selectedRect.width + selectedRect.x;
  selectedRect.y2 = selectedRect.height + selectedRect.y;


  if (selectedRect.haveLine) {
    selectedRect.haveLine.forEach((line, i) => {
      let lineIsChanged = changedLines.includes(i);

      if (lineIsChanged) {
        if (line.lineIsFromRect) {
          if (line.lineInfo.fromRectSide === "left") {
            line.lineInfo.y1 = selectedRect.y + line.lineInfo.lDiffY; 
            line.lineInfo.x1 = selectedRect.x;
            line.lineInfo.lineCoords[0][0] = line.lineInfo.x1;
            line.lineInfo.lineCoords[0][1] = line.lineInfo.y1;
            line.lineInfo.lineCoords[1][1] = line.lineInfo.y1;
          } else if (line.lineInfo.fromRectSide === "top") {
            line.lineInfo.x1 = selectedRect.x + line.lineInfo.lDiffX; 
            line.lineInfo.y1 = selectedRect.y;
            line.lineInfo.lineCoords[0][0] = line.lineInfo.x1;
            line.lineInfo.lineCoords[0][1] = line.lineInfo.y1;
            line.lineInfo.lineCoords[1][0] = line.lineInfo.x1;
          } else if (line.lineInfo.fromRectSide === "right") {
            line.lineInfo.y1 = selectedRect.y + line.lineInfo.lDiffY; 
            line.lineInfo.x1 = selectedRect.x2;
            line.lineInfo.lineCoords[0][0] = line.lineInfo.x1;
            line.lineInfo.lineCoords[0][1] = line.lineInfo.y1;
            line.lineInfo.lineCoords[1][1] = line.lineInfo.y1;
          } else if (line.lineInfo.fromRectSide === "bottom") {
            line.lineInfo.x1 = selectedRect.x + line.lineInfo.lDiffX; 
            line.lineInfo.y1 = selectedRect.y2;
            line.lineInfo.lineCoords[0][0] = line.lineInfo.x1;
            line.lineInfo.lineCoords[0][1] = line.lineInfo.y1;
            line.lineInfo.lineCoords[1][0] = line.lineInfo.x1;
          }
        } else {
          let last = line.lineInfo.lineCoords.length - 1;
          let penult = line.lineInfo.lineCoords.length - 2;
          if (line.lineInfo.toRectSide === "left") {
            line.lineInfo.y2 = selectedRect.y + line.lineInfo.lDiffY; 
            line.lineInfo.x2 = selectedRect.x;
            line.lineInfo.lineCoords[last][0] = line.lineInfo.x2;
            line.lineInfo.lineCoords[last][1] = line.lineInfo.y2;
            line.lineInfo.lineCoords[penult][1] = line.lineInfo.y2;
          } else if (line.lineInfo.toRectSide === "top") {
            line.lineInfo.x2 = selectedRect.x + line.lineInfo.lDiffX;
            line.lineInfo.y2 = selectedRect.y;
            line.lineInfo.lineCoords[last][0] = line.lineInfo.x2;
            line.lineInfo.lineCoords[last][1] = line.lineInfo.y2;
            line.lineInfo.lineCoords[penult][0] = line.lineInfo.x2;
          } else if (line.lineInfo.toRectSide === "right") {
            line.lineInfo.y2 = selectedRect.y + line.lineInfo.lDiffY; 
            line.lineInfo.x2 = selectedRect.x2;
            line.lineInfo.lineCoords[last][0] = line.lineInfo.x2;
            line.lineInfo.lineCoords[last][1] = line.lineInfo.y2;
            line.lineInfo.lineCoords[penult][1] = line.lineInfo.y2;
          } else if (line.lineInfo.toRectSide === "bottom") {
            line.lineInfo.x2 = selectedRect.x + line.lineInfo.lDiffX; 
            line.lineInfo.y2 = selectedRect.y2;
            line.lineInfo.lineCoords[last][0] = line.lineInfo.x2;
            line.lineInfo.lineCoords[last][1] = line.lineInfo.y2;
            line.lineInfo.lineCoords[penult][0] = line.lineInfo.x2;
          }
        }
      } else {
        if (line.lineIsFromRect) {
          if (line.lineInfo.fromRectSide === "left") {
            line.lineInfo.y1 = selectedRect.y + line.lineInfo.lDiffY; 
            line.lineInfo.x1 = selectedRect.x;
          } else if (line.lineInfo.fromRectSide === "top") {
            line.lineInfo.x1 = selectedRect.x + line.lineInfo.lDiffX; 
            line.lineInfo.y1 = selectedRect.y;
          } else if (line.lineInfo.fromRectSide === "right") {
            line.lineInfo.y1 = selectedRect.y + line.lineInfo.lDiffY; 
            line.lineInfo.x1 = selectedRect.x2;
          } else if (line.lineInfo.fromRectSide === "bottom") {
            line.lineInfo.x1 = selectedRect.x + line.lineInfo.lDiffX; 
            line.lineInfo.y1 = selectedRect.y2;
          }
        } else {
          if (line.lineInfo.toRectSide === "left") {
            line.lineInfo.y2 = selectedRect.y + line.lineInfo.lDiffY; 
            line.lineInfo.x2 = selectedRect.x;
          } else if (line.lineInfo.toRectSide === "top") {
            line.lineInfo.x2 = selectedRect.x + line.lineInfo.lDiffX; 
            line.lineInfo.y2 = selectedRect.y;
          } else if (line.lineInfo.toRectSide === "right") {
            line.lineInfo.y2 = selectedRect.y + line.lineInfo.lDiffY; 
            line.lineInfo.x2 = selectedRect.x2;
          } else if (line.lineInfo.toRectSide === "bottom") {
            line.lineInfo.x2 = selectedRect.x + line.lineInfo.lDiffX; 
            line.lineInfo.y2 = selectedRect.y2;
          }
        }
      }
    })
  }
  render();
  
  if (needRemoveSelectedRect) {
    document.querySelectorAll(".selected-rect").forEach(el => el.remove());
  }

  if (needRemoveSelectedSVGLine) {
    document.querySelectorAll(".selected-line").forEach(el => el.remove());
  }

  needRemoveSelectedSVGLine = false;
  needRemoveSelectedRect = false;
}

// *****************************************INVENTORY

const inventoryClick = (e) => {
  inventoryChildrenArr.forEach(el => {
    el.classList.remove("inventory__item_active");
  })

  if (e.target === cursor ||
      e.target === rectangle ||
      e.target === line) {

    e.target.classList.add("inventory__item_active");
    selectedInventoryItem.selectedItem = e.target;
  }
}

inventory.addEventListener("click", inventoryClick);

// *****************************************START_DRAW

canvas.addEventListener("mousedown", function(e) {
	if (selectedInventoryItem.selectedItem === rectangle) {
    canDrawSelection = true;
    x1 = e.clientX;
    y1 = e.clientY;
    x2 = e.clientX;
    y2 = e.clientY;
    animate();

    canvas.addEventListener("mousemove", drawRect);
  } else if (selectedInventoryItem.selectedItem === line) {
    canDrawSelection = true;
    lineX1 = e.clientX;
    lineY1 = e.clientY;
    lineX2 = e.clientX;
    lineY2 = e.clientY;
    animate();

    canvas.addEventListener("mousemove", drawLine);
  }
});

// *****************************************CREATE_RECT_DIV

window.addEventListener("mousedown", e => {
  document.querySelectorAll(".selected-rect").forEach(el => el.remove());
  document.querySelectorAll(".selected-line").forEach(el => el.remove());

  if (selectedInventoryItem.selectedItem === cursor) {
    RECTANGLES_ARR.forEach(el => {
      if (e.clientX >= el.x && e.clientX <= el.x2
        && e.clientY >= el.y && e.clientY <= el.y2
        && !dontTouchRect) {
        if (selectedRect
          && e.clientX >= selectedRect.x
          && e.clientX <= selectedRect.x2
          && e.clientY >= selectedRect.y
          && e.clientY <= selectedRect.y2) {
          selectedRect = selectedRect.square < el.square ?
                                            selectedRect : el;
        } else selectedRect = el;
        needCreateDiv = true;
        needRemoveSelectedRect = true;
        window.addEventListener("mousemove", moveSelectedRect);
        window.addEventListener("mouseup", () => {
          window.removeEventListener("mousemove", moveSelectedRect);
        })
      }
    })

    if (needCreateDiv) {
      let selectedRectEl = createRectangleDiv(selectedRect);
      document.body.appendChild(selectedRectEl);
      needCreateDiv = false;
    }

    differenceX = e.clientX - selectedRect.x;
    differenceY = e.clientY - selectedRect.y;

    if (selectedRect.haveLine) {
      selectedRect.haveLine.forEach(line => {
        if (line.lineIsFromRect) {
          line.lineInfo.lDiffY = line.lineInfo.y1 - selectedRect.y;
          line.lineInfo.lDiffX = line.lineInfo.x1 - selectedRect.x;
        } else {
          line.lineInfo.lDiffY = line.lineInfo.y2 - selectedRect.y;
          line.lineInfo.lDiffX = line.lineInfo.x2 - selectedRect.x;
        }
      })
    }

    if (LINES_ARR) {
      LINES_ARR.forEach((line, i) => {
        let clickIsOnLine = checkClickIsOnLine(e, line);

        if (clickIsOnLine) {
          needCreateSVGLine = true;
          needRemoveSelectedSVGLine = true;
          selectedLine = clickIsOnLine;
          selectedLinesIndex = i;
        }
      })
    
      console.log(LINES_ARR, selectedLine, needCreateSVGLine)
    }

    if (needCreateSVGLine) {
      let selectedLineEl = createSVGLine(selectedLine);
      dontTouchRect = true;
      document.body.appendChild(selectedLineEl);
      document.querySelector(".selected-line").addEventListener("mousedown", (e) => {
        if (e.target.classList.contains("point")) {
          sectionPoint = e.target;
          if (!changedLines.includes(selectedLinesIndex)) {
            changedLines.push(selectedLinesIndex);
          }
          console.log(sectionPoint);
          window.addEventListener("mousemove", changePoint);
          window.addEventListener("mouseup", () => {
            window.removeEventListener("mousemove", changePoint);
            if (JSON.stringify(selectedLine.lineCoords[0]) !==
                JSON.stringify([selectedLine.x1, selectedLine.y1])) {
              selectedLine.lineCoords.unshift([selectedLine.x1, selectedLine.y1]);
            }
            for (let i = 0; i < selectedLine.lineCoords.length - 1; i++) {
              let coord = selectedLine.lineCoords[i];
              let nextCoord = selectedLine.lineCoords[i + 1];
              let xDiff = Math.abs(coord[0] - nextCoord[0]);
              let yDiff = Math.abs(coord[1] - nextCoord[1]);

              if (yDiff < 3 && xDiff < 3) {
                selectedLine.lineCoords.splice(i, 2);
              }
            }
            sectionPoint = null;
            render();
          })
        } else if (e.target.classList.contains("begin-point")) {
          window.addEventListener("mousemove", changeBeginPoint);
          window.addEventListener("mouseup", () => {
            window.removeEventListener("mousemove", changeBeginPoint);
            needChangeLine = false;
            render();
          })

        } else if (e.target.classList.contains("end-point")) {
          window.addEventListener("mousemove", changeEndPoint);
          window.addEventListener("mouseup", () => {
            render();
            window.removeEventListener("mousemove", changeEndPoint);
            needChangeLine = false;
          })
        }
      })
      needCreateSVGLine = false;
    }
  }

  if (selectedInventoryItem.selectedItem === line) {
    lineX1 = e.clientX;
    lineY1 = e.clientY;
  }
})

// **************************************DRAW_END & PUSH

canvas.addEventListener("mouseup", function(e) {
  
	if (selectedInventoryItem.selectedItem === rectangle) {
    let startX, startY, endX, endY, width, height;
    width = Math.abs(x2-x1);
    height = Math.abs(y2-y1); 

    x1 < x2 ? (startX = x1, endX = x2) : (startX = x2, endX = x1);
    y1 < y2 ? (startY = y1, endY = y2) : (startY = y2, endY = y1);

    RECTANGLES_ARR.push({
      x: startX,
      y: startY,
      x2: endX,
      y2: endY,
      width,
      height,
      rectIndex: rectIndex++,
      square: width * height,
      haveLine: []
    })

    window.cancelAnimationFrame(frame)
    canDrawSelection = false;
    canvas.removeEventListener("mousemove", drawRect);
    render();
    selectedInventoryItem.selectedItem = cursor;
  }

  if (selectedInventoryItem.selectedItem === line) {
    const lineInfo = {
      x1: lineX1,
      y1: lineY1,
      x2: e.clientX,
      y2: e.clientY,
      lineCoords: [],
      fromRect: null,
      fromSide: null,
      toRect: null,
      toSide: null
    };

    RECTANGLES_ARR.forEach(r => {
      let onRect = clickedOnRectLine(
        r, {x: lineX1, y: lineY1}, {x: e.clientX, y: e.clientY}
      );

      if (onRect) {
        onRect.itIsFrom ? 
        (lineInfo.fromRectSide = onRect.side,
        r.haveLine.push({lineInfo, lineIsFromRect: true})) :
        (lineInfo.toRectSide = onRect.side,
        r.haveLine.push({lineInfo, lineIsFromRect: false}));
      }
    })

    lineInfo.lineCoords.push(LINE_COORDS);
    lineInfo.fromRect = fromRect;
    lineInfo.fromSide = fromSide;
    lineInfo.toRect = toRect;
    lineInfo.toSide = toSide;

    LINES_ARR.push(lineInfo);

    toRect = null;
    toSide = null;
    fromRect = null;
    fromSide = null;

    window.cancelAnimationFrame(frame)
    canDrawSelection = false;
    canvas.removeEventListener("mousemove", drawLine);
    render();
    selectedInventoryItem.selectedItem = cursor;
  }

  dontTouchRect = false;
  selectAndActiveCursor(inventoryChildrenArr, cursor);
});

// *****************************************DRAW & RENDER

function drawSelection() {
	if (canDrawSelection === true && selectedInventoryItem.selectedItem === rectangle) {
    drawSelectedRect(ctx, x1, y1, x2 - x1, y2 - y1);
  }

  if ((canDrawSelection === true &&
      selectedInventoryItem.selectedItem === line) ||
      needChangeLine) {
    fromRect = null;
    toRect = null;
    fromSide = null;
    toSide = null;

    RECTANGLES_ARR.forEach(rect => {
      let isNotNull = checkSide(rect, {x: lineX1, y: lineY1}) 
      if (isNotNull) {
        fromRect = rect;
        fromSide = isNotNull
      } else {
        isNotNull = checkSide(rect, {x: lineX2, y: lineY2});
        if (isNotNull) {
          toRect = rect;
          toSide = isNotNull;
        }
      }
    })

    LINE_COORDS.splice(0, LINE_COORDS.length);

    if (needChangeLine) {
      drawSelectedLine(ctx,
        LINES_ARR[selectedLinesIndex].x1, LINES_ARR[selectedLinesIndex].y1, LINES_ARR[selectedLinesIndex].x2, LINES_ARR[selectedLinesIndex].y2,
        {fromRect: LINES_ARR[selectedLinesIndex].fromRect,
        fromSide: LINES_ARR[selectedLinesIndex].fromSide,
        toRect: LINES_ARR[selectedLinesIndex].toRect,
        toSide: LINES_ARR[selectedLinesIndex].toSide},
        LINE_COORDS, [LINES_ARR, selectedLinesIndex], RECTANGLES_ARR);
    } else {
      drawSelectedLine(ctx, lineX1, lineY1, lineX2, lineY2, {fromRect, fromSide, toRect, toSide}, LINE_COORDS, null, null);
    }
  }
}

export function render() {
	ctx.canvas.width = window.innerWidth;
	ctx.canvas.height = window.innerHeight;

  drawExistingRects(ctx, RECTANGLES_ARR);

  if (changedLines.length) {
    drawExistingLines(ctx, LINES_ARR, changedLines);
  } else {
    drawExistingLines(ctx, LINES_ARR, null);
  }

  drawSelection();
}

function animate() {
	frame = requestAnimationFrame(animate);
  if (selectedInventoryItem.selectedItem !== cursor || needChangeLine) {
    console.log(needChangeLine, selectedInventoryItem);
    render();
  }
};

animate();