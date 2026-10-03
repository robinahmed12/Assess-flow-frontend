"use client";

import {useAdminUsers} from "../hooks/use-admin-users";
import {useUpdateUserStatus} from "../hooks/use-update-user-status";


export function AdminUsersPage(){

const {
 data=[],
 isLoading
}=useAdminUsers();


const update=useUpdateUserStatus();


if(isLoading)
 return <div>Loading users...</div>;


return (

<main className="space-y-5">


<h1 className="text-2xl font-bold">
Users
</h1>


<div className="rounded-xl border overflow-hidden">


{data.map(user=>(

<div
key={user.id}
className="border-b p-4 flex justify-between"
>


<div>

<p className="font-semibold">
{user.name}
</p>

<p>
{user.email}
</p>

<p>
{user.role} - {user.status}
</p>

</div>


<button

className="rounded border px-3 py-1"

onClick={()=>update.mutate({

id:user.id,

status:
 user.status==="ACTIVE"
 ? "SUSPENDED"
 : "ACTIVE"

})}

>

{
 user.status==="ACTIVE"
 ? "Suspend"
 : "Activate"
}

</button>


</div>

))}


</div>


</main>

);

}
