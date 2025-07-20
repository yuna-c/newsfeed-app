import { Link } from 'react-router-dom';
import { supabase } from '../supabase/Client';
import { AuthContext } from './../context/AuthContext';
import { useContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Modal from '../components/common/Modal';

function MyPage() {
  const { user } = useContext(AuthContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    id: '',
    email: '',
    nick_name: '',
    user_name: '',
    website_url: '',
    avatar_url: '',
    updated_at: ''
  });

  const [passwords, setPasswords] = useState({
    password: '',
    confirmPassword: ''
  });

  useEffect(() => {
    fetchUserData();
  }, [user]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const onChangePassword = (e) => {
    const { name, value } = e.target;
    setPasswords((prev) => ({ ...prev, [name]: value }));
  };

  // 마이페이지 유저 정보 가져오기
  const fetchUserData = async () => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, email, website_url, avatar_url, nick_name, updated_at, user_name')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      setFormData(data);
    } catch (err) {
      console.error(`데이터 가져오는 중 에러 발생: ${err.message}`);
    }
  };

  // 수정 정보 반영
  const onSubmit = async (e) => {
    e.preventDefault();

    if (passwords.password !== passwords.confirmPassword) {
      toast.error('비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      // upsert : 있으면 수정, 없으면 삽입
      const { _data, error: profileError } = await supabase.from('profiles').upsert({
        // email,
        id: user.id,
        nick_name: formData.nick_name,
        website_url: formData.website_url,
        updated_at: new Date().toISOString()
      });

      if (profileError) {
        alert('프로필 업데이트 실패');
        return;
      }

      // updateUser : 비밀번호 업데이트
      if (passwords.password) {
        const { _data, error: passwordError } = await supabase.auth.updateUser({
          password: passwords.password
        });

        if (passwordError) throw passwordError;
      }
      await fetchUserData();
      setIsModalOpen(false);
      toast.success('수정이 완료되었습니다.');
    } catch (err) {
      console.error('수정 중 오류 발생:', err.message);
      toast.error(`비밀번호 수정 중 오류가 발생하였습니다. 
        ${err.message}`);
    }
  };

  return (
    <>
      <section className="flex items-center justify-center min-h-[calc(100vh-10rem)]">
        <article className="w-full space-y-6 md:w-1/3 ">
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
                onClick={() => setIsModalOpen(true)}
                className="inline-flex justify-center w-1/2 px-4 py-2 font-semibold text-white rounded-md text-sm/6 bg-gray-950 hover:bg-gray-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-950"
              >
                수정하기
              </button>
            </li>
          </ul>
        </article>
      </section>

      {/* 모달 */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <article className="space-y-6">
          <h2 className="py-6 text-3xl font-extrabold">프로필 수정</h2>

          <form onSubmit={onSubmit} className="w-full pb-10 space-y-4 border-b">
            <fieldset className="flex flex-col pb-2">
              <label htmlFor="nick_name" className="mb-1 text-sm font-medium text-gray-700">
                닉네임
              </label>
              <input
                type="text"
                // 처음엔 제어되지 않던(uncontrolled) <input>을 나중에 제어되는(controlled) 상태로 바꾸기 때문에, value가 처음엔 undefined였다가 나중에 문자열로 바뀔 때 에러를 발생
                value={formData.nick_name}
                id="nick_name"
                name="nick_name"
                onChange={onChange}
                className={`w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              />
            </fieldset>
            <fieldset className="flex flex-col pb-2">
              <label htmlFor="website_url" className="mb-1 text-sm font-medium text-gray-700">
                포트폴리오
              </label>
              <input
                type="text"
                id="website_url"
                name="website_url"
                value={formData.website_url}
                onChange={onChange}
                className={`w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              />
            </fieldset>
            <fieldset className="flex flex-col pb-2">
              <label htmlFor="password" className="mb-1 text-sm font-medium text-gray-700">
                비밀번호
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={passwords.password}
                onChange={onChangePassword}
                className={`w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              />
            </fieldset>
            <fieldset className="flex flex-col pb-2">
              <label htmlFor="confirmPassword" className="mb-1 text-sm font-medium text-gray-700">
                비밀번호 확인
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={passwords.confirmPassword}
                onChange={onChangePassword}
                className={`w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              />
            </fieldset>

            <div className="flex w-full gap-2">
              <button
                type="submit"
                className="inline-flex justify-center w-1/2 px-4 py-2 font-semibold text-white rounded-md text-sm/6 bg-gray-950 hover:bg-gray-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-950"
              >
                확인
              </button>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="inline-flex justify-center w-1/2 px-4 py-2 font-semibold text-white rounded-md text-sm/6 bg-gray-950 hover:bg-gray-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-950"
              >
                닫기
              </button>
            </div>
          </form>
        </article>
      </Modal>
    </>
  );
}

export default MyPage;
