import { supabase } from '../supabase/Client';

/**
 * Supabase Storage에 이미지를 업로드하고 public URL을 반환
 * @param {File} file - 업로드할 이미지 파일 (input[type="file"]의 파일 객체)
 * @param {string} bucket - 저장할 버킷 이름 (기본값: 'images')
 * @param {string} folder - 저장할 폴더 경로 (기본값: 'public')
 * @returns {string|null} 업로드된 이미지의 public URL 또는 null
 */

export const getImageURL = async (file, bucket = 'images', folder = 'public') => {
  let imageUrl = null;
  if (!file) return null;

  try {
    const ext = file.name.split('.').pop();
    const filename = `${Date.now()}-${crypto.randomUUID()}.${ext}`;
    const filepath = `${folder}/${filename}`;

    const { error: uploadError } = await supabase.storage.from(bucket).upload(filepath, file);
    if (uploadError) {
      console.error(`[이미지 업로드 실패], ${uploadError.message}`);
      return null;
    }

    const { data, error: urlError } = supabase.storage.from(bucket).getPublicUrl(filepath);
    if (urlError) {
      console.error(`[이미지 URL 가져오기 실패], ${urlError.message}`);
      return null;
    }

    imageUrl = data.publicUrl;
  } catch (e) {
    console.error('[이미지 업로드 오류]', e.message);
    return null;
  }

  return imageUrl;
};
