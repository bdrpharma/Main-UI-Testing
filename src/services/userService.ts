import { supabase } from '../lib/supabase';

export interface CreateUserInput {
  name: string;
  mobile: string;
  email: string;
  address: string;
  pin_code: string;
  profile_photo_url?: string;
}

// 1. PIN code to zone_id auto lookup
export const getZoneByPincode = async (pincode: string): Promise<number | null> => {
  try {
    const { data, error } = await supabase
      .from('pin_codes')
      .select('zone_id')
      .eq('pin_code', pincode.trim())
      .maybeSingle();

    if (error) {
      console.warn('Zone auto-assignment failed:', error.message);
      return null;
    }

    return data?.zone_id ? Number(data.zone_id) : null;
  } catch {
    return null;
  }
};

// 2. Fetch User by mobile
export const getUserByMobile = async (mobile: string) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('mobile', mobile.trim())
    .maybeSingle();

  if (error) throw error;
  return data;
};

// 3. Create or update user matching users table columns
export const createUser = async (input: CreateUserInput) => {
  const zoneId = await getZoneByPincode(input.pin_code);

  const existing = await getUserByMobile(input.mobile);

  if (existing) {
    const { data, error } = await supabase
      .from('users')
      .update({
        name: input.name.trim(),
        email: input.email.trim(),
        address: input.address.trim(),
        pin_code: input.pin_code.trim(),
        zone_id: zoneId || existing.zone_id,
        profile_photo_url: input.profile_photo_url || existing.profile_photo_url,
        last_login: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', existing.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  const { data, error } = await supabase
    .from('users')
    .insert([
      {
        name: input.name.trim(),
        mobile: input.mobile.trim(),
        email: input.email.trim(),
        address: input.address.trim(),
        pin_code: input.pin_code.trim(),
        zone_id: zoneId,
        status: 'active',
        profile_photo_url: input.profile_photo_url || null,
        last_login: new Date().toISOString(),
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
};