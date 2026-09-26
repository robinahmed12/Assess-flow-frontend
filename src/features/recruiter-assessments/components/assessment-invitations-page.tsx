"use client";

import {useState} from "react";
import Link from "next/link";
import {toast} from "sonner";

import {useInvitations} from "../hooks/use-invitations";
import {useCreateInvitation} from "../hooks/use-create-invitation";
import {invitationSchema} from "../schemas/assessment.schemas";
import type {InvitationDto} from "../types/assessment.dto";

import {Button} from "@/src/shared/components/ui/button";
import {Input} from "@/src/shared/components/ui/input";
import {Label} from "@/src/shared/components/ui/label";
import {Badge} from "@/src/shared/components/ui/badge";
import {Skeleton} from "@/src/shared/components/ui/skeleton";
import {Separator} from "@/src/shared/components/ui/separator";
import {
 Card,CardContent,CardHeader,CardTitle,
} from "@/src/shared/components/ui/card";
import {
 Table,TableBody,TableCell,TableHead,TableHeader,TableRow,
} from "@/src/shared/components/ui/table";

export function AssessmentInvitationsPage({assessmentId}:{assessmentId:string}){

 const {data=[],isLoading}=useInvitations(assessmentId);
 const create=useCreateInvitation(assessmentId);

 const [email,setEmail]=useState("");
 const [expiresAt,setExpiresAt]=useState("");
 const [error,setError]=useState<string|null>(null);

 const onCreate=()=>{
  const parsed=invitationSchema.safeParse({
   candidateEmail:email,
   expiresAt:expiresAt||undefined,
  });

  if(!parsed.success){
   setError(parsed.error.issues[0]?.message??"Invalid invitation");
   return;
  }

  setError(null);

  create.mutate(parsed.data,{
   onSuccess:()=>{
    toast.success("Invitation sent");
    setEmail("");
    setExpiresAt("");
   },
   onError:()=>{
    toast.error("Could not send invitation");
   },
  });
 };

 const copyLink=(invitation:InvitationDto)=>{
   const link=invitation.invitationLink??`${window.location.origin}/candidate/assessments`;
  void navigator.clipboard.writeText(link);
  toast.success("Invitation link copied");
 };

 return (
  <main className="space-y-5">

   <div className="space-y-1">
    <h1 className="text-2xl font-bold">
     Invitations
    </h1>
    <p className="text-sm text-muted-foreground">
     Invite candidates by email and share their private attempt links.
    </p>
   </div>

   <Card>
    <CardHeader>
     <CardTitle>
      Invite a candidate
     </CardTitle>
    </CardHeader>

    <CardContent className="space-y-2">
     <div className="space-y-1.5">
      <Label htmlFor="email">
       Candidate email
      </Label>
      <Input
       id="email"
       type="email"
       value={email}
       onChange={(event)=>setEmail(event.target.value)}
       placeholder="candidate@example.com"
      />
     </div>

     <div className="space-y-1.5">
      <Label htmlFor="expiresAt">
       Expiry (optional)
      </Label>
      <Input
       id="expiresAt"
       type="datetime-local"
       value={expiresAt}
       onChange={(event)=>setExpiresAt(event.target.value)}
      />
     </div>

     {error&&(
      <p className="text-xs text-destructive">
       {error}
      </p>
     )}

     <div className="flex items-center justify-end pt-2">
      <Button
       disabled={create.isPending}
       onClick={onCreate}
      >
       {create.isPending?"Sending…":"Send invitation"}
      </Button>
     </div>
    </CardContent>
   </Card>

   <Separator/>

   <Card>
    <CardContent className="pt-6">
     {isLoading
      ? <InvitationTableSkeleton/>
      : data.length===0
        ? (
         <p className="py-10 text-center text-sm text-muted-foreground">
          No invitations sent yet.
         </p>
        )
        : (
         <Table>
          <TableHeader>
           <TableRow>
            <TableHead>
             Candidate
            </TableHead>
            <TableHead>
             Status
            </TableHead>
            <TableHead>
             Expires
            </TableHead>
            <TableHead>
             Sent
            </TableHead>
            <TableHead className="text-right">
             Actions
            </TableHead>
           </TableRow>
          </TableHeader>

          <TableBody>
           {data.map(invitation=>(
            <TableRow key={invitation.id}>
             <TableCell>
              {invitation.candidateEmail}
             </TableCell>
             <TableCell>
              <Badge variant="outline">
               {invitation.status}
              </Badge>
             </TableCell>
             <TableCell>
              {invitation.expiresAt
               ? new Date(invitation.expiresAt).toLocaleDateString()
               :"—"}
             </TableCell>
             <TableCell>
              {new Date(invitation.createdAt).toLocaleDateString()}
             </TableCell>
             <TableCell className="text-right">
              <Button
               variant="outline"
               size="sm"
               onClick={()=>copyLink(invitation)}
              >
               Copy link
              </Button>
             </TableCell>
            </TableRow>
           ))}
          </TableBody>
         </Table>
        )}
    </CardContent>
   </Card>

   <div>
    <Button variant="outline" size="sm">
     <Link href={`/recruiter/assessments/${assessmentId}`}>
      Back to assessment
     </Link>
    </Button>
   </div>
  </main>
 );
}

function InvitationTableSkeleton(){
 return (
  <div className="space-y-3">
   {[0,1,2].map(index=>(
    <Skeleton key={index} className="h-12"/>
   ))}
  </div>
 );
}
