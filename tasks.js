document.addEventListener("DOMContentLoaded", async () => {

    await loadEmployees();
    await loadTasks();

    document
    .getElementById("taskForm")
    .addEventListener(
        "submit",
        createTask
    );

});

async function loadEmployees() {

    const dropdown =
    document.getElementById(
        "assignedTo"
    );

    const { data, error } =
    await supabaseClient
    .from("users")
    .select("*")
    .eq("is_active", true)
    .order("full_name");

    if(error){
        return;
    }

    data.forEach(user => {

        dropdown.innerHTML += `
        <option value="${user.id}">
            ${user.full_name} (${user.role})
        </option>
        `;

    });

}

async function createTask(e) {

    e.preventDefault();

    const currentUser =
    JSON.parse(
        localStorage.getItem("skc_user")
    );

    const title =
    document.getElementById(
        "title"
    ).value;

    const description =
    document.getElementById(
        "description"
    ).value;

    const assignedTo =
    document.getElementById(
        "assignedTo"
    ).value;

    const priority =
    document.getElementById(
        "priority"
    ).value;

    const dueDate =
    document.getElementById(
        "dueDate"
    ).value;

    const { error } =
    await supabaseClient
    .from("tasks")
    .insert([{

        title,
        description,
        assigned_by: currentUser.id,
        assigned_to: assignedTo,
        priority,
        due_date: dueDate,
        status: "Pending"

    }]);

    if(error){

        alert(
            "Task Creation Failed"
        );

        return;
    }

    alert(
        "Task Created Successfully"
    );

    document
    .getElementById("taskForm")
    .reset();

    await loadTasks();

}

async function loadTasks() {

    const table =
    document.getElementById(
        "taskTable"
    );

    const { data, error } =
    await supabaseClient
    .from("tasks")
    .select("*")
    .order("created_at", {
        ascending:false
    });

    if(error){

        table.innerHTML =
        `<tr><td colspan="6">Failed to load tasks</td></tr>`;

        return;
    }

    if(!data.length){

        table.innerHTML =
        `<tr><td colspan="6">No Tasks Found</td></tr>`;

        return;
    }

    table.innerHTML = "";

    data.forEach(task => {

        table.innerHTML += `

        <tr>

            <td>${task.title}</td>

            <td>${task.assigned_to}</td>

            <td>${task.priority}</td>

            <td>${task.due_date || "-"}</td>

            <td>${task.status}</td>

            <td>

                <button
                onclick="markInProgress('${task.id}')">
                    In Progress
                </button>

                <button
                onclick="markCompleted('${task.id}')">
                    Complete
                </button>

                <button
                onclick="deleteTask('${task.id}')">
                    Delete
                </button>

            </td>

        </tr>

        `;

    });

}

async function markInProgress(taskId){

    await supabaseClient
    .from("tasks")
    .update({
        status:"In Progress"
    })
    .eq("id", taskId);

    await loadTasks();

}

async function markCompleted(taskId){

    await supabaseClient
    .from("tasks")
    .update({
        status:"Completed",
        completed_at:new Date()
    })
    .eq("id", taskId);

    await loadTasks();

}

async function deleteTask(taskId){

    const confirmDelete =
    confirm(
        "Delete Task?"
    );

    if(!confirmDelete){
        return;
    }

    await supabaseClient
    .from("tasks")
    .delete()
    .eq("id", taskId);

    await loadTasks();

}