import {AssessmentReportPage} from "@/src/features/recruiter-assessments";

export default function Page({params}:{params:{assessmentId:string}}){

 return (
  <AssessmentReportPage
   assessmentId={params.assessmentId}
  />
 );

}
