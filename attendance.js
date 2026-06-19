document.addEventListener(
    "DOMContentLoaded",
    async () => {

        document
        .getElementById("attendanceDate")
        .value =
        new Date()
        .toISOString()
        .split("T")[0];

        await loadAttendanceStats();
        await loadAttendance();

    }
);

async function loadAttendanceStats() {

    const today =
    new Date()
    .toISOString()
    .split("T")[0];

    const { count: presentCount } =
    await supabaseClient
    .from("attendance")
    .select("*", {
        count:"exact",
        head:true
    })
    .eq("attendance_date", today);

    document.getElementById(
        "presentCount"
    ).innerText =
    presentCount || 0;

    const { count: checkInCount } =
    await supabaseClient
    .from("attendance")
    .select("*", {
        count:"exact",
        head:true
    })
    .not(
        "check_in",
        "is",
        null
    )
    .eq("attendance_date", today);

    document.getElementById(
        "checkInCount"
    ).innerText =
    checkInCount || 0;

    const { count: checkOutCount } =
    await supabaseClient
    .from("attendance")
    .select("*", {
        count:"exact",
        head:true
    })
    .not(
        "check_out",
        "is",
        null
    )
    .eq("attendance_date", today);

    document.getElementById(
        "checkOutCount"
    ).innerText =
    checkOutCount || 0;

    const { count: totalUsers } =
    await supabaseClient
    .from("users")
    .select("*", {
        count:"exact",
        head:true
    });

    document.getElementById(
        "absentCount"
    ).innerText =
    (totalUsers || 0)
    -
    (presentCount || 0);

}

async function loadAttendance(
    selectedDate = null
) {

    const table =
    document.getElementById(
        "attendanceTable"
    );

    const attendanceDate =
    selectedDate ||
    new Date()
    .toISOString()
    .split("T")[0];

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
    .eq(
        "attendance_date",
        attendanceDate
    )
    .order(
        "created_at",
        {
            ascending:false
        }
    );

    if(error){

        table.innerHTML =
        `
        <tr>
            <td colspan="5">
                Failed To Load
            </td>
        </tr>
        `;

        return;
    }

    if(!data.length){

        table.innerHTML =
        `
        <tr>
            <td colspan="5">
                No Attendance Found
            </td>
        </tr>
        `;

        return;
    }

    table.innerHTML = "";

    data.forEach(row => {

        table.innerHTML +=
        `
        <tr>

            <td>
                ${row.users?.full_name || "-"}
            </td>

            <td>
                ${row.attendance_date}
            </td>

            <td>
                ${row.check_in || "-"}
            </td>

            <td>
                ${row.check_out || "-"}
            </td>

            <td>
                ${row.status || "-"}
            </td>

        </tr>
        `;

    });

}

async function filterAttendance() {

    const selectedDate =
    document.getElementById(
        "attendanceDate"
    ).value;

    await loadAttendance(
        selectedDate
    );

}