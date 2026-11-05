# Replica: guía rápida

Las 11 skills de Replica están en `.claude/skills/`. Cualquier sesión de Claude Code
abierta en este repositorio las carga sola. Cada skill guarda su trabajo en esta
carpeta `replica/`, y la siguiente lo lee.

## Cómo empezar

1. Abre una sesión de Claude Code en este repo (rama `claude/replica-skills`, o `main` cuando la fusiones).
2. Escribe `/replica-recon` y la URL de la app que quieres replicar.
3. Sigue el orden:

```
recon -> architect -> design -> build -> backend -> test -> diff -> entrepreneur -> brand -> launch -> deploy
```

| comando | qué hace |
| --- | --- |
| `/replica-recon` | Mapea la app: pantallas, flujos, componentes, modelo de datos |
| `/replica-architect` | Elige el stack, el esquema de base de datos y la API |
| `/replica-design` | Reconstruye el sistema de diseño como tokens |
| `/replica-build` | Construye la app pantalla por pantalla |
| `/replica-backend` | Login, base de datos, pagos, correos |
| `/replica-test` | Prueba cada flujo y registra bugs |
| `/replica-diff` | Puntúa tu versión frente a la original |
| `/replica-entrepreneur` | Lee reseñas reales y encuentra qué mejorar |
| `/replica-brand` | Nombre, colores y marca propios |
| `/replica-launch` | Landing, precios y ficha de tienda |
| `/replica-deploy` | Publica en tu dominio |

Consejo: antes de construir nada, `/replica-entrepreneur` sobre la app que te interesa
te dice si vale la pena.

## Reglas que las skills respetan

- Copian funciones y flujos, nunca código, logos, textos ni contenido de la original.
- Solo fuentes públicas y tu propia cuenta. Nada de scraping ni de saltarse logins.
- Siempre se cambia la marca antes de publicar.
- Revisa marcas registradas y términos antes de vender. No es asesoría legal.

Origen: https://github.com/Jakeschincariol/replica-skill (licencia MIT, en `.claude/skills/REPLICA-LICENSE`).
