export function SaveStatus({
state
}:{
state:
 | "idle"
 | "saving"
 | "saved"
 | "failed"
}){

return (
 <span className="text-sm text-muted-foreground">
  {state==="saving" && "Saving..."}
  {state==="saved" && "Saved"}
  {state==="failed" && "Save failed"}
  {state==="idle" && ""}
 </span>
);

}
