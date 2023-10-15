// Get the input field and button from the HTML file
const inputField = document.getElementById("input-field");
const addButton = document.getElementById("add-button");

// Get the unordered list from the HTML file
const toDoList = document.getElementById("to-do-list");

// Add an event listener to the button to add a new item to the list
addButton.addEventListener("click", function() {
    // Create a new list item and add the input value to it
    const newListItem = document.createElement("li");
    newListItem.innerText = inputField.value;

    // Add the new list item to the unordered list
    toDoList.appendChild(newListItem);

    // Clear the input field
    inputField.value = "";
});
