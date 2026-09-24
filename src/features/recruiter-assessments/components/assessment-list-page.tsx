"use client";

import {useState} from "react";
import Link from "next/link";

import {useAssessments} from "../hooks/use-assessments";
import {usePublishAssessment} from "../hooks/use-publish-assessment";
import {useArchiveAssessment} from "../hooks/use-archive-assessment";
import {
  ASSESSMENT_STATUS_LABELS,
  DRAFT_STATUS,
  ARCHIVED_STATUS,
} from "../constants/assessment.constants";
import type {AssessmentDto} from "../types/assessment.dto";

import {Card,CardContent,CardDescription,CardHeader,CardTitle} from "@/src/shared/components/ui/card";
import {Badge} from "@/src/shared/components/ui/badge";
import {Button} from "@/src/shared/components/ui/button";
import {Skeleton} from "@/src/shared/components/ui/skeleton";
import {Separator} from "@/src/shared/components/ui/separator";
import {
  AlertDialog,AlertDialogAction,AlertDialogCancel,AlertDialogContent,
  AlertDialogDescription,AlertDialogFooter,AlertDialogHeader,
  AlertDialogTitle,
} from "@/src/shared/components/ui/alert-dialog";

export function AssessmentListPage(){

 const {data=[],isLoading}=useAssessments();
 const publish=usePublishAssessment();
 const archive=useArchiveAssessment();
 const [archiveId,setArchiveId]=useState<string|null>(null);

 const archiveTarget=archiveId
  ? data.find(item=>item.id===archiveId)
  : undefined;

 return (
  <main className="space-y-5">

   <div className="flex items-start justify-between gap-4">
    <div className="space-y-1">
     <h1 className="text-2xl font-bold">
      Assessments
     </h1>
     <p className="text-sm text-muted-foreground">
      Create, review and track the assessments you publish.
     </p>
    </div>

    <Button>
     <Link href="/recruiter/assessments/new">
      New Assessment
     </Link>
    </Button>
   </div>

   {isLoading
    ? <AssessmentListSkeleton/>
    : data.length===0
      ? (
        <div className="rounded-xl border border-dashed p-12 text-center">
         <p className="font-medium">
          No assessments yet
         </p>
         <p className="mt-1 text-sm text-muted-foreground">
          Create your first assessment to start inviting candidates.
         </p>
         <Button  className="mt-5">
          <Link href="/recruiter/assessments/new">
           Create assessment
          </Link>
         </Button>
        </div>
      )
      : (
       <div className="space-y-4">
        {data.map(item=>(
         <AssessmentRow
          key={item.id}
          item={item}
          onPublish={()=>publish.mutate(item.id)}
          publishing={publish.isPending&&publish.variables===item.id}
          onArchive={()=>setArchiveId(item.id)}
         />
        ))}
       </div>
      )
   }

   <AlertDialog
    open={Boolean(archiveId)}
    onOpenChange={(open)=>!open&&setArchiveId(null)}
   >
    <AlertDialogContent>
     <AlertDialogHeader>
      <AlertDialogTitle>
       Archive assessment?
      </AlertDialogTitle>
      <AlertDialogDescription>
       {archiveTarget?(
        <>
         <span className="font-semibold">{archiveTarget.title}</span> will be
         archived and will no longer appear in candidate lists. This action
         cannot be undone.
        </>
       ):"This assessment will be archived."}
      </AlertDialogDescription>
     </AlertDialogHeader>

     <AlertDialogFooter>
      <AlertDialogCancel>
       Cancel
      </AlertDialogCancel>
      <AlertDialogAction
       variant="destructive"
       disabled={archive.isPending}
       onClick={()=>{
        if(archiveTarget) archive.mutate(archiveTarget.id);
        setArchiveId(null);
       }}
      >
       Archive
      </AlertDialogAction>
     </AlertDialogFooter>
    </AlertDialogContent>
   </AlertDialog>

  </main>
 );

}

function AssessmentRow({item,onPublish,publishing,onArchive}:{
 item:AssessmentDto;
 onPublish:()=>void;
 publishing:boolean;
 onArchive:()=>void;
}){

 const actionable=item.status!==ARCHIVED_STATUS;

 return (
  <Card className="transition-colors hover:border-primary/40">
   <CardHeader className="flex flex-row items-start justify-between gap-4">
    <div className="space-y-1">
     <CardTitle>
      <Link
       href={`/recruiter/assessments/${item.id}`}
       className="hover:underline"
      >
       {item.title}
      </Link>
     </CardTitle>
     <CardDescription>
      {item.description?(
       <span className="line-clamp-2">{item.description}</span>
      ):"No description set."}
     </CardDescription>
    </div>

    <Badge>
     {ASSESSMENT_STATUS_LABELS[item.status]}
    </Badge>
   </CardHeader>

   <CardContent className="space-y-4 pt-0">
    <div className="grid grid-cols-2 gap-3 text-xs sm:grid-cols-4">
     <Stat label="Duration" value={`${item.duration} min`} />
     <Stat label="Passing score" value={item.passingScore?.toString()??"—"} />
     <Stat label="Problems" value={String(item.problemCount)} />
     <Stat label="Visibility" value={item.resultVisibility} />
    </div>

    <Separator/>

    <div className="flex flex-wrap gap-2">
     {item.status===DRAFT_STATUS&&(
      <Button
       variant="outline"
       size="sm"
       disabled={publishing}
       onClick={onPublish}
      >
       {publishing?"Publishing…":"Publish"}
      </Button>
     )}

     <Button variant="outline" size="sm">
      <Link href={`/recruiter/assessments/${item.id}`}>
       View
      </Link>
     </Button>

     {actionable&&(
      <Button
       variant="ghost"
       size="sm"
       onClick={onArchive}
      >
       Archive
      </Button>
     )}
    </div>
   </CardContent>
  </Card>
 );

}

function Stat({label,value}:{label:string;value:string}){
 return (
  <div>
   <p className="text-muted-foreground">{label}</p>
   <p className="mt-0.5 font-medium">{value}</p>
  </div>
 );
}

function AssessmentListSkeleton(){
 return (
  <div className="space-y-4">
   {[0,1,2].map(i=>(
    <div key={i} className="rounded-xl border p-6">
     <Skeleton className="h-5 w-1/3"/>
     <Skeleton className="mt-3 h-3 w-2/3"/>
    </div>
   ))}
  </div>
 );
}
