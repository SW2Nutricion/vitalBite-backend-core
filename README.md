# VitalBite Backend Core

API central del sistema VitalBite para nutricionistas (SaaS multi-tenant).

## Stack

- Node.js
- NestJS
- GraphQL (Apollo)

## Módulos de dominio

| Módulo | Responsabilidad |
|--------|-----------------|
| `tenants` | Aislamiento multi-tenant por nutricionista |
| `patients` | Gestión de pacientes |
| `appointments` | Citas y agendamiento |
| `body-measurements` | Medidas corporales |
| `diets` | Consumo diario y dietas personalizadas |
| `body-composition` | Monitoreo de composición corporal |
| `reports` | Reportes propios del dominio |

La generación de PDFs, la orquestación de IA y el acceso al microservicio de
pagos no pertenecen a este servicio. El único punto de entrada para esas
integraciones es `vitalBite-api-gateway`, que consulta el Core cuando necesita
datos del dominio y reenvía la solicitud al microservicio correspondiente.

## Requisitos

- Node.js 20+
- pnpm 10+

## Configuración

```bash
cp .env.example .env
```

## Desarrollo

```bash
pnpm install
pnpm run start:dev
```

GraphQL Playground: `http://localhost:3000/graphql`

Query de prueba:

```graphql
query {
  health
}
```

Usuario demo Super Admin:

- Email: `super.admin@vitalbite.com`
- Password: `demo1234`
- Ruta inicial: `/super-admin/tenants`

Usuario demo plan individual:

- Email: `andrea.morales@vitalbite.com`
- Password: `demo1234`
- Tenant: `Consulta Individual Andrea`
- Plan: `Nutricionista individual` (`$15/mes`)
- Regla: el plan individual permite solo 1 usuario activo total; no tiene administrador separado en la demo.

## Scripts

| Comando | Descripción |
|---------|-------------|
| `pnpm run start:dev` | Servidor en modo watch |
| `pnpm run build` | Compilar para producción |
| `pnpm run start:prod` | Ejecutar build compilado |
| `pnpm run test` | Tests unitarios |
| `pnpm run test:e2e` | Tests end-to-end |
| `pnpm run lint` | Linter |

## Documentación

Ver carpeta `docs/` para requerimientos y arquitectura del proyecto.

La guía de capas y el plan de migración incremental están en
[`docs/NestJs/00-arquitectura/arquitectura-limpia.md`](docs/NestJs/00-arquitectura/arquitectura-limpia.md).
