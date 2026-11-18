import { supabase } from '../lib/supabase';

export const storageService = {
  async uploadFile(
    fileUri: string,
    folder: 'photos' | 'certificates',
    fileName: string
  ): Promise<string> {
    if (
      !fileUri ||
      fileUri === 'undefined' ||
      fileUri === 'null'
    ) {
      throw new Error('File URI is missing.');
    }

    const response = await fetch(fileUri);

    if (!response.ok) {
      throw new Error(
        `Unable to read selected file. Status: ${response.status}`
      );
    }

    const blob = await response.blob();

    if (blob.size === 0) {
      throw new Error('Selected file is empty.');
    }

    const sanitizedFileName = `${Date.now()}_${fileName.replace(
      /[^a-zA-Z0-9._-]/g,
      '_'
    )}`;

    const filePath = `${folder}/${sanitizedFileName}`;

    // Profile photos use doctor-profiles bucket.
    // Certificates and ID proofs use doctor-certificates bucket.
    const bucket =
      folder === 'photos'
        ? 'doctor-profiles'
        : 'doctor-certificates';

    console.log('Uploading to bucket:', bucket);
    console.log('File path:', filePath);
    console.log('File size:', blob.size);

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, blob, {
        contentType:
          blob.type || 'application/octet-stream',
        upsert: true,
      });

    if (error) {
      console.error('SUPABASE STORAGE ERROR:', error);
      throw error;
    }

    console.log('Upload successful:', data.path);

    // Get URL for the uploaded file.
    // This works as a directly accessible URL only
    // when the bucket is public.
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);

    return urlData.publicUrl;
  },
};

export const uploadDoctorProfilePhoto = async (
  mobile: string,
  fileUri: string
): Promise<string> => {
  return storageService.uploadFile(
    fileUri,
    'photos',
    `doctor_${mobile}_profile.jpg`
  );
};

export const uploadDoctorCertificate = async (
  mobile: string,
  documentType: string,
  fileUri: string
): Promise<string> => {
  return storageService.uploadFile(
    fileUri,
    'certificates',
    `doctor_${mobile}_${documentType}`
  );
};
