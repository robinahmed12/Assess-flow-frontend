"use client";

import Link from "next/link";
import {toast} from "sonner";

import {useAssessmentDetail} from "../hooks/use-assessment-detail";
import {usePublishAssessment} from "../hooks/use-publish-assessment";
import {useArchiveAssessment} from "../hooks/use-archive-assessment";
import {ASSESSMENT_STATUS_LABELS} from "../constants/assessment.constants";
import {DRAFT_STATUS,PUBLISHED_STATUS,ARCHIVED_STATUS} from "../constants/assessment.constants";
import type {AssessmentDetailDto} from "../types/assessment.dto";

import {
 Card,CardContent,CardDescription,CardHeader,CardTitle,
} from "@/src/shared/components/ui/card";
import {Badge} from "@/src/shared/components/ui/badge";
import {Button} from "@/src/shared/components/ui/button";
import {Skeleton} from "@/src/shared/components/ui/skeleton";
import {Separator} from "@/src/shared/components/ui/separator";
import {
 AlertDialog,AlertDialogAction,AlertDialogCancel,AlertDialogContent,
 AlertDialogDescription,AlertDialogFooter,AlertDialogHeader,AlertDialogTitle,
} from "@/src/shared/components/ui/alert-dialog";

export function AssessmentDetailPage({assessmentId}:{assessmentId:string}){

 const {data,isLoading,totalPoints}=useAssessmentDetail(assessmentId);
 const publish=usePublishAssessment();
 const archive=useArchiveAssessment();


 return (
  <main className="space-y-5">

   {isLoading||!data
    ? <AssessmentDetailSkeleton/>
    : (
     <>
      <div className="space-y-1">
       <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
         <h1 className="text-2xl font-bold">
          {data.title}
         </h1>
         {data.description?(
          <p className="max-w-2xl text-sm text-muted-foreground">
           {data.description}
          </p>
         ):"No description set."}
        </div>

        <Badge>
         {ASSESSMENT_STATUS_LABELS[data.status]}
        </Badge>
       </div>

       <div className="flex flex-wrap gap-2 pt-2">
        {data.status===DRAFT_STATUS&&(
         <Button
          variant="outline"
          disabled={publish.isPending}
          onClick={()=>publish.mutate(data.id)}
         >
          {publish.isPending?"Publishing…":"Publish"}
         </Button>
        )}

        <Button variant="outline">
         <Link href={`/recruiter/assessments/${data.id}/edit`}>
          Edit
         </Link>
        </Button>

        <Button variant="outline">
         <Link href={`/recruiter/assessments/${data.id}/invitations`}>
          Invitations
         </Link>
        </Button>

        <Button variant="outline">
         <Link href={`/recruiter/assessments/${data.id}/submissions`}>
          Submissions
         </Link>
        </Button>

        <Button variant="outline">
         <Link href={`/recruiter/assessments/${data.id}/report`}>
          Report
         </Link>
        </Button>

        {data.status!==ARCHIVED_STATUS&&(
         <Button
          variant="ghost"
          onClick={()=>archive.mutate(data.id)}
         >
          Archive
         </Button>
        )}
       </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
       <Stat label="Duration" value={`${data.duration} minutes`} />
       <Stat label="Passing score" value={data.passingScore?.toString()??"—"} />
       <Stat label="Problems" value={String(data.problems.length)} />
      </div>

      <Stat label="Total points" value={`${String(totalPoints)} pts`} />
     </>
    )
   }

   <Separator/>

   <section className="space-y-3">
    <h2 className="text-lg font-semibold">
     Problems
    </h2>

    {isLoading||!data
     ? <ProblemListSkeleton/>
     : data.problems.length===0
       ? (
        <p className="text-sm text-muted-foreground">
         No problems attached yet. Edit this assessment to add some.
        </p>
       )
       : (
        <div className="space-y-2">
         {data.problems.map(problem=>(
          <div
           key={problem.id}
           className="flex items-center justify-between gap-4 rounded-xl border p-4"
          >
           <div className="space-y-0.5">
            <p className="font-medium">
             {problem.problem.title}
            </p>
            <p className="text-xs text-muted-foreground">
             {problem.problem.type}
            </p>
           </div>
           <div className="text-right">
            <p className="font-medium">
             {problem.problem.points} pts
            </p>
           </div>
          </div>
         ))}
        </div>
       )}
   </section>

   <AlertDialog>
    <AlertDialogContent>
     <AlertDialogHeader>
      <AlertDialogTitle>
       Archive assessment?
      </AlertDialogTitle>
      <AlertDialogDescription>
       This assessment will be archived and hidden from candidate reports.
      </AlertDialogDescription>
     </AlertDialogHeader>

     <AlertDialogFooter>
      <AlertDialogCancel>
       Cancel
      </AlertDialogCancel>
      <AlertDialogAction
       variant="destructive"
       onClick={onArchive}
      >
       Archive
      </AlertDialogAction>
     </AlertDialogFooter>
    </AlertDialogContent>
   </AlertDialog>

  </main>
 );

 function onArchive(){
  archive.mutate(data?.id??"",{
   onSuccess:()=>toast.success("Assessment archived"),
   onError:()=>toast.error("Could not archive assessment"),
  });
 }

}

function Stat({label,value}:{label:string;value:string}){
 return (
  <div className="rounded-xl border p-4">
   <p className="text-xs text-muted-foreground">
    {label}
   </p>
   <p className="mt-1 font-medium">
    {value}
   </p>
  </div>
 );
}

function AssessmentDetailSkeleton(){
 return (
  <div className="space-y-4">
   <Skeleton className="h-8 w-1/3"/>
   <Skeleton className="h-4 w-2/3"/>
   <div className="grid gap-4 sm:grid-cols-3">
    {[0,1,2].map(index=>(
     <Skeleton key={index} className="h-20"/>
    ))}
   </div>
  </div>
 );
}

function ProblemListSkeleton(){
 return (
  <div className="space-y-2">
   {[0,1,2].map(index=>(
    <Skeleton key={index} className="h-14"/>
   ))}
  </div>
 );
}
