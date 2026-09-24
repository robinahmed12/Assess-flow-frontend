import {AssessmentSubmissionsPage} from "@/src/features/recruiter-assessments";

export default function Page({params}:{params:{assessmentId:string}}){

 return (
  <AssessmentSubmissionsPage
   assessmentId={params.assessmentId}
  />
 );

}
