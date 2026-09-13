"use client";

import { useEffect, useState } from "react";

export function AttemptTimer({expiresAt}:{expiresAt:string}) {
 const [remaining,setRemaining]=useState("");

 useEffect(()=>{
  const update=()=>{
   const diff=new Date(expiresAt).getTime()-Date.now();
   if(diff<=0){
    setRemaining("00:00");
    return;
   }
   const min=Math.floor(diff/60000);
   const sec=Math.floor((diff%60000)/1000);
   setRemaining(
    `${String(min).padStart(2,"0")}:${String(sec).padStart(2,"0")}`
   );
  };

  update();
  const id=setInterval(update,1000);
  return ()=>clearInterval(id);
 },[expiresAt]);

 return (
  <div className="rounded-lg border px-4 py-2 font-semibold">
   Time Remaining: {remaining}
  </div>
 );
}
