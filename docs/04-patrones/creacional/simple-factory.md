# 04 — Simple Factory

## Concepto

El patrón Simple Factory (o Factory Function) centraliza la creación de objetos en una función que recibe un parámetro y retorna la instancia adecuada. Oculta la lógica de selección al cliente.

Se diferencia del Factory Method de GoF en que no requiere una jerarquía de clases creadoras con herencia. Es más simple: una función con un mapa de opciones.

---

## Aplicación en E-Kitchen

La función `crearPlatoFactory(tipo)` en `src/lib/servicios/platoFactory.ts` retorna un objeto `PlatoCreador` según el tipo de plato seleccionado.

### Estructura

**Archivo:** `src/lib/servicios/platoFactory.ts:86-100`

```typescript
const CREADORES: Record<TipoPlato, PlatoCreador> = {
  plato_fuerte: new CreadorPlatoFuerte(),
  bebida: new CreadorBebida(),
  combo: new CreadorCombo(),
};

export function crearPlatoFactory(tipo: TipoPlato): PlatoCreador {
  const creador = CREADORES[tipo];
  if (!creador) throw new Error(`Tipo de plato no soportado: ${tipo}`);
  return creador;
}
```

- **Mapa pre-instanciado:** Los creadores se instancian una vez y se reutilizan (no se crean objetos nuevos en cada llamada)
- **Búsqueda O(1):** El acceso por clave de diccionario es inmediato
- **Error controlado:** Si el tipo no existe, lanza una excepción descriptiva

### Cliente

**Archivo:** `src/hooks/useGestionPlatos.ts:17-41`

```typescript
const crear = useCallback(async (datos: DatosFormularioPlato): Promise<ResultadoPlato> => {
  // 1. Obtener el creador según el tipo de plato
  const factory = crearPlatoFactory(datos.tipoPlato as TipoPlato);

  // 2. Validar con las reglas del tipo específico
  const errorValidacion = factory.validar(datos);
  if (errorValidacion) return { exito: false, error: errorValidacion };

  // 3. Transformar datos del formulario a formato DB
  const datosDB = factory.transformar(datos, imagenUrl);

  // 4. Persistir vía Server Action
  const nuevo = await crearPlato(datosDB);
  return { exito: true, plato: nuevo as Plato };
}, []);
```

El cliente (`useGestionPlatos`) **no conoce** qué clase concreta de `PlatoCreador` está usando. Solo interactúa con la interfaz.

---

## Referencia completa en el código

| Componente | Archivo | Rol |
|---|---|---|
| **Mapa de creadores** | `src/lib/servicios/platoFactory.ts:86-90` | `CREADORES` pre-instanciados |
| **Factory function** | `src/lib/servicios/platoFactory.ts:96-100` | `crearPlatoFactory(tipo)` |
| **Interfaz del producto** | `src/lib/servicios/platoFactory.ts:21-24` | `PlatoCreador` |
| **Clases concretas (3)** | `src/lib/servicios/platoFactory.ts:26-84` | `CreadorPlatoFuerte`, `CreadorBebida`, `CreadorCombo` |
| **Cliente** | `src/hooks/useGestionPlatos.ts:20` | `crearPlatoFactory(datos.tipoPlato)` |
| **Tipos** | `src/types/index.ts:8` | `TipoPlato` |
| **Tests** | `tests/unitarias/servicios/platoFactory.test.ts` | 11 tests de validación y transformación por tipo |

---

## Beneficio clave (OCP)

Para agregar un nuevo tipo de plato (ej: `"postre"`):

1. Crear `class CreadorPostre implements PlatoCreador`
2. Agregar `"postre"` al enum `TipoPlato`
3. Agregar `postre: new CreadorPostre()` al mapa `CREADORES`

El factory (`crearPlatoFactory`) y el cliente (`useGestionPlatos`) **no se modifican**.
