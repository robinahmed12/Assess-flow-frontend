"use client";

import {useCompany} from "../hooks/use-company";
import {useUpdateCompany} from "../hooks/use-update-company";
import {useState} from "react";


export function CompanyPage(){

 const {data,isLoading}=useCompany();
 const update=useUpdateCompany();

 const [name,setName]=useState("");


 if(isLoading)
  return <div>Loading company...</div>;


 return (

 <main className="space-y-6">

  <h1 className="text-2xl font-bold">
   Company Settings
  </h1>


  <div className="rounded-xl border p-5 space-y-4">

   <div>
    <p className="text-sm text-muted-foreground">
     Company Name
    </p>

    <input
     className="border rounded px-3 py-2 w-full"
     defaultValue={data?.name}
     onChange={(e)=>setName(e.target.value)}
    />

   </div>


   <button
    className="rounded bg-primary text-primary-foreground px-4 py-2"
    onClick={()=>update.mutate({name})}
   >
    Save
   </button>


  </div>


  <div className="rounded-xl border p-5 space-y-2">

   <p>
    Credits: {data?.credits ?? 0}
   </p>

   <p>
    License:
    {data?.companyLicensePaperUrl
      ? " Available"
      : " Not uploaded"}
   </p>


   <p>
    Self Document:
    {data?.selfDocumentUrl
      ? " Available"
      : " Not uploaded"}
   </p>

  </div>

 </main>

 );

}
