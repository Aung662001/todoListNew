const listContainer = document.querySelector("[data-lists]");
const newListForm = document.querySelector("[data-new-list-form]");
const newListInput = document.querySelector("[data-new-list-input]");

const LIST_FORM_KEY = "list-form";
const SELECTED_LIST_FORM_ID_KEY = "task.selectedListId";

const lists = JSON.parse(localStorage.getItem(LIST_FORM_KEY)) || [];
const selectedList = localStorage.getItem(SELECTED_LIST_FORM_ID_KEY);
newListForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const listInput = newListInput.value;
  const list = createList(listInput);
  console.log(listInput);
  newListInput.value = null;
  lists.push(list);
  saveAndRender();
});

function save() {
  localStorage.setItem(LIST_FORM_KEY, JSON.stringify(lists));
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
    if (list.id === selectedList) {
      selectedList.classList.add("active-list");
    }
  });
}
function clearElements(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}
render();
