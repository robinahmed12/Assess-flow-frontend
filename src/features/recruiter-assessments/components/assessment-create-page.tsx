"use client";

import {useMemo,useState} from "react";
import {useRouter} from "next/navigation";
import Link from "next/link";
import {toast} from "sonner";

import {useProblems} from "@/src/features/recruiter-problems/hooks/use-problems";
import {useCreateAssessment} from "../hooks/use-create-assessment";


import {Button} from "@/src/shared/components/ui/button";
import {Input} from "@/src/shared/components/ui/input";
import {Label} from "@/src/shared/components/ui/label";
import {Textarea} from "@/src/shared/components/ui/textarea";
import {Checkbox} from "@/src/shared/components/ui/checkbox";
import {Badge} from "@/src/shared/components/ui/badge";
import {Skeleton} from "@/src/shared/components/ui/skeleton";
import {Separator} from "@/src/shared/components/ui/separator";
import {Card,CardContent,CardHeader,CardTitle} from "@/src/shared/components/ui/card";
import { createAssessmentSchema } from "../schemas/assessment.schemas";

export function AssessmentCreatePage(){

 const router=useRouter();
 const create=useCreateAssessment();
 const problems=useProblems();

 const [title,setTitle]=useState("");
 const [description,setDescription]=useState("");
 const [duration,setDuration]=useState("30");
 const [passingScore,setPassingScore]=useState("");
 const [problemIds,setProblemIds]=useState<string[]>([]);
 const [errors,setErrors]=useState<Record<string,string>>({});

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

 const onSubmit=()=>{
  const parsed=createAssessmentSchema.safeParse({
   title,
   description:description.trim()?description:undefined,
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

  create.mutate(parsed.data,{
   onSuccess:(assessment)=>{
    toast.success("Assessment created");
    router.push(`/recruiter/assessments/${assessment.id}`);
   },
   onError:()=>{
    toast.error("Could not create assessment");
   },
  });
 };

 return (
  <main className="mx-auto max-w-3xl space-y-6">
   <div className="space-y-1">
    <h1 className="text-2xl font-bold">
     Create Assessment
    </h1>
    <p className="text-sm text-muted-foreground">
     Give your assessment a title, set the rules, then pick the problems it
     contains.
    </p>
   </div>

   <div className="space-y-5">
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
        placeholder="Senior Frontend Technical Screen"
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
        placeholder="What skills does this assessment measure?"
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
         min={1}
         max={1440}
         value={duration}
         onChange={(event)=>setDuration(event.target.value)}
        />
        {errors.durationMinutes&&(
         <p className="text-xs text-destructive">
          {errors.durationMinutes}
         </p>
        )}
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
          className="flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/40 has-data-checked:border-primary/50"
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
   </div>

   {errors.problemIds&&(
    <p className="text-xs text-destructive">
     {errors.problemIds}
    </p>
   )}

   <Separator/>

   <div className="flex items-center justify-end gap-2">
    <Button  variant="outline">
     <Link href="/recruiter/assessments">
      Cancel
     </Link>
    </Button>
    <Button
     disabled={create.isPending}
     onClick={onSubmit}
    >
     {create.isPending?"Creating…":"Create assessment"}
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
