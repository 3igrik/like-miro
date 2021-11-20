export const selectAndActiveCursor = (inventoryChildrenArr, cursor) => {
  inventoryChildrenArr.forEach(el => {
    el.classList.remove("inventory__item_active");
  })

  cursor.classList.add("inventory__item_active");
}