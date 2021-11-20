const ARROWS_LENGTH = 10; // length of head in pixels
const PX_FROM_SIDE = 15; // indent from borders in px
const MIN_MARGIN_FROM_BORDER = 3;  // MIN indent from borders in px

const drawArrows = (ctx, x, y, x2, y2, rects = null, lineCoords = []) => {
  let headLen = ARROWS_LENGTH;
  let differenceX = Math.abs(x2 - x);
  let differenceY = Math.abs(y2 - y);
  lineCoords.splice(0, lineCoords.length);

  let angle = Math.atan2(0, differenceX / 2);

  ctx.moveTo(x, y);
  lineCoords.push([x, y]);

  if (rects && (rects.fromRect || rects.toRect)) {
    let fromRect = rects.fromRect;
    let toRect = rects.toRect;
    let fromSide = rects.fromSide;
    let toSide = rects.toSide;
    
    if (fromRect && !toRect) {
      if (x2 > x) {
        let length = fromRect.x2 - x + PX_FROM_SIDE <= differenceX ?
                     fromRect.x2 - x + PX_FROM_SIDE : differenceX;
        
        if (fromSide === "left") {
          let needToUp = y2 <= y; 

          lineCoords.push([x - PX_FROM_SIDE, y]);

          if (x2 <= x + fromRect.width + PX_FROM_SIDE) {
            if (needToUp) {
              let lineYFromRectY = y - fromRect.y + PX_FROM_SIDE;
              lineCoords.push([x - PX_FROM_SIDE, y - lineYFromRectY]);
              lineCoords.push([x + length, y - lineYFromRectY]);
            } else {
              let lineYFromRectY = fromRect.y2 - y + PX_FROM_SIDE;
              lineCoords.push([x - PX_FROM_SIDE, y + lineYFromRectY]);
              lineCoords.push([x + length, y + lineYFromRectY]);
            }
            angle = Math.atan2(y2 + differenceY / 2, 0);
          } else {
            if (needToUp) {
              let lineYFromRectY = y - fromRect.y + PX_FROM_SIDE;
              if (y2 >= fromRect.y && y2 <= fromRect.y2) {
                lineCoords.push([x - PX_FROM_SIDE, y - lineYFromRectY]);
                lineCoords.push([x + fromRect.width + PX_FROM_SIDE, y - lineYFromRectY]);
                lineCoords.push([x + fromRect.width + PX_FROM_SIDE, y2]);
              } else {
                lineCoords.push([x - PX_FROM_SIDE, y2]);
              }
            } else {
              let lineYFromRectY = fromRect.y2 - y + PX_FROM_SIDE;
              
              if (y2 >= fromRect.y && y2 <= fromRect.y2) {
                lineCoords.push([x - PX_FROM_SIDE, y + lineYFromRectY]);
                lineCoords.push([x + fromRect.width + PX_FROM_SIDE, y + lineYFromRectY]);
                lineCoords.push([x + fromRect.width + PX_FROM_SIDE, y2]);
              } else {
                lineCoords.push([x - PX_FROM_SIDE, y2]);
              }
            }
          }

        } else if (fromSide === "top") {
          let needToUp = y2 <= y; 
          let length = fromRect.x2 - x >= differenceX / 2 ?
          fromRect.x2 - x + PX_FROM_SIDE : differenceX / 2;

          if (differenceY >= differenceX) {
            if (needToUp) {
              lineCoords.push([x, y - differenceY / 2]);
              lineCoords.push([x2, y - differenceY / 2]);
              angle = Math.atan2(y2 + differenceY / 2, 0);
            } else {
              lineCoords.push([x, y - PX_FROM_SIDE]);
              if (x2 <= fromRect.x2 + PX_FROM_SIDE) {
                lineCoords.push([x + length, y - PX_FROM_SIDE]);
                lineCoords.push([x + length, y + fromRect.height + PX_FROM_SIDE * 2]);
                lineCoords.push([x2, y + fromRect.height + PX_FROM_SIDE * 2]);
                angle = Math.atan2(y2 + differenceY / 2, 0);
              } else {
                lineCoords.push([x + length, y - PX_FROM_SIDE]);
                lineCoords.push([x + length, y2]);
                angle = Math.atan2(0, x2 - x + differenceX / 2);
              }
            }
          } else {
            lineCoords.push([x, y - PX_FROM_SIDE]);
            lineCoords.push([x + length, y - PX_FROM_SIDE]);
            lineCoords.push([x + length, y2]);
          }
        } else if (fromSide === "right") {
          lineCoords.push([x + differenceX / 2, y]);
          lineCoords.push([x + differenceX / 2, y2]);
        } else if (fromSide === "bottom") {
          let needToUp = y2 <= y; 
          let length = fromRect.x2 - x >= differenceX / 2 ?
                       fromRect.x2 - x + PX_FROM_SIDE : differenceX / 2;

          if (differenceY >= differenceX) {
            if (needToUp) {
              lineCoords.push([x, y + PX_FROM_SIDE]);
              if (x2 <= fromRect.x2 + PX_FROM_SIDE) {
                lineCoords.push([x + length, y + PX_FROM_SIDE]);
                lineCoords.push([x + length, y - fromRect.height - PX_FROM_SIDE * 2]);
                lineCoords.push([x2, y - fromRect.height - PX_FROM_SIDE * 2]);
                angle = Math.atan2(y2 + differenceY / 2, 0);
              } else {
                lineCoords.push([x + length, y + PX_FROM_SIDE]);
                lineCoords.push([x + length, y2]);
                angle = Math.atan2(0, x2 - x + differenceX / 2);
              }
            } else {
              lineCoords.push([x, y + differenceY / 2]);
              lineCoords.push([x2, y + differenceY / 2]);
              angle = Math.atan2(y2 + differenceY / 2, 0);
            }
          } else {
            lineCoords.push([x, y + PX_FROM_SIDE]);
            lineCoords.push([x + length, y + PX_FROM_SIDE]);
            lineCoords.push([x + length, y2]);
          }
        }
      } else if (x2 < x) {
        let length = x - fromRect.x + PX_FROM_SIDE <= differenceX ?
                     x - fromRect.x + PX_FROM_SIDE : differenceX;
        
        if (fromSide === "left") {
          lineCoords.push([x - differenceX / 2, y]);
          lineCoords.push([x - differenceX / 2, y2]);
        } else if (fromSide === "top") {
          let needToUp = y2 <= y; 
          let length = x - fromRect.x >= differenceX / 2 ?
          x - fromRect.x + PX_FROM_SIDE : differenceX / 2;

          if (differenceY >= differenceX) {
            if (needToUp) {
              lineCoords.push([x, y - differenceY / 2]);
              lineCoords.push([x2, y - differenceY / 2]);
              angle = Math.atan2(y2 + differenceY / 2, 0);
            } else {
              lineCoords.push([x, y - PX_FROM_SIDE]);
              if (x2 <= fromRect.x2 + PX_FROM_SIDE) {
                lineCoords.push([x - length, y - PX_FROM_SIDE]);
                lineCoords.push([x - length, y + fromRect.height + PX_FROM_SIDE * 2]);
                lineCoords.push([x2, y + fromRect.height + PX_FROM_SIDE * 2]);
                angle = Math.atan2(y2 + differenceY / 2, 0);
              } else {
                lineCoords.push([x - length, y - PX_FROM_SIDE]);
                lineCoords.push([x - length, y2]);
                angle = Math.atan2(0, x2 - x - differenceX / 2);
              }
            }
          } else {
            lineCoords.push([x, y - PX_FROM_SIDE]);
            lineCoords.push([x - length, y - PX_FROM_SIDE]);
            lineCoords.push([x - length, y2]);
          }
        } else if (fromSide === "right") {
          let needToUp = y2 <= y; 

          lineCoords.push([x + PX_FROM_SIDE, y]);

          if (x2 >= fromRect.x2 - fromRect.width - PX_FROM_SIDE) {
            if (needToUp) {
              let lineYFromRectY = y - fromRect.y + PX_FROM_SIDE;
              lineCoords.push([x + PX_FROM_SIDE, y - lineYFromRectY]);
              lineCoords.push([x - length, y - lineYFromRectY]);
            } else {
              let lineYFromRectY = fromRect.y2 - y + PX_FROM_SIDE;
              lineCoords.push([x + PX_FROM_SIDE, y + lineYFromRectY]);
              lineCoords.push([x - length, y + lineYFromRectY]);
            }
            angle = Math.atan2(y2 + differenceY / 2, 0);
          } else {
            if (needToUp) {
              let lineYFromRectY = y - fromRect.y + PX_FROM_SIDE;
              if (y2 >= fromRect.y && y2 <= fromRect.y2) {
                lineCoords.push([x + PX_FROM_SIDE, y - lineYFromRectY]);
                lineCoords.push([x - fromRect.width - PX_FROM_SIDE, y - lineYFromRectY]);
                lineCoords.push([x - fromRect.width - PX_FROM_SIDE, y2]);
              } else {
                lineCoords.push([x + PX_FROM_SIDE, y2]);
              }
            } else {
              let lineYFromRectY = fromRect.y2 - y + PX_FROM_SIDE;
              
              if (y2 >= fromRect.y && y2 <= fromRect.y2) {
                lineCoords.push([x + PX_FROM_SIDE, y + lineYFromRectY]);
                lineCoords.push([x - fromRect.width - PX_FROM_SIDE, y + lineYFromRectY]);
                lineCoords.push([x - fromRect.width - PX_FROM_SIDE, y2]);
              } else {
                lineCoords.push([x + PX_FROM_SIDE, y2]);
              }
            }
          }

          lineCoords.push([x2, y2])
        } else if (fromSide === "bottom") {
          let needToUp = y2 <= y; 
          let length = x - fromRect.x >= differenceX / 2 ?
                       x - fromRect.x + PX_FROM_SIDE : differenceX / 2;

          if (differenceY >= differenceX) {
            if (needToUp) {
              lineCoords.push([x, y + PX_FROM_SIDE]);
              if (x2 <= fromRect.x2 + PX_FROM_SIDE) {
                lineCoords.push([x - length, y + PX_FROM_SIDE]);
                lineCoords.push([x - length, y - fromRect.height - PX_FROM_SIDE * 2]);
                lineCoords.push([x2, y - fromRect.height - PX_FROM_SIDE * 2]);
                angle = Math.atan2(y2 + differenceY / 2, 0);
              } else {
                lineCoords.push([x - length, y + PX_FROM_SIDE]);
                lineCoords.push([x - length, y2]);
                angle = Math.atan2(0, x2 - x + differenceX / 2);
              }
            } else {
              lineCoords.push([x, y + differenceY / 2]);
              lineCoords.push([x2, y + differenceY / 2]);
              angle = Math.atan2(y2 + differenceY / 2, 0);
            }
          } else {
            lineCoords.push([x, y + PX_FROM_SIDE]);
            lineCoords.push([x - length, y + PX_FROM_SIDE]);
            lineCoords.push([x - length, y2]);
          }
        }
      }
    } else if (toRect && !fromRect) {
      if (x2 > x) {
        let length = x + differenceX / 2 >= toRect.x - PX_FROM_SIDE ?
                     toRect.x - x - PX_FROM_SIDE : differenceX / 2;

        if (toSide === "left") {
          lineCoords.push([x + differenceX / 2, y]);
          lineCoords.push([x + differenceX / 2, y2]);
        } else if (toSide === "top") {
          let needToUp = y2 <= y + PX_FROM_SIDE;
          if (needToUp) {
            lineCoords.push([x + length, y]);
            lineCoords.push([x + length, y2 - PX_FROM_SIDE]);
            lineCoords.push([x2, y2 - PX_FROM_SIDE]);
          } else {
            lineCoords.push([x2, y]);
          }
          angle = Math.atan2(PX_FROM_SIDE, 0);
          if (y2 <= y) {
            angle = Math.atan2(-PX_FROM_SIDE, 0);
          }
        } else if (toSide === "right") {
          let needToUp = y2 <= y;

          if (y >= toRect.y && y <= toRect.y2) {
            let lengthToRect = toRect.x - x - PX_FROM_SIDE;
            lineCoords.push([x + lengthToRect, y]);

            if (needToUp) {
              lineCoords.push([x + lengthToRect, toRect.y - PX_FROM_SIDE]);
              lineCoords.push([toRect.x2 + PX_FROM_SIDE, toRect.y - PX_FROM_SIDE]);
              lineCoords.push([toRect.x2 + PX_FROM_SIDE, y2]);
            } else {
              lineCoords.push([x + lengthToRect, toRect.y2 + PX_FROM_SIDE]);
              lineCoords.push([toRect.x2 + PX_FROM_SIDE, toRect.y2 + PX_FROM_SIDE]);
              lineCoords.push([toRect.x2 + PX_FROM_SIDE, y2]);
            }
          } else {
            lineCoords.push([x2 + PX_FROM_SIDE, y]);
            lineCoords.push([x2 + PX_FROM_SIDE, y2]);
          }
          angle = Math.atan2(0, -PX_FROM_SIDE);
        } else if (toSide === "bottom") {
          let needToUp = y2 <= y - PX_FROM_SIDE;
          if (needToUp) {
            lineCoords.push([x2, y]);
          } else {
            lineCoords.push([x + length, y]);
            lineCoords.push([x + length, y2 + PX_FROM_SIDE]);
            lineCoords.push([x2, y2 + PX_FROM_SIDE]);
          }
          angle = Math.atan2(-PX_FROM_SIDE, 0)
          if (y2 <= y) {
            angle = Math.atan2(PX_FROM_SIDE, 0)
          }
        }
      } else if (x2 <= x) {
          let length = x - differenceX / 2 <= toRect.x2 + PX_FROM_SIDE ?
                       x - toRect.x2 - PX_FROM_SIDE : differenceX / 2;

        if (toSide === "right") {
          lineCoords.push([x - differenceX / 2, y]);
          lineCoords.push([x - differenceX / 2, y2]);
        } else if (toSide === "top") {
          let needToUp = y2 <= y + PX_FROM_SIDE;
          if (needToUp) {
            lineCoords.push([x - length, y]);
            lineCoords.push([x - length, y2 - PX_FROM_SIDE]);
            lineCoords.push([x2, y2 - PX_FROM_SIDE]);
            
          } else {
            lineCoords.push([x2, y]);
          }
          angle = Math.atan2(PX_FROM_SIDE, 0);
          if (y2 <= y) {
            angle = Math.atan2(-PX_FROM_SIDE, 0)
          }
        } else if (toSide === "left") {
          let needToUp = y2 <= y;

          if (y >= toRect.y && y <= toRect.y2) {
            let lengthToRect = x - toRect.x2 - PX_FROM_SIDE;
            lineCoords.push([x - lengthToRect, y]);

            if (needToUp) {
              lineCoords.push([x - lengthToRect, toRect.y - PX_FROM_SIDE]);
              lineCoords.push([toRect.x - PX_FROM_SIDE, toRect.y - PX_FROM_SIDE]);
              lineCoords.push([toRect.x - PX_FROM_SIDE, y2]);
            } else {
              lineCoords.push([x - lengthToRect, toRect.y2 + PX_FROM_SIDE]);
              lineCoords.push([toRect.x - PX_FROM_SIDE, toRect.y2 + PX_FROM_SIDE]);
              lineCoords.push([toRect.x - PX_FROM_SIDE, y2]);
            }
          } else {
            lineCoords.push([x2 - PX_FROM_SIDE, y]);
            lineCoords.push([x2 - PX_FROM_SIDE, y2]);
          }
          angle = Math.atan2(0, -PX_FROM_SIDE);
        } else if (toSide === "bottom") {
          let needToUp = y2 <= y - PX_FROM_SIDE;
          if (!needToUp) {
            lineCoords.push([x - length, y]);
            lineCoords.push([x - length, y2 + PX_FROM_SIDE]);
            lineCoords.push([x2, y2 + PX_FROM_SIDE]);
          } else {
            lineCoords.push([x2, y]);
          }
          angle = Math.atan2(-PX_FROM_SIDE, 0);
          if (y2 <= y) {
            angle = Math.atan2(PX_FROM_SIDE, 0);
          }
        }
      }
    } else if (fromRect && toRect) {

      let toCoordsInFromRect = (
        x2 >= fromRect.x && x2 <= fromRect.x2 &&
        y2 >= fromRect.y && y2 <= fromRect.y2
      )
      if (toCoordsInFromRect) {
        angle = Math.atan2(Math.abs(y2 - y), Math.abs(x2 - x));
      } else {

// ******************FROM RECTANGLE TO RECTANLGE WHEN X2 > X 
        if (x2 > x) {
          let marginFromBorder = toRect.x - fromRect.x2 >= PX_FROM_SIDE * 2 ?
                                 PX_FROM_SIDE : MIN_MARGIN_FROM_BORDER;
          let needToUp = y2 <= y;

          if (fromSide === "left") {
            lineCoords.push([x - PX_FROM_SIDE, y]);
            let height = y2 <= fromRect.y - PX_FROM_SIDE ?
                         y - y2 : y - fromRect.y + PX_FROM_SIDE;

            if (toSide === "left") {
                if (needToUp) {
                  lineCoords.push([x - PX_FROM_SIDE, y - height]);
                  if (y - height !== y2) {
                    lineCoords.push([toRect.x - marginFromBorder, y - height]);
                    lineCoords.push([toRect.x - marginFromBorder, y2]);
                  }
                } else {
                  height = y2 >= fromRect.y2 + PX_FROM_SIDE ?
                           y2 - y : fromRect.y2 - y + PX_FROM_SIDE;
                  lineCoords.push([x - PX_FROM_SIDE, y + height]);
                  if (y + height !== y2) {
                    lineCoords.push([toRect.x - marginFromBorder, y + height]);
                    lineCoords.push([toRect.x - marginFromBorder, y2]);
                  }
                }
            } else if (toSide === "top") {
              let fromRectYHigher = fromRect.y <= toRect.y;
              let fromRectY2Higher = fromRect.y2 <= toRect.y;       
              if (needToUp) {
                if (fromRectYHigher) {
                  lineCoords.push([x - PX_FROM_SIDE, fromRect.y - PX_FROM_SIDE]);
                  lineCoords.push([x2, fromRect.y - PX_FROM_SIDE]);
                } else {
                  let needToX = fromRect.x <= toRect.x ? fromRect : toRect;
                  lineCoords.splice(0, 1);
                  lineCoords.push([needToX.x - PX_FROM_SIDE, y]);
                  lineCoords.push([needToX.x - PX_FROM_SIDE, toRect.y - PX_FROM_SIDE]);
                  lineCoords.push([x2, toRect.y - PX_FROM_SIDE]);
                }
              } else {
                if (fromRectY2Higher) {
                  let marginFromBorder = toRect.y - fromRect.y2 >= PX_FROM_SIDE * 2 ? PX_FROM_SIDE : MIN_MARGIN_FROM_BORDER;
                  lineCoords.push([x - PX_FROM_SIDE, fromRect.y2 + marginFromBorder]);
                  lineCoords.push([x2, fromRect.y2 + marginFromBorder]);
                } else {
                  lineCoords.push([x - PX_FROM_SIDE, fromRect.y2 + PX_FROM_SIDE]);
                  lineCoords.push([toRect.x - marginFromBorder, fromRect.y2 + PX_FROM_SIDE]);
                  lineCoords.push([toRect.x - marginFromBorder, toRect.y - PX_FROM_SIDE]);
                  lineCoords.push([x2, toRect.y - PX_FROM_SIDE]);
                }
          lineCoords.push([x2, toRect.y - PX_FROM_SIDE]);
              }
            } else if (toSide === "right") {
              let higherRect = fromRect.y < toRect.y ? fromRect : toRect;
              if (needToUp) {
                let fromRectLower = fromRect.y >= toRect.y2 + PX_FROM_SIDE;

                if (fromRectLower) {
                  lineCoords.push([x - PX_FROM_SIDE, toRect.y2 + PX_FROM_SIDE]);
                  lineCoords.push([toRect.x2 + PX_FROM_SIDE, toRect.y2 + PX_FROM_SIDE]);
                  lineCoords.push([toRect.x2 + PX_FROM_SIDE, y2]);
                } else {
                  let needToX = fromRect.x <= toRect.x ? fromRect : toRect;
                  lineCoords.push([needToX.x - PX_FROM_SIDE, y]);
                  lineCoords.push([needToX.x - PX_FROM_SIDE, higherRect.y - PX_FROM_SIDE]);
                  lineCoords.push([toRect.x2 + PX_FROM_SIDE, higherRect.y - PX_FROM_SIDE]);
                  lineCoords.push([toRect.x2 + PX_FROM_SIDE, y2]);
                }
              } else {
                let fromRectUpper = fromRect.y2 <= toRect.y - PX_FROM_SIDE;
                if (fromRectUpper) {
                  lineCoords.push([x - PX_FROM_SIDE, toRect.y - PX_FROM_SIDE]);
                  lineCoords.push([toRect.x2 + PX_FROM_SIDE, toRect.y - PX_FROM_SIDE]);
                  lineCoords.push([toRect.x2 + PX_FROM_SIDE, y2]);
                } else {
                  let needToX = fromRect.x2 >= toRect.x2 ? fromRect : toRect;
                  lineCoords.push([x - PX_FROM_SIDE, higherRect.y - PX_FROM_SIDE]);
                  lineCoords.push([needToX.x2 + PX_FROM_SIDE, higherRect.y - PX_FROM_SIDE]);
                  lineCoords.push([needToX.x2 + PX_FROM_SIDE, y2]);
                }
              }
              angle = Math.atan2(0, -PX_FROM_SIDE);
            } else if (toSide === "bottom") {
              let fromRectLower = fromRect.y >= toRect.y2;
              let lowerY2Rect = fromRect.y2 > toRect.y2 ? fromRect : toRect;
              let needTo = fromRect.x <= toRect.x ? fromRect : toRect;

              if (fromRectLower) {
                let marginFromBorder = fromRect.y - toRect.y2 >= PX_FROM_SIDE * 2 ? PX_FROM_SIDE : MIN_MARGIN_FROM_BORDER;
                lineCoords.push([fromRect.x - PX_FROM_SIDE, toRect.y2 + marginFromBorder]);
                lineCoords.push([x2, toRect.y2 + marginFromBorder]);
              } else {
                lineCoords.splice(0, 1);
                lineCoords.push([needTo.x - PX_FROM_SIDE, y]);
                lineCoords.push([needTo.x - PX_FROM_SIDE, lowerY2Rect.y2 + PX_FROM_SIDE]);
                lineCoords.push([x2, lowerY2Rect.y2 + PX_FROM_SIDE]);
              }
            }
          } else if (fromSide === "top") {
            let fromRectLower = fromRect.y >= toRect.y2;
            
            if (toSide === "left") {
              if (fromRectLower) {
                lineCoords.push([x, y2]);
              } else {
                if (x2 >= fromRect.x2) { 
                  lineCoords.push([x, y - PX_FROM_SIDE]);
                  lineCoords.push([toRect.x - marginFromBorder, y - PX_FROM_SIDE]);
                  lineCoords.push([toRect.x - marginFromBorder, y2]);
                } else {
                  lineCoords.push([x, y - PX_FROM_SIDE]);
                  lineCoords.push([fromRect.x - PX_FROM_SIDE, y - PX_FROM_SIDE]);
                  lineCoords.push([fromRect.x - PX_FROM_SIDE, y2]);
                }
              }
            } else if (toSide === "top") {
              let xUnderOrOnToRect = x >= toRect.x - PX_FROM_SIDE && x <= toRect.x2; 
              if (fromRectLower) {
                if (xUnderOrOnToRect) {
                  let needTo = x - toRect.x <= toRect.x2 - x ? toRect.x - PX_FROM_SIDE : toRect.x2 + PX_FROM_SIDE;
                  let marginFromBorder = fromRect.y - toRect.y2 >= PX_FROM_SIDE + 5 ? PX_FROM_SIDE : MIN_MARGIN_FROM_BORDER;
                  
                  lineCoords.push([x, y - marginFromBorder]);
                  lineCoords.push([needTo, y - marginFromBorder]);
                  lineCoords.push([needTo, toRect.y - PX_FROM_SIDE]);
                  lineCoords.push([x2, toRect.y - PX_FROM_SIDE]);
                } else {
                  lineCoords.push([x, toRect.y - PX_FROM_SIDE]);
                  lineCoords.push([x2, toRect.y - PX_FROM_SIDE]);
                }
              } else {
                let marginFromBorder = toRect.y - fromRect.y2 >= PX_FROM_SIDE + 5 ? PX_FROM_SIDE : MIN_MARGIN_FROM_BORDER;
                if (xUnderOrOnToRect) {
                  let needTo = x - fromRect.x <= fromRect.x2 - x ? fromRect.x - PX_FROM_SIDE : fromRect.x2 + PX_FROM_SIDE;
                  lineCoords.push([x, y - PX_FROM_SIDE]);
                  lineCoords.push([needTo, y - PX_FROM_SIDE]);
                  lineCoords.push([needTo, toRect.y - marginFromBorder]);
                  lineCoords.push([x2, toRect.y - marginFromBorder]);
                } else {
                  if (x2 <= fromRect.x2 + PX_FROM_SIDE) {
                    lineCoords.push([x, y - PX_FROM_SIDE]);
                    lineCoords.push([fromRect.x2 + PX_FROM_SIDE, y - PX_FROM_SIDE]);
                    lineCoords.push([fromRect.x2 + PX_FROM_SIDE, toRect.y - marginFromBorder]);
                    lineCoords.push([x2, toRect.y - marginFromBorder]);
                  } else {
                    if (fromRect.y <= toRect.y) {
                      lineCoords.push([x, fromRect.y - PX_FROM_SIDE]);
                      lineCoords.push([x2, fromRect.y - PX_FROM_SIDE]);
                    } else {
                      lineCoords.push([x, toRect.y - PX_FROM_SIDE]);
                      lineCoords.push([x2, toRect.y - PX_FROM_SIDE]);
                    }
                    
                  }
                }
                
              }
            } else if (toSide === "right") {
              
              if (fromRectLower) {
                let marginFromBorder = fromRect.y - toRect.y2 >= PX_FROM_SIDE + 5 ? PX_FROM_SIDE : MIN_MARGIN_FROM_BORDER;
                lineCoords.push([x, y - marginFromBorder]);
                lineCoords.push([x2 + PX_FROM_SIDE, y - marginFromBorder]);
                lineCoords.push([x2 + PX_FROM_SIDE, y2]);
              } else {
                lineCoords.push([x, y - PX_FROM_SIDE]);
                if (x2 <= fromRect.x2 + PX_FROM_SIDE) {
                  lineCoords.push([fromRect.x2 + PX_FROM_SIDE, y - PX_FROM_SIDE]);
                  lineCoords.push([fromRect.x2 + PX_FROM_SIDE, y2]);
                  lineCoords.push([x2 + PX_FROM_SIDE, y2]);
                } else {
                  if (fromRect.y <= toRect.y) {
                    lineCoords.push([toRect.x2 + PX_FROM_SIDE, y - PX_FROM_SIDE]);
                    lineCoords.push([toRect.x2 + PX_FROM_SIDE, y2]);
                  } else {
                    lineCoords.push([x, toRect.y - PX_FROM_SIDE]);
                    lineCoords.push([x2 + PX_FROM_SIDE, toRect.y - PX_FROM_SIDE]);
                    lineCoords.push([x2 + PX_FROM_SIDE, y2]);
                  }
                }
              }
            } else if (toSide === "bottom") {
              if (fromRectLower) {
                if (x !== x2) {
                  let marginFromBorder = fromRect.y - toRect.y2 > PX_FROM_SIDE * 2 ? PX_FROM_SIDE : MIN_MARGIN_FROM_BORDER;
                  lineCoords.push([x, toRect.y2 + marginFromBorder]);
                  lineCoords.push([x2, toRect.y2 + marginFromBorder]);
                }
              } else {
                if (x >= toRect.x && x <= toRect.x2 || fromRect.y > toRect.y2) {
                  let needTo = toRect.x2 > fromRect.x2 ? toRect.x2 + PX_FROM_SIDE : fromRect.x2 + PX_FROM_SIDE;
                  lineCoords.push([x, y - PX_FROM_SIDE]);
                  lineCoords.push([needTo, y - PX_FROM_SIDE]);
                  lineCoords.push([needTo, y2 + PX_FROM_SIDE]);
                  lineCoords.push([x2, y2 + PX_FROM_SIDE]);
                } else {
                  if (fromRect.y <= toRect.y) {
                    let lowerRect = fromRect.y2 >= toRect.y2 ? fromRect : toRect;
                    lineCoords.push([x, y - PX_FROM_SIDE]);
                    lineCoords.push([fromRect.x - PX_FROM_SIDE, y - PX_FROM_SIDE]);
                    lineCoords.push([fromRect.x - PX_FROM_SIDE, lowerRect.y2 + PX_FROM_SIDE]);
                    lineCoords.push([x2, lowerRect.y2 + PX_FROM_SIDE]);
                  } else {
                    lineCoords.push([x, toRect.y - PX_FROM_SIDE]);
                    lineCoords.push([toRect.x2 + PX_FROM_SIDE, toRect.y - PX_FROM_SIDE]);
                    lineCoords.push([toRect.x2 + PX_FROM_SIDE, y2 + PX_FROM_SIDE]);
                    lineCoords.push([x2, y2 + PX_FROM_SIDE]);
                  }
                }
              }
            }
            
          } else if (fromSide === "right") {
            let fromRectUpper = fromRect.y2 <= toRect.y;

            if (toSide === "left") {
              if (x !== x2) {
                lineCoords.push([x + differenceX / 2, y]);
                lineCoords.push([x + differenceX / 2, y2]);
              }
            } else if (toSide === "top") {
              if (fromRectUpper) {
                lineCoords.push([x2, y]);
              } else {
                if (x >= toRect.x && x <= toRect.x2) {
                  lineCoords.push([toRect.x2 + PX_FROM_SIDE, y]);
                  lineCoords.push([toRect.x2 + PX_FROM_SIDE, toRect.y - PX_FROM_SIDE]);
                  lineCoords.push([x2, toRect.y - PX_FROM_SIDE]);
                } else {
                  let marginFromBorder = toRect.x - fromRect.x2 >= PX_FROM_SIDE * 2 ? PX_FROM_SIDE : MIN_MARGIN_FROM_BORDER;
                  lineCoords.push([x + marginFromBorder, y]);
                  lineCoords.push([x + marginFromBorder, toRect.y - PX_FROM_SIDE]);
                  lineCoords.push([x2, toRect.y - PX_FROM_SIDE]);
                }
              }
            } else if (toSide === "right") {
              if (y >= toRect.y - PX_FROM_SIDE && y <= toRect.y2) {
                let marginFromBorder = toRect.x - fromRect.x2 >= PX_FROM_SIDE * 2 ? PX_FROM_SIDE : 4;
                lineCoords.push([x + marginFromBorder, y]);
                lineCoords.push([x + marginFromBorder, toRect.y - PX_FROM_SIDE]);
                lineCoords.push([x2 + PX_FROM_SIDE, toRect.y - PX_FROM_SIDE]);
                lineCoords.push([x2 + PX_FROM_SIDE, y2]);
              } else {
                lineCoords.push([x2 + PX_FROM_SIDE, y]);
                lineCoords.push([x2 + PX_FROM_SIDE, y2]);
              }
            } else if (toSide === "bottom") {
              let xLowerThanToRect = y > toRect.y2;
              if (xLowerThanToRect) {
                lineCoords.push([x2, y]);
              } else {
                if (y >= toRect.y - PX_FROM_SIDE * 2 && y <= toRect.y2) {
                  let marginFromBorder = toRect.x - fromRect.x2 >= PX_FROM_SIDE * 2 ? PX_FROM_SIDE : MIN_MARGIN_FROM_BORDER;
                  lineCoords.push([x + marginFromBorder, y]);
                  lineCoords.push([x + marginFromBorder, y2 + PX_FROM_SIDE]);
                  lineCoords.push([x2, y2 + PX_FROM_SIDE]);
                } else {
                  lineCoords.push([toRect.x2 + PX_FROM_SIDE, y]);
                  lineCoords.push([toRect.x2 + PX_FROM_SIDE, y2 + PX_FROM_SIDE]);
                  lineCoords.push([x2, y2 + PX_FROM_SIDE]);
                }
              }
            }
          } else if (fromSide === "bottom") {
            if (toSide === "left") {
              let xHigherThanX2 = y < y2;

              if (xHigherThanX2) {
                lineCoords.push([x, y2]);
              } else {
                lineCoords.push([x, y + PX_FROM_SIDE]);
                if (fromRect.x2 >= toRect.x) {
                  lineCoords.push([fromRect.x - PX_FROM_SIDE, y + PX_FROM_SIDE]);
                  lineCoords.push([fromRect.x - PX_FROM_SIDE, y2]);
                } else {
                  let marginFromBorder = toRect.x - fromRect.x2 >= PX_FROM_SIDE * 2 ? PX_FROM_SIDE : MIN_MARGIN_FROM_BORDER;
                  lineCoords.push([x2 - marginFromBorder, y + PX_FROM_SIDE]);
                  lineCoords.push([x2 - marginFromBorder, y2]);
                }
              }
            } else if (toSide === "top") {
              let fromRectUpper = fromRect.y2 <= toRect.y;

              if (fromRectUpper) {
                let marginFromBorder = toRect.y - fromRect.y2 >= PX_FROM_SIDE * 2 ? PX_FROM_SIDE : MIN_MARGIN_FROM_BORDER;
                lineCoords.push([x, y + marginFromBorder]);
                lineCoords.push([x2, y + marginFromBorder]);
              } else {
                let needToY = fromRect.y <= toRect.y ? fromRect : toRect;
                let needToX = fromRect.x < toRect.x ? fromRect : toRect;
                lineCoords.push([x, y + PX_FROM_SIDE]);
                lineCoords.push([needToX.x - PX_FROM_SIDE, y + PX_FROM_SIDE]);
                lineCoords.push([needToX.x - PX_FROM_SIDE, needToY.y - PX_FROM_SIDE]);
                lineCoords.push([x2, needToY.y - PX_FROM_SIDE]);
              }
            } else if (toSide === "right") {
              let fromRectUpper = fromRect.y2 <= toRect.y;

              if (fromRectUpper) {
                let marginFromBorder = toRect.y - fromRect.y2 >= PX_FROM_SIDE * 2 ? PX_FROM_SIDE : MIN_MARGIN_FROM_BORDER;
                lineCoords.push([x, y + marginFromBorder]);
                lineCoords.push([toRect.x2 + PX_FROM_SIDE, y + marginFromBorder]);
                lineCoords.push([toRect.x2 + PX_FROM_SIDE, y2]);
              } else {
                let needToY = fromRect.y2 >= toRect.y2 ? fromRect : toRect;
                let needToX = fromRect.x2 >= toRect.x2 ? fromRect : toRect;
                lineCoords.push([x, needToY.y2 + PX_FROM_SIDE]);
                lineCoords.push([needToX.x2 + PX_FROM_SIDE, needToY.y2 + PX_FROM_SIDE]);
                lineCoords.push([needToX.x2 + PX_FROM_SIDE, y2]);
              }
            } else if (toSide === "bottom") {
              let xLowerThanToRect = y >= toRect.y2 + PX_FROM_SIDE;
              if (xLowerThanToRect) {
                lineCoords.push([x, y + PX_FROM_SIDE]);
                if (x2 >= fromRect.x && x2 <= fromRect.x2) {
                  let marginFromBorder = fromRect.y - toRect.y2 >= PX_FROM_SIDE * 2 ? PX_FROM_SIDE : MIN_MARGIN_FROM_BORDER;
                  lineCoords.push([fromRect.x2 + PX_FROM_SIDE, y + PX_FROM_SIDE]);
                  lineCoords.push([fromRect.x2 + PX_FROM_SIDE, y2 + marginFromBorder]);
                  lineCoords.push([x2, y2 + marginFromBorder]);
                } else {
                  lineCoords.push([x2, y + PX_FROM_SIDE]);
                }
              } else {
                if (x >= toRect.x - PX_FROM_SIDE * 2 && x <= toRect.x2) {
                  let marginFromBorder = toRect.y - fromRect.y2 >= PX_FROM_SIDE * 2 ? PX_FROM_SIDE : MIN_MARGIN_FROM_BORDER;
                  lineCoords.push([x, y + marginFromBorder]);
                  lineCoords.push([toRect.x2 + PX_FROM_SIDE, y + marginFromBorder]);
                  lineCoords.push([toRect.x2 + PX_FROM_SIDE, y2 + PX_FROM_SIDE]);
                  lineCoords.push([x2, y2 + PX_FROM_SIDE]);
                } else {
                  lineCoords.push([x, y2 + PX_FROM_SIDE]);
                  lineCoords.push([x2, y2 + PX_FROM_SIDE]);
                }
              }
            }
          }
        } else if (x2 <= x) {

// ******************FROM RECTANGLE TO RECTANLGE WHEN X2 <= X 
          if (fromSide === "left") {

            if (toSide === "left") {
              let toRectHigher = toRect.y2 <= y - PX_FROM_SIDE;
              let toRectLower = toRect.y >= y + PX_FROM_SIDE; 
              
              if (toRectHigher || toRectLower) {
                lineCoords.push([toRect.x - PX_FROM_SIDE, y]);
                lineCoords.push([toRect.x - PX_FROM_SIDE, y2]);
              } else {
                let marginFromBorder = fromRect.x - toRect.x2 >= PX_FROM_SIDE * 2 ? PX_FROM_SIDE : MIN_MARGIN_FROM_BORDER;
                lineCoords.push([x - marginFromBorder, y]);
                lineCoords.push([x - marginFromBorder, toRect.y2 + PX_FROM_SIDE]);
                lineCoords.push([x2 - PX_FROM_SIDE, toRect.y2 + PX_FROM_SIDE]);
                lineCoords.push([x2 - PX_FROM_SIDE, y2]);
              }
            } else if (toSide === "top") {
              let fromRectUpper = fromRect.y2 <= toRect.y;

              if (fromRectUpper) {
                lineCoords.push([x2, y]);
              } else {
                if (x >= toRect.x && x <= toRect.x2) {
                  lineCoords.push([toRect.x - PX_FROM_SIDE, y]);
                  lineCoords.push([toRect.x - PX_FROM_SIDE, toRect.y - PX_FROM_SIDE]);
                  lineCoords.push([x2, toRect.y - PX_FROM_SIDE]);
                } else {
                  let marginFromBorder = fromRect.x - toRect.x2 >= PX_FROM_SIDE * 2 ? PX_FROM_SIDE : MIN_MARGIN_FROM_BORDER;
                  lineCoords.push([x - marginFromBorder, y]);
                  lineCoords.push([x - marginFromBorder, toRect.y - PX_FROM_SIDE]);
                  lineCoords.push([x2, toRect.y - PX_FROM_SIDE]);
                }
              }
            } else if (toSide === "right") {
              if (x !== x2) {
                lineCoords.push([x - differenceX / 2, y]);
                lineCoords.push([x - differenceX / 2, y2]);
              }
            } else if (toSide === "bottom") {
              let xLowerThanToRect = y > toRect.y2;
              if (xLowerThanToRect) {
                lineCoords.push([x2, y]);
              } else {
                if (y >= toRect.y - PX_FROM_SIDE * 2 && y <= toRect.y2) {
                  let marginFromBorder = fromRect.x - toRect.x2 >= PX_FROM_SIDE * 2 ? PX_FROM_SIDE : MIN_MARGIN_FROM_BORDER;
                  lineCoords.push([x - marginFromBorder, y]);
                  lineCoords.push([x - marginFromBorder, y2 + PX_FROM_SIDE]);
                  lineCoords.push([x2, y2 + PX_FROM_SIDE]);
                } else {  
                  lineCoords.push([toRect.x - PX_FROM_SIDE, y]);
                  lineCoords.push([toRect.x - PX_FROM_SIDE, y2 + PX_FROM_SIDE]);
                  lineCoords.push([x2, y2 + PX_FROM_SIDE]);
                }
              }
            }
          } else if (fromSide === "top") {
            let fromRectLower = fromRect.y > toRect.y2;

            if (toSide === "left") {
              if (fromRectLower) {
                let marginFromBorder = fromRect.y - toRect.y2 >= PX_FROM_SIDE + 5 ? PX_FROM_SIDE : MIN_MARGIN_FROM_BORDER;
                lineCoords.push([x, y - marginFromBorder]);
                lineCoords.push([x2 - PX_FROM_SIDE, y - marginFromBorder]);
                lineCoords.push([x2 - PX_FROM_SIDE, y2]);
              } else {
                let higherRect = toRect.y <= fromRect.y ? toRect : fromRect;
                let needToX = fromRect.x <= toRect.x ? fromRect : toRect;
                lineCoords.push([x, higherRect.y - PX_FROM_SIDE]);
                lineCoords.push([needToX.x - PX_FROM_SIDE, higherRect.y - PX_FROM_SIDE]);
                lineCoords.push([needToX.x - PX_FROM_SIDE, y2]);
              }
            } else if (toSide === "top") {
              let xUnderOrOnToRect = x >= toRect.x - PX_FROM_SIDE && x <= toRect.x2;
              if (fromRectLower) {
                if (xUnderOrOnToRect) {
                  let needTo = x - toRect.x <= toRect.x2 - x ? toRect.x - PX_FROM_SIDE : toRect.x2 + PX_FROM_SIDE;
                  let marginFromBorder = fromRect.y - toRect.y2 >= PX_FROM_SIDE + 5 ? PX_FROM_SIDE : MIN_MARGIN_FROM_BORDER;
                  
                  lineCoords.push([x, y - marginFromBorder]);
                  lineCoords.push([needTo, y - marginFromBorder]);
                  lineCoords.push([needTo, toRect.y - PX_FROM_SIDE]);
                  lineCoords.push([x2, toRect.y - PX_FROM_SIDE]);
                } else {
                  lineCoords.push([x, toRect.y - PX_FROM_SIDE]);
                  lineCoords.push([x2, toRect.y - PX_FROM_SIDE]);
                }
              } else {
                let marginFromBorder = toRect.y - fromRect.y2 >= PX_FROM_SIDE + 5 ? PX_FROM_SIDE : MIN_MARGIN_FROM_BORDER;
                if (xUnderOrOnToRect) {
                  let needTo = x - fromRect.x <= fromRect.x2 - x ? fromRect.x - PX_FROM_SIDE : fromRect.x2 + PX_FROM_SIDE;
                  lineCoords.push([x, y - PX_FROM_SIDE]);
                  lineCoords.push([needTo, y - PX_FROM_SIDE]);
                  lineCoords.push([needTo, toRect.y - marginFromBorder]);
                  lineCoords.push([x2, toRect.y - marginFromBorder]);
                } else {
                  let higherRect = fromRect.y <= toRect.y ? fromRect : toRect;
                  lineCoords.push([x, higherRect.y - PX_FROM_SIDE]);
                  lineCoords.push([x2, higherRect.y - PX_FROM_SIDE]);
                }
              }

            } else if (toSide === "right") {
              if (y2 < y) {
                lineCoords.push([x, y2]);
              } else {
                if (y2 >= fromRect.y2) { 
                  lineCoords.push([x, y - PX_FROM_SIDE]);
                  lineCoords.push([fromRect.x2 + PX_FROM_SIDE, y - PX_FROM_SIDE]);
                  lineCoords.push([fromRect.x2 + PX_FROM_SIDE, y2]);
                } else {
                  let marginFromBorder = fromRect.x - toRect.x2 >= PX_FROM_SIDE * 2 ? PX_FROM_SIDE : MIN_MARGIN_FROM_BORDER; 
                  lineCoords.push([x, y - PX_FROM_SIDE]);
                  lineCoords.push([toRect.x2 + marginFromBorder, y - PX_FROM_SIDE]);
                  lineCoords.push([toRect.x2 + marginFromBorder, y2]);
                }
              }
              
            } else if (toSide === "bottom") {
              if (fromRectLower) {
                if (x !== x2) {
                  let marginFromBorder = fromRect.y - toRect.y2 > PX_FROM_SIDE * 2 ? PX_FROM_SIDE : MIN_MARGIN_FROM_BORDER;
                  lineCoords.push([x, toRect.y2 + marginFromBorder]);
                  lineCoords.push([x2, toRect.y2 + marginFromBorder]);
                }
              } else {  
                if (x >= toRect.x && x <= toRect.x2 || fromRect.y > toRect.y2
                    || toRect.x2 > fromRect.x - MIN_MARGIN_FROM_BORDER) {
                  let needTo = toRect.x2 > fromRect.x2 ? toRect.x2 + PX_FROM_SIDE : fromRect.x2 + PX_FROM_SIDE;
                  lineCoords.push([x, y - PX_FROM_SIDE]);
                  lineCoords.push([needTo, y - PX_FROM_SIDE]);
                  lineCoords.push([needTo, y2 + PX_FROM_SIDE]);
                  lineCoords.push([x2, y2 + PX_FROM_SIDE]);
                } else {
                  let marginFromBorder = fromRect.x - toRect.x2 >= PX_FROM_SIDE * 2 ? PX_FROM_SIDE : MIN_MARGIN_FROM_BORDER;
                  lineCoords.push([x, fromRect.y - PX_FROM_SIDE]);
                  lineCoords.push([fromRect.x - marginFromBorder, fromRect.y - PX_FROM_SIDE]);
                  lineCoords.push([fromRect.x - marginFromBorder, y2 + PX_FROM_SIDE]);
                  lineCoords.push([x2, y2 + PX_FROM_SIDE]);
                  
                }
              }
            }
            
          } else if (fromSide === "right") {
            lineCoords.push([x + PX_FROM_SIDE, y]);

            if (toSide === "left") {
              let toRectLower = toRect.y >= fromRect.y2 + PX_FROM_SIDE * 2;

              if (toRectLower) {
                lineCoords.push([x + PX_FROM_SIDE, fromRect.y2 + PX_FROM_SIDE]);
                lineCoords.push([toRect.x - PX_FROM_SIDE, fromRect.y2 + PX_FROM_SIDE]);
                lineCoords.push([toRect.x - PX_FROM_SIDE, y2]);
              } else {
                let needToX = fromRect.x <= toRect.x ? fromRect : toRect;
                let needToY = fromRect.y <= toRect.y ? fromRect : toRect;

                if (x >= toRect.x && x <= toRect.x2 + PX_FROM_SIDE) {
                  lineCoords.push([x + PX_FROM_SIDE, fromRect.y2 + PX_FROM_SIDE]);
                  lineCoords.push([needToX.x - PX_FROM_SIDE, fromRect.y2 + PX_FROM_SIDE]);
                  lineCoords.push([needToX.x - PX_FROM_SIDE, y2]);
                } else {
                  lineCoords.push([x + PX_FROM_SIDE, needToY.y - PX_FROM_SIDE]);
                  lineCoords.push([needToX.x - PX_FROM_SIDE, needToY.y - PX_FROM_SIDE]);
                  lineCoords.push([needToX.x - PX_FROM_SIDE, y2]);
                }
              }

            } else if (toSide === "top") {
              let toRectLower = toRect.y >= fromRect.y2;

              if (toRectLower) {
                let marginFromBorder = toRect.y - fromRect.y2 >= PX_FROM_SIDE * 2 ? PX_FROM_SIDE : MIN_MARGIN_FROM_BORDER;

                lineCoords.push([x + PX_FROM_SIDE, fromRect.y2 + marginFromBorder]);
                lineCoords.push([x2, fromRect.y2 + marginFromBorder]);
              } else {
                let needToX = fromRect.x2 >= toRect.x2 ? fromRect : toRect;
                let needToY = fromRect.y <= toRect.y ? fromRect : toRect;

                lineCoords.splice(0, 1);
                lineCoords.push([needToX.x2 + PX_FROM_SIDE, y]);
                lineCoords.push([needToX.x2 + PX_FROM_SIDE, needToY.y - PX_FROM_SIDE]);
                lineCoords.push([x2, needToY.y - PX_FROM_SIDE]);
              }
            } else if (toSide === "right") {
              if (y2 >= fromRect.y && y2 <= fromRect.y2) {
                let marginFromBorder = fromRect.x - toRect.x2 >= PX_FROM_SIDE * 2 ? PX_FROM_SIDE : MIN_MARGIN_FROM_BORDER;

                lineCoords.push([x + PX_FROM_SIDE, fromRect.y2 + PX_FROM_SIDE]);
                lineCoords.push([fromRect.x - marginFromBorder, fromRect.y2 + PX_FROM_SIDE]);
                lineCoords.push([fromRect.x - marginFromBorder, y2]);
              } else {
                lineCoords.push([x + PX_FROM_SIDE, y2]);
              }
            } else if (toSide === "bottom") {
              let fromRectLower = fromRect.y > toRect.y2;

              if (fromRectLower) {
                let marginFromBorder = fromRect.y - toRect.y2 >= PX_FROM_SIDE * 2 ? PX_FROM_SIDE : MIN_MARGIN_FROM_BORDER;
                lineCoords.push([x + PX_FROM_SIDE, toRect.y2 + marginFromBorder]);
                lineCoords.push([x2, toRect.y2 + marginFromBorder]);
              } else {
                let marginFromBorder = fromRect.y - toRect.y2 >= PX_FROM_SIDE * 2 ? PX_FROM_SIDE : MIN_MARGIN_FROM_BORDER;
                if (y >= fromRect.y && y <= fromRect.y2) {
                  let needToY = fromRect.y2 >= toRect.y2 ? fromRect : toRect;
                  lineCoords.push([x + PX_FROM_SIDE, needToY.y2 + PX_FROM_SIDE]);
                  lineCoords.push([x2, needToY.y2 + PX_FROM_SIDE]);
                } else {
                  lineCoords.push([x + PX_FROM_SIDE, toRect.y2 + marginFromBorder]);
                  lineCoords.push([x2, toRect.y2 + marginFromBorder]);
                }
              }
            }
          } else if (fromSide === "bottom") {
            if (toSide === "left") {
              let fromRectUpper = fromRect.y2 < toRect.y;

              if (fromRectUpper) {
                let marginFromBorder = toRect.y - fromRect.y2 >= PX_FROM_SIDE * 2 ? PX_FROM_SIDE : MIN_MARGIN_FROM_BORDER;
                lineCoords.push([x, y + marginFromBorder]);
                lineCoords.push([toRect.x - PX_FROM_SIDE, y + marginFromBorder]);
                lineCoords.push([toRect.x - PX_FROM_SIDE, y2]);
              } else {
                let needToY = fromRect.y2 >= toRect.y2 ? fromRect : toRect;
                let needToX = fromRect.x <= toRect.x ? fromRect : toRect;
                lineCoords.push([x, needToY.y2 + PX_FROM_SIDE]);
                lineCoords.push([needToX.x - PX_FROM_SIDE, needToY.y2 + PX_FROM_SIDE]);
                lineCoords.push([needToX.x - PX_FROM_SIDE, y2]);
              }
            } else if (toSide === "top") {
              let fromRectUpper = fromRect.y2 <= toRect.y;

              if (fromRectUpper) {
                let marginFromBorder = toRect.y - fromRect.y2 >= PX_FROM_SIDE * 2 ? PX_FROM_SIDE : MIN_MARGIN_FROM_BORDER;
                lineCoords.push([x, y + marginFromBorder]);
                lineCoords.push([x2, y + marginFromBorder]);
              } else {
                let needToY = fromRect.y2 >= toRect.y2 ? fromRect : toRect;
                let needToX = fromRect.x < toRect.x ? fromRect : toRect;
                lineCoords.push([x, needToY.y2 + PX_FROM_SIDE]);
                lineCoords.push([needToX.x - PX_FROM_SIDE, needToY.y2 + PX_FROM_SIDE]);
                lineCoords.push([needToX.x - PX_FROM_SIDE, y2 - PX_FROM_SIDE]);
                lineCoords.push([x2, y2 - PX_FROM_SIDE]);
              }
            } else if (toSide === "right") {
              let xHigherThanX2 = y < y2;

              if (xHigherThanX2) {
                lineCoords.push([x, y2]);
              } else {
                lineCoords.push([x, y + PX_FROM_SIDE]);
                if (fromRect.x <= toRect.x2) {
                  lineCoords.push([fromRect.x2 + PX_FROM_SIDE, y + PX_FROM_SIDE]);
                  lineCoords.push([fromRect.x2 + PX_FROM_SIDE, y2]);
                } else {
                  let marginFromBorder = fromRect.x - toRect.x2 >= PX_FROM_SIDE * 2 ? PX_FROM_SIDE : MIN_MARGIN_FROM_BORDER;
                  lineCoords.push([x2 + marginFromBorder, y + PX_FROM_SIDE]);
                  lineCoords.push([x2 + marginFromBorder, y2]);
                }
              }
            } else if (toSide === "bottom") {
              let xLowerThanToRect = y >= toRect.y2 + PX_FROM_SIDE;
              if (xLowerThanToRect) {
                lineCoords.push([x, y + PX_FROM_SIDE]);
                if (x2 >= fromRect.x && x2 <= fromRect.x2) {
                  let marginFromBorder = fromRect.y - toRect.y2 >= PX_FROM_SIDE * 2 ? PX_FROM_SIDE : MIN_MARGIN_FROM_BORDER;
                  lineCoords.push([fromRect.x2 + PX_FROM_SIDE, y + PX_FROM_SIDE]);
                  lineCoords.push([fromRect.x2 + PX_FROM_SIDE, y2 + marginFromBorder]);
                  lineCoords.push([x2, y2 + marginFromBorder]);
                } else {
                  lineCoords.push([x2, y + PX_FROM_SIDE]);
                }
              } else {
                if (x >= toRect.x - PX_FROM_SIDE * 2 && x <= toRect.x2) {
                  let marginFromBorder = toRect.y - fromRect.y2 >= PX_FROM_SIDE * 2 ? PX_FROM_SIDE : MIN_MARGIN_FROM_BORDER;
                  lineCoords.push([x, y + marginFromBorder]);
                  lineCoords.push([toRect.x2 + PX_FROM_SIDE, y + marginFromBorder]);
                  lineCoords.push([toRect.x2 + PX_FROM_SIDE, y2 + PX_FROM_SIDE]);
                  lineCoords.push([x2, y2 + PX_FROM_SIDE]);
                } else {
                  lineCoords.push([x, y2 + PX_FROM_SIDE]);
                  lineCoords.push([x2, y2 + PX_FROM_SIDE]);
                }
              }
            }
          }
        }
      }
      
      if (toSide === "left") {
        if (x > x2) {
          angle = Math.atan2(0, -PX_FROM_SIDE);
        } else {
          angle = Math.atan2(0, PX_FROM_SIDE);
        }
      } else if (toSide === "top") {
        if (y > y2) {
          angle = Math.atan2(-PX_FROM_SIDE, 0);
        } else {
          angle = Math.atan2(PX_FROM_SIDE, 0);
        }
      } else if (toSide === "right") {
        if (x > x2) {
          angle = Math.atan2(0, PX_FROM_SIDE);
        } else {
          angle = Math.atan2(0, -PX_FROM_SIDE);
        }
      } else if (toSide === "bottom") {
        if (y > y2) {
          angle = Math.atan2(PX_FROM_SIDE, 0);
        } else {
          angle = Math.atan2(-PX_FROM_SIDE, 0);
        }
      }
    }
  } else {
    if (differenceX >= differenceY) {
      if (x2 > x) {
        lineCoords.push([x + differenceX / 2, y]);
        lineCoords.push([x + differenceX / 2, y2]);
      } else if (x2 < x) {
        lineCoords.push([x - differenceX / 2, y]);
        lineCoords.push([x - differenceX / 2, y2]);
      }
    } else {
      if (y2 >= y) {
        lineCoords.push([x, y + differenceY / 2]);
        lineCoords.push([x2, y + differenceY / 2]);
        angle = Math.atan2(y2 - differenceY / 2, 0);
      } else if (y2 < y) {
        lineCoords.push([x, y - differenceY / 2]);
        lineCoords.push([x2, y - differenceY / 2]);
        angle = Math.atan2(y2 + differenceY / 2, 0);
      }
    }
  }
  
  lineCoords.push([x2, y2]);
  
  lineCoords.forEach(line => {
    ctx.lineTo(line[0], line[1]);
  })

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
    let fromRect = el.fromRect,
        fromSide = el.fromSide,
        toRect = el.toRect,
        toSide = el.toSide,
        lineCoords = el.lineCoords;
    let rects = {fromRect, fromSide, toRect, toSide}
  
    drawArrows(ctx, x, y, x2, y2, rects, lineCoords);
  })
}

export const drawSelectedLine = (ctx, x, y, x2, y2, rects, lineCoords) => {
  ctx.beginPath();
  ctx.lineWidth="1";
	ctx.strokeStyle="black";
  
  drawArrows(ctx, x, y, x2, y2, rects, lineCoords);
}