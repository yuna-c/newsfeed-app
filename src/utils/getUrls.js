import { supabase } from '../supabase/Client';

/**
 * Supabase Storage에 이미지를 업로드하고 public URL을 반환합니다.
 *
 * 기존 이미지가 존재하고 해당 이미지가 본인(userId) 소유일 경우, 먼저 삭제합니다.
 *
 * 파일명은 `${userId}-${timestamp}-${uuid}.${ext}` 형식으로 생성되며,
 * 경로는 `bucket/folder/파일명` 구조로 저장됩니다.
 *
 * @param {File} file - 업로드할 이미지 파일 (input[type="file"]에서 가져온 파일 객체)
 * @param {string} [bucket='avatars'] - 저장할 Supabase 스토리지 버킷 이름
 * @param {string} [folder='public'] - 저장할 폴더 경로 (예: userId로 지정 가능)
 * @param {string|null} [oldUrl=null] - 이전 이미지의 public URL (있으면 삭제 시도)
 * @param {string|null} [userId=null] - 현재 유저 ID (파일명 생성 및 삭제 검증용)
 * @returns {Promise<string|null>} 업로드된 이미지의 public URL (실패 시 null)
 */

export const getImageURL = async (file, bucket = 'images', folder = 'public', oldUrl = null, userId = null) => {
  if (!file) return null;

  try {
    // 기존 이미지 삭제 (본인 것일 때만)
    if (oldUrl && userId) {
      const segments = oldUrl.split('/');
      const fileName = segments[segments.length - 1];

      if (fileName.startsWith(userId)) {
        const pathToDelete = `${folder}/${fileName}`;
        await supabase.storage.from(bucket).remove([pathToDelete]);
      } else {
        console.warn('본인 이미지가 아니므로 삭제하지 않음');
      }
    }

    // 새 이미지 업로드
    const ext = file.name.split('.').pop();
    const filename = `${userId}-${Date.now()}-${crypto.randomUUID()}.${ext}`;
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

    return data.publicUrl;
  } catch (error) {
    console.error('[이미지 업로드 오류]', error.message);
    return null;
  }
};

/**
 * Supabase Storage에 여러 이미지를 업로드하고 각 이미지의 public URL 배열을 반환
 *
 * @param {FileList | File[]} files - 업로드할 이미지 파일 리스트 (input[type="file"]에서 가져온 값)
 * @param {string} [bucket='images'] - 저장할 Supabase 버킷 이름 (기본값: 'images')
 * @param {string} [folder='public'] - 저장할 버킷 내 폴더 경로 (기본값: 'public')
 * @returns {Promise<string[]>} 업로드된 이미지의 public URL 배열 (업로드 실패한 항목은 제외됨)
 *
 * @example
 * const urls = await getMultipleImageURL(e.target.files, 'images', 'posts');
 * console.log(urls); // ["https://.../posts/abc.png", "https://.../posts/xyz.jpg"]
 */

export const getMultipleImageURL = async (files, bucket = 'images', folder = 'public', userId = '') => {
  if (!files || files.length === 0) return [];
  const uploadFolder = userId ? `${folder}/${userId}` : folder;

  try {
    const upload = Array.from(files).map(async (file) => {
      const ext = file.name.split('.').pop();
      const filename = `${Date.now()}-${crypto.randomUUID()}.${ext}`;
      const filepath = `${uploadFolder}/${filename}`;

      const { error: uploadError } = await supabase.storage.from(bucket).upload(filepath, file);

      if (uploadError) {
        console.error(`[이미지 업로드 실패], ${uploadError.message}`);
        return null;
      }

      const { data, error: urlError } = supabase.storage.from(bucket).getPublicUrl(filepath);

      if (urlError) {
        console.error(`[이미지 URL 가져오기 실패], ${file.name} - ${urlError.message}`);
        return null;
      }

      return data.publicUrl;
    });

    const uploadedUrls = await Promise.all(upload);
    return uploadedUrls.filter(Boolean); // 실패한 파일은 제거
  } catch (error) {
    console.error('[여러 이미지 업로드 중 오류 발생]', error.message);
    return [];
  }
};

/**
 * Supabase Storage에 이미지를 업로드하고 public URL을 반환
 * @param {File} file - 업로드할 이미지 파일 (input[type="file"]의 파일 객체)
 * @param {string} bucket - 저장할 버킷 이름 (기본값: 'images')
 * @param {string} folder - 저장할 폴더 경로 (기본값: 'public')
 * @returns {string|null} 업로드된 이미지의 public URL 또는 null


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
 */
