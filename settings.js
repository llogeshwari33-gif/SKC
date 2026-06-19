document
.getElementById(
"passwordForm"
)
.addEventListener(
"submit",
updatePassword
);

async function updatePassword(e){

e.preventDefault();

const newPassword =
document.getElementById(
"newPassword"
).value;

const { error } =
await supabaseClient.auth
.updateUser({
password:newPassword
});

if(error){

alert(
"Password Update Failed"
);

return;

}

alert(
"Password Updated Successfully"
);

document
.getElementById(
"passwordForm"
)
.reset();

}