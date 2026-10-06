import './styles.css';
import { Activity, Bell, Boxes, FileText, Layers, LayoutGrid, Palette, Plus, Server, Settings, Shield } from 'lucide-react';
import { StrictMode, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router';
import {
  AppShell,
  Badge,
  Brand,
  Button,
  Callout,
  CheckboxField,
  CodeBlock,
  ConfirmProvider,
  Dialog,
  EmptyState,
  Field,
  Input,
  KeyValue,
  Page,
  PageHeader,
  Pagination,
  Panel,
  SegmentedControl,
  Select,
  SeverityBadge,
  Slider,
  StatStrip,
  StatusDot,
  SwitchField,
  Table,
  TBody,
  TD,
  TH,
  THead,
  TR,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Textarea,
  ThemePicker,
  ThemeProvider,
  TimeRangePicker,
  Toaster,
  TooltipProvider,
  UserMenu,
  DEFAULT_RANGE,
  formatRelative,
  themes,
  toast,
  useConfirm,
  useTheme,
  variantVarsFor,
  type Severity,
  type TimeRange,
} from './exports.ts';
import { Meter, StackedBarChart, TimeSeriesChart } from '../src/charts/index.ts';
import { AGENTS, LEVELS, NOW, logHistogram, metricSeries } from './data.ts';

const levelSeries = LEVELS.map((l) => ({ key: l, label: l, color: `var(--color-sev-${l.toLowerCase()})` }));

const statusBadge: Record<string, { tone: 'ok' | 'warn' | 'danger' | 'neutral' | 'info'; label: string }> = {
  adopted: { tone: 'ok', label: 'Adopted' },
  pending: { tone: 'warn', label: 'Pending' },
  adoption_failed: { tone: 'danger', label: 'Adoption failed' },
};
const connDot: Record<string, { tone: 'ok' | 'neutral' | 'danger'; label: string }> = {
  connected: { tone: 'ok', label: 'Connected' },
  disconnected: { tone: 'neutral', label: 'Disconnected' },
  never_connected: { tone: 'danger', label: 'Never connected' },
};

function Overview() {
  const [range, setRange] = useState<TimeRange>(DEFAULT_RANGE);
  const metrics = metricSeries();
  return (
    <Page>
      <PageHeader
        title="Overview"
        description="Everything reporting to prod-eu right now."
        actions={
          <>
            <TimeRangePicker value={range} onChange={setRange} />
            <Button variant="primary">
              <Plus />
              Add agent
            </Button>
          </>
        }
      />
      <StatStrip
        stats={[
          { label: 'Agents', value: 5, hint: '3 connected' },
          { label: 'Firing alerts', value: 2, tone: 'danger', hint: 'CPU high, log errors' },
          { label: 'Log lines / min', value: '1,284' },
          { label: 'Critical CVEs', value: 0, tone: 'ok', hint: 'Last scan 2h ago' },
        ]}
      />
      <div className="grid gap-3 sm:grid-cols-3">
        <Meter label="CPU" value={42.3} icon={<Activity />} />
        <Meter label="Memory" value={71.8} icon={<Layers />} />
        <Meter label="Disk" value={88.1} icon={<Server />} />
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="CPU and memory" icon={<Activity />}>
          <TimeSeriesChart
            data={metrics}
            series={[
              { key: 'cpu', label: 'CPU' },
              { key: 'memory', label: 'Memory' },
            ]}
            yDomain={[0, 100]}
            formatValue={(v) => `${v.toFixed(0)}%`}
          />
        </Panel>
        <Panel title="Log volume" icon={<FileText />}>
          <StackedBarChart data={logHistogram()} series={levelSeries} stepMs={300_000} />
        </Panel>
      </div>
      <Panel title="Agents" icon={<Server />} flush actions={<Button size="sm">View all</Button>}>
        <Table>
          <THead>
            <tr>
              <TH>Host</TH>
              <TH>IP</TH>
              <TH>Profile</TH>
              <TH>Status</TH>
              <TH>Connection</TH>
              <TH>Last seen</TH>
            </tr>
          </THead>
          <TBody>
            {AGENTS.map((a) => (
              <TR key={a.id} interactive>
                <TD className="font-medium">{a.host}</TD>
                <TD className="font-mono text-[13px] text-fg-secondary">{a.ip}</TD>
                <TD>{a.profile}</TD>
                <TD>
                  <Badge tone={statusBadge[a.status]!.tone}>{statusBadge[a.status]!.label}</Badge>
                </TD>
                <TD>
                  <span className="inline-flex items-center gap-2 text-fg-secondary">
                    <StatusDot tone={connDot[a.conn]!.tone} />
                    {connDot[a.conn]!.label}
                  </span>
                </TD>
                <TD className="text-fg-muted">{formatRelative(a.seen, NOW)}</TD>
              </TR>
            ))}
          </TBody>
        </Table>
      </Panel>
    </Page>
  );
}

function Components() {
  const confirm = useConfirm();
  const [mode, setMode] = useState<'a' | 'b' | 'c'>('a');
  const [sel, setSel] = useState('');
  const [slider, setSlider] = useState(30);
  const [dialogOpen, setDialogOpen] = useState(false);
  return (
    <Page>
      <PageHeader title="Components" description="Every primitive in logmon-ui, in the current theme." />
      <Panel title="Buttons">
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="primary">Primary</Button>
          <Button>Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="danger">Danger</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="inverted">Inverted</Button>
          <Button variant="link">Link</Button>
          <Button variant="primary" loading>
            Saving
          </Button>
          <Button disabled>Disabled</Button>
          <Button size="sm">Small</Button>
          <Button size="icon" aria-label="Settings">
            <Settings />
          </Button>
        </div>
      </Panel>
      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="Form controls">
          <div className="flex flex-col gap-4">
            <Field label="Instance name" hint="Letters and numbers, 3–20 characters.">
              {(ids) => <Input placeholder="prodeu" {...ids} />}
            </Field>
            <Field label="Email" error="That doesn't look like an email address.">
              {(ids) => <Input defaultValue="not-an-email" {...ids} />}
            </Field>
            <Field label="Region">
              {(ids) => (
                <Select
                  {...ids}
                  value={sel}
                  onValueChange={setSel}
                  options={[
                    { value: '', label: 'All regions' },
                    { value: 'eu-north-1', label: 'eu-north-1 — Stockholm' },
                    { value: 'eu-west-1', label: 'eu-west-1 — Ireland' },
                  ]}
                />
              )}
            </Field>
            <Field label="Glob patterns">
              {(ids) => <Textarea className="font-mono" defaultValue={'/var/log/*.log\n/var/log/pods/*/*/*.log'} {...ids} />}
            </Field>
            <Field label={`Retention: ${slider} days`}>
              {() => <Slider value={[slider]} min={1} max={365} onValueChange={([v]) => setSlider(v!)} aria-label="Retention" />}
            </Field>
            <CheckboxField label="Automatically adopt agents" hint="Skips the pending review step." defaultChecked />
            <SwitchField label="Collect metrics" hint="CPU, memory, disk and network every 5 seconds." defaultChecked />
            <SegmentedControl
              value={mode}
              onValueChange={setMode}
              options={[
                { value: 'a', label: '15m' },
                { value: 'b', label: '1h' },
                { value: 'c', label: '24h' },
              ]}
            />
          </div>
        </Panel>
        <div className="flex flex-col gap-4">
          <Panel title="Feedback">
            <div className="flex flex-col gap-3">
              <Callout tone="info" title="Read-only access">
                You can view this instance but not change it.
              </Callout>
              <Callout tone="ok" title="Profile saved" />
              <Callout tone="warn" title="Trial — 12 days remaining">
                Trial accounts run one small instance with up to 5 agents.
              </Callout>
              <Callout tone="danger" title="Some metrics could not be loaded" action={<Button size="sm">Retry</Button>}>
                The metrics store did not answer for Network.
              </Callout>
              <div className="flex flex-wrap gap-2">
                <Badge>Neutral</Badge>
                <Badge tone="accent">Accent</Badge>
                <Badge tone="ok">Connected</Badge>
                <Badge tone="info">Modifying</Badge>
                <Badge tone="warn">Pending</Badge>
                <Badge tone="danger">Firing</Badge>
                <Badge tone="outline">Default</Badge>
              </div>
              <div className="flex flex-wrap gap-2">
                {(['fatal', 'error', 'warn', 'info', 'debug', 'trace'] as Severity[]).map((s) => (
                  <SeverityBadge key={s} severity={s} />
                ))}
              </div>
            </div>
          </Panel>
          <Panel title="Overlays">
            <div className="flex flex-wrap gap-2">
              <Button onClick={() => setDialogOpen(true)}>Open dialog</Button>
              <Button
                variant="danger"
                onClick={async () => {
                  if (
                    await confirm({
                      title: 'Delete profile "edge"?',
                      description: 'Agents using it fall back to default.',
                      tone: 'danger',
                      confirmLabel: 'Delete',
                    })
                  ) {
                    toast.success('Profile deleted');
                  }
                }}
              >
                Confirm
              </Button>
              <Button onClick={() => toast('Agent adopted', 'web-03 starts collecting on its next poll.')}>Toast</Button>
              <Button onClick={() => toast.error('Failed to save rule', 'Threshold must be non-negative.')}>Error toast</Button>
            </div>
            <Dialog
              open={dialogOpen}
              onOpenChange={setDialogOpen}
              title="Create profile"
              description="Start from defaults or copy an existing profile."
              footer={
                <>
                  <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
                  <Button variant="primary" onClick={() => setDialogOpen(false)}>
                    Create
                  </Button>
                </>
              }
            >
              <Field label="Name">{(ids) => <Input placeholder="production" {...ids} />}</Field>
            </Dialog>
          </Panel>
        </div>
      </div>
      <Panel title="Tabs, code and data">
        <Tabs defaultValue="one">
          <TabsList>
            <TabsTrigger value="one">Rules</TabsTrigger>
            <TabsTrigger value="two">History</TabsTrigger>
            <TabsTrigger value="three">Maintenance windows</TabsTrigger>
          </TabsList>
          <TabsContent value="one" className="flex flex-col gap-4 pt-4">
            <CodeBlock copy="logmon-client -server https://acme-prod.logmon.io -adoption-key ••••">
              logmon-client -server https://acme-prod.logmon.io -adoption-key ••••••••
            </CodeBlock>
            <KeyValue
              items={[
                { label: 'Operating system', value: 'Ubuntu 26.04 LTS' },
                { label: 'Architecture', value: 'arm64' },
                { label: 'CPU', value: 'Graviton4 (8 cores)' },
                { label: 'IP address', value: '10.0.1.12', mono: true },
              ]}
            />
          </TabsContent>
          <TabsContent value="two">
            <EmptyState icon={<Bell />} title="No history yet">
              Transitions show up here once a rule fires or resolves.
            </EmptyState>
          </TabsContent>
          <TabsContent value="three" />
        </Tabs>
        <Pagination offset={0} pageSize={50} hasMore onChange={() => undefined} />
      </Panel>
    </Page>
  );
}

function Themes() {
  const { appearance } = useTheme();
  return (
    <Page>
      <PageHeader title="Themes" description={`Every theme's roles in its ${appearance.scheme} variant.`} />
      <Panel title="Appearance" icon={<Palette />}>
        <ThemePicker />
      </Panel>
      <div className="grid gap-4 md:grid-cols-2">
        {themes.map((t) => {
          const vars = variantVarsFor(t, appearance.scheme);
          return (
            <Panel key={t.id} title={t.name} description={t.description}>
              <div className="grid grid-cols-8 gap-1.5">
                {Object.entries(vars).map(([k, v]) => (
                  <div key={k} title={`${k}: ${v}`} className="aspect-square rounded-md border border-line" style={{ background: v }} />
                ))}
              </div>
            </Panel>
          );
        })}
      </div>
    </Page>
  );
}

function Shell() {
  return (
    <AppShell
      brand={<Brand context="acme · prod-eu" />}
      nav={[
        {
          items: [
            { to: '/', label: 'Overview', icon: <LayoutGrid />, end: true },
            { to: '/components', label: 'Components', icon: <Boxes /> },
            { to: '/themes', label: 'Themes', icon: <Palette /> },
          ],
        },
        {
          label: 'Monitoring',
          items: [
            { to: '/logs', label: 'Logs', icon: <FileText /> },
            { to: '/alerts', label: 'Alerts', icon: <Bell />, badge: <Badge tone="danger">2</Badge> },
            { to: '/security', label: 'Security', icon: <Shield /> },
          ],
        },
      ]}
      footer={<UserMenu name="Jack Pettersson" subtitle="Editor" onSignOut={() => toast('Signed out')} />}
    >
      <Routes>
        <Route path="/" element={<Overview />} />
        <Route path="/components" element={<Components />} />
        <Route path="/themes" element={<Themes />} />
        <Route path="*" element={<Overview />} />
      </Routes>
    </AppShell>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <TooltipProvider>
        <ConfirmProvider>
          <BrowserRouter>
            <Shell />
          </BrowserRouter>
          <Toaster />
        </ConfirmProvider>
      </TooltipProvider>
    </ThemeProvider>
  </StrictMode>,
);
