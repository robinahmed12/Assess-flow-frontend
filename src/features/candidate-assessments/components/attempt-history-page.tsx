"use client";

import {useAttemptHistory} from "../hooks/use-attempt-history";
import {StatusBadge} from "./status-badge";
import {formatDate} from "../utils/date-format";

export function AttemptHistoryPage(){

 const {data=[],isLoading}=useAttemptHistory();

 if(isLoading) return <div>Loading attempts...</div>;

 return (
  <div className="space-y-5">
   <h1 className="text-2xl font-bold">Attempt History</h1>

   {data.map(item=>(
    <div key={item.id} className="rounded-xl border p-5 space-y-2">
     <h2 className="font-semibold">{item.assessment.title}</h2>
     <StatusBadge status={item.status}/>
     <p>Started: {formatDate(item.startedAt)}</p>
     <p>Score: {item.score ?? "Not available"}</p>
     <p>Percentage: {item.percentage ?? "Not available"}%</p>
    </div>
   ))}
  </div>
 );
}
