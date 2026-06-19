import { serve } from "https://deno.land/std/http/server.ts";

import { createClient }
from "https://esm.sh/@supabase/supabase-js@2";

serve(async(req)=>{

const body =
await req.json();

const supabase =
createClient(
Deno.env.get("SUPABASE_URL")!,
Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

const {
email,
password,
full_name,
role
} = body;

const {
data,
error
} =
await supabase.auth.admin.createUser({

email,
password,
email_confirm:true

});

if(error){

return new Response(
JSON.stringify(error),
{
status:400
}
);

}

await supabase
.from("users")
.insert([{

id:data.user.id,
email,
full_name,
role,
is_active:true

}]);

return new Response(
JSON.stringify({
success:true
}),
{
headers:{
"Content-Type":
"application/json"
}
}
);

});