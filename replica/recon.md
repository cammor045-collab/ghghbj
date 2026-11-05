# Mapa de recon: Mi Bancolombia (iOS) → app de finanzas personales (web móvil / PWA)

Alcance: la estructura de 5 pestañas (Inicio, Transacciones, Explorar, Trámites, Ajustes),
adaptada a una app de **finanzas personales con marca propia**: el usuario registra a mano sus
cuentas, tarjetas, movimientos y bolsillos de ahorro. No es un banco y no mueve dinero real.
Para: el propio usuario (producto que podría venderse después).
Fecha: 2026-11-05

> Regla de esta réplica: se copian la **estructura y los patrones de navegación**. Nunca el
> nombre, logo, amarillo de marca, textos, iconos ni marcas de productos de la original
> (Bancolombia, Tu360, Puntos Colombia...). Una app que se parece a la de un banco real y pide
> "Iniciar sesión" es un vector de phishing: replica-brand debe cambiarlo todo antes de publicar.

## Fuentes

| # | fuente | URL | notas |
| --- | --- | --- | --- |
| 1 | capturas del usuario (5) | `replica/screens/` | fuente principal. Sin sesión iniciada en Ajustes. |
| 2 | ficha App Store | https://apps.apple.com/es/app/mi-bancolombia/id6526460670 | **no leída**: la red de esta sesión bloquea apps.apple.com |
| 3 | sitio y centro de ayuda | https://www.bancolombia.com/personas | pendiente, por leer a mano si hace falta |

Inicio y Transacciones no aparecen en las capturas: todo lo de esas pestañas es **inferido**
del nombre de la pestaña y del patrón habitual en apps financieras (confianza: guess).

## Ciclo principal

Abrir la app, ver cuánto dinero tengo y en qué se fue: saldo total, movimientos recientes y
bolsillos de ahorro.

## Pantallas

| ID | pantalla | cómo se llega | propósito | componentes clave | estados vistos |
| --- | --- | --- | --- | --- | --- |
| S01 | Inicio | pestaña 1 | resumen: saldo, cuentas, últimos movimientos | tarjeta de saldo, lista de cuentas, lista de movimientos | ninguno (inferida) |
| S02 | Explorar | pestaña 3 | catálogo de servicios por secciones | encabezado de sección, ícono circular con color por sección + etiqueta, divisor | lleno |
| S03 | Trámites › Productos | pestaña 4, sub-pestaña 1 | acceso a tipos de producto, "Para ti" y "Para tu negocio" | segmented tabs, tarjeta-grid 2 col con ícono, badge "¡Nuevo!", punto verde | lleno, scroll |
| S04 | Trámites › Trámites | pestaña 4, sub-pestaña 2 | gestiones: agendar turno, documentos, activar tarjetas | segmented tabs, tarjeta-grid 2 col | lleno |
| S05 | Ajustes (sin sesión) | pestaña 5 | menú de configuración | título grande, grid 3 col de íconos circulares, botón contorno "Iniciar sesión" fijo abajo | sin sesión |
| S06 | Transacciones | pestaña 2 | historial de movimientos con filtros | lista agrupada por fecha, búsqueda, filtros | ninguno (inferida) |
| S07 | Detalle de cuenta / tarjeta | desde S01 o S03 | saldo y movimientos de un producto | cabecera de saldo, lista | inferida |
| S08 | Bolsillos | Explorar › Bolsillos | apartar dinero por metas | lista de bolsillos, barra de progreso, crear/mover | inferida |
| S09 | Día a Día | Explorar › Día a Día | presupuesto / control de gasto diario | gráfico, categorías | inferida (guess) |
| S10 | Nuevo movimiento | botón en S01/S06 | registrar ingreso o gasto a mano | formulario: monto, cuenta, categoría, fecha, nota | inferida |
| S11 | Tu usuario | Ajustes | perfil | formulario | inferida |
| S12 | Seguridad | Ajustes | PIN, biometría, cerrar sesión | toggles | inferida |
| S13 | Preferencias de pantalla | Ajustes | tema claro/oscuro, tamaño de texto | toggles, radio | inferida |
| S14 | Protección de datos / Términos | Ajustes | textos legales, exportar y borrar mis datos | texto largo, botones | inferida |
| S15 | Iniciar sesión / registro | Ajustes › Iniciar sesión | cuenta propia de la app | formulario | inferida |
| S16 | Solicitar documentos | Trámites | en la réplica: exportar extracto (PDF/CSV) de mis registros | selector de rango, botón | inferida |

## Flujos

```
F01 Ver mi resumen
    S01
    clics del camino feliz: 0 (pantalla de inicio)
    edge: sin cuentas aún (estado vacío), saldo negativo, montos muy largos

F02 Registrar un gasto
    S01 -> S10 -> S01
    clics: 3 (botón +, completar, guardar)
    edge: monto vacío/cero, decimales con coma, fecha futura, cuenta borrada

F03 Buscar un movimiento
    S06 -> filtro/búsqueda -> detalle
    edge: sin resultados, cientos de movimientos

F04 Crear un bolsillo y apartar dinero
    S02 -> S08 -> crear -> mover dinero
    edge: mover más de lo disponible, meta alcanzada

F05 Agregar una cuenta o tarjeta
    S03 -> Cuentas/Tarjetas -> formulario -> S07
    edge: nombre largo, moneda distinta (COP/USD)

F06 Exportar mis datos
    S04 -> S16 -> descargar
    edge: rango sin movimientos

F07 Cambiar tema / seguridad
    S05 -> S13 o S12
    edge: preferencia del sistema en modo oscuro

F08 Iniciar sesión
    S05 -> S15 -> S05 con sesión
    edge: contraseña errónea, sin conexión
```

## Componentes

| componente | variantes | estados | usado en |
| --- | --- | --- | --- |
| Barra de pestañas inferior | 5 ítems ícono + etiqueta | normal, activo (fondo de acento lleno) | todas |
| Logo centrado en cabecera | — | — | todas (usar marca propia) |
| Tabs segmentadas | 2 opciones, subrayado grueso en la activa | normal, activa | S03, S04 |
| Tarjeta de acción (grid 2 col) | con/sin badge "nuevo", ícono en círculo gris o con anillo verde | normal, pulsada | S03, S04 |
| Ícono circular + etiqueta | fondo de color por sección (lila, verde menta, amarillo claro, salmón) o blanco | normal, pulsada | S02, S05 |
| Encabezado de sección | — | — | S02, S03 |
| Divisor | fino gris | — | S02 |
| Badge "nuevo" | texto verde | — | S03 |
| Botón | primario, contorno (pill, ancho completo) | default, pulsado, deshabilitado, cargando | S05 y formularios |
| Panel inferior fijo | con sombra superior y esquinas redondeadas | — | S05 |
| Campos de formulario | monto, texto, select, fecha | vacío, foco, error | S10, S11, S15 |
| Fila de movimiento | ingreso, gasto | — | S01, S06, S07 |
| Toast | éxito, error | — | global |

Patrón visual: fondo gris muy claro, tarjetas blancas con radio grande (~20px), tipografía
sans humanista, íconos de línea fina. Todo se rehace con un set abierto (Lucide/Phosphor).

## Modelo de datos inferido

```
Usuario      id, nombre, email, moneda_principal, tema, pin_activo
             evidencia: S05 "Tu usuario", "Seguridad", "Preferencias de pantalla"
             confianza: media

Cuenta       id, usuario_id, tipo (ahorros | corriente | efectivo | otro), nombre,
             moneda, saldo_inicial
             evidencia: S03 "Cuentas"   confianza: media

Tarjeta      id, usuario_id, nombre, tipo (débito | crédito), cupo, día_corte, día_pago,
             últimos_4 (opcional, nunca el número completo)
             evidencia: S03 "Tarjetas", S04 "Activar tarjetas"   confianza: media

Movimiento   id, usuario_id, cuenta_id | tarjeta_id, tipo (ingreso | gasto | transferencia),
             monto_centavos, categoría_id, fecha, nota
             evidencia: pestaña "Transacciones"   confianza: guess

Categoría    id, usuario_id, nombre, ícono, color
             evidencia: S02 "Día a Día" (guess)   confianza: guess

Bolsillo     id, usuario_id, cuenta_id, nombre, meta_centavos, saldo_centavos
             evidencia: S02 "Bolsillos"   confianza: media

Crédito / Inversión / Seguro   registro manual: nombre, monto, cuota o rendimiento, fechas
             evidencia: S03   confianza: guess (could)
```

Relaciones: Usuario 1-n Cuenta, Usuario 1-n Tarjeta, Cuenta 1-n Movimiento,
Tarjeta 1-n Movimiento, Cuenta 1-n Bolsillo, Categoría 1-n Movimiento.

## Matriz de funciones

Ver `features.csv`. Must: 14 (1 añadida, no está en la original), should: 9 (1 añadida), could: 6, skip: 9.

## Fuera de alcance (no se puede o no se debe clonar)

- Mover dinero real, transferencias, pagos, recargas de celular o transporte: requieren licencia
  de la Superintendencia Financiera y convenios con operadores.
- Abrir cuentas, otorgar créditos, vender seguros o inversiones: productos regulados. En la
  réplica solo se **registran** a mano.
- Activar tarjetas físicas, agendar turno en sucursal: dependen de un banco real.
- Tu360 Inmobiliario / Movilidad, Puntos Colombia, ofertas y viajes: marketplaces y programas
  de aliados de la original, no son funciones reconstruibles.
- Panamá o Puerto Rico: filiales del banco.
- Datáfonos y pagos en línea: procesamiento de pagos regulado.
- La marca, el logo, el amarillo característico y los textos de la original.

## Tamaño

Pantallas 16, flujos 8, entidades 7. Partes difíciles: autenticación y aislamiento de datos
por usuario, cálculo correcto de saldos (cuentas, tarjetas, bolsillos y transferencias), manejo
de moneda y montos en centavos con formato COP. Tamaño: **M** (unas semanas para todo; un fin de
semana para la estructura de 5 pestañas con datos de ejemplo).
