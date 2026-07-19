const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const searchInput = document.getElementById("searchInput");
const taskCount = document.getElementById("taskCount");
const clearAll = document.getElementById("clearAll");
const emptyMessage = document.getElementById("emptyMessage");
const filterButtons = document.querySelectorAll(".filter-btn");
const progress = document.getElementById("progress");
const progressText = document.getElementById("progressText");
const priority = document.getElementById("priority");
const dueDate = document.getElementById("dueDate");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";

// Save tasks
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Update task counter
function updateCount() {
    taskCount.textContent = `${tasks.length} Task${tasks.length !== 1 ? "s" : ""}`;
}

// Display tasks
function displayTasks() {
    taskList.innerHTML = "";

    const search = searchInput.value.toLowerCase();

    const filtered = tasks.filter(task => {
        const matchSearch = task.text.toLowerCase().includes(search);

        if (currentFilter === "completed")
            return task.completed && matchSearch;

        if (currentFilter === "pending")
            return !task.completed && matchSearch;

        return matchSearch;
    });

    if (filtered.length === 0) {
        emptyMessage.style.display = "block";
    } else {
        emptyMessage.style.display = "none";
    }

    filtered.forEach((task, index) => {
        const li = document.createElement("li");

        li.innerHTML = `
            <span class="${task.completed ? "completed" : ""}">
                ${task.text}
                <span class="${task.priority.toLowerCase()}">${task.priority}</span>
            </span>
            <p>📅 Due: ${task.dueDate || "No Due Date"}</p>
           
            <div class="task-buttons">
                <button class="complete-btn" onclick="toggleTask(${index})">✔</button>
                <button class="edit-btn" onclick="editTask(${index})">✏</button>
                <button class="delete-btn" onclick="deleteTask(${index})">🗑</button>
            </div>
        `;

        taskList.appendChild(li);
    });

    updateCount();
    updateProgress();
    saveTasks();
}
function updateProgress() {
    const completed = tasks.filter(task => task.completed).length;
    const total = tasks.length;

    const percent = total === 0 ? 0 : (completed / total) * 100;

    progress.style.width = percent + "%";
    progressText.textContent = `${completed}/${total} Tasks Completed`;
}

// Add task
function addTask() {
    const text = taskInput.value.trim();

    if (text === "") {
        alert("Please enter a task.");
        return;
    }

    tasks.push({
        text: text,
        completed: false,
        priority: priority.value,
        dueDate: dueDate.value
    });

    taskInput.value = "";
    displayTasks();
}

// Delete task
function deleteTask(index) {
    tasks.splice(index, 1);
    displayTasks();
}

// Complete task
function toggleTask(index) {
    tasks[index].completed = !tasks[index].completed;
    displayTasks();
}

// Edit task
function editTask(index) {
    const newText = prompt("Edit Task", tasks[index].text);

    if (newText !== null && newText.trim() !== "") {
        tasks[index].text = newText.trim();
        displayTasks();
    }
}

// Clear all
clearAll.addEventListener("click", () => {
    if (confirm("Delete all tasks?")) {
        tasks = [];
        displayTasks();
    }
});

// Add button
addBtn.addEventListener("click", addTask);

// Enter key
taskInput.addEventListener("keypress", e => {
    if (e.key === "Enter") addTask();
});

// Search
searchInput.addEventListener("input", displayTasks);

// Filters
filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {

        filterButtons.forEach(b => b.classList.remove("active"));

        btn.classList.add("active");

        currentFilter = btn.dataset.filter;

        displayTasks();
    });
});

// Initial display
displayTasks();
const themeBtn = document.getElementById("themeBtn");

themeBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark");

    if(document.body.classList.contains("dark")){
        themeBtn.textContent = "☀ Light Mode";
    } else {
        themeBtn.textContent = "🌙 Dark Mode";
    }
});
