const { Client } = require('pg');


async function fixRLS() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL
  });

  try {
    await client.connect();
    
    console.log('Fixing RLS for profiles table...');
    
    await client.query(`
      CREATE OR REPLACE FUNCTION public.is_admin()
      RETURNS BOOLEAN AS $$
        SELECT EXISTS (
          SELECT 1 FROM public.profiles
          WHERE id = auth.uid() AND role = 'admin'
        );
      $$ LANGUAGE sql SECURITY DEFINER SET search_path = public;
    `);
    
    await client.query(`
      DROP POLICY IF EXISTS "Admin can view all profiles" ON public.profiles;
    `);
    
    await client.query(`
      CREATE POLICY "Admin can view all profiles"
        ON public.profiles FOR SELECT
        USING (public.is_admin());
    `);

    console.log('✅ RLS fixed successfully.');
  } catch (err) {
    console.error('Error fixing RLS:', err);
  } finally {
    await client.end();
  }
}

fixRLS();
