const listContainer = document.querySelector("[data-lists]");
const newListForm = document.querySelector("[data-new-list-form]");
const newListInput = document.querySelector("[data-new-list-input]");
const deleteListButton = document.querySelector("[ data-delete-list-button]");
const displayContainer = document.querySelector(
  "[data-list-display-container]"
);
const listTitle = document.querySelector("[data-list-title]");
const listCount = document.querySelector("[data-list-count]");
const taskTemplate = document.getElementById("task-template");
const taskContainer = document.querySelector("[data-tasks]");
const newTaskForm = document.querySelector("[data-new-task-form]");
const newTaskInput = document.querySelector("[data-new-task-input");
const clearCompleteTasks = document.querySelector(
  "[data-clear-complete-tasks]"
);

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

newTaskForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const taskInput = newTaskInput.value;
  if (taskInput === null || taskInput === "") return;
  const task = createTask(taskInput);
  newTaskInput.value = null;
  const selectedTask = lists.find((list) => list.id === selectedListId);
  selectedTask.tasks.push(task);
  saveAndRender();
});

listContainer.addEventListener("click", (e) => {
  if (e.target.tagName.toLowerCase() === "li") {
    selectedListId = e.target.dataset.listId;
    saveAndRender();
  }
});
taskContainer.addEventListener("click", (e) => {
  if (e.target.tagName.toLowerCase() === "input") {
    const selectedList = lists.find((list) => list.id === selectedListId);
    const selectedTask = selectedList.tasks.find(
      (task) => task.id === e.target.id
    );
    selectedTask.complete = e.target.checked;
    save();
    renderTaskCount(selectedList);
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
  return {
    id: Date.now().toString(),
    name: list,
    tasks: [],
  };
}

function createTask(name) {
  return {
    id: Date.now().toString(),
    name: name,
    complete: false,
  };
}

function render() {
  clearElements(listContainer);
  renderList();
  const selectedList = lists.find((list) => list.id === selectedListId);
  if (selectedListId == null || selectedListId == "null") {
    displayContainer.style.display = "none";
  } else {
    displayContainer.style.display = "";
    listTitle.innerText = selectedList.name;
    renderTaskCount(selectedList);
    clearElements(taskContainer);
    renderTasks(selectedList);
  }
}
function renderTasks(selectedList) {
  selectedList.tasks.forEach((task) => {
    const taskElement = document.importNode(taskTemplate.content, true);
    const checkBox = taskElement.querySelector("input");
    checkBox.id = task.id;
    checkBox.checked = task.complete;
    const label = taskElement.querySelector("label");
    label.htmlFor = task.id;
    label.append(task.name);
    taskContainer.append(taskElement);
  });
}
function renderTaskCount(selectedList) {
  const taskCount = ` ${
    selectedList.tasks.filter((task) => !task.complete).length
  } `;
  const taskString = taskCount <= 1 ? "task" : "tasks";
  listCount.innerText = `${taskCount} ${taskString} remaning`;
}
function renderList() {
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
clearCompleteTasks.addEventListener("click", () => {
  let selectedList = lists.find((list) => list.id === selectedListId);
  console.log(selectedList.tasks);
  selectedList.tasks = selectedList.tasks.filter((task) => !task.complete);
  saveAndRender();
});
