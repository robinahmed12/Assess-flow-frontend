import { Badge } from "@/src/shared/components/ui/badge";


export function StatusBadge({status}:{status:string}){
 return (
  <Badge>
   {status.replace("_"," ")}
  </Badge>
 );
}
