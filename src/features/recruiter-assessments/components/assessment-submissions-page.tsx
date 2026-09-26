"use client";

import {useState} from "react";

import {useSubmissions} from "../hooks/use-submissions";
import {useAssessmentDetail} from "../hooks/use-assessment-detail";
import type {
 AttemptStatus,
 SubmissionDto,
} from "../types/assessment.dto";
import {ATTEMPT_STATUS_LABELS} from "../constants/assessment.constants";

import {Button} from "@/src/shared/components/ui/button";
import {Badge} from "@/src/shared/components/ui/badge";
import {Skeleton} from "@/src/shared/components/ui/skeleton";
import {Card,CardContent,CardHeader,CardTitle} from "@/src/shared/components/ui/card";
import {
 Select,SelectContent,SelectItem,SelectTrigger,SelectValue,
} from "@/src/shared/components/ui/select";
import {
 Table,TableBody,TableCell,TableHead,TableHeader,TableRow,
} from "@/src/shared/components/ui/table";

type StatusFilterKey=AttemptStatus|"ALL";

const STATUS_FILTERS:StatusFilterKey[]=[
 "ALL","IN_PROGRESS","SUBMITTED","EVALUATED","EXPIRED",
];

export function AssessmentSubmissionsPage({assessmentId}:{assessmentId:string}){

 const assessment=useAssessmentDetail(assessmentId);

 const [page,setPage]=useState(1);
 const [status,setStatus]=useState<StatusFilterKey>("ALL");
 const pageSize=10;

 const submissions=useSubmissions(assessmentId,{
  page,
  limit:pageSize,
  status:status==="ALL"?undefined:status,
 });

 const totalPages=submissions.data?.meta.totalPages??1;
 const rows=submissions.data?.data??[];
 const total=submissions.data?.meta.total??0;

 return (
  <main className="space-y-5">

   <div className="flex flex-wrap items-start justify-between gap-4">
    <div className="space-y-1">
     <h1 className="text-2xl font-bold">
      Submissions
     </h1>
     <p className="text-sm text-muted-foreground">
      {assessment.data
       ? `${assessment.data.title} · candidate attempts`
       : "Candidate attempts"}
     </p>
    </div>

    <Select
     value={status}
     onValueChange={(value)=>{
      setStatus(value as StatusFilterKey);
      setPage(1);
     }}
    >
     <SelectTrigger className="w-44">
      <SelectValue placeholder="Filter by status"/>
     </SelectTrigger>
     <SelectContent>
      {STATUS_FILTERS.map(key=>(
       <SelectItem key={key} value={key}>
        {key==="ALL"? "All statuses" : ATTEMPT_STATUS_LABELS[key]}
       </SelectItem>
      ))}
     </SelectContent>
    </Select>
   </div>

   <Card>
    <CardHeader className="flex flex-row items-center justify-between">
     <CardTitle>
      Attempts
     </CardTitle>
     <span className="text-xs text-muted-foreground">
      {total} total
     </span>
    </CardHeader>

    <CardContent className="pt-0">
     {submissions.isLoading
      ? <SubmissionsSkeleton/>
      : rows.length===0
        ? (
         <p className="py-10 text-center text-sm text-muted-foreground">
          No submissions yet.
         </p>
        )
        : (
         <Table>
          <TableHeader>
           <TableRow>
            <TableHead>Candidate</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Score</TableHead>
            <TableHead>Result</TableHead>
            <TableHead>Submitted</TableHead>
            <TableHead className="text-right">Review</TableHead>
           </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map(submission=>(
             <SubmissionRow
              key={submission.id}
              submission={submission}
             />
            ))}
          </TableBody>
         </Table>
        )}
    </CardContent>

    {totalPages>1&&(
     <CardContent className="flex items-center justify-between border-t pt-4">
      <Button
       variant="outline"
       size="sm"
       disabled={page<=1}
       onClick={()=>setPage(current=>Math.max(1,current-1))}
      >
       Previous
      </Button>
      <span className="text-xs text-muted-foreground">
       Page {page} of {totalPages}
      </span>
      <Button
       variant="outline"
       size="sm"
       disabled={page>=totalPages}
       onClick={()=>setPage(current=>Math.min(totalPages,current+1))}
      >
       Next
      </Button>
     </CardContent>
    )}
   </Card>
  </main>
 );
}

function SubmissionRow({submission}:{
 submission:SubmissionDto;
}){

 const hasResult=submission.evaluatedAnswerCount>0&&submission.totalScore!=null;

 return (
  <TableRow>
   <TableCell>{submission.candidate.email??submission.candidateEmail}</TableCell>
   <TableCell>
    <Badge variant="secondary">
     {ATTEMPT_STATUS_LABELS[submission.status]}
    </Badge>
   </TableCell>
   <TableCell>
    {hasResult
     ? `${submission.totalScore} pts`
     : "—"}
   </TableCell>
   <TableCell>
    {submission.passed==null
     ? (
      <span className="text-muted-foreground">Pending</span>
     )
     : submission.passed
       ? <Badge>Passed</Badge>
       : <Badge variant="destructive">Failed</Badge>}
   </TableCell>
   <TableCell>
    {submission.submittedAt
     ? new Date(submission.submittedAt).toLocaleDateString()
     : "—"}
   </TableCell>
    <TableCell className="text-right">
     <Button variant="outline" size="sm" disabled title="Submission review is not available yet">
      Review
     </Button>
    </TableCell>
  </TableRow>
 );
}

function SubmissionsSkeleton(){
 return (
  <div className="space-y-3">
   {[0,1,2,3].map(index=>(
    <Skeleton key={index} className="h-12"/>
   ))}
  </div>
 );
}
