import {AssessmentEditPage} from "@/src/features/recruiter-assessments";

export default function Page({params}:{params:{assessmentId:string}}){

 return (
  <AssessmentEditPage
   assessmentId={params.assessmentId}
  />
 );

}
