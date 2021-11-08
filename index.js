import { createRectangleDiv } from "./utils/createRectangleDiv.js";

"use strict"

let canvas = document.getElementById("canvas");
let cursor = document.querySelector(".inventory__cursor");
let line = document.querySelector(".inventory__line");
let rectangle = document.querySelector(".inventory__rectangle");
let inventoryChildrenArr = Array.from(document.querySelector(".inventory").children);

const RECTANGLES_ARR = [];
let selectedInventoryItem = cursor;
let frame = null;
let selectedRect = {rectIndex: -1};
let rectIndex = 0;
let needCreateDiv = false;

let differenceX = 0, differenceY = 0;
let x1 = 0, y1 = 0, x2 = 0, y2 = 0;
let canDrawSelection = false;
let needRemoveSelectedRect = false;
let ctx = canvas.getContext("2d")

function drawRect(e) {
  x2 = e.clientX;
  y2 = e.clientY;
}

const moveSelectedRect = (e) => {
  selectedRect.x = e.clientX - differenceX;
  selectedRect.y = e.clientY - differenceY;
  selectedRect.x2 = selectedRect.width + selectedRect.x;
  selectedRect.y2 = selectedRect.height + selectedRect.y;
  render();
  
  if (needRemoveSelectedRect) {
    document.querySelectorAll(".selected-rect").forEach(el => el.remove());
    console.log("asd")
  }

  needRemoveSelectedRect = false;
}

const inventoryClick = (e) => {
  inventoryChildrenArr.forEach(el => {
    el.classList.remove("inventory__cursor_active");
  })
  e.target.classList.add("inventory__cursor_active");
  selectedInventoryItem = e.target;
}

cursor.addEventListener("click", inventoryClick);
line.addEventListener("click", inventoryClick);
rectangle.addEventListener("click", inventoryClick);

canvas.addEventListener("mousedown", function(e) {
	if (selectedInventoryItem !== cursor) {
    canDrawSelection = true;
    x1 = e.clientX;
    y1 = e.clientY;
    x2 = e.clientX;
    y2 = e.clientY;
    animate();

    canvas.addEventListener("mousemove", drawRect);
  }
});

window.addEventListener("mousedown", e => {
  document.querySelectorAll(".selected-rect").forEach(el => el.remove());

  if (selectedInventoryItem === cursor) {
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
  }
})

canvas.addEventListener("mouseup", function(e) {
	if (selectedInventoryItem !== cursor) {
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
      square: width * height
    })

    window.cancelAnimationFrame(frame)
    canDrawSelection = false;
    canvas.removeEventListener("mousemove", drawRect);
    render();
  }

  inventoryChildrenArr.forEach(el => {
    el.classList.remove("inventory__cursor_active");
  })

  cursor.classList.add("inventory__cursor_active");
  selectedInventoryItem = cursor;
});

function drawSelection() {
	if (canDrawSelection === true) {
  	ctx.beginPath();
    ctx.lineWidth="2";
		ctx.strokeStyle="black";
  	ctx.rect(x1, y1, x2 - x1, y2 - y1);
		ctx.stroke();
  }
}

function render() {
	ctx.canvas.width = window.innerWidth;
	ctx.canvas.height = window.innerHeight;

  RECTANGLES_ARR.forEach(el => {
    ctx.lineWidth="2"
    ctx.strokeStyle="black";
    ctx.strokeRect(el.x, el.y, el.width, el.height);
  })

  drawSelection();
}

function animate() {
	frame = requestAnimationFrame(animate);
  if (selectedInventoryItem !== cursor) {
    render();
  }
};

animate();