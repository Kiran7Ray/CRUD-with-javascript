import { groceryItems } from "./data.js";
import { createItems } from "./item.js";

// State
let items = [...groceryItems];
let editFlag = false;
let editID = "";

// Selectors
const form = document.getElementById("grocery-form");
const itemInput = document.getElementById("item-input");
const submitBtn = form.querySelector("button");
const clearBtn = document.getElementById("clear-btn");
const appContainer = document.getElementById("app");

// Event Listeners
form.addEventListener("submit", addItem);
clearBtn.addEventListener("click", clearItems);
appContainer.addEventListener("click", handleItemAction);
appContainer.addEventListener("change", handleItemChange);

// Functions
function render() {
  appContainer.innerHTML = "";
  const itemsElement = createItems(items);
  appContainer.appendChild(itemsElement);
}

function addItem(e) {
  e.preventDefault();
  const value = itemInput.value;
  const id = new Date().getTime().toString();

  if (value && !editFlag) {
    const newItem = { id, name: value, completed: false };
    items.push(newItem);
    render();
    addToLocalStorage(items);
    setBackToDefault();
  } else if (value && editFlag) {
    items = items.map((item) => {
      if (item.id === editID) {
        return { ...item, name: value };
      }
      return item;
    });
    render();
    addToLocalStorage(items);
    setBackToDefault();
  }
}

function clearItems() {
  items = [];
  render();
  addToLocalStorage(items);
  setBackToDefault();
}

function deleteItem(id) {
  items = items.filter((item) => item.id !== id);
  render();
  addToLocalStorage(items);
  setBackToDefault();
}

function editItem(id) {
  const item = items.find((item) => item.id === id);
  itemInput.value = item.name;
  editID = id;
  editFlag = true;
  submitBtn.textContent = "Edit";
  itemInput.focus();
}

function toggleCompleted(id) {
  items = items.map((item) => {
    if (item.id === id) {
      return { ...item, completed: !item.completed };
    }
    return item;
  });
  render();
  addToLocalStorage(items);
}

function handleItemAction(e) {
  const target = e.target;
  const itemElement = target.closest(".single-item");
  if (!itemElement) return;
  const id = itemElement.dataset.id;

  if (target.closest(".remove-btn")) {
    deleteItem(id);
  } else if (target.closest(".edit-btn")) {
    editItem(id);
  }
}

function handleItemChange(e) {
  const target = e.target;
  if (target.type === "checkbox") {
    const itemElement = target.closest(".single-item");
    if (!itemElement) return;
    const id = itemElement.dataset.id;
    toggleCompleted(id);
  }
}

function setBackToDefault() {
  itemInput.value = "";
  editFlag = false;
  editID = "";
  submitBtn.textContent = "Add";
}

function addToLocalStorage(items) {
  // Optional: Persist to local storage if desired, keeping it simple for now as requested.
  // localStorage.setItem("list", JSON.stringify(items));
}

// Initialize App
render();
