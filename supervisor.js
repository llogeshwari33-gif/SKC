document.addEventListener("DOMContentLoaded", async () => {

    await loadDashboard();
    await loadAttendance();
    await loadTasks();

    document
    .getElementById("checkInBtn")
    .addEventListener("click", checkIn);

    document
    .getElementById("checkOutBtn")
    .addEventListener("click", checkOut);

});

function getUser() {

    return JSON.parse(
        localStorage.getItem("skc_user")
    );

}

async function loadDashboard() {

    const user = getUser();

    const { count: totalTasks } =
    await supabaseClient
    .from("tasks")
    .select("*", {
        count: "exact",
        head: true
    })
    .eq("assigned_to", user.id);

    document.getElementById(
        "myTasks"
    ).innerText = totalTasks || 0;

    const { count: completed } =
    await supabaseClient
    .from("tasks")
    .select("*", {
        count: "exact",
        head: true
    })
    .eq("assigned_to", user.id)
    .eq("status", "Completed");

    document.getElementById(
        "completedTasks"
    ).innerText = completed || 0;

    const { count: pending } =
    await supabaseClient
    .from("tasks")
    .select("*", {
        count: "exact",
        head: true
    })
    .eq("assigned_to", user.id)
    .eq("status", "Pending");

    document.getElementById(
        "pendingTasks"
    ).innerText = pending || 0;

}

async function loadAttendance() {

    const user = getUser();

    const today =
    new Date().toISOString().split("T")[0];

    const { data } =
    await supabaseClient
    .from("attendance")
    .select("*")
    .eq("user_id", user.id)
    .eq("attendance_date", today)
    .single();

    if(data){

        document.getElementById(
            "attendanceStatus"
        ).innerText =
        data.status || "Present";

        document.getElementById(
            "checkInTime"
        ).innerText =
        data.check_in || "--";

        document.getElementById(
            "checkOutTime"
        ).innerText =
        data.check_out || "--";

    }

}

async function checkIn() {

    const user = getUser();

    const today =
    new Date().toISOString().split("T")[0];

    const currentTime =
    new Date().toLocaleTimeString();

    const { data } =
    await supabaseClient
    .from("attendance")
    .select("*")
    .eq("user_id", user.id)
    .eq("attendance_date", today)
    .single();

    if(data){

        alert("Already Checked In");

        return;
    }

    await supabaseClient
    .from("attendance")
    .insert([{
        user_id:user.id,
        attendance_date:today,
        check_in:currentTime,
        status:"Present"
    }]);

    alert("Check In Successful");

    location.reload();

}

async function checkOut() {

    const user = getUser();

    const today =
    new Date().toISOString().split("T")[0];

    const currentTime =
    new Date().toLocaleTimeString();

    const { data } =
    await supabaseClient
    .from("attendance")
    .select("*")
    .eq("user_id", user.id)
    .eq("attendance_date", today)
    .single();

    if(!data){

        alert("Please Check In First");

        return;
    }

    await supabaseClient
    .from("attendance")
    .update({
        check_out:currentTime
    })
    .eq("id", data.id);

    alert("Check Out Successful");

    location.reload();

}

async function loadTasks() {

    const user = getUser();

    const table =
    document.getElementById(
        "taskTable"
    );

    const { data, error } =
    await supabaseClient
    .from("tasks")
    .select("*")
    .eq("assigned_to", user.id);

    if(error){

        table.innerHTML =
        `<tr><td colspan="4">Failed to load tasks</td></tr>`;

        return;
    }

    if(!data.length){

        table.innerHTML =
        `<tr><td colspan="4">No tasks assigned</td></tr>`;

        return;
    }

    table.innerHTML = "";

    data.forEach(task => {

        table.innerHTML += `
        <tr>
            <td>${task.title}</td>
            <td>${task.priority}</td>
            <td>${task.status}</td>
            <td>
                <button onclick="completeTask('${task.id}')">
                    Complete
                </button>
            </td>
        </tr>
        `;

    });

}

async function completeTask(taskId) {

    await supabaseClient
    .from("tasks")
    .update({
        status:"Completed",
        completed_at:new Date()
    })
    .eq("id", taskId);

    alert("Task Completed");

    location.reload();

}

async function submitReport() {

    const user = getUser();

    const workDone =
    document.getElementById(
        "workDone"
    ).value;

    const issues =
    document.getElementById(
        "issues"
    ).value;

    const today =
    new Date().toISOString().split("T")[0];

    await supabaseClient
    .from("daily_reports")
    .insert([{
        user_id:user.id,
        report_date:today,
        work_done:workDone,
        issues:issues
    }]);

    alert(
        "Daily Report Submitted"
    );

    document.getElementById(
        "workDone"
    ).value = "";

    document.getElementById(
        "issues"
    ).value = "";

}