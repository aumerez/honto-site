// Creates the submissions table. Usage: DATABASE_URL=... npm run db:migrate
import { readFile } from 'node:fs/promises';
import postgres from 'postgres';

const url = process.env.DATABASE_URL;
if (!url) {
  console.error('DATABASE_URL is not set.');
  process.exit(1);
}
const sql = postgres(url, { ssl: process.env.DATABASE_SSL === 'false' ? false : 'require', max: 1 });
const schema = await readFile(new URL('../db/schema.sql', import.meta.url), 'utf8');
await sql.unsafe(schema);
await sql.end();
console.log('Database ready.');
