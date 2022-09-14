// import Kanban from "./classes/Kanban.js";
// let inputs = document.getElementsByClassName("kanban__item-input");

// for(let i = 0; i < inputs.length; i++){
//   inputs[i].addEventListener("dragstart", e => {
//     e.dataTransfer.setData("text/plain", inputs[i].id);
//   });
// }


for (const dropZone of document.querySelectorAll(".kanban__dropzone")){
  // When draggable element is over a drop zone
  dropZone.addEventListener("dragover", e => {
    e.preventDefault();
    dropZone.classList.add("kanban__dropzone--active");
  });

  // When draggable element leave a drop zone
  dropZone.addEventListener("dragleave", e => {
    e.preventDefault();
    dropZone.classList.remove("kanban__dropzone--active");
  })

  // When draggable element is dropped onto drop zone
  dropZone.addEventListener("drop", e => {
    e.preventDefault();

    const droppedElementId = e.dataTransfer.getData("text/plain");
    const droppedItem = document.getElementById(droppedElementId);

    const columnElement = dropZone.closest(".kanban__column");
    const columnName = columnElement.firstElementChild.textContent;
    const dropZoneInColumn = Array.from(columnElement.querySelectorAll(".kanban__dropzone"));
    const droppedIndex = dropZoneInColumn.indexOf(dropZone);
    const itemId = e.dataTransfer.getData("text/plain");

    console.log(itemId);

    console.log(droppedItem);

    dropZone.classList.remove("kanban__dropzone--active");
  })
}

for(const input of document.querySelectorAll(".kanban__item-input")){
  console.log(input);
  input.addEventListener("dragstart", () => {
    const dragForm = input.parentElement.parentElement.previousElementSibling;
    dragForm.submit();
  })
}

for(const dropForm of document.querySelectorAll(".dropForm")){
  dropForm.addEventListener("drop", e => {
    e.preventDefault();
    dropForm.submit();
  })
}

// double clicks to delete items
// double click to submit the form to call the method in app.js
let deleteItems = document.getElementsByName("deleteForms");
for(let i = 0; i < deleteItems.length; i++){
  deleteItems[i].addEventListener("dblclick", () => {
    const answer = confirm("Do you want to delete this item?");

    if(answer){
      deleteItems[i].submit();
    }
  })
}
