import { NavLink, useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronRight, Home, LayoutGrid, ListOrdered, Briefcase, Settings, type LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { CATEGORIES, dateLabel, money, useStore, type Movement } from '../store';

export function Logo() {
  return (
    <div className="flex items-center justify-center gap-2 py-4" aria-label="Finanzas, marca provisional">
      <span className="grid h-8 w-8 place-items-center rounded-full bg-accent text-sm font-extrabold text-on-accent">F</span>
      <span className="text-lg font-extrabold tracking-tight">finanzas</span>
    </div>
  );
}

const TABS: { to: string; label: string; icon: LucideIcon }[] = [
  { to: '/', label: 'Inicio', icon: Home },
  { to: '/movimientos', label: 'Movimientos', icon: ListOrdered },
  { to: '/explorar', label: 'Explorar', icon: LayoutGrid },
  { to: '/gestion', label: 'Gestión', icon: Briefcase },
  { to: '/ajustes', label: 'Ajustes', icon: Settings },
];

export function TabBar() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 mx-auto max-w-md border-t border-border bg-surface pb-[env(safe-area-inset-bottom)]" aria-label="Principal">
      <ul className="grid grid-cols-5">
        {TABS.map(({ to, label, icon: Icon }) => (
          <li key={to}>
            <NavLink
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `flex h-16 flex-col items-center justify-center gap-1 text-[11px] font-semibold transition-colors ${
                  isActive ? 'text-accent' : 'text-muted'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span className={`grid h-8 w-12 place-items-center rounded-full ${isActive ? 'bg-accent-soft' : ''}`}>
                    <Icon size={20} strokeWidth={isActive ? 2.2 : 1.6} />
                  </span>
                  {label}
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function PageHeader({ title, back = true }: { title: string; back?: boolean }) {
  const nav = useNavigate();
  return (
    <header className="sticky top-0 z-10 flex items-center gap-2 bg-bg/95 px-4 py-3 backdrop-blur">
      {back && (
        <button onClick={() => nav(-1)} className="grid h-10 w-10 place-items-center rounded-full hover:bg-chip" aria-label="Volver">
          <ArrowLeft size={22} />
        </button>
      )}
      <h1 className="text-xl font-extrabold">{title}</h1>
    </header>
  );
}

export function SectionTitle({ children }: { children: ReactNode }) {
  return <h2 className="px-1 pb-3 pt-6 text-lg font-bold">{children}</h2>;
}

export function ActionCard({ icon: Icon, label, onClick, badge }: { icon: LucideIcon; label: string; onClick?: () => void; badge?: string }) {
  return (
    <button onClick={onClick} className="flex min-h-[150px] flex-col justify-between rounded-card bg-surface p-5 text-left shadow-sm transition active:scale-[0.98]">
      <div className="flex items-start justify-between">
        <span className={`grid h-12 w-12 place-items-center rounded-full ${badge ? 'border-2 border-accent bg-surface' : 'bg-chip'}`}>
          <Icon size={22} strokeWidth={1.6} />
        </span>
        {badge && <span className="rounded-full bg-accent-soft px-2 py-0.5 text-xs font-bold text-accent">{badge}</span>}
      </div>
      <span className="text-base font-bold leading-snug">{label}</span>
    </button>
  );
}

export function CircleItem({ icon: Icon, label, tint = 'bg-surface', onClick }: { icon: LucideIcon; label: string; tint?: string; onClick?: () => void }) {
  return (
    <button onClick={onClick} className="flex w-[100px] flex-col items-center gap-2 text-center">
      <span className={`grid h-[84px] w-[84px] place-items-center rounded-full ${tint} transition active:scale-95`}>
        <Icon size={28} strokeWidth={1.5} />
      </span>
      <span className="text-sm leading-tight text-text">{label}</span>
    </button>
  );
}

export function Row({ title, subtitle, right, onClick }: { title: string; subtitle?: string; right?: ReactNode; onClick?: () => void }) {
  const Tag = onClick ? 'button' : 'div';
  return (
    <Tag onClick={onClick} className="flex w-full items-center gap-3 px-4 py-3 text-left">
      <div className="min-w-0 flex-1">
        <p className="truncate font-semibold">{title}</p>
        {subtitle && <p className="truncate text-sm text-muted">{subtitle}</p>}
      </div>
      {right}
      {onClick && <ChevronRight size={18} className="text-muted" />}
    </Tag>
  );
}

export function MovementList({ movements, empty }: { movements: Movement[]; empty: string }) {
  const { accounts } = useStore();
  if (movements.length === 0) return <Empty text={empty} />;
  const groups = movements
    .slice()
    .sort((a, b) => b.date.localeCompare(a.date))
    .reduce<Record<string, Movement[]>>((acc, m) => ((acc[m.date] ??= []).push(m), acc), {});
  return (
    <div className="space-y-4">
      {Object.entries(groups).map(([date, items]) => (
        <section key={date}>
          <h3 className="px-1 pb-2 text-sm font-semibold capitalize text-muted">{dateLabel(date)}</h3>
          <ul className="divide-y divide-border overflow-hidden rounded-card bg-surface">
            {items.map((m) => (
              <li key={m.id}>
                <Row
                  title={m.note || m.category}
                  subtitle={`${m.category} · ${accounts.find((a) => a.id === m.accountId)?.name ?? 'Cuenta borrada'}`}
                  right={
                    <span className={`whitespace-nowrap font-bold ${m.type === 'ingreso' ? 'text-success' : ''}`}>
                      {m.type === 'ingreso' ? '+' : '−'}
                      {money(m.amount)}
                    </span>
                  }
                />
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

export function Empty({ text }: { text: string }) {
  return <p className="rounded-card bg-surface p-6 text-center text-muted">{text}</p>;
}

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block space-y-1">
      <span className="text-sm font-semibold text-muted">{label}</span>
      {children}
    </label>
  );
}

export const inputCls = 'w-full rounded-xl border border-border bg-surface px-4 py-3 text-base outline-none focus:border-accent';

export function PrimaryButton({ children, ...p }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button {...p} className="w-full rounded-full bg-accent py-3.5 text-base font-bold text-on-accent transition active:scale-[0.99] disabled:opacity-40">
      {children}
    </button>
  );
}

export function OutlineButton({ children, ...p }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button {...p} className="w-full rounded-full border-2 border-text py-3.5 text-base font-bold transition active:scale-[0.99]">
      {children}
    </button>
  );
}

export { CATEGORIES };
