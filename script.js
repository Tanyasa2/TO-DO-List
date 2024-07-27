const input = document.querySelector(".todo-input");
const addButton = document.querySelector(".add-button");
const deleteAllButton = document.querySelector(".delete-all");
const todosHTML = document.querySelector(".todos");
const emptyImage = document.querySelector(".empty-image");
let todosJson = JSON.parse(localStorage.getItem("todos")) || [];
let filter = "";

function getTodoHTML(todo, index) {
  let checked = todo.status === "completed" ? "checked" : "";
  return `
    <li class="todo">
      <label for="${index}">
        <input id="${index}" onclick="updateStatus(this)" type="checkbox" ${checked} />
        <span class="${checked}">${todo.name}</span>
      </label>
      <button class="delete-btn" data-index="${index}" onclick="remove(this)">
        <i class="fa fa-times"></i>
      </button>
    </li>
  `;
}

function showTodos() {
  const filteredTodos = todosJson.filter((todo) => {
    if (filter === "") return true;
    return todo.status === filter;
  });

  if (filteredTodos.length === 0) {
    todosHTML.innerHTML = "";
    emptyImage.style.display = "block";
  } else {
    todosHTML.innerHTML = filteredTodos
      .map((todo, index) => getTodoHTML(todo, index))
      .join("");
    emptyImage.style.display = "none";
  }
}

function addTodo() {
  let todo = input.value.trim();
  if (!todo) {
    return;
  }
  input.value = "";
  todosJson.unshift({ name: todo, status: "pending" });
  localStorage.setItem("todos", JSON.stringify(todosJson));
  showTodos();
}

input.addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    addTodo();
  }
});

addButton.addEventListener("click", addTodo);

deleteAllButton.addEventListener("click", deleteAllTodos);

function updateStatus(todo) {
  let todoName = todo.parentElement.querySelector("span");
  if (todo.checked) {
    todoName.classList.add("checked");
    todosJson[todo.id].status = "completed";
  } else {
    todoName.classList.remove("checked");
    todosJson[todo.id].status = "pending";
  }
  localStorage.setItem("todos", JSON.stringify(todosJson));
  showTodos();
}

function remove(todo) {
  const index = todo.dataset.index;
  todosJson.splice(index, 1);
  localStorage.setItem("todos", JSON.stringify(todosJson));
  showTodos();
}

function deleteAllTodos() {
  todosJson = [];
  localStorage.setItem("todos", JSON.stringify(todosJson));
  showTodos();
}

document.querySelectorAll(".filter").forEach(function (el) {
  el.addEventListener("click", (e) => {
    if (el.classList.contains("active")) {
      el.classList.remove("active");
      filter = "";
    } else {
      document
        .querySelectorAll(".filter")
        .forEach((tag) => tag.classList.remove("active"));
      el.classList.add("active");
      filter = e.target.dataset.filter;
    }
    showTodos();
  });
});

showTodos();
