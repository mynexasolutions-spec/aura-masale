const { Client } = require('pg');


async function runMigration() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await client.connect();

    const sql = `
      CREATE TABLE IF NOT EXISTS public.global_faqs (
        id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        question      TEXT NOT NULL,
        answer        TEXT NOT NULL,
        display_order INTEGER NOT NULL DEFAULT 0,
        created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
        updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
      );

      ALTER TABLE public.global_faqs ENABLE ROW LEVEL SECURITY;

      -- Use a DO block to avoid errors if policies exist
      DO $$
      BEGIN
          IF NOT EXISTS (
              SELECT 1 FROM pg_policies WHERE tablename = 'global_faqs' AND policyname = 'Anyone can view global FAQs'
          ) THEN
              CREATE POLICY "Anyone can view global FAQs" ON public.global_faqs FOR SELECT USING (true);
          END IF;

          IF NOT EXISTS (
              SELECT 1 FROM pg_policies WHERE tablename = 'global_faqs' AND policyname = 'Admin can manage global FAQs'
          ) THEN
              CREATE POLICY "Admin can manage global FAQs" ON public.global_faqs FOR ALL USING (
                EXISTS (
                  SELECT 1 FROM public.profiles
                  WHERE id = auth.uid() AND role = 'admin'
                )
              );
          END IF;
      END $$;

      -- Add trigger for updated_at
      DO $$
      BEGIN
          IF NOT EXISTS (
              SELECT 1 FROM pg_trigger WHERE tgname = 'set_updated_at_global_faqs'
          ) THEN
              CREATE TRIGGER set_updated_at_global_faqs BEFORE UPDATE ON public.global_faqs
              FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
          END IF;
      END $$;

      -- Add use_global_faqs to products table
      DO $$
      BEGIN
          IF NOT EXISTS (
              SELECT 1 FROM information_schema.columns 
              WHERE table_schema = 'public' 
              AND table_name = 'products' 
              AND column_name = 'use_global_faqs'
          ) THEN
              ALTER TABLE public.products ADD COLUMN use_global_faqs BOOLEAN NOT NULL DEFAULT true;
          END IF;
      END $$;
    `;

    await client.query(sql);
    console.log("Migration applied successfully.");

  } catch (err) {
    console.error("Migration failed:", err);
  } finally {
    await client.end();
  }
}

runMigration();
