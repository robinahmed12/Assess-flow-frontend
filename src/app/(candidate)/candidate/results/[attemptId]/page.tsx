import {CandidateResultPage} from "@/features/candidate-result";

export default function Page({
 params
}:{
 params:{
  attemptId:string;
 }
}){
 return (
  <CandidateResultPage
   attemptId={params.attemptId}
  />
 );
}
