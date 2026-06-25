require('dotenv').config({ path: '.env.local' });
const { Client } = require('pg');

async function main() {
  const url = process.env.DATABASE_URL.replace('@0302@', '%400302@');
  const client = new Client({ connectionString: url });
  
  await client.connect();
  console.log('Connected to DB');
  
  await client.query('ALTER TABLE public.categories ADD COLUMN IF NOT EXISTS image_url TEXT;');
  console.log('Added image_url column');
  
  await client.end();
}

main().catch(console.error);
