# Troubleshooting

## Error de conexión a base de datos

Verificar:

- `DATABASE_URL`.
- Acceso de red.
- Credenciales.
- Estado de PostgreSQL/Supabase.

## Error de autenticación

Verificar:

- `JWT_SECRET`.
- Expiración del token.
- Header `Authorization`.
- Formato `Bearer <token>`.

## Error de CORS

Verificar:

- `CORS_ORIGIN`.
- Dominio del frontend Angular.
- Configuración del ambiente.

## Error comunicando el API Gateway

Verificar:

- URL y disponibilidad del API Gateway.
- Logs del API Gateway y del Core.

## Error GraphQL

Verificar:

- Schema.
- Resolver.
- Guards.
- Permisos.
- Datos enviados en input.
