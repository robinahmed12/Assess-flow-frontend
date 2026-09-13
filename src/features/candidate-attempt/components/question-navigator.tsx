export function QuestionNavigator({
 count,
 current,
 onChange,
}:{
 count:number;
 current:number;
 onChange:(index:number)=>void;
}){

return (
 <div className="flex gap-2 flex-wrap">
  {Array.from({length:count}).map((_,i)=>(
   <button
    key={i}
    onClick={()=>onChange(i)}
    className={
     current===i
      ? "rounded bg-primary text-primary-foreground px-3 py-1"
      : "rounded border px-3 py-1"
    }
   >
    {i+1}
   </button>
  ))}
 </div>
);

}
