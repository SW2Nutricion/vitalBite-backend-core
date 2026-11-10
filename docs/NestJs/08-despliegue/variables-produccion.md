# Variables de producción

Las variables de producción deben configurarse en el proveedor cloud, no en archivos versionados.

## Variables críticas

- `NODE_ENV=production`
- `PORT`
- `DATABASE_URL`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`
- `CORS_ORIGIN`

## Reglas

- Usar secretos seguros.
- Separar ambientes.
- Rotar credenciales si se exponen.
- Validar la conectividad del API Gateway antes del despliegue.
