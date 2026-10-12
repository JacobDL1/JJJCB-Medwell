import { supabase } from './supabaseClient.js'

const { error } = await supabase.from('connection_test').select('*')
console.log(error)
