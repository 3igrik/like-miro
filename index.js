import { drawExistingLines, drawSelectedLine } from "./line/line.js";
import { drawExistingRects, drawSelectedRect } from "./rectangle/rectangle.js";
import { clickedOnRectLine, checkSide } from "./utils/clickedOnRectLine.js";
import { createRectangleDiv } from "./utils/createRectangleDiv.js";
import { selectAndActiveCursor } from "./utils/selectAndActiveCursor.js";
import { selectWithKeyBoard } from "./inventory/inventory.js";

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

let selectedInventoryItem = {selectedItem: null};
let frame = null;
let selectedRect = {rectIndex: -1};
let rectIndex = 0;
let needCreateDiv = false;

let fromRect = null,
    toRect = null,
    fromSide = null,
    toSide = null;
let differenceX = 0, differenceY = 0;
let x1 = 0, y1 = 0, x2 = 0, y2 = 0;
let lineX1 = 0, lineY1 = 0, lineX2 = 0, lineY2 = 0;
let canDrawSelection = false;
let needRemoveSelectedRect = false;
let ctx = canvas.getContext("2d")

function drawLine(e) {
  lineX2 = e.clientX;
  lineY2 = e.clientY;
}

function drawRect(e) {
  x2 = e.clientX;
  y2 = e.clientY;
}

selectWithKeyBoard(inventoryChildrenArr, cursor, line, rectangle, selectedInventoryItem);

const moveSelectedRect = (e) => {
  selectedRect.x = e.clientX - differenceX;
  selectedRect.y = e.clientY - differenceY;
  selectedRect.x2 = selectedRect.width + selectedRect.x;
  selectedRect.y2 = selectedRect.height + selectedRect.y;


  if (selectedRect.haveLine) {
    selectedRect.haveLine.forEach(line => {
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
    })
  }
  render();
  
  if (needRemoveSelectedRect) {
    document.querySelectorAll(".selected-rect").forEach(el => el.remove());
  }

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

  // if (e.target === line) {
  //   window.addEventListener("mousemove", hoverRect);
  // } else {
  //   window.removeEventListener("mousemove", hoverRect);
  // }
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

  if (selectedInventoryItem.selectedItem === cursor) {
    RECTANGLES_ARR.forEach(el => {
      if (e.clientX >= el.x && e.clientX <= el.x2
        && e.clientY >= el.y && e.clientY <= el.y2) {
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

  // window.removeEventListener("mousemove", hoverRect);
  selectAndActiveCursor(inventoryChildrenArr, cursor);
});

// *****************************************DRAW & RENDER

function drawSelection() {
	if (canDrawSelection === true && selectedInventoryItem.selectedItem === rectangle) {
    drawSelectedRect(ctx, x1, y1, x2 - x1, y2 - y1);
  }

  if (canDrawSelection === true && selectedInventoryItem.selectedItem === line) {
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

    drawSelectedLine(ctx, lineX1, lineY1, lineX2, lineY2, {fromRect, fromSide, toRect, toSide}, LINE_COORDS);
  }
}

export function render() {
	ctx.canvas.width = window.innerWidth;
	ctx.canvas.height = window.innerHeight;

  drawExistingRects(ctx, RECTANGLES_ARR);

  drawExistingLines(ctx, LINES_ARR);

  drawSelection();
}

function animate() {
	frame = requestAnimationFrame(animate);
  if (selectedInventoryItem.selectedItem !== cursor) {
    render();
  }
};

animate();