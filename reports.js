document.addEventListener(
"DOMContentLoaded",
async () => {

await loadSummary();
await loadAttendanceReport();
await loadTaskReport();

}
);

async function loadSummary(){

const { count: employeeCount } =
await supabaseClient
.from("users")
.select("*",{count:"exact",head:true});

document.getElementById(
"employeeCount"
).innerText =
employeeCount || 0;

const { count: taskCount } =
await supabaseClient
.from("tasks")
.select("*",{count:"exact",head:true});

document.getElementById(
"taskCount"
).innerText =
taskCount || 0;

const { count: completedTaskCount } =
await supabaseClient
.from("tasks")
.select("*",{count:"exact",head:true})
.eq("status","Completed");

document.getElementById(
"completedTaskCount"
).innerText =
completedTaskCount || 0;

const { count: attendanceCount } =
await supabaseClient
.from("attendance")
.select("*",{count:"exact",head:true});

document.getElementById(
"attendanceCount"
).innerText =
attendanceCount || 0;

}

async function loadAttendanceReport(){

const table =
document.getElementById(
"attendanceReportTable"
);

const { data } =
await supabaseClient
.from("attendance")
.select(`
*,
users(full_name)
`)
.order("created_at",{
ascending:false
})
.limit(20);

table.innerHTML = "";

data.forEach(item => {

table.innerHTML += `
<tr>
<td>${item.users?.full_name || "-"}</td>
<td>${item.attendance_date}</td>
<td>${item.status}</td>
</tr>
`;

});

}

async function loadTaskReport(){

const table =
document.getElementById(
"taskReportTable"
);

const { data } =
await supabaseClient
.from("tasks")
.select("*")
.order("created_at",{
ascending:false
})
.limit(20);

table.innerHTML = "";

data.forEach(task => {

table.innerHTML += `
<tr>
<td>${task.title}</td>
<td>${task.priority}</td>
<td>${task.status}</td>
</tr>
`;

});

}