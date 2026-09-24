"use client";

import Link from "next/link";

import {useAssessmentReport} from "../hooks/use-assessment-report";
import {ASSESSMENT_STATUS_LABELS} from "../constants/assessment.constants";
import type {AssessmentReportDto} from "../types/assessment.dto";

import {Button} from "@/src/shared/components/ui/button";
import {Badge} from "@/src/shared/components/ui/badge";
import {Skeleton} from "@/src/shared/components/ui/skeleton";
import {Separator} from "@/src/shared/components/ui/separator";
import {Card,CardContent,CardHeader,CardTitle} from "@/src/shared/components/ui/card";

export function AssessmentReportPage({assessmentId}:{assessmentId:string}){

 const {data,isLoading}=useAssessmentReport(assessmentId);

 return (
  <main className="space-y-5">

   <div className="space-y-1">
    <h1 className="text-2xl font-bold">
     Result report
    </h1>
    <p className="text-sm text-muted-foreground">
     Aggregate performance metrics for this assessment.
    </p>
   </div>

   {isLoading||!data
    ? <ReportSkeleton/>
    : <ReportContent report={data}/>}

   <Separator/>

   <div>
    <Button variant="outline" size="sm">
     <Link href={`/recruiter/assessments/${assessmentId}`}>
      Back to assessment
     </Link>
    </Button>
   </div>
  </main>
 );
}

function ReportContent({report}:{report:AssessmentReportDto}){

 const {assessment,metrics}=report;

 return (
  <div className="space-y-5">

   <div className="space-y-1">
    <div className="flex items-center gap-2">
     <h2 className="text-lg font-semibold">
      {assessment.title}
     </h2>
     <Badge>
      {ASSESSMENT_STATUS_LABELS[assessment.status]}
     </Badge>
    </div>
    <p className="text-sm text-muted-foreground">
     Passing score {assessment.passingScore??"—"} · {assessment.resultVisibility}
    </p>
   </div>

   <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
    <Metric label="Invited" value={metrics.invited}/>
    <Metric label="Started" value={metrics.started}/>
    <Metric label="Submitted" value={metrics.submitted}/>
    <Metric label="Evaluated" value={metrics.evaluated}/>
    <Metric label="Avg score" value={`${metrics.averageScore.toFixed(1)} pts`}/>
    <Metric label="Avg %" value={`${metrics.averagePercentage.toFixed(1)}%`}/>
   </div>

   <Card>
    <CardHeader>
     <CardTitle>
      Pass rate
     </CardTitle>
    </CardHeader>
    <CardContent>
     <p className="text-3xl font-bold">
      {metrics.passRate.toFixed(1)}%
     </p>
     <p className="text-xs text-muted-foreground">
      Percentage of submitted attempts that passed.
     </p>
    </CardContent>
   </Card>
  </div>
 );
}

function Metric({label,value}:{label:string;value:string|number}){
 return (
  <div className="rounded-xl border p-4">
   <p className="text-xs text-muted-foreground">
    {label}
   </p>
   <p className="mt-1 text-xl font-semibold">
    {value}
   </p>
  </div>
 );
}

function ReportSkeleton(){
 return (
  <div className="space-y-5">
   <div className="space-y-2">
    <Skeleton className="h-6 w-40"/>
    <Skeleton className="h-4 w-64"/>
   </div>
   <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
    {[0,1,2,3,4,5].map(index=>(
     <Skeleton key={index} className="h-20"/>
    ))}
   </div>
   <Skeleton className="h-28 w-full"/>
  </div>
 );
}
