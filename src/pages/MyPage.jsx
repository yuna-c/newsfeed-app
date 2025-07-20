import { Link } from 'react-router-dom';
import { supabase } from '../supabase/Client';
import { AuthContext } from './../context/AuthContext';
import { useContext, useEffect, useState } from 'react';

function MyPage() {
  const { user } = useContext(AuthContext);
  const [passwords, setPasswords] = useState({
    password: '',
    confirmPassword: ''
  });
  const [formData, setFormData] = useState({
    id: '',
    email: '',
    nickName: '',
    userName: '',
    websiteUrl: '',
    avatarUrl: '',
    updatedAt: ''
  });

  const fetchUserData = async () => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, email, website_url, avatar_url, nick_name, user_name, updated_at')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      setFormData(data);
    } catch (err) {
      console.error(`데이터 가져오는 중 에러 발생: ${err.message}`);
    }
  };

  console.log(formData);

  useEffect(() => {
    fetchUserData();
  }, [user]);

  return (
    <section className="flex items-start justify-center min-h-[calc(100vh-10rem)]">
      <article className="space-y-6 xl:w-1/3">
        <h2 className="pt-16 pb-8 text-3xl font-extrabold">마이페이지</h2>

        <ul className="w-full pb-10 space-y-4 border-b">
          <li className="flex justify-center pb-4">
            {formData.avatar_url ? (
              <div className="relative w-56 h-56 overflow-hidden rounded-full">
                <img
                  src={formData.avatar_url}
                  alt={formData.nick_name}
                  className="relative object-cover w-full h-full"
                />

                <input
                  type="file"
                  accept="images/*"
                  className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
            ) : (
              <div className="relative w-56 h-56 overflow-hidden rounded-full">
                <img
                  src="https://placehold.co/100x100"
                  alt="프로필 기본 이미지"
                  className="relative object-cover w-full h-full"
                />
                <input
                  type="file"
                  accept="images/*"
                  className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
            )}
          </li>
          <li>
            <p className="flex flex-col text-sm font-semibold text-gray-600">
              <span className="mb-1 font-medium">이름</span>
              <span className="text-lg text-gray-700"> {formData.user_name}</span>
            </p>
          </li>
          <li>
            <p className="flex flex-col text-sm font-semibold text-gray-600">
              <span className="mb-1 font-medium">닉네임</span>
              <span className="text-lg text-gray-700"> {formData.nick_name}</span>
            </p>
          </li>
          <li>
            <p className="flex flex-col text-sm font-semibold text-gray-600">
              <span className="mb-1 font-medium">이메일</span>
              <span className="text-lg text-gray-700"> {formData.email}</span>
            </p>
          </li>
          <li>
            <p className="flex flex-col text-sm font-semibold text-gray-600">
              <span className="mb-1 font-medium">포트폴리오</span>
              <Link to={formData.website_url} className="text-lg text-gray-700">
                {formData.website_url}
              </Link>
            </p>
          </li>
          <li className="flex justify-center pt-2">
            <button
              type="button"
              className="inline-flex justify-center w-1/2 px-4 py-2 font-semibold text-white rounded-md text-sm/6 bg-gray-950 hover:bg-gray-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-950"
            >
              수정하기
            </button>
          </li>
        </ul>
      </article>
    </section>
  );
}

export default MyPage;
