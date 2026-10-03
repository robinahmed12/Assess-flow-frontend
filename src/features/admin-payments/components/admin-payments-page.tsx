"use client";

import {useAdminPayments} from "../hooks/use-admin-payments";


export function AdminPaymentsPage(){

const {
 data=[],
 isLoading
}=useAdminPayments();


if(isLoading)
 return <div>Loading payments...</div>;


return (

<main className="space-y-5">


<h1 className="text-2xl font-bold">
Payments
</h1>


<div className="rounded-xl border overflow-hidden">


{data.map(payment=>(

<div
key={payment.id}
className="border-b p-4 space-y-1"
>


<p className="font-semibold">
{payment.company?.name}
</p>


<p>
Amount: {payment.amount}
</p>


<p>
Credits:
{payment.creditsPurchased}
</p>


<p>
Status:
{payment.status}
</p>


</div>

))}


</div>


</main>

);

}
