import {AssessmentDetailPage} from "@/src/features/recruiter-assessments";

export default function Page({params}:{params:{assessmentId:string}}){

 return (
  <AssessmentDetailPage
   assessmentId={params.assessmentId}
  />
 );

}
