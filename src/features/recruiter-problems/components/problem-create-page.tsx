"use client";

import {useState} from "react";
import {useCreateProblem} from "../hooks/use-create-problem";

export function ProblemCreatePage(){

 const create=useCreateProblem();

 const [title,setTitle]=useState("");

 return (
  <main className="space-y-5">

   <h1 className="text-2xl font-bold">
    Create Problem
   </h1>

   <input
    className="border rounded p-2 w-full"
    placeholder="Problem title"
    value={title}
    onChange={e=>setTitle(e.target.value)}
   />

   <button
    className="rounded bg-primary text-primary-foreground px-4 py-2"
    onClick={()=>
     create.mutate({
      title,
      description:"",
      type:"MCQ",
      points:1,
      tags:[]
     })
    }
   >
    Save
   </button>

  </main>
 );

}
