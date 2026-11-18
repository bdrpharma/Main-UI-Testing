import { useEffect, useState } from 'react';
import { supabase } from '@/src/lib/supabase';
export function useAuth(){ const [loading,setLoading]=useState(true); const [session,setSession]=useState<any>(null); useEffect(()=>{let mounted=true; if(!supabase){setLoading(false);return;} supabase.auth.getSession().then(({data})=>{if(mounted){setSession(data.session);setLoading(false)}}); const {data:{subscription}}=supabase.auth.onAuthStateChange((_e,s)=>setSession(s)); return ()=>{mounted=false;subscription.unsubscribe()};},[]); return {session,loading}; }
