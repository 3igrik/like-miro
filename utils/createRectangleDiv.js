export const createRectangleDiv = (selectedRect) => {
  let selectedRectEl = document.createElement("div");
  selectedRectEl.classList.add("selected-rect");
  selectedRectEl.style.left = `${selectedRect.x}px`;
  selectedRectEl.style.top = `${selectedRect.y}px`;
  selectedRectEl.style.width = `${selectedRect.width}px`;
  selectedRectEl.style.height = `${selectedRect.height}px`;

  return selectedRectEl;
}