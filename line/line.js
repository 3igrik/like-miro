const ARROWS_LENGTH = 20; // length of head in pixels

const drawArrows = (ctx, x, y, x2, y2) => {
  let headLen = ARROWS_LENGTH; // 
  let differenceX = Math.abs(x2 - x);
  let differenceY = Math.abs(y2 - y);
  let angle = Math.atan2(differenceY, differenceX);
  ctx.moveTo(x, y);
  ctx.lineTo(x2, y2);

    //draw arrows

  if (x2 >= x && y2 >= y) {
    ctx.lineTo(x2 - headLen * Math.cos(angle - Math.PI / 6), y2 - headLen * Math.sin(angle - Math.PI / 6));
  } else if (x2 <= x && y2 <= y) {
    ctx.lineTo(x2 + headLen * Math.cos(angle - Math.PI / 6), y2 + headLen * Math.sin(angle - Math.PI / 6));
  } else if (x2 >= x && y2 <= y) {
    ctx.lineTo(x2 - headLen * Math.cos(angle - Math.PI / 6), y2 + headLen * Math.sin(angle - Math.PI / 6));
  } else if (x2 <= x && y2 >= y) {
    ctx.lineTo(x2 + headLen * Math.cos(angle - Math.PI / 6), y2 - headLen * Math.sin(angle - Math.PI / 6));
  }
    
   ctx.moveTo(x2, y2);
  
  if (x2 >= x && y2 >= y) {
    ctx.lineTo(x2 - headLen * Math.cos(angle + Math.PI / 6), y2 - headLen * Math.sin(angle + Math.PI / 6));
  } else if (x2 <= x && y2 <= y) {
    ctx.lineTo(x2 + headLen * Math.cos(angle + Math.PI / 6), y2 + headLen * Math.sin(angle + Math.PI / 6));
  } else if (x2 >= x && y2 <= y) {
    ctx.lineTo(x2 - headLen * Math.cos(angle + Math.PI / 6), y2 + headLen * Math.sin(angle + Math.PI / 6));
  } else if (x2 <= x && y2 >= y) {
    ctx.lineTo(x2 + headLen * Math.cos(angle + Math.PI / 6), y2 - headLen * Math.sin(angle + Math.PI / 6));
  }
  ctx.stroke();
}

export const drawExistingLines = (ctx, linesArr) => {
  linesArr.forEach(el => {
    ctx.lineWidth="1"
    ctx.strokeStyle="black";

    let x = el.x1, x2 = el.x2, y = el.y1, y2 = el.y2;
  
    drawArrows(ctx, x, y, x2, y2);
  })
}

export const drawSelectedLine = (ctx, x, y, x2, y2) => {
  ctx.beginPath();
  ctx.lineWidth="1";
	ctx.strokeStyle="black";
  
  drawArrows(ctx, x, y, x2, y2);
}