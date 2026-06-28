# PostgreSQL Database Setup

This project now includes a PostgreSQL schema file for the ecommerce database.

## Create the database
Run this command in your terminal:

```bash
psql -U postgres -h localhost -f database/postgres_schema.sql
```

If PostgreSQL prompts for a password, use the password for your local postgres account.

## Environment variables
Update your .env file with:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_postgres_password
DB_NAME=shophub_ecommerce
```
