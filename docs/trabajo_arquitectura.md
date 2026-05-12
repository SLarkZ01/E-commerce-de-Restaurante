# Documento de Requisitos: Proyecto Final Arquitectura de SW

El objetivo del proyecto final es diseñar o implementar una solución de software justificando la arquitectura, los patrones de diseño y los mecanismos de prueba y validación usados. Debe demostrar su capacidad para seleccionar tecnologías y estructuras coherentes con el tipo de sistema elegido.

---

## 1. Opciones de Proyecto

Cada equipo debe elegir una de las siguientes líneas de trabajo (trabajo previamente ya realizado e igual puede cambiar si considera necesario):

**1.1. Sistema académico tradicional:** Sistema para gestión de matrícula, calificaciones, horarios, pagos, usuarios, reportes y notificaciones, orientado a instituciones educativas de tamaño medio o grande.

**1.2. Plataforma de e-learning moderna:** Plataforma para cursos, contenidos, evaluaciones, progreso, foros, certificación y experiencia de usuario multicanal, con posibilidad de recomendaciones o personalización.

**1.3. Analítica o IA:** Sistema para procesamiento, visualización, predicción o automatización basada en datos, con enfoque en ingestión, limpieza, modelado, análisis y consumo de resultados.

**1.4. E-commerce o Marketplace:** Plataforma de catálogo, carrito, pagos, inventario, pedidos, usuarios, promociones, logística y analítica comercial, con soporte para alta concurrencia y crecimiento progresivo.

---

## 2. Alcance Mínimo

Cada proyecto debe incluir:

- Descripción del problema y contexto.
- Alcance funcional definido y alcanzado.
- La arquitectura base definida.
- Mínimo 3 patrones de diseño integrados de forma coherente.
- Propuesta de pruebas.
- Riesgos y supuestos.

---

## 3. Arquitecturas Base Sugeridas

Cada equipo es libre de elegir, pero debe justificar su decisión de acuerdo con el tipo de proyecto. Las siguientes combinaciones son recomendadas por coherencia técnica:

| Tipo de Proyecto | Arquitectura Base Sugerida |
|------------------|---------------------------|
| Sistema académico tradicional | Monolito modular + capas o hexagonal |
| Plataforma de e-learning moderna | Hexagonal o monolito modular evolutivo |
| Analítica o IA | Pipelines + capas o hexagonal |
| E-commerce o marketplace | Microservicios o monolito modular + event-driven |

---

## 4. Patrones Mínimos Requeridos

Cada proyecto debe integrar al menos 3 patrones, elegidos de forma consecuente con el problema. Se recomienda que sean de distinto nivel, si aplica al caso. Sugerencias:

| Proyecto | Patrones Recomendados |
|----------|-----------------------|
| Sistema académico | Strategy, Observer, Adapter, Facade, Repository |
| E-learning | Observer, Strategy, Factory Method, Decorator, Command |
| Analítica o IA | Pipeline / Pipe-and-filter, Strategy, Adapter, Iterator |
| E-commerce | Strategy, Observer, Facade, Adapter, Singleton o Factory |

---

## Criterios de Evaluación

Una solución bien estructurada debe responder fácilmente a preguntas como:

- ¿Qué problema resuelve?
- ¿Qué riesgo evita?
- ¿Qué costo añade?
- ¿Cómo se probará?
- ¿Cómo crecerá luego?
- ¿Qué mejora incluye frente a otras existentes?