import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Outlet, Route, Routes, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import './index.css';
import { StoreProvider } from './store';
import { TabBar } from './components/ui';
import { Ajustes, Explorar, Gestion, Inicio, Movimientos } from './screens/tabs';
import { Apariencia, Cuentas, Entrar, Exportar, Metas, NuevoMovimiento, Perfil, Presupuesto, Privacidad, Proximamente, Tarjetas, Terminos } from './screens/pages';

function Shell() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return (
    <div className="mx-auto min-h-full max-w-md bg-bg">
      <main className="min-h-[100dvh] pb-24"><Outlet /></main>
      <TabBar />
    </div>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <StoreProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Shell />}>
            <Route index element={<Inicio />} />
            <Route path="movimientos" element={<Movimientos />} />
            <Route path="explorar" element={<Explorar />} />
            <Route path="gestion" element={<Gestion />} />
            <Route path="ajustes" element={<Ajustes />} />
            <Route path="nuevo" element={<NuevoMovimiento />} />
            <Route path="cuentas" element={<Cuentas />} />
            <Route path="tarjetas" element={<Tarjetas />} />
            <Route path="metas" element={<Metas />} />
            <Route path="presupuesto" element={<Presupuesto />} />
            <Route path="exportar" element={<Exportar />} />
            <Route path="apariencia" element={<Apariencia />} />
            <Route path="perfil" element={<Perfil />} />
            <Route path="entrar" element={<Entrar />} />
            <Route path="privacidad" element={<Privacidad />} />
            <Route path="terminos" element={<Terminos />} />
            <Route path="*" element={<Proximamente />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </StoreProvider>
  </StrictMode>,
);
