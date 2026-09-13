"use client";

import type {CandidateAssessmentDto} from "../types/candidate-assessments.dto";
import {StatusBadge} from "./status-badge";
import {formatDate} from "../utils/date-format";
import {useStartAssessment} from "../hooks/use-start-assessment";

export function AssessmentCard({data}:{data:CandidateAssessmentDto}){

 const start=useStartAssessment();

 const canStart=!data.attempt && data.assessment.status==="PUBLISHED";
 const canResume=data.attempt?.status==="IN_PROGRESS";

 return (
  <div className="rounded-xl border p-5 space-y-3">
   <div className="flex justify-between">
    <h2 className="font-semibold">{data.assessment.title}</h2>
    <StatusBadge status={data.status}/>
   </div>

   <p>Duration: {data.assessment.duration} minutes</p>
   <p>Deadline: {formatDate(data.expiresAt)}</p>

   {data.attempt && <StatusBadge status={data.attempt.status}/>}

   {canStart && (
    <button onClick={()=>start.mutate(data.assessment.id)}
    className="rounded bg-primary px-4 py-2 text-primary-foreground">
     Start
    </button>
   )}

   {canResume && (
    <button onClick={()=>start.mutate(data.assessment.id)}
    className="rounded bg-primary px-4 py-2 text-primary-foreground">
     Resume
    </button>
   )}
  </div>
 );
}
