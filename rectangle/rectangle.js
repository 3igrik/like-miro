export const drawExistingRects = (ctx, rectsArr) => {
  rectsArr.forEach(element => {
    ctx.lineWidth="2"
    ctx.strokeStyle="black";
    ctx.strokeRect(element.x, element.y, element.width, element.height);
  });

  console.log("recs")
}

export const drawSelectedRect = (ctx, x, y, width, height) => {
  ctx.beginPath();
  ctx.lineWidth="2";
	ctx.strokeStyle="black";
  ctx.rect(x, y, width, height);
	ctx.stroke();
  
}