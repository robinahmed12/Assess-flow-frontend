"use client";

import {useCandidateResult} from "../hooks/use-candidate-result";

export function CandidateResultPage({
 attemptId
}:{
 attemptId:string;
}){

 const {data,isLoading,error}=useCandidateResult(attemptId);

 if(isLoading)
  return <div>Loading result...</div>;

 if(error)
  return (
   <div>
    Result unavailable or waiting for review
   </div>
  );

 return (
  <div className="space-y-4">
   <h1 className="text-2xl font-bold">
    {data?.assessment?.title}
   </h1>

   <div className="rounded-xl border p-5">
    <p>
     Score: {data?.totalScore ?? "N/A"}
    </p>
    <p>
     Percentage: {data?.percentage ?? "N/A"}
    </p>
    <p>
     Status: {data?.status}
    </p>
   </div>
  </div>
 );
}
