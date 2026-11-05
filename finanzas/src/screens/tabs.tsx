import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Wallet, CreditCard, HandCoins, TrendingUp, Umbrella, Store as StoreIcon, Plus, PiggyBank, PieChart,
  Tags, FileDown, Calculator, CalendarClock, Target, UserRound, ShieldCheck, Boxes, SlidersHorizontal,
  ShieldHalf, FileCheck2, Star, Search, Eye, EyeOff,
} from 'lucide-react';
import { ActionCard, CircleItem, Logo, MovementList, OutlineButton, Row, SectionTitle } from '../components/ui';
import { money, useStore } from '../store';

export function Inicio() {
  const s = useStore();
  const nav = useNavigate();
  const [hidden, setHidden] = useState(false);
  const show = (n: number) => (hidden ? '••••••' : money(n));
  return (
    <div className="px-4 pb-20">
      <Logo />
      <p className="px-1 text-lg font-bold">Hola{s.profile ? `, ${s.profile.name.split(' ')[0]}` : ''}</p>

      <section className="mt-3 rounded-card bg-accent p-5 text-on-accent">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold opacity-90">Saldo total</p>
          <button onClick={() => setHidden((h) => !h)} aria-label={hidden ? 'Mostrar saldos' : 'Ocultar saldos'} className="rounded-full p-1">
            {hidden ? <Eye size={20} /> : <EyeOff size={20} />}
          </button>
        </div>
        <p className="mt-1 text-3xl font-extrabold tracking-tight">{show(s.total)}</p>
        <p className="mt-1 text-sm opacity-90">{s.accounts.length} cuentas registradas</p>
      </section>

      <SectionTitle>Mis cuentas</SectionTitle>
      <ul className="divide-y divide-border overflow-hidden rounded-card bg-surface">
        {s.accounts.map((a) => (
          <li key={a.id}>
            <Row title={a.name} subtitle={a.type} right={<span className="font-bold">{show(s.balance(a.id))}</span>} onClick={() => nav('/cuentas')} />
          </li>
        ))}
      </ul>

      <div className="flex items-center justify-between">
        <SectionTitle>Últimos movimientos</SectionTitle>
        <button onClick={() => nav('/movimientos')} className="pt-6 text-sm font-bold text-accent">Ver todos</button>
      </div>
      <MovementList movements={s.movements.slice(0, 5)} empty="Aún no registras movimientos." />

      <button
        onClick={() => nav('/nuevo')}
        className="fixed bottom-24 right-[max(1rem,calc(50%-14rem+1rem))] z-10 flex items-center gap-2 rounded-full bg-accent px-5 py-3.5 font-bold text-on-accent shadow-lg"
      >
        <Plus size={20} /> Registrar
      </button>
    </div>
  );
}

export function Movimientos() {
  const s = useStore();
  const [q, setQ] = useState('');
  const [type, setType] = useState<'todos' | 'ingreso' | 'gasto'>('todos');
  const list = s.movements.filter(
    (m) => (type === 'todos' || m.type === type) && `${m.note} ${m.category}`.toLowerCase().includes(q.toLowerCase()),
  );
  return (
    <div className="px-4">
      <Logo />
      <h1 className="px-1 text-2xl font-extrabold">Movimientos</h1>
      <div className="mt-4 flex items-center gap-2 rounded-full bg-surface px-4">
        <Search size={18} className="text-muted" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar por nota o categoría" className="w-full bg-transparent py-3 outline-none" aria-label="Buscar" />
      </div>
      <div className="mt-3 flex gap-2" role="radiogroup" aria-label="Tipo">
        {(['todos', 'ingreso', 'gasto'] as const).map((t) => (
          <button key={t} role="radio" aria-checked={type === t} onClick={() => setType(t)}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold capitalize ${type === t ? 'bg-text text-bg' : 'bg-surface'}`}>
            {t === 'todos' ? 'Todos' : t === 'ingreso' ? 'Ingresos' : 'Gastos'}
          </button>
        ))}
      </div>
      <div className="mt-4">
        <MovementList movements={list} empty={q || type !== 'todos' ? 'No hay movimientos con ese filtro.' : 'Aún no registras movimientos.'} />
      </div>
    </div>
  );
}

export function Explorar() {
  const nav = useNavigate();
  const sections = [
    { title: 'Ahorro', tint: 'bg-tint-1', items: [
      { icon: PiggyBank, label: 'Metas de ahorro', to: '/metas' },
      { icon: PieChart, label: 'Presupuesto', to: '/presupuesto' },
    ] },
    { title: 'Organiza tu dinero', tint: 'bg-tint-2', items: [
      { icon: Tags, label: 'Gastos por categoría', to: '/presupuesto' },
      { icon: CalendarClock, label: 'Pagos de tarjeta', to: '/tarjetas' },
    ] },
    { title: 'Herramientas', tint: 'bg-tint-3', items: [
      { icon: Calculator, label: 'Calculadora de ahorro', to: '/proximamente' },
      { icon: FileDown, label: 'Exportar datos', to: '/exportar' },
      { icon: Target, label: 'Nueva meta', to: '/metas' },
    ] },
  ];
  return (
    <div className="px-4">
      <Logo />
      {sections.map((sec, i) => (
        <section key={sec.title} className={i ? 'border-t border-border' : ''}>
          <SectionTitle>{sec.title}</SectionTitle>
          <div className="flex flex-wrap gap-4 pb-6">
            {sec.items.map((it) => <CircleItem key={it.label} icon={it.icon} label={it.label} tint={sec.tint} onClick={() => nav(it.to)} />)}
          </div>
        </section>
      ))}
    </div>
  );
}

export function Gestion() {
  const nav = useNavigate();
  const [tab, setTab] = useState<'productos' | 'tramites'>('productos');
  return (
    <div>
      <div className="px-4"><Logo /></div>
      <div role="tablist" className="grid grid-cols-2 border-b border-border">
        {(['productos', 'tramites'] as const).map((t) => (
          <button key={t} role="tab" aria-selected={tab === t} onClick={() => setTab(t)}
            className={`pb-3 pt-1 text-lg ${tab === t ? 'border-b-4 border-text font-bold' : 'text-muted'}`}>
            {t === 'productos' ? 'Productos' : 'Trámites'}
          </button>
        ))}
      </div>
      <div className="px-4 pb-6">
        {tab === 'productos' ? (
          <>
            <SectionTitle>Lo que tienes</SectionTitle>
            <div className="grid grid-cols-2 gap-3">
              <ActionCard icon={Wallet} label="Cuentas" onClick={() => nav('/cuentas')} />
              <ActionCard icon={CreditCard} label="Tarjetas" onClick={() => nav('/tarjetas')} />
              <ActionCard icon={HandCoins} label="Créditos" onClick={() => nav('/proximamente')} />
              <ActionCard icon={TrendingUp} label="Inversiones" onClick={() => nav('/proximamente')} />
              <ActionCard icon={Umbrella} label="Seguros" badge="Pronto" onClick={() => nav('/proximamente')} />
            </div>
            <SectionTitle>Para tu negocio</SectionTitle>
            <div className="grid grid-cols-2 gap-3">
              <ActionCard icon={StoreIcon} label="Finanzas del negocio" badge="Pronto" onClick={() => nav('/proximamente')} />
            </div>
          </>
        ) : (
          <div className="grid grid-cols-2 gap-3 pt-6">
            <ActionCard icon={Plus} label="Registrar movimiento" onClick={() => nav('/nuevo')} />
            <ActionCard icon={FileDown} label="Descargar extracto" onClick={() => nav('/exportar')} />
            <ActionCard icon={Wallet} label="Agregar cuenta" onClick={() => nav('/cuentas?nueva=1')} />
            <ActionCard icon={CreditCard} label="Agregar tarjeta" onClick={() => nav('/tarjetas?nueva=1')} />
          </div>
        )}
      </div>
    </div>
  );
}

export function Ajustes() {
  const s = useStore();
  const nav = useNavigate();
  const items = [
    { icon: UserRound, label: 'Mi perfil', to: '/perfil' },
    { icon: ShieldCheck, label: 'Seguridad', to: '/proximamente' },
    { icon: Boxes, label: 'Mis productos', to: '/cuentas' },
    { icon: SlidersHorizontal, label: 'Apariencia', to: '/apariencia' },
    { icon: ShieldHalf, label: 'Privacidad de datos', to: '/privacidad' },
    { icon: FileCheck2, label: 'Términos de uso', to: '/terminos' },
    { icon: Star, label: 'Danos tu opinión', to: '/proximamente' },
  ];
  return (
    <div className="px-4 pb-40">
      <Logo />
      <h1 className="pb-6 text-center text-3xl font-extrabold">Ajustes</h1>
      <div className="grid grid-cols-3 justify-items-center gap-y-6">
        {items.map((it) => <CircleItem key={it.label} icon={it.icon} label={it.label} onClick={() => nav(it.to)} />)}
      </div>
      <div className="fixed inset-x-0 bottom-16 z-10 mx-auto max-w-md rounded-t-3xl bg-surface px-4 pb-4 pt-5 shadow-[0_-4px_16px_rgba(0,0,0,0.06)] mb-[env(safe-area-inset-bottom)]">
        {s.profile ? (
          <OutlineButton onClick={() => s.setProfile(null)}>Cerrar sesión ({s.profile.name})</OutlineButton>
        ) : (
          <OutlineButton onClick={() => nav('/entrar')}>Iniciar sesión</OutlineButton>
        )}
      </div>
    </div>
  );
}
