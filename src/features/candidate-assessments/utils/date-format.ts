import {
 format,
 parseISO
} from "date-fns";


export function formatDate(
 value:string | null
){

 if(!value)
  return "No deadline";


 return format(
  parseISO(value),
  "MMM dd, yyyy hh:mm a"
 );

}