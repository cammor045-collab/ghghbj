import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

export type AccountType = 'ahorros' | 'corriente' | 'efectivo' | 'otro';
export type MovementType = 'ingreso' | 'gasto';

export interface Account { id: string; name: string; type: AccountType; initial: number }
export interface Card { id: string; name: string; kind: 'credito' | 'debito'; limit: number; cutDay: number; payDay: number; last4?: string }
export interface Movement { id: string; type: MovementType; amount: number; accountId: string; category: string; date: string; note: string }
export interface Goal { id: string; name: string; target: number; saved: number }
export interface Profile { name: string; email: string }

interface Data {
  profile: Profile | null;
  theme: 'light' | 'dark' | 'system';
  accounts: Account[];
  cards: Card[];
  movements: Movement[];
  goals: Goal[];
}

export const CATEGORIES = ['Comida', 'Transporte', 'Hogar', 'Servicios', 'Salud', 'Ocio', 'Compras', 'Salario', 'Otros'];

const KEY = 'finanzas-demo-v1';
const uid = () => Math.random().toString(36).slice(2, 10);
const daysAgo = (n: number) => new Date(Date.now() - n * 864e5).toISOString().slice(0, 10);

// Montos en pesos enteros (COP no usa centavos en la práctica).
function seed(): Data {
  const a1 = { id: uid(), name: 'Cuenta de ahorros', type: 'ahorros' as const, initial: 2_350_000 };
  const a2 = { id: uid(), name: 'Efectivo', type: 'efectivo' as const, initial: 180_000 };
  return {
    profile: null,
    theme: 'system',
    accounts: [a1, a2],
    cards: [{ id: uid(), name: 'Tarjeta de crédito', kind: 'credito', limit: 3_000_000, cutDay: 15, payDay: 30, last4: '4821' }],
    movements: [
      { id: uid(), type: 'ingreso', amount: 3_200_000, accountId: a1.id, category: 'Salario', date: daysAgo(6), note: 'Pago de nómina' },
      { id: uid(), type: 'gasto', amount: 86_500, accountId: a1.id, category: 'Comida', date: daysAgo(5), note: 'Mercado de la semana' },
      { id: uid(), type: 'gasto', amount: 12_000, accountId: a2.id, category: 'Transporte', date: daysAgo(3), note: 'Bus' },
      { id: uid(), type: 'gasto', amount: 145_000, accountId: a1.id, category: 'Servicios', date: daysAgo(2), note: 'Internet y luz' },
      { id: uid(), type: 'gasto', amount: 38_900, accountId: a1.id, category: 'Ocio', date: daysAgo(1), note: 'Cine' },
      { id: uid(), type: 'gasto', amount: 22_000, accountId: a2.id, category: 'Comida', date: daysAgo(0), note: 'Almuerzo' },
    ],
    goals: [
      { id: uid(), name: 'Vacaciones', target: 2_000_000, saved: 650_000 },
      { id: uid(), name: 'Fondo de emergencia', target: 5_000_000, saved: 1_200_000 },
    ],
  };
}

function load(): Data {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw) as Data;
  } catch { /* almacenamiento no disponible */ }
  return seed();
}

interface Store extends Data {
  balance: (accountId: string) => number;
  total: number;
  addMovement: (m: Omit<Movement, 'id'>) => void;
  deleteMovement: (id: string) => void;
  addAccount: (a: Omit<Account, 'id'>) => void;
  addCard: (c: Omit<Card, 'id'>) => void;
  addGoal: (g: Omit<Goal, 'id' | 'saved'>) => void;
  addToGoal: (id: string, amount: number) => void;
  setTheme: (t: Data['theme']) => void;
  setProfile: (p: Profile | null) => void;
  reset: () => void;
}

const Ctx = createContext<Store | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<Data>(load);

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(data)); } catch { /* ignorar */ }
  }, [data]);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const apply = () => {
      const dark = data.theme === 'dark' || (data.theme === 'system' && mq.matches);
      document.documentElement.classList.toggle('dark', dark);
    };
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, [data.theme]);

  const store = useMemo<Store>(() => {
    const balance = (accountId: string) => {
      const acc = data.accounts.find((a) => a.id === accountId);
      const moves = data.movements.filter((m) => m.accountId === accountId);
      return (acc?.initial ?? 0) + moves.reduce((s, m) => s + (m.type === 'ingreso' ? m.amount : -m.amount), 0);
    };
    const set = (fn: (d: Data) => Data) => setData((d) => fn(d));
    return {
      ...data,
      balance,
      total: data.accounts.reduce((s, a) => s + balance(a.id), 0),
      addMovement: (m) => set((d) => ({ ...d, movements: [{ ...m, id: uid() }, ...d.movements] })),
      deleteMovement: (id) => set((d) => ({ ...d, movements: d.movements.filter((m) => m.id !== id) })),
      addAccount: (a) => set((d) => ({ ...d, accounts: [...d.accounts, { ...a, id: uid() }] })),
      addCard: (c) => set((d) => ({ ...d, cards: [...d.cards, { ...c, id: uid() }] })),
      addGoal: (g) => set((d) => ({ ...d, goals: [...d.goals, { ...g, id: uid(), saved: 0 }] })),
      addToGoal: (id, amount) => set((d) => ({ ...d, goals: d.goals.map((g) => (g.id === id ? { ...g, saved: Math.max(0, g.saved + amount) } : g)) })),
      setTheme: (theme) => set((d) => ({ ...d, theme })),
      setProfile: (profile) => set((d) => ({ ...d, profile })),
      reset: () => setData(seed()),
    };
  }, [data]);

  return <Ctx.Provider value={store}>{children}</Ctx.Provider>;
}

export function useStore() {
  const s = useContext(Ctx);
  if (!s) throw new Error('useStore fuera de StoreProvider');
  return s;
}

export const money = (n: number) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n);

export const dateLabel = (iso: string) => {
  const today = new Date().toISOString().slice(0, 10);
  const yesterday = new Date(Date.now() - 864e5).toISOString().slice(0, 10);
  if (iso === today) return 'Hoy';
  if (iso === yesterday) return 'Ayer';
  return new Date(iso + 'T12:00:00').toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'long' });
};
