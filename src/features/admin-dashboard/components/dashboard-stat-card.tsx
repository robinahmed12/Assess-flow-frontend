export function DashboardStatCard({
 title,
 value
}:{
 title:string;
 value:number|string;
}){

return (

<div className="rounded-xl border p-5">

<p className="text-sm text-muted-foreground">
{title}
</p>

<p className="text-3xl font-bold">
{value}
</p>

</div>

);

}
