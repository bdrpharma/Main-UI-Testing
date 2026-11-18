
import { supabase } from '../lib/supabase';
import { getZoneByPincode } from './userService';

export interface DoctorRegistrationPayload {
  name: string;
  email?: string;
  mobile: string;
  registration_number: string;
  specialization: string;
  hospital_name: string;
  address: string;
  pin_code: string;
  profile_photo_url?: string;
  qualification_certificate_url?: string;
  medical_council_certificate_url?: string;
  id_proof_url?: string;
}

// 1. Fetch Doctor by Mobile Number
export const getDoctorByMobile = async (mobile: string) => {
  const { data, error } = await supabase
    .from('doctors')
    .select('*')
    .eq('mobile', mobile.trim())
    .maybeSingle();

  if (error) throw error;
  return data;
};

// 2. Register or Update Doctor
export const registerDoctor = async (
  payload: DoctorRegistrationPayload
) => {
  const zoneId = await getZoneByPincode(payload.pin_code);
  const existing = await getDoctorByMobile(payload.mobile);

  if (existing) {
    const { data, error } = await supabase
      .from('doctors')
      .update({
        name: payload.name.trim(),
        email: payload.email?.trim() || existing.email,
        registration_number: payload.registration_number.trim(),
        specialization: payload.specialization.trim(),
        hospital_name: payload.hospital_name.trim(),
        address: payload.address.trim(),
        pin_code: payload.pin_code.trim(),
        zone_id: zoneId || existing.zone_id,
        profile_photo_url:
          payload.profile_photo_url || existing.profile_photo_url,
        qualification_certificate_url:
          payload.qualification_certificate_url ||
          existing.qualification_certificate_url,
        medical_council_certificate_url:
          payload.medical_council_certificate_url ||
          existing.medical_council_certificate_url,
        id_proof_url:
          payload.id_proof_url || existing.id_proof_url,
        status: 'pending',
      })
      .eq('id', existing.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  const { data, error } = await supabase
    .from('doctors')
    .insert([
      {
        name: payload.name.trim(),
        email: payload.email?.trim() || null,
        mobile: payload.mobile.trim(),
        registration_number: payload.registration_number.trim(),
        specialization: payload.specialization.trim(),
        hospital_name: payload.hospital_name.trim(),
        address: payload.address.trim(),
        pin_code: payload.pin_code.trim(),
        zone_id: zoneId,
        profile_photo_url: payload.profile_photo_url || null,
        qualification_certificate_url:
          payload.qualification_certificate_url || null,
        medical_council_certificate_url:
          payload.medical_council_certificate_url || null,
        id_proof_url: payload.id_proof_url || null,
        status: 'pending',
        remarks: null,
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
};

// 3. Check Approval Status
export const checkDoctorStatus = async (mobile: string) => {
  const { data, error } = await supabase
    .from('doctors')
    .select('id, name, status, remarks')
    .eq('mobile', mobile.trim())
    .maybeSingle();

  if (error) throw error;
  return data;
};
