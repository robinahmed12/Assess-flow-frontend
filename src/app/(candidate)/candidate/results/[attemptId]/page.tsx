import {CandidateResultPage} from "@/src/features/candidate-result";

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
