"use client";

import {useState} from "react";
import {useAttemptDetail} from "../hooks/use-attempt-detail";
import {useSaveAnswer} from "../hooks/use-save-answer";
import {useSubmitAttempt} from "../hooks/use-submit-attempt";
import {AttemptTimer} from "./attempt-timer";
import {QuestionCard} from "./question-card";
import {QuestionNavigator} from "./question-navigator";

export function AttemptWorkspace({
 attemptId
}:{
 attemptId:string;
}){

const {data,isLoading}=useAttemptDetail(attemptId);
const save=useSaveAnswer();
const submit=useSubmitAttempt();

const [current,setCurrent]=useState(0);
const [answers,setAnswers]=useState<Record<string,string>>({});

if(isLoading)
 return <div>Loading attempt...</div>;

const problems=data?.assessment?.problems ?? [];

const problem=problems[current];

function update(value:string){
 if(!problem)return;

 setAnswers(prev=>({
  ...prev,
  [problem.id]:value
 }));

 save.mutate({
  attemptId,
  problemId:problem.id,
  payload:
   problem.type==="MCQ"
    ? {selectedOptionId:value}
    : {answerText:value}
 });
}


return (
<div className="space-y-6">

<div className="flex justify-between items-center">
 <h1 className="text-2xl font-bold">
  {data?.assessment?.title}
 </h1>

 {data?.expiresAt &&
  <AttemptTimer expiresAt={data.expiresAt}/>}
</div>


<QuestionNavigator
 count={problems.length}
 current={current}
 onChange={setCurrent}
/>


{problem &&
<QuestionCard
 problem={problem}
 value={answers[problem.id] ?? ""}
 onChange={update}
/>
}


<button
 className="rounded bg-primary text-primary-foreground px-5 py-2"
 onClick={()=>submit.mutate(attemptId)}
>
 Submit Assessment
</button>

</div>
);

}
