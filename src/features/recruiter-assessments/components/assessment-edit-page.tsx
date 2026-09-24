"use client";

import {useEffect,useMemo,useState} from "react";
import {useRouter} from "next/navigation";
import {toast} from "sonner";

import {useAssessmentDetail} from "../hooks/use-assessment-detail";
import {useUpdateAssessment} from "../hooks/use-update-assessment";
import {useProblems} from "../../recruiter-problems/hooks/use-problems";
import {updateAssessmentSchema} from "../schemas/assessment.schemas";

import {Button} from "@/src/shared/components/ui/button";
import {Input} from "@/src/shared/components/ui/input";
import {Label} from "@/src/shared/components/ui/label";
import {Textarea} from "@/src/shared/components/ui/textarea";
import {Checkbox} from "@/src/shared/components/ui/checkbox";
import {Badge} from "@/src/shared/components/ui/badge";
import {Skeleton} from "@/src/shared/components/ui/skeleton";
import {Separator} from "@/src/shared/components/ui/separator";
import {Card,CardContent,CardHeader,CardTitle} from "@/src/shared/components/ui/card";
import Link from "next/link";

export function AssessmentEditPage({assessmentId}:{assessmentId:string}){

 const router=useRouter();
 const {data,isLoading}=useAssessmentDetail(assessmentId);
 const update=useUpdateAssessment();
 const problems=useProblems();

 const [title,setTitle]=useState("");
 const [description,setDescription]=useState("");
 const [duration,setDuration]=useState("");
 const [passingScore,setPassingScore]=useState("");
 const [problemIds,setProblemIds]=useState<string[]>([]);
 const [errors,setErrors]=useState<Record<string,string>>({});

 useEffect(()=>{
  if(!data)return;
 // eslint-disable-next-line react-hooks/set-state-in-effect -- sync the controlled form once the fetched assessment arrives (prefill)
// eslint-disable-next-line react-hooks/set-state-in-effect -- sync the controlled form once the fetched assessment arrives (intentional prefill before the first Submit)
 setTitle(data.title);
  setDescription(data.description??"");
  setDuration(String(data.duration));
  setPassingScore(data.passingScore!=null?String(data.passingScore):"");
  setProblemIds(data.problems.map(item=>item.problem.id));
 },[data]);

 const selectedPoints=useMemo(
  ()=>problemIds.reduce(
   (sum,id)=>{
    const problem=(problems.data??[]).find(item=>item.id===id);
    return sum+(problem?.points??0);
   },
   0
  ),
  [problemIds,problems.data]
 );

 const toggleProblem=(id:string)=>{
  setProblemIds(current=>
   current.includes(id)
    ? current.filter(pid=>pid!==id)
    : [...current,id]
  );
 };

 if(isLoading||!data){
  return <EditPageSkeleton/>;
 }

 const onSubmit=()=>{
  const parsed=updateAssessmentSchema.safeParse({
   title,
   description:description.trim()?description:null,
   durationMinutes:duration,
   passingScore,
   problemIds,
  });

  if(!parsed.success){
   const next:Record<string,string>={};
   parsed.error.issues.forEach(issue=>{
    const key=issue.path[0]?.toString()??"form";
    if(!next[key]) next[key]=issue.message;
   });
   setErrors(next);
   return;
  }

  setErrors({});

  update.mutate({
   id:data.id,
   payload:parsed.data,
  },{
   onSuccess:()=>{
    toast.success("Assessment updated");
    router.push(`/recruiter/assessments/${data.id}`);
   },
   onError:()=>{
    toast.error("Could not update assessment");
   },
  });
 };

 return (
  <main className="mx-auto max-w-3xl space-y-6">

   <div className="space-y-1">
    <h1 className="text-2xl font-bold">
     Edit assessment
    </h1>
    <p className="text-sm text-muted-foreground">
     Update the details of this assessment. Duration cannot be changed once set.
    </p>
   </div>

   <Card>
    <CardHeader>
     <CardTitle>
      Details
     </CardTitle>
    </CardHeader>

    <CardContent className="space-y-4">
     <div className="space-y-1.5">
      <Label htmlFor="title">
       Title
      </Label>
      <Input
       id="title"
       value={title}
       onChange={(event)=>setTitle(event.target.value)}
      />
      {errors.title&&(
       <p className="text-xs text-destructive">
        {errors.title}
       </p>
      )}
     </div>

     <div className="space-y-1.5">
      <Label htmlFor="description">
       Description
      </Label>
      <Textarea
       id="description"
       value={description}
       onChange={(event)=>setDescription(event.target.value)}
      />
     </div>

     <div className="grid grid-cols-2 gap-4">
      <div className="space-y-1.5">
       <Label htmlFor="duration">
        Duration (minutes)
       </Label>
       <Input
        id="duration"
        type="number"
        disabled
        value={duration}
       />
       <p className="text-xs text-muted-foreground">
        Duration is fixed after creation.
       </p>
      </div>

      <div className="space-y-1.5">
       <Label htmlFor="passingScore">
        Passing score (points)
       </Label>
       <Input
        id="passingScore"
        type="number"
        min={0}
        value={passingScore}
        onChange={(event)=>setPassingScore(event.target.value)}
       />
       {errors.passingScore&&(
        <p className="text-xs text-destructive">
         {errors.passingScore}
        </p>
       )}
      </div>
     </div>
    </CardContent>
   </Card>

   <Card>
    <CardHeader className="flex flex-row items-center justify-between gap-4">
     <CardTitle>
      Problems
     </CardTitle>
     <Badge variant="secondary">
      {problemIds.length} selected · {selectedPoints} pts
     </Badge>
    </CardHeader>

    <CardContent className="space-y-3">
     {problems.isLoading
      ? <ProblemPickerSkeleton/>
      : (problems.data??[]).map(problem=>(
        <label
         key={problem.id}
         className="flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/40"
        >
         <Checkbox
          checked={problemIds.includes(problem.id)}
          onCheckedChange={()=>toggleProblem(problem.id)}
         />
         <span className="flex-1 space-y-0.5">
          <span className="block text-sm font-medium">
           {problem.title}
          </span>
          <span className="block text-xs text-muted-foreground">
           {problem.type} · {problem.points} pts
          </span>
         </span>
         <Badge>
          {problem.type}
         </Badge>
        </label>
       ))}
    </CardContent>
   </Card>

   {errors.problemIds&&(
    <p className="text-xs text-destructive">
     {errors.problemIds}
    </p>
   )}

   <Separator/>

   <div className="flex items-center justify-end gap-2">
    <Button variant="outline">
     <Link href={`/recruiter/assessments/${assessmentId}`}>
      Cancel
     </Link>
    </Button>
    <Button
     disabled={update.isPending}
     onClick={onSubmit}
    >
     {update.isPending?"Saving…":"Save changes"}
    </Button>
   </div>
  </main>
 );

}

function ProblemPickerSkeleton(){
 return (
  <div className="space-y-3">
   {[0,1,2].map(index=>(
    <div key={index} className="flex items-center gap-3 rounded-lg border p-3">
     <Skeleton className="size-4"/>
     <Skeleton className="h-8 flex-1"/>
    </div>
   ))}
  </div>
 );
}

function EditPageSkeleton(){
 return (
  <div className="mx-auto max-w-3xl space-y-6">
   <Skeleton className="h-8 w-1/3"/>
   <Skeleton className="h-40 w-full"/>
   <Skeleton className="h-64 w-full"/>
  </div>
 );
}
