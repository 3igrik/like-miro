import { PX_FROM_SIDE } from "../line/line.js";

const X = 0;
const Y = 1;

const MIN_LEN_FOR_SECTION = PX_FROM_SIDE + 5; // min length of the line section to create a point

export const createSVGLine = (selectedLine) => {
  const selectedLineEl = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  const path = document.createElementNS(
    'http://www.w3.org/2000/svg',
    'path'
  );
  const points = [];

  let pathsD = ``;
  let cx = 0;
  let cy = 0;

  selectedLine.lineCoords.forEach((el, i, arr) => {
    if (i === 0) {
      pathsD += `M ${el[X]}, ${el[Y]} `; 
    } else {
      pathsD += `L ${el[X]}, ${el[Y]} `;
    }

    if (i === 0 || i + 1 === selectedLine.lineCoords.length) {
      const point = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'circle'
      );
      
      point.setAttribute("cx", el[X]);
      point.setAttribute("cy", el[Y]);
      point.setAttribute("r", 7);
      point.setAttribute("stroke", "grey");
      point.setAttribute("fill", "#fff");
      
      if (i === 0) {
        point.classList.add("begin-point");
      } else {
        point.classList.add("end-point");
      }

      points.push(point);
    } 
    
    const point = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'circle'
    );
    point.setAttribute("r", 7);
    point.setAttribute("stroke", "#fff");
    point.setAttribute("fill", "#3075ff84");

    if (i + 1 !== selectedLine.lineCoords.length) {
      if (arr[i][X] === arr[i + 1][X]) {
        let len = Math.abs(arr[i][Y] - arr[i + 1][Y]);
        console.log(len, 2);

        if (len > MIN_LEN_FOR_SECTION) {
          let begin = Math.min(arr[i][Y], arr[i + 1][Y]);

          cx = arr[i][X];
          cy = begin + len / 2;
          point.setAttribute("cx", cx);
          point.setAttribute("cy", cy);
          points.push(point);
          point.classList.add("point");
          point.setAttribute("data-begin", i);
          point.setAttribute("data-end", i + 1);
        }
      } if (arr[i][Y] === arr[i + 1][Y]) {
        let len = Math.abs(arr[i][X] - arr[i + 1][X]);

        console.log(len, 1);
        if (len > MIN_LEN_FOR_SECTION) {
          let begin = Math.min(arr[i][X], arr[i + 1][X]);

          cy = arr[i][Y];
          cx = begin + len / 2;
          point.setAttribute("cx", cx);
          point.setAttribute("cy", cy);
          points.push(point);
          point.classList.add("point");
          point.setAttribute("data-begin", i);
          point.setAttribute("data-end", i + 1);
        }
      }
    }
  });

  pathsD = pathsD.trim();
  path.setAttribute("d", pathsD);

  selectedLineEl.appendChild(path);
  selectedLineEl.classList.add("selected-line");

  points.forEach(el => {
    selectedLineEl.appendChild(el);
  });

  return selectedLineEl;
}