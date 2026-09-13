"use client";

import {useCandidateAssessments} from "../hooks/use-candidate-assessments";
import {AssessmentCard} from "./assessment-card";

export function CandidateAssessmentsPage(){

 const {data=[],isLoading}=useCandidateAssessments();

 if(isLoading) return <div>Loading assessments...</div>;

 return (
  <div className="space-y-5">
   <h1 className="text-2xl font-bold">My Assessments</h1>

   {data.length===0 ? (
    <div className="border rounded-xl p-6">
     No assessments assigned
    </div>
   ) : data.map(item=>(
    <AssessmentCard key={item.id} data={item}/>
   ))}
  </div>
 );
}
