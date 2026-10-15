import { ChevronRight } from 'lucide-react';
import { Fragment, useState, type ReactNode } from 'react';
import { formatDateTime } from '../lib/format.ts';
import { Pagination, Table, TableEmpty, TBody, TD, TH, THead } from './table.tsx';

// The shape every logmon audit API returns (logmon-server's /api/audit-log,
// logmon-hosting's org and admin audit logs).
export interface AuditEntry {
  id: number;
  occurred_at: string;
  actor: string;
  action: string;
  target_type: string;
  target_id: string;
  details?: Record<string, unknown>;
}

export interface AuditColumn<E extends AuditEntry> {
  header: string;
  cell: (entry: E) => ReactNode;
  className?: string;
}

export interface AuditLogTableProps<E extends AuditEntry> {
  entries: E[];
  // An app's labels for its actions; unknown ones show as the raw action.
  actionLabels: ReadonlyMap<string, string>;
  // Inserted after Action, e.g. the admin console's Org.
  extraColumns?: AuditColumn<E>[];
  emptyText?: ReactNode;
  // Expanded rows collapse when this changes (a new filter).
  resetKey?: string;
  offset: number;
  pageSize: number;
  hasMore: boolean;
  onOffsetChange: (offset: number) => void;
  busy?: boolean;
}

// The audit trail table: newest first, a row expands to its details JSON, paged
// by has_more. Fetching and filters stay with the app: its endpoint and filters
// differ, the table doesn't.
export function AuditLogTable<E extends AuditEntry>({
  entries,
  actionLabels,
  extraColumns = [],
  emptyText = 'No entries match these filters.',
  resetKey = '',
  offset,
  pageSize,
  hasMore,
  onOffsetChange,
  busy,
}: AuditLogTableProps<E>) {
  const [open, setOpen] = useState<Set<number>>(() => new Set());
  const [seenKey, setSeenKey] = useState(resetKey);
  if (seenKey !== resetKey) {
    setSeenKey(resetKey);
    setOpen(new Set());
  }
  const toggle = (id: number) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (!next.delete(id)) next.add(id);
      return next;
    });
  const columns = 5 + extraColumns.length;

  return (
    <>
      <Table>
        <THead>
          <tr>
            <TH className="w-8" />
            <TH>Time</TH>
            <TH>Actor</TH>
            <TH>Action</TH>
            {extraColumns.map((c) => (
              <TH key={c.header}>{c.header}</TH>
            ))}
            <TH>Target</TH>
          </tr>
        </THead>
        <TBody>
          {entries.length === 0 && <TableEmpty colSpan={columns}>{emptyText}</TableEmpty>}
          {entries.map((e) => {
            const expanded = open.has(e.id);
            return (
              <Fragment key={e.id}>
                <tr className="cursor-pointer hover:bg-hover" onClick={() => toggle(e.id)}>
                  <TD className="pr-0">
                    <button
                      type="button"
                      aria-expanded={expanded}
                      aria-label={expanded ? 'Hide details' : 'Show details'}
                      onClick={(ev) => {
                        ev.stopPropagation();
                        toggle(e.id);
                      }}
                      className="flex cursor-pointer rounded-md p-0.5 text-fg-muted hover:bg-hover hover:text-fg"
                    >
                      <ChevronRight className={`size-4 transition-transform ${expanded ? 'rotate-90' : ''}`} />
                    </button>
                  </TD>
                  <TD className="whitespace-nowrap text-fg-secondary">{formatDateTime(e.occurred_at)}</TD>
                  <TD>{e.actor}</TD>
                  <TD>{actionLabels.get(e.action) ?? e.action}</TD>
                  {extraColumns.map((c) => (
                    <TD key={c.header} className={c.className ?? 'text-fg-secondary'}>
                      {c.cell(e)}
                    </TD>
                  ))}
                  <TD className="font-mono text-[13px] text-fg-secondary">
                    {e.target_type}
                    {e.target_id ? `:${e.target_id}` : ''}
                  </TD>
                </tr>
                {expanded && (
                  <tr className="bg-sunken">
                    <td colSpan={columns} className="px-4 py-3">
                      <pre className="font-mono text-[13px] whitespace-pre-wrap text-fg-secondary">
                        {JSON.stringify(e.details ?? {}, null, 2)}
                      </pre>
                    </td>
                  </tr>
                )}
              </Fragment>
            );
          })}
        </TBody>
      </Table>
      <Pagination offset={offset} pageSize={pageSize} count={entries.length} hasMore={hasMore} disabled={busy} onChange={onOffsetChange} />
    </>
  );
}
