import { apiClient } from "@/src/shared/lib/api/api-client";
import { unwrap } from "../../auth/api/auth.api";
import type {
  CreateInvitationRequestDto,
  InvitationDto,
} from "../types/assessment.dto";

export const invitationApi = {
  list: (assessmentId: string) =>
    unwrap(
      apiClient<InvitationDto[]>(
        `/invitations/${assessmentId}/invitations`,
      ),
    ),

  create: (
    assessmentId: string,
    payload: CreateInvitationRequestDto,
  ) =>
    unwrap(
      apiClient<InvitationDto>(
        `/invitations/${assessmentId}/invitations`,
        {
          method: "POST",
          body: payload,
        },
      ),
    ),
};