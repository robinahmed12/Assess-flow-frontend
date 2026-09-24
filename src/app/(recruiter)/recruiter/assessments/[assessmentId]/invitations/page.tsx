import {AssessmentInvitationsPage} from "@/src/features/recruiter-assessments";

export default function Page({params}:{params:{assessmentId:string}}){

 return (
  <AssessmentInvitationsPage
   assessmentId={params.assessmentId}
  />
 );

}
