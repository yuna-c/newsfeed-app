import { useContext, useEffect, useRef, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function WritePost() {
  const { user } = useContext(AuthContext);
  const fileInputRef = useRef(null);

  const [images, setImages] = useState([]); // 업로드된 이미지 URL 배열
  const [previewUrl, setPreviewUrl] = useState([]); // 미리보기
  const [thumbnailIndex, setThumbnailIndex] = useState(0);
  const [uploading, setUploading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    console.log(`유저 정보🙋`, user);
  }, []);

  const onSubmit = () => {};
  const onChange = () => {};
  const onChangeImage = () => {};

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    projectStartDate: '',
    projectEndDate: '',
    hashtag: ''
  });
  return (
    <section className="flex items-center justify-center min-h-[calc(100vh-10rem)]">
      <article className="w-full space-y-6 xl:w-1/3">
        <h2 className="text-3xl font-extrabold">글쓰기</h2>

        <form onSubmit={onSubmit}>
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
              value={formData.content}
              onChange={onChange}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </fieldset>
          <fieldset>
            <label htmlFor="" className="mb-1 text-sm font-medium text-gray-700">
              기간
            </label>
            <div className="flex">
              <input
                type="date"
                value={formData.projectStartDate}
                onChange={onChange}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <span className="p-2">~</span>
              <input
                type="date"
                value={formData.projectEndDate}
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
              ref={fileInputRef}
              multiple
              onChange={onChange}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </fieldset>

          <button
            type="submit"
            className="inline-flex justify-center w-1/2 px-4 py-2 font-semibold text-white rounded-md text-sm/6 bg-gray-950 hover:bg-gray-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-950/"
          >
            업로드중 /포스트 작성하기
          </button>
        </form>
      </article>
    </section>
  );
}

export default WritePost;
