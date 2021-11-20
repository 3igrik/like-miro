export const SIDES_OF_THE_RECT = {
  top: "top",
  left: "left",
  bottom: "bottom",
  right: "right"
};

export const checkSide = (rect, line) => {
  let res = null;
  
  if (line.y >= rect.y && line.y <= rect.y2 &&
      (line.x >= rect.x - 2 && line.x <= rect.x + 2 ||
      line.x >= rect.x2 - 2 && line.x <= rect.x2 + 2)) {
    if (line.x >= rect.x - 2 && line.x <= rect.x + 2) {
      res = SIDES_OF_THE_RECT.left;
    } else if (line.x >= rect.x2 - 2 && line.x <= rect.x2 + 2) {
      res = SIDES_OF_THE_RECT.right;
    }
  } else if (line.x >= rect.x && line.x <= rect.x2) {
    if (line.y >= rect.y - 2 && line.y <= rect.y + 2) {
      res = SIDES_OF_THE_RECT.top;
    } else if (line.y >= rect.y2 - 5 && line.y <= rect.y2 + 5) {
        res = SIDES_OF_THE_RECT.bottom;
      }
    }

  return res;
}

export const clickedOnRectLine = (rect, from, to) => {
  let res = null;
  let itIsFrom = true;

  res = checkSide(rect, from);

  if (!res) {
    res = checkSide(rect, to);
    itIsFrom = false;
  }

  return res ? {side: res, itIsFrom} : null;
}