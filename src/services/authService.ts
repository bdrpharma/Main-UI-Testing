import { supabase } from '@/src/lib/supabase';

/**
 * Send OTP
 */
export async function sendOtp(phone: string) {
  if (!supabase) {
    throw new Error('Supabase is not configured');
  }

  return await supabase.auth.signInWithOtp({
    phone,
  });
}

/**
 * Verify OTP
 */
export async function verifyOtp(
  phone: string,
  token: string
) {
  if (!supabase) {
    throw new Error('Supabase is not configured');
  }

  return await supabase.auth.verifyOtp({
    phone,
    token,
    type: 'sms',
  });
}

/**
 * Check if user already exists
 */
export async function checkUserExists(
  phone: string
): Promise<boolean> {
  if (!supabase) {
    return false;
  }

  const { data, error } = await supabase
    .from('users')
    .select('id')
    .eq('mobile', phone)
    .maybeSingle();

  if (error) {
    console.error('checkUserExists:', error);
    return false;
  }

  return !!data;
}

/**
 * Check if doctor exists
 */
export async function checkDoctorExists(
  phone: string
) {
  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from('doctors')
    .select('id,status')
    .eq('mobile', phone)
    .maybeSingle();

  if (error) {
    console.error('checkDoctorExists:', error);
    return null;
  }

  return data;
}

/**
 * Logout current user
 */
export async function logout() {
  if (!supabase) {
    return;
  }

  await supabase.auth.signOut();
}