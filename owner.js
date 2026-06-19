// SKC/js/owner.js

document.addEventListener("DOMContentLoaded", async () => {

    await loadDashboardStats();
    await loadAttendance();
    await loadTasks();
    await loadActivities();

});

async function loadDashboardStats() {

    try {

        const { count: employeeCount } =
        await supabaseClient
        .from("users")
        .select("*", { count: "exact", head: true });

        document.getElementById(
            "totalEmployees"
        ).innerText = employeeCount || 0;

        const { count: managerCount } =
        await supabaseClient
        .from("users")
        .select("*", { count: "exact", head: true })
        .eq("role", "manager");

        document.getElementById(
            "totalManagers"
        ).innerText = managerCount || 0;

        const { count: supervisorCount } =
        await supabaseClient
        .from("users")
        .select("*", { count: "exact", head: true })
        .eq("role", "supervisor");

        document.getElementById(
            "totalSupervisors"
        ).innerText = supervisorCount || 0;

        const today =
        new Date().toISOString().split("T")[0];

        const { count: presentCount } =
        await supabaseClient
        .from("attendance")
        .select("*", { count: "exact", head: true })
        .eq("attendance_date", today);

        document.getElementById(
            "presentToday"
        ).innerText = presentCount || 0;

        const { count: pendingCount } =
        await supabaseClient
        .from("tasks")
        .select("*", { count: "exact", head: true })
        .eq("status", "Pending");

        document.getElementById(
            "pendingTasks"
        ).innerText = pendingCount || 0;

        const { count: completedCount } =
        await supabaseClient
        .from("tasks")
        .select("*", { count: "exact", head: true })
        .eq("status", "Completed");

        document.getElementById(
            "completedTasks"
        ).innerText = completedCount || 0;

    }
    catch(error){

        console.error(error);

    }

}

async function loadAttendance() {

    const table =
    document.getElementById(
        "attendanceTable"
    );

    const today =
    new Date().toISOString().split("T")[0];

    const { data, error } =
    await supabaseClient
    .from("attendance")
    .select(`
        *,
        users(
            full_name,
            role
        )
    `)
    .eq("attendance_date", today)
    .limit(10);

    if(error){

        table.innerHTML =
        `<tr><td colspan="4">Failed to load attendance</td></tr>`;

        return;
    }

    if(!data.length){

        table.innerHTML =
        `<tr><td colspan="4">No attendance found</td></tr>`;

        return;
    }

    table.innerHTML = "";

    data.forEach(row => {

        table.innerHTML += `
        <tr>
            <td>${row.users?.full_name || "-"}</td>
            <td>${row.users?.role || "-"}</td>
            <td>${row.check_in || "-"}</td>
            <td>${row.status || "-"}</td>
        </tr>
        `;

    });

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
    })
    .limit(10);

    if(error){

        table.innerHTML =
        `<tr><td colspan="4">Failed to load tasks</td></tr>`;

        return;
    }

    if(!data.length){

        table.innerHTML =
        `<tr><td colspan="4">No tasks found</td></tr>`;

        return;
    }

    table.innerHTML = "";

    data.forEach(task => {

        table.innerHTML += `
        <tr>
            <td>${task.title}</td>
            <td>${task.assigned_to || "-"}</td>
            <td>${task.priority}</td>
            <td>${task.status}</td>
        </tr>
        `;

    });

}

async function loadActivities() {

    const container =
    document.getElementById(
        "activityContainer"
    );

    const { data, error } =
    await supabaseClient
    .from("notifications")
    .select("*")
    .order("created_at", {
        ascending:false
    })
    .limit(10);

    if(error){

        container.innerHTML =
        "Failed to load activities";

        return;
    }

    if(!data.length){

        container.innerHTML =
        "No activities available";

        return;
    }

    container.innerHTML = "";

    data.forEach(item => {

        container.innerHTML += `
        <div style="
            padding:10px;
            border-bottom:1px solid #e2e8f0;">
            <strong>${item.title}</strong><br>
            ${item.message}
        </div>`;

    });

}
``` 🚀💚