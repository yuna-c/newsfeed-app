import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { supabase } from '../../supabase/Client';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getMultipleImageURL } from '../../utils/getUrls';

function WritePost() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [errors, setErrors] = useState({});
  const [upLoading, setUpLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [previewUrls, setPreviewUrls] = useState([]); // 대표 이미지 설정
  const [thumbnailIndex, setThumbnailIndex] = useState(0); // 썸네일 인덱스 설정

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    hashtag: '',
    updated_at: '',
    // 데이터가 들어가지 않을 때를 대비해 nullish 처리로 에러 접근 방지
    projectStartDate: null,
    projectEndDate: null,
    thumbnail: 0,
    images: []
  });

  const validateForm = () => {
    const newError = {};

    if (!formData.title) {
      newError.title = '제목을 입력해 주세요.';
    }

    if (!formData.description) {
      newError.description = '설명을 입력해 주세요.';
    }

    if (!formData.content) {
      newError.content = '본문을 입력해 주세요.';
    }

    if (!formData.projectStartDate || !formData.projectEndDate) {
      newError.projectStartDate = '프로젝트 시작일을 입력해주세요.';
      newError.projectEndDate = '프로젝트 종료일을 입력해주세요.';
    }

    setErrors(newError);
    return Object.keys(newError).length === 0;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitted(true);

    if (validateForm()) {
      try {
        const updates = {
          user_id: user.id,
          title: formData.title,
          nick_name: user.nick_name,
          description: formData.description,
          content: formData.content,
          hash_tag: formData.hashtag.split(' '),
          project_start_date: formData.projectStartDate || null,
          project_end_date: formData.projectEndDate || null,
          images: formData.images,
          thumb_nail: formData.images[thumbnailIndex],
          updated_at: new Date().toISOString()
        };
        console.log(updates);
        const { _data, error } = await supabase.from('posts').insert(updates).select();

        if (error) throw error;
        toast.success('글 작성이 완료되었습니다.');
        setTimeout(() => {
          navigate('/');
        }, 1000); // toast 실행 된 후 navigate 처리
      } catch (error) {
        console.error('포스트 작성 실패', error.message);
      }
    }
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const onChangeImages = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    setUpLoading(true);

    try {
      const previews = files.map((file) => URL.createObjectURL(file));
      // hook으로 이미지 업로드, URL 가져오는 로직 분리
      // for...of를 map으로 변경
      const urls = await getMultipleImageURL(files, 'images', 'posts', user.id);
      setPreviewUrls(previews);
      setFormData((prev) => ({ ...prev, images: urls }));
      setThumbnailIndex(0);
      setUpLoading(false);
    } catch (err) {
      console.error('예상치 못한 에러 발생', err.message);
    } finally {
      setUpLoading(false);
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
              className={`w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
              ${isSubmitted && errors.title ? 'border-red-500' : 'border-gray-300'}`}
              autoFocus
            />
            {isSubmitted && errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
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
              className={`w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
              ${isSubmitted && errors.description ? 'border-red-500' : 'border-gray-300'}`}
            />
            {isSubmitted && errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
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
              className={`w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
              ${isSubmitted && errors.hashtag ? 'border-red-500' : 'border-gray-300'}`}
            />
            {isSubmitted && errors.hashtag && <p className="mt-1 text-sm text-red-500">{errors.hashtag}</p>}
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
              className={`w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
              ${isSubmitted && errors.content ? 'border-red-500' : 'border-gray-300'}`}
            />
            {isSubmitted && errors.content && <p className="mt-1 text-sm text-red-500">{errors.content}</p>}
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
                className={`w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
              ${isSubmitted && errors.projectStartDate ? 'border-red-500' : 'border-gray-300'}`}
              />
              <span className="p-2">~</span>
              <input
                type="date"
                id="projectEndDate"
                value={formData.projectEndDate || ''}
                name="projectEndDate"
                onChange={onChange}
                className={`w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
              ${isSubmitted && errors.projectEndDate ? 'border-red-500' : 'border-gray-300'}`}
              />
            </div>
            {isSubmitted && errors.projectStartDate && (
              <p className="mt-1 text-sm text-red-500">{errors.projectStartDate}</p>
            )}
          </fieldset>

          <fieldset>
            <label htmlFor="file" className="mb-1 text-sm font-medium text-gray-700">
              파일선택
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={onChangeImages}
              multiple
              className={`w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
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
