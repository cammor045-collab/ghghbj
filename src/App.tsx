import { cn } from '@/utils/cn';

const principles = [
  'Solo procesa información que tú ya ves y decides registrar manualmente.',
  'No accede a datos privados ni elude autenticación.',
  'No automatiza acciones, clics ni envíos de formularios.',
  'Cada análisis se etiqueta como inferencia basada solo en tus registros.',
];

/**
 * Pantalla base del scaffold (Fase 1). Las fases siguientes reemplazan
 * este componente por el enrutador y los layouts de la aplicación.
 */
export default function App() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-xl w-full animate-fade-in">
        <span className="inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
          <span className="material-symbols-rounded text-base">bolt</span>
          Fase 1 · Scaffold
        </span>
        <h1 className="mt-4 text-4xl font-bold tracking-tight">
          IMES Manager Pro
        </h1>
        <p className="mt-3 text-muted-foreground">
          Registra, organiza y analiza manualmente la información que observas en
          servicios web.
        </p>
        <ul className="mt-6 space-y-2">
          {principles.map((p) => (
            <li
              key={p}
              className={cn(
                'flex items-start gap-2 rounded-md border bg-card p-3 text-sm',
                'text-card-foreground',
              )}
            >
              <span className="material-symbols-rounded text-success text-lg">
                check_circle
              </span>
              {p}
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
