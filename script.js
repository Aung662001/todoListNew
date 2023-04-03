const listContainer = document.querySelector("[data-lists]");
const newListForm = document.querySelector("[data-new-list-form]");
const newListInput = document.querySelector("[data-new-list-input]");
const deleteListButton = document.querySelector("[ data-delete-list-button]");

const LIST_FORM_KEY = "list-form";
const SELECTED_LIST_FORM_ID_KEY = "task.selectedListId";

let lists = JSON.parse(localStorage.getItem(LIST_FORM_KEY)) || [];
let selectedListId = localStorage.getItem(SELECTED_LIST_FORM_ID_KEY);
newListForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const listInput = newListInput.value;
  if (listInput === null || listInput === "") return;
  const list = createList(listInput);
  newListInput.value = null;
  lists.push(list);
  saveAndRender();
});

listContainer.addEventListener("click", (e) => {
  if (e.target.tagName.toLowerCase() === "li") {
    selectedListId = e.target.dataset.listId;
    saveAndRender();
  }
});

function save() {
  localStorage.setItem(LIST_FORM_KEY, JSON.stringify(lists));
  localStorage.setItem(SELECTED_LIST_FORM_ID_KEY, selectedListId);
}
function saveAndRender() {
  save();
  render();
}

function createList(list) {
  return { id: Date.now().toString(), name: list, task: [] };
}

function render() {
  clearElements(listContainer);
  lists.map((list) => {
    const listElement = document.createElement("li");
    listElement.dataset.listId = list.id;
    listElement.classList.add("list-name");
    listElement.innerText = list.name;
    listContainer.append(listElement);
    if (list.id === selectedListId) {
      listElement.classList.add("active-list");
    }
  });
}
function clearElements(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}
render();

deleteListButton.addEventListener("click", (e) => {
  e.preventDefault();
  lists = lists.filter((list) => list.id != selectedListId);
  selectedListId = null;
  saveAndRender();
});
