document.addEventListener("DOMContentLoaded", async () => {

    await loadEmployees();

    document
    .getElementById("employeeForm")
    .addEventListener(
        "submit",
        createEmployee
    );

});

async function loadEmployees() {

    const table =
    document.getElementById(
        "employeeTable"
    );

    const { data, error } =
    await supabaseClient
    .from("users")
    .select("*")
    .order("created_at", {
        ascending:false
    });

    if(error){

        table.innerHTML =
        `<tr><td colspan="5">Failed to load employees</td></tr>`;

        return;
    }

    if(!data.length){

        table.innerHTML =
        `<tr><td colspan="5">No employees found</td></tr>`;

        return;
    }

    table.innerHTML = "";

    data.forEach(user => {

        table.innerHTML += `
        <tr>

            <td>${user.full_name}</td>

            <td>${user.email}</td>

            <td>${user.role}</td>

            <td>
                ${user.is_active
                    ? "Active"
                    : "Inactive"}
            </td>

            <td>

                <button
                onclick="toggleStatus('${user.id}', ${user.is_active})">
                    ${user.is_active
                        ? "Disable"
                        : "Enable"}
                </button>

                <button
                onclick="deleteEmployee('${user.id}')">
                    Delete
                </button>

            </td>

        </tr>
        `;

    });

}

async function createEmployee(e) {

    e.preventDefault();

    alert(
        "Production Setup Required: User creation should be done through Supabase Edge Function."
    );

}

async function toggleStatus(
    userId,
    currentStatus
){

    const { error } =
    await supabaseClient
    .from("users")
    .update({
        is_active: !currentStatus
    })
    .eq("id", userId);

    if(error){

        alert("Update Failed");

        return;
    }

    alert("Status Updated");

    await loadEmployees();

}

async function deleteEmployee(userId){

    const confirmDelete =
    confirm(
        "Delete Employee?"
    );

    if(!confirmDelete){
        return;
    }

    const { error } =
    await supabaseClient
    .from("users")
    .delete()
    .eq("id", userId);

    if(error){

        alert("Delete Failed");

        return;
    }

    alert("Employee Deleted");

    await loadEmployees();

}