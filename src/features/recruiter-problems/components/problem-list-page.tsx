"use client";

import {useProblems} from "../hooks/use-problems";

export function ProblemListPage(){

 const {data=[],isLoading}=useProblems();

 if(isLoading)
  return <div>Loading problems...</div>;

 return (
  <main className="space-y-5">

   <h1 className="text-2xl font-bold">
    Problems
   </h1>

   {data.map(problem=>(
    <div
     key={problem.id}
     className="rounded-xl border p-5"
    >
     <h2 className="font-semibold">
      {problem.title}
     </h2>

     <p>
      Type: {problem.type}
     </p>

     <p>
      Points: {problem.points}
     </p>

    </div>
   ))}

  </main>
 );

}
