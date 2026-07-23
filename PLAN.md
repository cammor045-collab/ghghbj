# IMES Manager Pro — Plan de Construcción

Plataforma de productividad para **registrar, organizar y analizar manualmente**
información que el usuario ya observa en pantalla. La app trabaja **exclusivamente**
con registros creados por el propio usuario.

## Principio rector (invariante de diseño)

- Solo procesa información que el usuario ya ve y decide registrar **manualmente**.
- **No** accede a datos privados, **no** automatiza acciones, **no** modifica páginas,
  **no** envía formularios, **no** hace clics automáticos, **no** elude autenticación.
- La extensión usa `activeTab` con **inyección bajo demanda** (nunca content script
  persistente) y **confirmación explícita** antes de escribir en Firestore.
- Todo análisis y conclusión se etiqueta en UI como **inferencia basada solo en los
  registros almacenados**.

## Stack

React 19 · Vite · TypeScript estricto · TailwindCSS · Firebase Auth · Firestore ·
React Router · React Query (TanStack) · Recharts · Framer Motion · Material Icons ·
Extensión Manifest V3.

## Convenciones

- Ningún archivo supera ~250 líneas; si crece, se extraen subcomponentes/hooks.
- Sin `TODO`, sin placeholders: cada archivo compila y funciona.
- Tras cada fase: `npm run build` + `npx tsc --noEmit`, corregir, commit, y **detenerse
  para revisión**.

---

## Árbol de archivos completo

```
imes-manager-pro/
├── PLAN.md
├── README.md
├── .env.example
├── .gitignore
├── .eslintrc.cjs
├── .prettierrc.json
├── package.json
├── vite.config.ts
├── tsconfig.json
├── tsconfig.node.json
├── index.html
├── postcss.config.js
├── tailwind.config.ts
├── firebase.json
├── firestore.rules
├── firestore.indexes.json
├── public/
│   └── favicon.svg
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── router.tsx
│   ├── index.css
│   ├── vite-env.d.ts
│   ├── assets/
│   │   └── logo.svg
│   ├── types/
│   │   ├── index.ts
│   │   ├── user.ts
│   │   ├── project.ts
│   │   ├── record.ts
│   │   ├── report.ts
│   │   ├── alert.ts
│   │   ├── settings.ts
│   │   ├── activity.ts
│   │   └── history.ts
│   ├── firebase/
│   │   ├── config.ts
│   │   ├── app.ts
│   │   └── converters.ts
│   ├── contexts/
│   │   ├── AuthContext.tsx
│   │   ├── ThemeContext.tsx
│   │   └── SettingsContext.tsx
│   ├── services/
│   │   ├── base.ts
│   │   ├── users.ts
│   │   ├── projects.ts
│   │   ├── records.ts
│   │   ├── reports.ts
│   │   ├── alerts.ts
│   │   ├── settings.ts
│   │   ├── activity.ts
│   │   └── history.ts
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useTheme.ts
│   │   ├── useProjects.ts
│   │   ├── useRecords.ts
│   │   ├── useReports.ts
│   │   ├── useAlerts.ts
│   │   ├── useActivity.ts
│   │   ├── useSettings.ts
│   │   ├── useStatistics.ts
│   │   └── useDebounce.ts
│   ├── utils/
│   │   ├── cn.ts
│   │   ├── date.ts
│   │   ├── format.ts
│   │   ├── statistics.ts
│   │   ├── compare.ts
│   │   ├── trends.ts
│   │   ├── export.ts
│   │   └── id.ts
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Textarea.tsx
│   │   │   ├── Select.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Dropdown.tsx
│   │   │   ├── Tabs.tsx
│   │   │   ├── Spinner.tsx
│   │   │   ├── EmptyState.tsx
│   │   │   ├── Toast.tsx
│   │   │   ├── Icon.tsx
│   │   │   └── InferenceTag.tsx
│   │   ├── charts/
│   │   │   ├── ChartCard.tsx
│   │   │   ├── AreaChart.tsx
│   │   │   ├── LineChart.tsx
│   │   │   ├── BarChart.tsx
│   │   │   ├── PieChart.tsx
│   │   │   ├── RadarChart.tsx
│   │   │   └── Heatmap.tsx
│   │   ├── dashboard/
│   │   │   ├── StatCard.tsx
│   │   │   ├── RecentActivity.tsx
│   │   │   ├── DaySummary.tsx
│   │   │   └── LastRecordTimer.tsx
│   │   ├── projects/
│   │   │   ├── ProjectForm.tsx
│   │   │   ├── ProjectCard.tsx
│   │   │   ├── ProjectList.tsx
│   │   │   └── ProjectTags.tsx
│   │   ├── records/
│   │   │   ├── RecordForm.tsx
│   │   │   ├── RecordCard.tsx
│   │   │   ├── RecordList.tsx
│   │   │   ├── ObservedItemsField.tsx
│   │   │   └── RecordFilters.tsx
│   │   ├── compare/
│   │   │   ├── RecordPicker.tsx
│   │   │   ├── CompareView.tsx
│   │   │   └── DiffSummary.tsx
│   │   ├── timeline/
│   │   │   ├── Timeline.tsx
│   │   │   └── TimelineItem.tsx
│   │   ├── alerts/
│   │   │   ├── AlertForm.tsx
│   │   │   ├── AlertList.tsx
│   │   │   └── ThresholdField.tsx
│   │   ├── search/
│   │   │   └── MultiSearch.tsx
│   │   ├── analysis/
│   │   │   ├── TrendPanel.tsx
│   │   │   ├── GrowthPanel.tsx
│   │   │   └── AssistantSummary.tsx
│   │   └── common/
│   │       ├── ProtectedRoute.tsx
│   │       ├── RoleGate.tsx
│   │       ├── PageHeader.tsx
│   │       └── ConfirmDialog.tsx
│   ├── layouts/
│   │   ├── AppLayout.tsx
│   │   ├── AuthLayout.tsx
│   │   ├── Sidebar.tsx
│   │   └── Topbar.tsx
│   └── pages/
│       ├── LoginPage.tsx
│       ├── RegisterPage.tsx
│       ├── DashboardPage.tsx
│       ├── ProjectsPage.tsx
│       ├── ProjectDetailPage.tsx
│       ├── RecordsPage.tsx
│       ├── ComparePage.tsx
│       ├── TimelinePage.tsx
│       ├── StatisticsPage.tsx
│       ├── AlertsPage.tsx
│       ├── SearchPage.tsx
│       ├── AnalysisPage.tsx
│       ├── SettingsPage.tsx
│       └── NotFoundPage.tsx
└── chrome-extension/
    ├── manifest.json
    ├── package.json
    ├── vite.config.ts
    ├── tsconfig.json
    ├── src/
    │   ├── background.ts
    │   ├── content.ts          (inyectado bajo demanda; captura selección visible)
    │   ├── popup.tsx
    │   ├── options.tsx
    │   ├── firebase.ts
    │   ├── types.ts
    │   └── styles.css
    ├── popup.html
    └── options.html
```

---

## Orden de construcción (10 fases)

**Fase 1 — Scaffold**
`package.json`, `vite.config.ts`, `tsconfig*.json` (strict), Tailwind + tokens de tema,
ESLint + Prettier, estructura de carpetas, `.env.example`, `.gitignore`, `README.md`,
`index.html`, `main.tsx`/`App.tsx` mínimos, `index.css`. Build verde.

**Fase 2 — Firebase + Auth + Roles**
`firebase/config.ts`, `app.ts`; `AuthContext`, `ThemeContext`; roles
(Administrador, Editor, Solo lectura); `ProtectedRoute` + `RoleGate`; `router.tsx`;
`firestore.rules` (roles reforzados en servidor) + `firestore.indexes.json` +
`firebase.json`.

**Fase 3 — Tipos + Servicios + Hooks**
Tipos de `users, projects, records, reports, alerts, settings, activity, history`.
Servicios Firestore con converters. Hooks React Query (loading/error/estados).

**Fase 4 — Layout + Navegación + Auth pages**
`AppLayout`, `Sidebar`, `Topbar`, `AuthLayout`; `LoginPage`, `RegisterPage`;
componentes `ui/` base.

**Fase 5 — Dashboard + Charts**
`StatCard`, `RecentActivity`, `DaySummary`, `LastRecordTimer`; gráficas reutilizables
(área, línea, barras, circular, radar, heatmap); semanal + mensual.

**Fase 6 — CRUD Proyectos + Registros**
Formularios, listas, tarjetas, tags, campos de items observados; historial por proyecto.

**Fase 7 — Comparador + Timeline + Estadísticas**
`CompareView`/`DiffSummary` (% cambios, nuevos/eliminados/variaciones/resumen);
`Timeline` navegable; módulo estadístico (promedios, máx/mín, variación, crecimiento,
frecuencia, distribución).

**Fase 8 — Alertas + Búsqueda + Exportación + Config**
Alertas con umbrales (aumento excesivo, atípico, actividad inusual, cambios
consecutivos); búsqueda multicriterio; export PDF/Excel/CSV/JSON; `SettingsPage`
(tema, idioma, colores, logo, nombre de empresa, formato de fechas).

**Fase 9 — Extensión Chrome MV3**
`manifest.json` (`activeTab`, sin host persistente), `background.ts`, `content.ts`
(inyección bajo demanda), `popup.tsx` (previsualización + confirmación explícita),
`options.tsx`. Cada registro: fecha, hora, origen, proyecto, notas, datos observados,
id único.

**Fase 10 — Panel de Análisis**
Comparación, detección de tendencias, crecimiento/disminuciones/diferencias, y
asistente que resume cambios/tendencias/actividad/comparaciones/conclusiones. Toda
conclusión etiquetada como **inferencia** basada solo en registros almacenados.

---

## Checkpoints por fase

Al terminar cada fase: `npm run build` → `npx tsc --noEmit` → corregir → commit
descriptivo → **detenerse para tu revisión** antes de la siguiente fase.
