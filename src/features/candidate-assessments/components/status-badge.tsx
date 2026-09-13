

import { Badge } from "@/src/shared/components/ui/badge";
import type {
AttemptStatus,
InvitationStatus,
AssessmentStatus
} from "../types/candidate-assessments.dto";



type Status =
 | AttemptStatus
 | InvitationStatus
 | AssessmentStatus;



export function StatusBadge({
status
}:{
status:Status
}){


return (

<Badge
variant={
 status==="PUBLISHED" ||
 status==="EVALUATED" ||
 status==="ACCEPTED"
 ?
 "default"
 :
 "secondary"
}
>

{status.replace("_"," ")}

</Badge>

)

}