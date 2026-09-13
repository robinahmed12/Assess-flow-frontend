export class AutosaveQueue {

 private versions:Record<string,number>={};

 next(problemId:string){

  this.versions[problemId]=
   (this.versions[problemId]??0)+1;

  return this.versions[problemId];
 }


 isLatest(
 problemId:string,
 version:number
 ){

 return this.versions[problemId]===version;

 }

}
