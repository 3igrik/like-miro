const MIN_MISS = 2; // minimum miss(in px) from the line

const X = 0;
const Y = 1;

export const checkClickIsOnLine = (e, line) => {
  
  let x = e.clientX;
  let y = e.clientY;
  
  let lineCoords = line.lineCoords;

  for (let i = 0; i < lineCoords.length - 1; i++) {
    const begin = lineCoords[i];
    const end = lineCoords[i + 1];

    if (x >= begin[X] - MIN_MISS && x <= begin[X] + MIN_MISS) {
      if ((y >= begin[Y] && y <= end[Y]) ||
          (y >= end[Y] && y <= begin[Y])) {
        return line;
      }
    } else if (y >= begin[Y] - MIN_MISS && y <= begin[Y] + MIN_MISS) {
      if ((x >= begin[X] && x <= end[X]) ||
          (x >= end[X] && x <= begin[X])) {
        return line;
      }
    }
  }

  return false;
}