import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vhzxgxbhmjzjrxgxqglu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZoenhneGJobWp6anJ4Z3hxZ2x1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE1MTM3MjEsImV4cCI6MjA4NzA4OTcyMX0.5oNp5qdBVtoa1ZKxnXNbrpqmnYYREFg2GHzjSmUg3WM';
const supabase = createClient(supabaseUrl, supabaseKey);

async function testSignIn() {
    const email = 'test.user.1771615101282@gmail.com';
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: 'password123',
    });
    console.log(`Email ${email} -> Error: ${error ? error.message : 'SUCCESS'}`);
}

testSignIn();
