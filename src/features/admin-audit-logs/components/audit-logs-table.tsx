"use client";

import { Eye } from "lucide-react";

import { Badge } from "@/src/shared/components/ui/badge";
import { Button } from "@/src/shared/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/shared/components/ui/table";
import { getAuditActionTone } from "../constants/audit-log.constants";
import {
  formatActor,
  formatAuditDate,
  hasMetadata,
  toEntityLabel,
} from "../utils/audit-log-format";
import type { AuditLogDto } from "../types/audit-log.dto";

export interface AuditLogsTableProps {
  logs: AuditLogDto[];
  onInspect: (log: AuditLogDto) => void;
}

export function AuditLogsTable({ logs, onInspect }: AuditLogsTableProps) {
  return (
    <div className="overflow-x-auto rounded-xl border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-44">Time</TableHead>
            <TableHead>Action</TableHead>
            <TableHead>Entity</TableHead>
            <TableHead>Actor</TableHead>
            <TableHead className="w-24 text-right">Metadata</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {logs.map((log) => {
            const tone = getAuditActionTone(log.action);
            const actor = log.actor ?? null;

            return (
              <TableRow key={log.id}>
                <TableCell className="whitespace-nowrap text-muted-foreground">
                  {formatAuditDate(log.createdAt)}
                </TableCell>

                <TableCell>
                  <Badge
                    variant={tone === "neutral" ? "secondary" : "outline"}
                    className={
                      tone === "success"
                        ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                        : tone === "failure"
                          ? "border-destructive/40 bg-destructive/10 text-destructive"
                          : undefined
                    }
                  >
                    {log.action}
                  </Badge>
                </TableCell>

                <TableCell>
                  <div className="flex flex-col gap-0.5">
                    <span className="font-medium">{toEntityLabel(log.entityType)}</span>
                    <span className="font-mono text-xs text-muted-foreground break-all">
                      {log.entityId}
                    </span>
                  </div>
                </TableCell>

                <TableCell>
                  <div className="flex flex-col gap-0.5">
                    <span>{formatActor(actor)}</span>
                    {actor?.email ? (
                      <span className="text-xs text-muted-foreground break-all">
                        {actor.email}
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground">Automated entry</span>
                    )}
                  </div>
                </TableCell>

                <TableCell className="text-right">
                  {hasMetadata(log.metadata) ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onInspect(log)}
                      aria-label={`View metadata for ${log.action}`}
                    >
                      <Eye className="h-4 w-4" />
                      View
                    </Button>
                  ) : (
                    <span className="text-xs text-muted-foreground">—</span>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
