document.addEventListener(
"DOMContentLoaded",
async () => {

await loadNotifications();

}
);

async function loadNotifications(){

const user =
JSON.parse(
localStorage.getItem(
"skc_user"
)
);

const container =
document.getElementById(
"notificationList"
);

const { data } =
await supabaseClient
.from("notifications")
.select("*")
.eq("user_id",user.id)
.order("created_at",{
ascending:false
});

if(!data.length){

container.innerHTML =
"No Notifications";

return;

}

container.innerHTML = "";

data.forEach(item => {

container.innerHTML += `
<div style="
padding:15px;
margin-bottom:10px;
border:1px solid #e2e8f0;
border-radius:10px;">
<h4>${item.title}</h4>
<p>${item.message}</p>
</div>
`;

});

}