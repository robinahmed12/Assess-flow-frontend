"use client";

import { Button } from "@/src/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/src/shared/components/ui/dialog";
import { formatMetadata } from "../utils/audit-log-format";
import type { AuditLogDto } from "../types/audit-log.dto";

export interface AuditLogMetadataDialogProps {
  log: AuditLogDto | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AuditLogMetadataDialog({
  log,
  open,
  onOpenChange,
}: AuditLogMetadataDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Audit metadata</DialogTitle>
          <DialogDescription>
            {log ? `${log.action} · ${log.entityType}` : "No audit log selected"}
          </DialogDescription>
        </DialogHeader>

        <pre className="max-h-[60vh] overflow-auto rounded-lg border bg-muted/40 p-4 text-xs">
          {log ? formatMetadata(log.metadata) || "No metadata recorded." : ""}
        </pre>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
