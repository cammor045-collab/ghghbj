import { useState, type FormEvent } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Construction } from 'lucide-react';
import { CATEGORIES, Empty, Field, PageHeader, PrimaryButton, Row, inputCls } from '../components/ui';
import { money, useStore, type AccountType, type MovementType } from '../store';

const today = () => new Date().toISOString().slice(0, 10);
const toInt = (v: string) => Math.round(Number(v.replace(/[^\d]/g, '')) || 0);

export function NuevoMovimiento() {
  const s = useStore();
  const nav = useNavigate();
  const [type, setType] = useState<MovementType>('gasto');
  const [amount, setAmount] = useState('');
  const [accountId, setAccountId] = useState(s.accounts[0]?.id ?? '');
  const [category, setCategory] = useState('Comida');
  const [date, setDate] = useState(today());
  const [note, setNote] = useState('');
  const value = toInt(amount);

  if (s.accounts.length === 0)
    return (<><PageHeader title="Registrar" /><div className="px-4"><Empty text="Primero agrega una cuenta en Gestión › Trámites." /></div></>);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (value <= 0) return;
    s.addMovement({ type, amount: value, accountId, category, date, note: note.trim() });
    nav('/', { replace: true });
  };

  return (
    <>
      <PageHeader title="Registrar movimiento" />
      <form onSubmit={submit} className="space-y-4 px-4 pb-8">
        <div className="grid grid-cols-2 gap-2 rounded-full bg-surface p-1" role="radiogroup" aria-label="Tipo">
          {(['gasto', 'ingreso'] as const).map((t) => (
            <button type="button" key={t} role="radio" aria-checked={type === t} onClick={() => setType(t)}
              className={`rounded-full py-2.5 font-bold ${type === t ? 'bg-accent text-on-accent' : 'text-muted'}`}>
              {t === 'gasto' ? 'Gasto' : 'Ingreso'}
            </button>
          ))}
        </div>
        <Field label="Monto (COP)">
          <input inputMode="numeric" autoFocus className={`${inputCls} text-2xl font-extrabold`} placeholder="$ 0"
            value={value ? money(value) : amount} onChange={(e) => setAmount(e.target.value)} />
        </Field>
        <Field label="Cuenta">
          <select className={inputCls} value={accountId} onChange={(e) => setAccountId(e.target.value)}>
            {s.accounts.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
          </select>
        </Field>
        <Field label="Categoría">
          <select className={inputCls} value={category} onChange={(e) => setCategory(e.target.value)}>
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </Field>
        <Field label="Fecha"><input type="date" className={inputCls} value={date} max={today()} onChange={(e) => setDate(e.target.value)} /></Field>
        <Field label="Nota (opcional)"><input className={inputCls} maxLength={60} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Ej. mercado" /></Field>
        <PrimaryButton type="submit" disabled={value <= 0}>Guardar</PrimaryButton>
      </form>
    </>
  );
}

export function Cuentas() {
  const s = useStore();
  const [params] = useSearchParams();
  const [open, setOpen] = useState(params.has('nueva'));
  const [name, setName] = useState('');
  const [type, setType] = useState<AccountType>('ahorros');
  const [initial, setInitial] = useState('');
  return (
    <>
      <PageHeader title="Cuentas" />
      <div className="space-y-4 px-4 pb-8">
        {s.accounts.length === 0 ? <Empty text="No tienes cuentas registradas." /> : (
          <ul className="divide-y divide-border overflow-hidden rounded-card bg-surface">
            {s.accounts.map((a) => <li key={a.id}><Row title={a.name} subtitle={a.type} right={<b>{money(s.balance(a.id))}</b>} /></li>)}
          </ul>
        )}
        {open ? (
          <form className="space-y-3 rounded-card bg-surface p-4" onSubmit={(e) => {
            e.preventDefault();
            if (!name.trim()) return;
            s.addAccount({ name: name.trim(), type, initial: toInt(initial) });
            setName(''); setInitial(''); setOpen(false);
          }}>
            <Field label="Nombre"><input className={inputCls} value={name} maxLength={40} onChange={(e) => setName(e.target.value)} placeholder="Ej. Ahorros nómina" /></Field>
            <Field label="Tipo">
              <select className={inputCls} value={type} onChange={(e) => setType(e.target.value as AccountType)}>
                <option value="ahorros">Ahorros</option><option value="corriente">Corriente</option>
                <option value="efectivo">Efectivo</option><option value="otro">Otro</option>
              </select>
            </Field>
            <Field label="Saldo inicial (COP)"><input inputMode="numeric" className={inputCls} value={initial} onChange={(e) => setInitial(e.target.value)} placeholder="0" /></Field>
            <PrimaryButton type="submit" disabled={!name.trim()}>Agregar cuenta</PrimaryButton>
          </form>
        ) : <PrimaryButton onClick={() => setOpen(true)}>Agregar cuenta</PrimaryButton>}
      </div>
    </>
  );
}

export function Tarjetas() {
  const s = useStore();
  const [params] = useSearchParams();
  const [open, setOpen] = useState(params.has('nueva'));
  const [f, setF] = useState({ name: '', limit: '', cutDay: '15', payDay: '30', last4: '' });
  return (
    <>
      <PageHeader title="Tarjetas" />
      <div className="space-y-4 px-4 pb-8">
        {s.cards.length === 0 ? <Empty text="No tienes tarjetas registradas." /> : (
          <ul className="space-y-3">
            {s.cards.map((c) => (
              <li key={c.id} className="rounded-card bg-surface p-5">
                <p className="font-bold">{c.name} {c.last4 && <span className="text-muted">•••• {c.last4}</span>}</p>
                <p className="mt-1 text-sm text-muted">Cupo {money(c.limit)} · corte día {c.cutDay} · pago día {c.payDay}</p>
              </li>
            ))}
          </ul>
        )}
        <p className="px-1 text-sm text-muted">Nunca guardes el número completo ni el código de seguridad. Solo los últimos 4 dígitos, si quieres.</p>
        {open ? (
          <form className="space-y-3 rounded-card bg-surface p-4" onSubmit={(e) => {
            e.preventDefault();
            if (!f.name.trim()) return;
            s.addCard({ name: f.name.trim(), kind: 'credito', limit: toInt(f.limit), cutDay: toInt(f.cutDay) || 1, payDay: toInt(f.payDay) || 1, last4: f.last4.replace(/\D/g, '').slice(0, 4) || undefined });
            setF({ name: '', limit: '', cutDay: '15', payDay: '30', last4: '' }); setOpen(false);
          }}>
            <Field label="Nombre"><input className={inputCls} value={f.name} maxLength={40} onChange={(e) => setF({ ...f, name: e.target.value })} placeholder="Ej. Tarjeta de compras" /></Field>
            <Field label="Cupo (COP)"><input inputMode="numeric" className={inputCls} value={f.limit} onChange={(e) => setF({ ...f, limit: e.target.value })} /></Field>
            <div className="grid grid-cols-3 gap-2">
              <Field label="Día corte"><input inputMode="numeric" className={inputCls} value={f.cutDay} onChange={(e) => setF({ ...f, cutDay: e.target.value })} /></Field>
              <Field label="Día pago"><input inputMode="numeric" className={inputCls} value={f.payDay} onChange={(e) => setF({ ...f, payDay: e.target.value })} /></Field>
              <Field label="Últimos 4"><input inputMode="numeric" maxLength={4} className={inputCls} value={f.last4} onChange={(e) => setF({ ...f, last4: e.target.value })} /></Field>
            </div>
            <PrimaryButton type="submit" disabled={!f.name.trim()}>Agregar tarjeta</PrimaryButton>
          </form>
        ) : <PrimaryButton onClick={() => setOpen(true)}>Agregar tarjeta</PrimaryButton>}
      </div>
    </>
  );
}

export function Metas() {
  const s = useStore();
  const [name, setName] = useState('');
  const [target, setTarget] = useState('');
  return (
    <>
      <PageHeader title="Metas de ahorro" />
      <div className="space-y-4 px-4 pb-8">
        {s.goals.length === 0 && <Empty text="Crea tu primera meta de ahorro." />}
        {s.goals.map((g) => {
          const pct = g.target ? Math.min(100, Math.round((g.saved / g.target) * 100)) : 0;
          return (
            <div key={g.id} className="rounded-card bg-surface p-5">
              <div className="flex justify-between"><p className="font-bold">{g.name}</p><p className="text-sm font-bold text-accent">{pct}%</p></div>
              <p className="mt-1 text-sm text-muted">{money(g.saved)} de {money(g.target)}</p>
              <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-chip" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
                <div className="h-full rounded-full bg-accent transition-all" style={{ width: `${pct}%` }} />
              </div>
              <div className="mt-4 flex gap-2">
                {[50_000, 100_000].map((n) => (
                  <button key={n} onClick={() => s.addToGoal(g.id, n)} className="rounded-full bg-accent-soft px-3 py-1.5 text-sm font-bold text-accent">+{money(n)}</button>
                ))}
                <button onClick={() => s.addToGoal(g.id, -50_000)} className="rounded-full bg-chip px-3 py-1.5 text-sm font-bold">−{money(50_000)}</button>
              </div>
            </div>
          );
        })}
        <form className="space-y-3 rounded-card bg-surface p-4" onSubmit={(e) => {
          e.preventDefault();
          if (!name.trim() || toInt(target) <= 0) return;
          s.addGoal({ name: name.trim(), target: toInt(target) });
          setName(''); setTarget('');
        }}>
          <p className="font-bold">Nueva meta</p>
          <Field label="¿Para qué ahorras?"><input className={inputCls} maxLength={40} value={name} onChange={(e) => setName(e.target.value)} placeholder="Ej. Bicicleta" /></Field>
          <Field label="¿Cuánto necesitas? (COP)"><input inputMode="numeric" className={inputCls} value={target} onChange={(e) => setTarget(e.target.value)} /></Field>
          <PrimaryButton type="submit" disabled={!name.trim() || toInt(target) <= 0}>Crear meta</PrimaryButton>
        </form>
      </div>
    </>
  );
}

export function Presupuesto() {
  const s = useStore();
  const month = new Date().toISOString().slice(0, 7);
  const gastos = s.movements.filter((m) => m.type === 'gasto' && m.date.startsWith(month));
  const total = gastos.reduce((t, m) => t + m.amount, 0);
  const byCat = Object.entries(gastos.reduce<Record<string, number>>((a, m) => ((a[m.category] = (a[m.category] ?? 0) + m.amount), a), {}))
    .sort((a, b) => b[1] - a[1]);
  return (
    <>
      <PageHeader title="Presupuesto del mes" />
      <div className="space-y-4 px-4 pb-8">
        <div className="rounded-card bg-surface p-5">
          <p className="text-sm text-muted">Gastado este mes</p>
          <p className="text-3xl font-extrabold">{money(total)}</p>
        </div>
        {byCat.length === 0 ? <Empty text="Sin gastos este mes." /> : (
          <ul className="space-y-3 rounded-card bg-surface p-5">
            {byCat.map(([cat, n]) => (
              <li key={cat}>
                <div className="flex justify-between text-sm"><span className="font-semibold">{cat}</span><span>{money(n)}</span></div>
                <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-chip"><div className="h-full rounded-full bg-accent" style={{ width: `${(n / total) * 100}%` }} /></div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}

export function Exportar() {
  const s = useStore();
  const download = () => {
    const rows = [['fecha', 'tipo', 'monto', 'cuenta', 'categoria', 'nota'],
      ...s.movements.map((m) => [m.date, m.type, String(m.amount), s.accounts.find((a) => a.id === m.accountId)?.name ?? '', m.category, m.note])];
    const csv = rows.map((r) => r.map((c) => `"${c.replace(/"/g, '""')}"`).join(',')).join('\n');
    const url = URL.createObjectURL(new Blob(['﻿' + csv], { type: 'text/csv' }));
    const a = Object.assign(document.createElement('a'), { href: url, download: `movimientos-${new Date().toISOString().slice(0, 10)}.csv` });
    a.click();
    URL.revokeObjectURL(url);
  };
  return (
    <>
      <PageHeader title="Descargar extracto" />
      <div className="space-y-4 px-4">
        <p className="rounded-card bg-surface p-5 text-muted">Descarga todos tus movimientos ({s.movements.length}) en un archivo CSV que abre Excel o Google Sheets.</p>
        <PrimaryButton onClick={download} disabled={!s.movements.length}>Descargar CSV</PrimaryButton>
      </div>
    </>
  );
}

export function Apariencia() {
  const s = useStore();
  const opts = [['system', 'Igual que el teléfono'], ['light', 'Claro'], ['dark', 'Oscuro']] as const;
  return (
    <>
      <PageHeader title="Apariencia" />
      <div className="px-4">
        <ul className="divide-y divide-border overflow-hidden rounded-card bg-surface" role="radiogroup">
          {opts.map(([v, l]) => (
            <li key={v}>
              <button role="radio" aria-checked={s.theme === v} onClick={() => s.setTheme(v)} className="flex w-full items-center justify-between px-4 py-4 font-semibold">
                {l}<span className={`h-5 w-5 rounded-full border-2 ${s.theme === v ? 'border-accent bg-accent' : 'border-border'}`} />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export function Perfil() {
  const s = useStore();
  const nav = useNavigate();
  if (!s.profile) return (<><PageHeader title="Mi perfil" /><div className="space-y-4 px-4"><Empty text="Aún no has creado tu perfil." /><PrimaryButton onClick={() => nav('/entrar')}>Crear perfil</PrimaryButton></div></>);
  return (
    <>
      <PageHeader title="Mi perfil" />
      <div className="px-4"><div className="rounded-card bg-surface p-5"><p className="text-xl font-bold">{s.profile.name}</p><p className="text-muted">{s.profile.email || 'Sin correo'}</p></div></div>
    </>
  );
}

export function Entrar() {
  const s = useStore();
  const nav = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  return (
    <>
      <PageHeader title="Crear perfil" />
      <form className="space-y-4 px-4" onSubmit={(e) => { e.preventDefault(); if (!name.trim()) return; s.setProfile({ name: name.trim(), email: email.trim() }); nav('/', { replace: true }); }}>
        <p className="rounded-card bg-accent-soft p-4 text-sm">Modo demo: tu perfil y tus datos se guardan solo en este dispositivo. Las cuentas reales con contraseña llegan con el backend.</p>
        <Field label="Tu nombre"><input className={inputCls} autoFocus maxLength={40} value={name} onChange={(e) => setName(e.target.value)} /></Field>
        <Field label="Correo (opcional)"><input type="email" className={inputCls} value={email} onChange={(e) => setEmail(e.target.value)} /></Field>
        <PrimaryButton type="submit" disabled={!name.trim()}>Continuar</PrimaryButton>
      </form>
    </>
  );
}

export function Privacidad() {
  const s = useStore();
  const nav = useNavigate();
  return (
    <>
      <PageHeader title="Privacidad de datos" />
      <div className="space-y-4 px-4">
        <p className="rounded-card bg-surface p-5 text-muted">Tus datos viven en este dispositivo. No se envían a ningún servidor. Puedes descargarlos o borrarlos cuando quieras.</p>
        <PrimaryButton onClick={() => nav('/exportar')}>Descargar mis datos</PrimaryButton>
        <button className="w-full rounded-full py-3.5 font-bold text-danger" onClick={() => { if (confirm('¿Borrar todo y volver a los datos de ejemplo?')) { s.reset(); nav('/'); } }}>
          Borrar mis datos
        </button>
      </div>
    </>
  );
}

export function Terminos() {
  return (<><PageHeader title="Términos de uso" /><div className="px-4"><p className="rounded-card bg-surface p-5 text-muted">Borrador. Esta app es una herramienta personal para registrar tus finanzas. No es una entidad financiera, no mueve dinero y no ofrece asesoría.</p></div></>);
}

export function Proximamente() {
  return (
    <>
      <PageHeader title="Próximamente" />
      <div className="flex flex-col items-center gap-3 px-8 pt-16 text-center text-muted">
        <Construction size={48} strokeWidth={1.4} />
        <p>Esta sección aún está en construcción.</p>
      </div>
    </>
  );
}
