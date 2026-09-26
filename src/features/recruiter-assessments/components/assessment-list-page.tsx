"use client";

import {useMemo, useState} from "react";
import Link from "next/link";
import {LayoutGrid, Table2} from "lucide-react";

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
  Table,TableBody,TableCell,TableHead,TableHeader,TableRow,
} from "@/src/shared/components/ui/table";
import {
  AlertDialog,AlertDialogAction,AlertDialogCancel,AlertDialogContent,
  AlertDialogDescription,AlertDialogFooter,AlertDialogHeader,
  AlertDialogTitle,
} from "@/src/shared/components/ui/alert-dialog";
import { cn } from "@/src/shared/utils/utils";


type ViewMode = "table" | "kanban";

export function AssessmentListPage(){

 const {data=[],isLoading}=useAssessments();
 const publish=usePublishAssessment();
 const archive=useArchiveAssessment();
 const [archiveId,setArchiveId]=useState<string|null>(null);
 const [view,setView]=useState<ViewMode>("table");

 const archiveTarget=archiveId
  ? data.find(item=>item.id===archiveId)
  : undefined;

 const publishing=(id:string)=>publish.isPending&&publish.variables===id;

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

    <div className="flex items-center gap-3">
     <ViewToggle view={view} onChange={setView}/>
     <Button>
      <Link href="/recruiter/assessments/new">
       New Assessment
      </Link>
     </Button>
    </div>
   </div>

   {isLoading
    ? <AssessmentListSkeleton view={view}/>
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
      : view==="table"
        ? (
          <AssessmentTable
           data={data}
           onPublish={(id)=>publish.mutate(id)}
           isPublishing={publishing}
           onArchive={setArchiveId}
          />
        )
        : (
          <AssessmentKanban
           data={data}
           onPublish={(id)=>publish.mutate(id)}
           isPublishing={publishing}
           onArchive={setArchiveId}
          />
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

/* ---------- view toggle ---------- */

function ViewToggle({view,onChange}:{
 view:ViewMode;
 onChange:(view:ViewMode)=>void;
}){
 return (
  <div className="flex items-center rounded-lg border p-1">
   <button
    type="button"
    aria-label="Table view"
    aria-pressed={view==="table"}
    onClick={()=>onChange("table")}
    className={cn(
     "flex h-8 w-8 items-center justify-center rounded-md transition-colors",
     view==="table"
      ? "bg-primary text-primary-foreground"
      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
    )}
   >
    <Table2 className="h-4 w-4"/>
   </button>
   <button
    type="button"
    aria-label="Kanban view"
    aria-pressed={view==="kanban"}
    onClick={()=>onChange("kanban")}
    className={cn(
     "flex h-8 w-8 items-center justify-center rounded-md transition-colors",
     view==="kanban"
      ? "bg-primary text-primary-foreground"
      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
    )}
   >
    <LayoutGrid className="h-4 w-4"/>
   </button>
  </div>
 );
}

/* ---------- shared row actions ---------- */

function RowActions({item,onPublish,publishing,onArchive}:{
 item:AssessmentDto;
 onPublish:()=>void;
 publishing:boolean;
 onArchive:()=>void;
}){
 const actionable=item.status!==ARCHIVED_STATUS;

 return (
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
 );
}

/* ---------- table view ---------- */

function AssessmentTable({data,onPublish,isPublishing,onArchive}:{
 data:AssessmentDto[];
 onPublish:(id:string)=>void;
 isPublishing:(id:string)=>boolean;
 onArchive:(id:string)=>void;
}){
 return (
  <div className="overflow-x-auto rounded-xl border">
   <Table>
    <TableHeader>
     <TableRow>
      <TableHead>Assessment</TableHead>
      <TableHead>Status</TableHead>
      <TableHead>Duration</TableHead>
      <TableHead>Passing score</TableHead>
      <TableHead>Problems</TableHead>
      <TableHead>Visibility</TableHead>
      <TableHead className="text-right">Actions</TableHead>
     </TableRow>
    </TableHeader>
    <TableBody>
     {data.map(item=>(
      <TableRow key={item.id}>
       <TableCell className="max-w-[280px]">
        <Link
         href={`/recruiter/assessments/${item.id}`}
         className="font-medium hover:underline"
        >
         {item.title}
        </Link>
        <p className="mt-0.5 truncate text-xs text-muted-foreground">
         {item.description||"No description set."}
        </p>
       </TableCell>
       <TableCell>
        <Badge>{ASSESSMENT_STATUS_LABELS[item.status]}</Badge>
       </TableCell>
       <TableCell>{item.duration} min</TableCell>
       <TableCell>{item.passingScore?.toString()??"—"}</TableCell>
       <TableCell>{item.problemCount}</TableCell>
       <TableCell className="capitalize">{item.resultVisibility}</TableCell>
       <TableCell className="text-right">
        <div className="flex justify-end">
         <RowActions
          item={item}
          onPublish={()=>onPublish(item.id)}
          publishing={isPublishing(item.id)}
          onArchive={()=>onArchive(item.id)}
         />
        </div>
       </TableCell>
      </TableRow>
     ))}
    </TableBody>
   </Table>
  </div>
 );
}

/* ---------- kanban view ---------- */

function AssessmentKanban({data,onPublish,isPublishing,onArchive}:{
 data:AssessmentDto[];
 onPublish:(id:string)=>void;
 isPublishing:(id:string)=>boolean;
 onArchive:(id:string)=>void;
}){
 const columns=useMemo(()=>{
  const statuses=Object.keys(ASSESSMENT_STATUS_LABELS) as Array<keyof typeof ASSESSMENT_STATUS_LABELS>;
  return statuses.map(status=>({
   status,
   label:ASSESSMENT_STATUS_LABELS[status],
   items:data.filter(item=>item.status===status),
  }));
 },[data]);

 return (
  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
   {columns.map(column=>(
    <div key={column.status} className="flex flex-col rounded-xl border bg-muted/30">
     <div className="flex items-center justify-between border-b px-3 py-2.5">
      <span className="text-sm font-medium">{column.label}</span>
      <span className="rounded-full bg-background px-2 py-0.5 text-xs text-muted-foreground">
       {column.items.length}
      </span>
     </div>

     <div className="flex-1 space-y-3 p-3">
      {column.items.length===0
       ? (
         <p className="rounded-lg border border-dashed p-4 text-center text-xs text-muted-foreground">
          Nothing here
         </p>
       )
       : column.items.map(item=>(
        <Card key={item.id} className="transition-colors hover:border-primary/40">
         <CardHeader className="space-y-1 pb-2">
          <CardTitle className="text-sm">
           <Link
            href={`/recruiter/assessments/${item.id}`}
            className="hover:underline"
           >
            {item.title}
           </Link>
          </CardTitle>
          <CardDescription className="line-clamp-2 text-xs">
           {item.description||"No description set."}
          </CardDescription>
         </CardHeader>

         <CardContent className="space-y-3 pt-0">
          <div className="grid grid-cols-2 gap-2 text-[11px]">
           <Stat label="Duration" value={`${item.duration} min`} />
           <Stat label="Passing" value={item.passingScore?.toString()??"—"} />
           <Stat label="Problems" value={String(item.problemCount)} />
           <Stat label="Visibility" value={item.resultVisibility} />
          </div>

          <Separator/>

          <RowActions
           item={item}
           onPublish={()=>onPublish(item.id)}
           publishing={isPublishing(item.id)}
           onArchive={()=>onArchive(item.id)}
          />
         </CardContent>
        </Card>
       ))
      }
     </div>
    </div>
   ))}
  </div>
 );
}

/* ---------- shared bits ---------- */

function Stat({label,value}:{label:string;value:string}){
 return (
  <div>
   <p className="text-muted-foreground">{label}</p>
   <p className="mt-0.5 font-medium">{value}</p>
  </div>
 );
}

function AssessmentListSkeleton({view}:{view:ViewMode}){
 if(view==="kanban"){
  return (
   <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
    {[0,1,2,3].map(i=>(
     <div key={i} className="space-y-3 rounded-xl border p-3">
      <Skeleton className="h-4 w-1/2"/>
      <Skeleton className="h-20 w-full rounded-lg"/>
      <Skeleton className="h-20 w-full rounded-lg"/>
     </div>
    ))}
   </div>
  );
 }
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