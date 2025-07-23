import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { supabase } from '../../supabase/Client';
import { useNavigate } from 'react-router-dom';

function WritePost() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [upLoading, setUpLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    hashtag: '',
    projectStartDate: '',
    projectEndDate: '',
    images: []
  });

  useEffect(() => {}, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    setUpLoading(true);

    try {
      const updates = {
        title: formData.title,
        nick_name: user.nick_name,
        description: formData.description,
        content: formData.content,
        hash_tag: formData.hashtag.split(' '),
        project_start_date: formData.projectStartDate,
        project_end_date: formData.projectEndDate,
        images: formData.images
      };

      const { data, error } = await supabase.from('posts').insert(updates).select();

      if (error) throw error;
      console.log(data);
      // navigate('/');
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
    // 1. 파일 목록 : Array.from(유사배열) **유사 배열(iterable)**을 **진짜 배열(Array)**로 바꿔주는 메서드 이렇게 해야 .map(), .forEach() 등 배열 메서드 사용 가능
    const files = Array.from(e.target.files);
    const uploadedUrls = [];

    try {
      // for in은 인덱스를 순환하기 떄문에 for...of 나 forEach를 써야함
      for (const file of files) {
        const ext = file.name.split('.').pop(); // 2. 확장자 추출
        const filename = `${user.id}-${crypto.randomUUID()}.${ext}`; // 3. 업로드 경로
        const filepath = `post/${filename}`; // 4. 업로드 경로

        // 5. Supabase 업로드
        const { _data, error: uploadError } = await supabase.storage.from('images').upload(filepath, file);

        if (uploadError) {
          console.error('이미지 업로드 실패', uploadError.message);
          return;
        }

        // 6. 공개 URL 가져오기
        const { data: publicUrlData, error: publicUrlError } = await supabase.storage
          .from('images')
          .getPublicUrl(filepath);

        if (publicUrlError) {
          console.error('URl 가져오기 실패', publicUrlError.message);
          return;
        }

        // 7. 배열에 저장
        uploadedUrls.push(publicUrlData);
      }

      // 8. 상태 반영 : 불변성 유지 하면서 images 필드만 업데이트
      setFormData((prev) => ({ ...prev, images: uploadedUrls }));
    } catch (err) {
      console.error('예상치 못한 에러 발생', err.message);
    }
  };

  return (
    <section className="flex items-center justify-center min-h-[calc(100vh-10rem)]">
      <article className="w-full space-y-6 xl:w-1/3">
        <h2 className="text-3xl font-extrabold">글쓰기</h2>

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
                value={formData.projectStartDate}
                name="projectStartDate"
                onChange={onChange}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <span className="p-2">~</span>
              <input
                type="date"
                id="projectEndDate"
                value={formData.projectEndDate}
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
