import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vhzxgxbhmjzjrxgxqglu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZoenhneGJobWp6anJ4Z3hxZ2x1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE1MTM3MjEsImV4cCI6MjA4NzA4OTcyMX0.5oNp5qdBVtoa1ZKxnXNbrpqmnYYREFg2GHzjSmUg3WM';
const supabase = createClient(supabaseUrl, supabaseKey);

async function testEmail(email) {
    const { data, error } = await supabase.auth.signUp({
        email,
        password: 'password123',
        options: { data: { full_name: 'Test' } }
    });
    console.log(`Email ${email} -> Error: ${error ? error.message : 'SUCCESS'}`);
}

async function runTests() {
    await testEmail('test_user_jetski@gmail.com');
    await testEmail('test.user.jetski@gmail.com');
    await testEmail(`test${Date.now()}@gmail.com`);
    await testEmail(`test_user${Date.now()}@gmail.com`);
    await testEmail('roosevelt@gmail.com');
}

runTests();
