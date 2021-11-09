export const selectAndActiveCursor = (inventoryChildrenArr, cursor) => {
  inventoryChildrenArr.forEach(el => {
    el.classList.remove("inventory__cursor_active");
  })

  cursor.classList.add("inventory__cursor_active");
}