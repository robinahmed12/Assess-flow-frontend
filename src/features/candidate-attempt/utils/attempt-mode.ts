export function isReadOnly(status:string){

 return [
  "SUBMITTED",
  "EVALUATED",
  "EXPIRED"
 ].includes(status);

}
