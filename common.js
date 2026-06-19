const currentUser =
JSON.parse(
localStorage.getItem("skc_user")
);

if(
!currentUser &&
!window.location.pathname.includes("index.html")
){
    window.location.href = "../index.html";
}

document.addEventListener(
"DOMContentLoaded",
()=>{

const userName =
document.getElementById("userName");

if(
userName &&
currentUser
){
    userName.innerText =
    currentUser.full_name;
}

});

function logout(){

localStorage.removeItem(
"skc_user"
);

supabaseClient.auth.signOut();

window.location.href =
"../index.html";

}

function formatDate(date){

return new Date(date)
.toLocaleDateString(
"en-IN"
);

}

function formatDateTime(date){

return new Date(date)
.toLocaleString(
"en-IN"
);

}