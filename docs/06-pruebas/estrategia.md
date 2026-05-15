# 06 — Estrategia de Pruebas

## Enfoque general

| Tipo | Herramienta | Alcance | ¿Cuándo se ejecuta? |
|---|---|---|---|
| **Unitarias** | Vitest | Stores, funciones puras, validaciones de estado | Cada commit (watch mode) |
| **Componentes** | Vitest + Testing Library | Renderizado, eventos de UI, cambios de estado | Cada commit |
| **Integración** | Vitest + Testing Library | Server Actions + Base de datos (Supabase local) | Pre-push |
| **Carga** | k6 / Artillery | Supabase Realtime concurrencia, endpoints críticos | Antes de release |
| **E2E** | Playwright (futuro) | Flujo completo: QR → Menú → Pago → Cocina → Entrega | CI/CD |

## Principios

1. **Test de comportamiento, no de implementación:** Probar qué hace el usuario, no cómo está escrito el código interno
2. **Optimistic updates testeados:** Verificar que la UI reacciona antes de la respuesta del servidor y revierte en caso de error
3. **Cada historia de usuario tiene al menos un test de integración** (ver `docs/02-alcance/historias-usuario.md`)
4. **Los tests unitarios no tocan la base de datos real** — usan mocks de Drizzle

## Configuración

Archivo de configuración: `vitest.config.ts`
Archivo de setup: `tests/setup.ts` (importa `@testing-library/jest-dom/vitest`)

Comandos disponibles:
```bash
npm test            # Watch mode
npm run test:run    # Single run
npm run test:coverage # Con reporte de cobertura
```
### Estado actual
53 tests implementados (8 archivos): 45 unitarios + 8 integración.
