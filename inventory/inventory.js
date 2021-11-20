export const selectWithKeyBoard = (inventoryChildrenArr, cursor, line, rectangle, selectedItem) => {
  window.addEventListener("keydown", e => {
    if (e.code === "KeyV" ||
        e.code === "KeyL" ||
        e.code === "KeyS") {
      inventoryChildrenArr.forEach(el => {
        el.classList.remove("inventory__item_active");
  })

      switch (e.code) {
        case "KeyL":
          line.classList.add("inventory__item_active");
          selectedItem.selectedItem = line;
          break;
      
        case "KeyV":
          cursor.classList.add("inventory__item_active");
          selectedItem.selectedItem = cursor;
          break;
      
        case "KeyS":
          rectangle.classList.add("inventory__item_active");
          selectedItem.selectedItem = rectangle;
          break;
      }
    }
  })
}