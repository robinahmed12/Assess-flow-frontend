import { AttemptWorkspace } from "@/src/features/candidate-attempt";


export default function Page({
 params,
}:{
 params:{
  attemptId:string;
 }
}){

 return (
  <AttemptWorkspace
   attemptId={params.attemptId}
  />
 );

}
