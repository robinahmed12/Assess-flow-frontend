"use client";

import {useAdminDashboard} from "../hooks/use-admin-dashboard";
import {DashboardStatCard} from "./dashboard-stat-card";


export function AdminDashboardPage(){

const {
data,
isLoading
}=useAdminDashboard();


if(isLoading)
 return <div>Loading dashboard...</div>;


return (

<main className="space-y-6">


<h1 className="text-2xl font-bold">
Admin Dashboard
</h1>


<section className="grid gap-4 md:grid-cols-4">


<DashboardStatCard
 title="Users"
 value={data?.users?.total ?? 0}
/>


<DashboardStatCard
 title="Active Users"
 value={data?.users?.active ?? 0}
/>


<DashboardStatCard
 title="Recruiters"
 value={data?.users?.byRole?.recruiter ?? 0}
/>


<DashboardStatCard
 title="Candidates"
 value={data?.users?.byRole?.candidate ?? 0}
/>


<DashboardStatCard
 title="Companies"
 value={data?.companies?.total ?? 0}
/>


<DashboardStatCard
 title="Problems"
 value={data?.problems?.total ?? 0}
/>


<DashboardStatCard
 title="Assessments"
 value={data?.assessments?.total ?? 0}
/>


<DashboardStatCard
 title="Payments"
 value={data?.payments?.total ?? 0}
/>


</section>


<section className="grid gap-4 md:grid-cols-3">

<div className="rounded-xl border p-5">
<h2 className="font-semibold">
Assessment Status
</h2>

<p>
Draft: {data?.assessments?.draft ?? 0}
</p>

<p>
Published: {data?.assessments?.published ?? 0}
</p>

</div>


<div className="rounded-xl border p-5">

<h2 className="font-semibold">
Attempt Status
</h2>

<p>
In Progress: {data?.attempts?.inProgress ?? 0}
</p>

<p>
Evaluated: {data?.attempts?.evaluated ?? 0}
</p>

</div>


<div className="rounded-xl border p-5">

<h2 className="font-semibold">
Payment Status
</h2>

<p>
Success: {data?.payments?.succeeded ?? 0}
</p>

<p>
Pending: {data?.payments?.pending ?? 0}
</p>

</div>


</section>


</main>

);

}
