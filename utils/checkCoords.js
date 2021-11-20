export const checkCoords = (x, y, rectsArr) => {
  let isCoordsOnRect = false;

  for (let i = 0; i < rectsArr.length; i++) {
    if (x >= rectsArr[i].x && x <= rectsArr[i].x2 &&
        y >= rectsArr[i].y && y <= rectsArr[i].y2) {
      isCoordsOnRect = true;
    
      return isCoordsOnRect;
    }
  }

  return isCoordsOnRect;
}