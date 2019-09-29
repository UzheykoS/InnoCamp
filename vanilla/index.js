const TO_DO_ITEMS_KEY = "TO_DO_ITEMS_KEY";

// Modal Dialog start

const modal = document.getElementById("createNoteModal");
const openModalBtn = document.getElementById("createNoteModalBtn");
const span = document.getElementsByClassName("close-modal")[0];
const cancelModalBtn = document.getElementById("modalCancelBtn");

const closeModalFnc = function() {
  modal.style.display = "none";
};

openModalBtn.onclick = function() {
  modal.style.display = "block";
};

span.onclick = closeModalFnc;
cancelModalBtn.onclick = closeModalFnc;

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};

// Modal Dialog end

// Form Handlers Start
const nameInput = document.querySelector("input");

nameInput.addEventListener("input", () => {
  nameInput.setCustomValidity("");
  nameInput.checkValidity();
});

nameInput.addEventListener("invalid", () => {
  if (nameInput.value === "") {
    nameInput.setCustomValidity("Enter your username!");
  } else {
    nameInput.setCustomValidity(
      "Usernames can only contain upper and lowercase letters. Try again!"
    );
  }
});

function submitForm(event) {
  try {
    const persistedValue = localStorage.getItem(TO_DO_ITEMS_KEY);
    const items = persistedValue ? JSON.parse(persistedValue) : [];
    const item = {
      title: event.target.title.value,
      description: event.target.description.value,
      priority: event.target.priority.value,
      id: items.length + 1
    };
    items.push(item);
    localStorage.setItem(TO_DO_ITEMS_KEY, JSON.stringify(items));
    refreshItems();
  } catch (e) {
    console.log("Error parsing items: ", e);
  }
}

// Form Handlers End

const itemsContainer = document.getElementById("to-do-items");

function refreshItems() {
  try {
    itemsContainer.innerHTML = '';
    const persistedValue = localStorage.getItem(TO_DO_ITEMS_KEY);
    if (!persistedValue) {
      return;
    }
    const items = JSON.parse(persistedValue);
    items.forEach(item => {
      itemsContainer.appendChild(createToDoCard(item));
    });
  } catch (e) {
    console.log("Error parsing items: ", e);
  }
}

function createToDoCard(toDoItem) {
  const node = document.createElement("div");
  node.className = "item-container";

  const titleNode = document.createElement("div");
  titleNode.textContent = `Title: ${toDoItem.title}`;
  node.appendChild(titleNode);

  const descriptionNode = document.createElement("div");
  descriptionNode.textContent = `Description: ${toDoItem.description}`;
  node.appendChild(descriptionNode);

  const priorityNode = document.createElement("div");
  priorityNode.textContent = `Priority: ${toDoItem.priority}`;
  priorityNode.className =
    toDoItem.priority === "Low"
      ? "priority-low"
      : toDoItem.priority === "Middle"
      ? "priority-middle"
      : "priority-high";
  node.appendChild(priorityNode);

  const deleteButton = document.createElement("button");
  deleteButton.title = "Delete";
  deleteButton.textContent = "Delete";
  deleteButton.onclick = function(ev) {
    try {
      const persistedValue = localStorage.getItem(TO_DO_ITEMS_KEY);
      if (!persistedValue) {
        return;
      }
      const items = JSON.parse(persistedValue);
      const index = items.findIndex(i => i.id === toDoItem.id);
      if (index > -1) {
        items.splice(index, 1);
        localStorage.setItem(TO_DO_ITEMS_KEY, JSON.stringify(items));
        refreshItems();
      }
    } catch (e) {
      console.log("Error deleting item: ", e);
    }
  };
  node.appendChild(deleteButton);

  return node;
}

refreshItems();
