const input = document.getElementById("input");
const addBtn = document.getElementById("add-btn");
const tasksUl = document.getElementById("tasks");
const completedTaskUL = document.getElementById("completed-tasks-ul");

let generalList = document.getElementsByClassName("generalListItem");
let cancelButtons = document.getElementsByClassName("cancel");

const TASKS_STORAGE_KEY = "tasks";
const COMPLETED_TASKS_STORAGE_KEY = "completedTasks";

//Utility functions

//Function to check if a task is completed
const isTaskCompleted = (task) => task.classList.contains("checked");

// Function to save data to localStorage with error handling
const saveToLocalStorage = (key, data) => {
  try {
    localStorage.setItem(key, data);
  } catch (e) {
    console.error(`Error saving to localStorage: ${e}`);
  }
};

// Function to retrieve data from localStorage with error handling
const retrieveFromLocalStorage = (key) => {
  try {
    return localStorage.getItem(key) || "";
  } catch (e) {
    console.error(`Error retrieving from localStorage: ${e}`);
    return "";
  }
};

// Function to update localStorage with the current state of tasks and completed tasks
const updateLocalStorage = () => {
  saveToLocalStorage(TASKS_STORAGE_KEY, tasksUl.innerHTML);
  saveToLocalStorage(COMPLETED_TASKS_STORAGE_KEY, completedTaskUL.innerHTML);
};

// Function to create a new task element with the provided task text
const createTaskElement = (taskText) => {
  const li = document.createElement("li");
  li.classList.add("generalListItem", "unchecked");
  li.textContent = taskText;

  // Create and append the cancel button to the task element
  const span = document.createElement("span");
  span.classList.add("cancel");
  span.textContent = "x";

  li.appendChild(span);

  // Attach event listeners to the task and cancel button
  handleTaskClick(li);
  handleCancelClick(span);

  return li;
};

// Function to handle the click event on a task item
// Toggles the task's completion state and updates localStorage
const handleTaskClick = (item) => {
  item.addEventListener("click", () => {
    item.classList.toggle("unchecked");
    item.classList.toggle("checked");
    updateLocalStorage();

    // Check if the clicked task is completed
    if (isTaskCompleted(item)) {
      // Clone the completed task, remove its cancel button, and move it to the completed task list
      const taskClone = item.cloneNode(true);
      taskClone.classList.remove("generalListItem");
      taskClone.removeChild(taskClone.querySelector(".cancel"));
      completedTaskUL.append(taskClone);
      updateLocalStorage();
    } else {
      // Remove the task from the completed task list if it is unchecked
      Array.from(completedTaskUL.childNodes).forEach((task) => {
        if (task.textContent === item.textContent.slice(0, -1)) {
          task.remove();
          updateLocalStorage();
        }
      });
    }
  });
};

// Function to handle the click event on a cancel button
// Removes the task from the list and updates localStorage
const handleCancelClick = (button) => {
  button.addEventListener("click", () => {
    button.parentElement.classList.add("checked");
    button.parentElement.remove();
    updateLocalStorage();
  });
};

// Load saved tasks from local storage
tasksUl.innerHTML = retrieveFromLocalStorage(TASKS_STORAGE_KEY);
completedTaskUL.innerHTML = retrieveFromLocalStorage(
  COMPLETED_TASKS_STORAGE_KEY
);

// Add event listeners to existing list items
Array.from(generalList).forEach(handleTaskClick);

// Add event listeners to existing cancel buttons
Array.from(cancelButtons).forEach(handleCancelClick);

//Event listener for add item button
addBtn.addEventListener("click", () => {
  if (input.value.trim() !== "") {
    const newTask = createTaskElement(input.value.trim());
    tasksUl.appendChild(newTask);
    input.value = "";
    updateLocalStorage();
  } else {
    alert("You need to add a task");
  }
});
