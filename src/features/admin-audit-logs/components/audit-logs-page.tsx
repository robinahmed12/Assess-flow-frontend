"use client";

import {useAuditLogs} from "../hooks/use-audit-logs";


export function AuditLogsPage(){

const {
 data=[],
 isLoading
}=useAuditLogs();


if(isLoading)
 return <div>Loading audit logs...</div>;


return (

<main className="space-y-5">


<h1 className="text-2xl font-bold">
Audit Logs
</h1>


<div className="rounded-xl border overflow-hidden">


{data.map(log=>(

<div
key={log.id}
className="border-b p-4 space-y-1"
>


<p className="font-semibold">
{log.action}
</p>


<p>
Entity:
{log.entityType}
</p>


<p>
Entity ID:
{log.entityId}
</p>


<p>
Actor:
{log.actor?.email ?? "System"}
</p>


<details>

<summary className="cursor-pointer">
Metadata
</summary>

<pre className="text-sm mt-2 overflow-auto">
{JSON.stringify(
 log.metadata,
 null,
 2
)}
</pre>

</details>


</div>

))}


</div>


</main>

);

}
