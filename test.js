const { createClient } = require('@supabase/supabase-js');


const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function runTest() {
  console.log('Testing Authentication & CRUD Flows...\n');

  // 1. Admin Login
  console.log('1. Logging in as admin...');
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: 'admin@auramasale.com',
    password: 'admin123'
  });

  if (authError) {
    console.error('❌ Admin Login Failed:', authError.message);
    return;
  }
  console.log('✅ Admin Login Successful (User ID:', authData.user.id, ')');

  // Verify Role
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', authData.user.id)
    .single();
  
  if (profileError) {
    console.error('❌ Profile Error:', profileError);
  }

  if (profile?.role === 'admin') {
    console.log('✅ Admin role verified in profiles table');
  } else {
    console.error('❌ User does not have admin role');
    return;
  }

  // 2. Create Category
  console.log('\n2. Creating a new category...');
  const { data: category, error: catError } = await supabase
    .from('categories')
    .insert({
      name: 'Test Spices ' + Date.now(),
      slug: 'test-spices-' + Date.now(),
      description: 'Test category description',
      is_active: true
    })
    .select()
    .single();

  if (catError) {
    console.error('❌ Category Creation Failed:', catError.message);
    return;
  }
  console.log('✅ Category created:', category.name);

  // 3. Create Product
  console.log('\n3. Creating a new product...');
  const { data: product, error: prodError } = await supabase
    .from('products')
    .insert({
      name: 'Test Turmeric ' + Date.now(),
      slug: 'test-turmeric-' + Date.now(),
      category_id: category.id,
      short_description: 'Pure turmeric',
      description: 'Long description for pure turmeric',
      is_active: true
    })
    .select()
    .single();

  if (prodError) {
    console.error('❌ Product Creation Failed:', prodError.message);
    return;
  }
  console.log('✅ Product created:', product.name);

  // 4. Create Product FAQ
  console.log('\n4. Adding FAQs to the product...');
  const { error: faqError } = await supabase
    .from('product_faqs')
    .insert([
      {
        product_id: product.id,
        question: 'Is this organic?',
        answer: 'Yes, 100% organic.',
        display_order: 0
      }
    ]);

  if (faqError) {
    console.error('❌ FAQ Creation Failed:', faqError.message);
    return;
  }
  console.log('✅ FAQ added to product');

  // 5. Cleanup
  console.log('\n5. Cleaning up test data...');
  await supabase.from('products').delete().eq('id', product.id);
  await supabase.from('categories').delete().eq('id', category.id);
  console.log('✅ Test data cleaned up successfully');

  console.log('\n🎉 ALL TESTS PASSED!');
}

runTest();
