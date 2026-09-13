"use client";

import {
 AlertDialog,
 AlertDialogAction,
 AlertDialogCancel,
 AlertDialogContent,
 AlertDialogDescription,
 AlertDialogFooter,
 AlertDialogHeader,
 AlertDialogTitle,
} from "@/components/ui/alert-dialog";


export function SubmitDialog({
open,
onOpenChange,
onConfirm
}:{
open:boolean;
onOpenChange:(v:boolean)=>void;
onConfirm:()=>void;
}){

return (
<AlertDialog open={open} onOpenChange={onOpenChange}>
 <AlertDialogContent>
  <AlertDialogHeader>
   <AlertDialogTitle>
    Submit assessment?
   </AlertDialogTitle>

   <AlertDialogDescription>
    After submission you cannot edit answers.
   </AlertDialogDescription>
  </AlertDialogHeader>

  <AlertDialogFooter>
   <AlertDialogCancel>
    Cancel
   </AlertDialogCancel>

   <AlertDialogAction onClick={onConfirm}>
    Submit
   </AlertDialogAction>
  </AlertDialogFooter>
 </AlertDialogContent>
</AlertDialog>
);

}
