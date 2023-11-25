$(document).ready(() => {
    let tasks = [];
    const taskList = $("#taskList");
    const pagination = $("#pagination");
    const itemsPerPage = 10;
    let totalPages;
    let currentPage = -1;

    function getTasks() {
        $.ajax({
            url: "https://jsonplaceholder.typicode.com/todos",
            method: "GET",
            success: (response) => {
                totalPages = Math.ceil(response.length / itemsPerPage);
                tasks = response;
                displayTasks(1);
                updatePagination(1);
            },
            error: () => {
                alert("Error al cargar las tareas");
            }
        })
    }

    getTasks();

    function displayTasks(page) {
        taskList.empty();

        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;

        for (let i = startIndex; i < endIndex && i < tasks.length; i++) {
            addTask(tasks[i]);
        }

        currentPage = page;
    }

    $("#taskForm").submit(e => {
        e.preventDefault();

        const taskInput = $("#taskInput");
        const taskText = taskInput.val();

        const task = { completed: false, id: 0, title: taskText, userId: 0 };

        tasks.push(task);
        totalPages = Math.ceil(tasks.length / itemsPerPage);

        taskInput.val("");

        if (currentPage < totalPages) {
            displayTasks(totalPages);
            updatePagination(totalPages);
            return;
        }

        if (currentPage === totalPages) {
            addTask(task);
        }
    });

    function addTask(todo) {
        const { completed, id, title } = todo;

        const listItem =
            $(`<li id="todo-item-${id}" class='list-group-item d-flex justify-content-between align-items-center' data-completed='false'>
                <p id="todo-${id}">${title}</p>
            </li>`);

        if (completed) {
            updateTask(listItem, todo);
            showUndo(listItem, todo);
        }

        if (!completed) {
            showActions(listItem, todo);
        }

        // tasks.push(todo);
        taskList.append(listItem);
    }

    function showActions(listItem, task) {
        const { id } = task;
        const btnDiv = $(`<div id='btn-container-${id}'></div>`);
        const completeBtn = $("<button class='btn btn-success btn-sm complete-btn me-2'></button>").text("Completar");
        const deleteBtn = $("<button class='btn btn-danger btn-sm delete-btn me-2'></button>").text("Eliminar");

        btnDiv.append(completeBtn);
        btnDiv.append(deleteBtn);

        completeBtn.on("click", function() {
            task.completed = true;

            btnDiv.remove();
            updateTask(listItem, task);
            showUndo(listItem, task);
        });

        deleteBtn.on("click", function () {
            task.completed = true;
            btnDiv.remove();
            updateTask(listItem, task);
            showUndo(listItem, task);
        });

        listItem.append(btnDiv);
    }

    function showUndo(listItem, task) {
        const undoDelete = $("<button class='btn btn-secondary btn-sm undo-btn me-3'></button>").text("Deshacer");

        undoDelete.on("click", function () {
            task.completed = false;

            undoDelete.remove();
            updateTask(listItem, task);
            showActions(listItem, task);
        });

        listItem.append(undoDelete);
    }

    function updateTask(listItem, task) {
        const { id, completed } = task;
        const text = $(`#todo-${id}`);

        if (completed) {
            text.css("text-decoration", "line-through");
        } else {
            text.css("text-decoration", "none");
        }

    }

    function updatePagination(index) {
        pagination.empty();

        for (let i = 1; i <= totalPages; i++) {
            const pageItem = $("<li class='page-item'></li>");
            const pageLink = $(`<a class='page-link' href="#">${i}</a>`);

            if (i === index) {
                pageItem.addClass('active');
            }

            pageLink.click(function() {
                currentPage = i;
                displayTasks(i);
                updatePagination(i);
            });

            pageItem.append(pageLink);
            pagination.append(pageItem);
        }
    }
});
