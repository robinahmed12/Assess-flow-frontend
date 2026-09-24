"use client";

import {
useMutation,
useQueryClient
} from "@tanstack/react-query";

import {assessmentApi} from "../api/assessment.api";


export function useCreateAssessment(){

const qc=useQueryClient();

return useMutation({

mutationFn:assessmentApi.create,

onSuccess:()=>{

qc.invalidateQueries({
 queryKey:[
  "assessments",
  "list"
 ]
});

}

});

}
