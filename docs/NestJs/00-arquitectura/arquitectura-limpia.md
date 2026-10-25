# Arquitectura limpia del Core

El Core se organiza por módulos de negocio y aplica inversión de dependencias
en el límite de persistencia. GraphQL es un adaptador de entrada y Prisma es
un adaptador de infraestructura; ninguno de los dos define las reglas del
dominio.

## Capas

| Capa | Responsabilidad | Puede depender de |
| --- | --- | --- |
| `domain` | Entidades, valores y reglas invariantes del negocio | Solo tipos propios |
| `application` | Casos de uso, puertos y contratos | `domain` y contratos de entrada |
| `infrastructure` | Prisma, integraciones externas y configuración | `application` y librerías externas |
| `interfaces` | Resolvers, DTOs y modelos GraphQL | `application` |

La transición se realiza de forma incremental. El primer corte introduce el
puerto `DATABASE_PORT` en `src/core/application/ports/database.port.ts`. Los
servicios de aplicación reciben ese puerto mediante inyección de dependencias;
`PrismaModule` registra `PrismaService` como su implementación concreta.

## Reglas de dependencia

1. Un resolver no consulta Prisma ni contiene reglas de negocio.
2. Un caso de uso no importa `PrismaService`; depende de un puerto.
3. Los DTOs de GraphQL no se usan como entidades de dominio.
4. Las implementaciones concretas se registran en módulos de infraestructura.
5. La validación de tenant se mantiene en los casos de uso y nunca se omite
   al cambiar de adaptador.
6. Los cambios de nombres en GraphQL requieren compatibilidad explícita para
   preservar a los clientes existentes.

## Migración de un módulo

Para extraer completamente un módulo:

1. Identificar sus entidades y reglas invariantes en `domain`.
2. Extraer cada operación pública a un caso de uso en `application`.
3. Definir interfaces de repositorio y servicios externos en `application`.
4. Implementar esas interfaces en `infrastructure`.
5. Mantener el resolver como adaptador fino y cubrir el caso de uso con
   pruebas unitarias sin Nest ni Prisma.

El puerto de base de datos actual es un paso de compatibilidad: permite
desacoplar la composición de Nest y preparar la extracción de repositorios
específicos sin cambiar la API GraphQL ni los tests existentes.
