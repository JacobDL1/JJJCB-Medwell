import { supabase } from './supabaseClient.js';

export async function logout() {
    await supabase.auth.signOut();
    window.location.replace('../index.html'); 
}

export async function checkUserRole(requiredRole) {
    // Verify with the server
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
        window.location.replace('../index.html');
        return null;
    }

    // Check the database role
    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('user_id', user.id)
        .single();

    if (profileError || !profile || profile.role !== requiredRole) {
        window.location.replace('../index.html');
        return null;
    }

    return user; 
}