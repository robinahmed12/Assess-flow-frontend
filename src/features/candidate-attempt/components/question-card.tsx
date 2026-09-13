"use client";

export function QuestionCard({
 problem,
 value,
 onChange,
}:{
 problem:any;
 value:string;
 onChange:(value:string)=>void;
}){

 return (
  <div className="rounded-xl border p-5 space-y-4">

   <h2 className="font-semibold">
    {problem.title}
   </h2>

   <p>
    {problem.description}
   </p>


   {problem.type==="MCQ" ? (
    <div className="space-y-2">
     {problem.options?.map((option:any)=>(
      <label key={option.id} className="block">
       <input
        type="radio"
        checked={value===option.id}
        onChange={()=>onChange(option.id)}
       />
       {" "}
       {option.text}
      </label>
     ))}
    </div>
   ):(
    <textarea
     className="w-full rounded border p-3"
     value={value}
     onChange={(e)=>onChange(e.target.value)}
     placeholder="Write your answer..."
    />
   )}

  </div>
 );
}
