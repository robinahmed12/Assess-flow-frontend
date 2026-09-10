"use client";
export default function Error({reset}:{error:Error;reset:()=>void}){return <div><button onClick={reset}>Retry</button></div>;}
