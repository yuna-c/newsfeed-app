import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { supabase } from '../../supabase/Client';
import { useNavigate } from 'react-router-dom';

function WritePost() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [upLoading, setUpLoading] = useState(false);
  const [previewUrls, setPreviewUrls] = useState([]); // 대표 이미지 설정
  const [thumbnailIndex, setThumbnailIndex] = useState(0); // 썸네일 인덱스 설정
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    hashtag: '',
    // 데이터가 들어가지 않을 때를 대비해 nullish 처리로 에러 접근 방지
    projectStartDate: null,
    projectEndDate: null,
    thumbnail: 0,
    images: []
  });

  useEffect(() => {}, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    setUpLoading(true);
    // 하나만 들어가면 null 400에러로 동작을 막기 때문에 미리 유효성 처리
    if (!formData.projectStartDate || !formData.projectEndDate) {
      alert('프로젝트 시작일과 종료일을 모두 입력해주세요.');
      return;
    }

    try {
      const updates = {
        title: formData.title,
        nick_name: user.nick_name,
        description: formData.description,
        content: formData.content,
        hash_tag: formData.hashtag.split(' '),
        project_start_date: formData.projectStartDate || null,
        project_end_date: formData.projectEndDate || null,
        images: formData.images,
        thumb_nail: formData.images[thumbnailIndex]
      };
      console.log(updates);
      const { data, error } = await supabase.from('posts').insert(updates).select();

      if (error) throw error;
      console.log(data);
      navigate('/');
    } catch (error) {
      console.error('포스트 작성 실패', error.message);
    }
  };

  /*
  1. 파일 목록 가져오기
  2. 각각의 파일을:
    └ 이름 만들기 → 업로드 → URL 가져오기 → 배열에 저장
  3. 상태 업데이트: setImages
  */

  const onChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const onChangeImages = async (e) => {
    const files = Array.from(e.target.files);
    const uploadedUrls = [];
    if (files.length === 0) return;
    setUpLoading(true);

    // files 배열에 있는 각 파일을 브라우저에서 보여주는 임시 이미지 URL로 바꿔주는 코드

    try {
      const previews = files.map((file) => URL.createObjectURL(file));

      for (const file of files) {
        const ext = file.name.split('.').pop();
        const filename = `${user.id}-${crypto.randomUUID()}.${ext}`;
        const filepath = `post/${filename}`;

        const { _data, error: uploadError } = await supabase.storage.from('images').upload(filepath, file);

        if (uploadError) {
          console.error('이미지 업로드 실패', uploadError.message);
          return;
        }

        const { data: publicUrlData, error: publicUrlError } = await supabase.storage
          .from('images')
          .getPublicUrl(filepath);

        if (publicUrlError) {
          console.error('URl 가져오기 실패', publicUrlError.message);
          return;
        }
        // publicUrlData : 객체 이고 브라우저에서 보여주거나 저장 하고 싶은건 publicUrl(문자열 이기 때문에) 객체 자체가 배열에 들어감
        // 이러면 <img src={url}>에 여러 객체가 들어가기 때문에 publicUrl (공개링크) 하나만  data 에 넣어야 함
        uploadedUrls.push(publicUrlData.publicUrl);
      }
      setPreviewUrls(previews);
      setFormData((prev) => ({ ...prev, images: uploadedUrls }));
      setThumbnailIndex(0);
      setUpLoading(false);
    } catch (err) {
      console.error('예상치 못한 에러 발생', err.message);
    }
  };

  return (
    <section className="flex items-center justify-center min-h-[calc(100vh-10rem)]">
      <article className="w-full space-y-6 xl:w-1/3">
        <h2 className="text-3xl font-extrabold">글쓰기</h2>

        <div>
          {previewUrls.map((url, index) => (
            <div key={index} className="inline-block m-2">
              <div
                className={`border-2 rounded-md overflow-hidden ${
                  index === thumbnailIndex ? ` border-black` : `border-transparent`
                }`}
              >
                <img
                  src={url}
                  onClick={() => setThumbnailIndex(index)}
                  className={`w-[100px] h-[100px] object-cover cursor-pointer`}
                />
              </div>
              <div className="mt-1 text-center">
                <button
                  type="button"
                  className="inline-flex justify-center w-1/2 px-2 py-1 text-xs font-semibold text-white rounded-full bg-gray-950 hover:bg-gray-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-950/"
                >
                  삭제
                </button>
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <fieldset>
            <label htmlFor="title" className="mb-1 text-sm font-medium text-gray-700">
              제목
            </label>
            <input
              type="text"
              id="title"
              value={formData.title}
              name="title"
              onChange={onChange}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              autoFocus
            />
          </fieldset>

          <fieldset>
            <label htmlFor="description" className="mb-1 text-sm font-medium text-gray-700">
              설명
            </label>
            <input
              type="text"
              id="description"
              value={formData.description}
              name="description"
              onChange={onChange}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </fieldset>
          <fieldset>
            <label htmlFor="hashtag" className="mb-1 text-sm font-medium text-gray-700">
              해시태그
            </label>
            <input
              type="text"
              id="hashtag"
              value={formData.hashtag}
              name="hashtag"
              onChange={onChange}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </fieldset>
          <fieldset>
            <label htmlFor="content" className="mb-1 text-sm font-medium text-gray-700">
              본문
            </label>
            <textarea
              rows="10"
              id="content"
              value={formData.content}
              name="content"
              onChange={onChange}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </fieldset>
          <fieldset>
            <label htmlFor="date" className="mb-1 text-sm font-medium text-gray-700">
              기간
            </label>
            <div className="flex">
              <input
                type="date"
                id="projectStartDate"
                value={formData.projectStartDate || ''}
                name="projectStartDate"
                onChange={onChange}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <span className="p-2">~</span>
              <input
                type="date"
                id="projectEndDate"
                value={formData.projectEndDate || ''}
                name="projectEndDate"
                onChange={onChange}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </fieldset>
          <fieldset>
            <label htmlFor="file" className="mb-1 text-sm font-medium text-gray-700">
              파일선택
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={onChangeImages}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </fieldset>

          <div className="flex w-full gap-2">
            <button
              type="submit"
              className="inline-flex justify-center w-full px-4 py-2 font-semibold text-white rounded-md text-sm/6 bg-gray-950 hover:bg-gray-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-950/"
            >
              {upLoading ? '업로드중' : '포스트 작성하기'}
            </button>
          </div>
        </form>
      </article>
    </section>
  );
}

export default WritePost;
