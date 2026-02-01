// State
let items = getLocalStorage();
let editFlag = false;
let editID = "";

// Selectors
const form = document.getElementById("grocery-form");
const alert = document.querySelector(".alert");
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

function createItems(itemsArray) {
  const container = document.createElement("div");
  container.className = "items";

  itemsArray.forEach((item) => {
    const itemElement = createSingleItem(item);
    container.appendChild(itemElement);
  });

  return container;
}

function createSingleItem(item) {
  const div = document.createElement("div");
  div.className = "single-item";
  div.dataset.id = item.id;

  div.innerHTML = `
    <input type="checkbox" ${item.completed ? "checked" : ""} />
    <span style="text-decoration: ${item.completed ? "line-through" : "none"}">
      ${item.name}
    </span>
    <div class="btns">
      <button class="btn edit-btn" type="button">
        <i class="fa-solid fa-pen-to-square"></i>
      </button>
      <button class="btn delete-btn" type="button">
        <i class="fa-solid fa-trash-can"></i>
      </button>
    </div>
  `;

  return div;
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
    displayAlert("item added to the list", "success");
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
    displayAlert("value changed", "success");
    setBackToDefault();
  } else {
    displayAlert("please enter value", "danger");
  }
}

function displayAlert(text, action) {
  alert.textContent = text;
  alert.classList.add(`alert-${action}`);

  // remove alert
  setTimeout(function () {
    alert.textContent = "";
    alert.classList.remove(`alert-${action}`);
  }, 1000);
}

function clearItems() {
  items = [];
  render();
  addToLocalStorage(items);
  displayAlert("empty list", "danger");
  setBackToDefault();
}

function deleteItem(id) {
  items = items.filter((item) => item.id !== id);
  render();
  addToLocalStorage(items);
  displayAlert("item removed", "danger");
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

  // Handle delete button click (check for button or icon inside it)
  if (target.closest(".delete-btn")) {
    deleteItem(id);
  }
  // Handle edit button click
  else if (target.closest(".edit-btn")) {
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
  localStorage.setItem("list", JSON.stringify(items));
}

function getLocalStorage() {
  return localStorage.getItem("list")
    ? JSON.parse(localStorage.getItem("list"))
    : [];
}

// Initialize App
render();
