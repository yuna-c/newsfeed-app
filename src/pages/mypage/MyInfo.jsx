import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useContext, useEffect, useState } from 'react';
import Modal from '../../components/common/Modal';
import { getImageURL } from './../../utils/getUrls';
import { supabase } from '../../supabase/Client';
import { AuthContext } from '../../context/AuthContext';

function MyInfo() {
  const { user, signOut } = useContext(AuthContext);
  const [errors, setErrors] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [upLoading, setUpLoading] = useState(false);

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

  // 유효성 검사
  const validateForm = () => {
    const newErrors = {};

    // 비밀번호를 입력한 경우만 검사
    if (passwords.password || passwords.confirmPassword) {
      if (passwords.password.length < 6) {
        newErrors.password = '비밀번호는 최소 6자 이상이어야 합니다.';
      }

      if (passwords.password !== passwords.confirmPassword) {
        newErrors.confirmPassword = '비밀번호가 일치하지 않습니다.';
      }
    }

    setErrors(newErrors);
    // 객체의 key 값들을 배열로 반환(newErrors 객체에 아무 키도 없으면 = 에러가 없다)
    return Object.keys(newErrors).length === 0;
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
    } catch (error) {
      console.error(`데이터 가져오는 중 에러 발생: ${error.message}`);
    }
  };

  // 수정 정보 반영
  const onSubmit = async (e) => {
    e.preventDefault();
    // 에러 메시지를 화면에 표시하기 위한 플래그
    setIsSubmitted(true);

    // 유효성 검사 통과 시에만 요청 진행
    if (validateForm()) {
      try {
        // Supabase upsert: 기존 유저 정보가 있으면 업데이트, 없으면 삽입
        const { _data, error: profileError } = await supabase.from('profiles').upsert({
          id: user.id,
          nick_name: formData.nick_name,
          website_url: formData.website_url,
          updated_at: new Date().toISOString()
        });

        if (profileError) {
          alert('프로필 업데이트 실패');
          return;
        }

        // 비밀번호가 입력된 경우에만 비밀번호 업데이트 요청
        if (passwords.password) {
          const { _data, error: passwordError } = await supabase.auth.updateUser({
            password: passwords.password
          });

          if (passwordError) {
            // ❗️비밀번호 변경 중 오류 발생 시, 해당 메시지를 errors.password에 저장해 사용자에게 표시
            setErrors((prev) => ({
              ...prev,
              password: '비밀번호 변경 실패: ' + passwordError.message
            }));
            return;
          }
        }

        // 변경된 정보 다시 불러오기
        await fetchUserData();

        setIsModalOpen(false);
        toast.dismiss();
        toast.success('수정이 완료되었습니다.');
      } catch (error) {
        console.error('수정 중 오류 발생:', error.message);
        toast.error(`비밀번호 수정 중 오류가 발생하였습니다. 
        ${error.message}`);
      }
    }
  };

  // 프로필 이미지 업데이트
  const onImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // 이미지 파일인지 MIME 타입으로 확인
    if (!file.type.startsWith('image/', 0)) {
      toast.error('이미지 파일만 업로드 가능합니다');
      return;
    }

    setUpLoading(true);

    try {
      // 업로드 후 public URL 받아오기
      // const avatarUrl = await getImageURL(file, 'avatars', user.id);
      const avatarUrl = await getImageURL(file, 'avatars', user.id, formData.avatar_url, user.id);

      if (avatarUrl) {
        // UI에 즉시 반영
        setFormData((prev) => ({ ...prev, avatar_url: avatarUrl }));

        // DB의 profiles 테이블에도 업데이트
        const { _data, error } = await supabase
          .from('profiles')
          .update({
            avatar_url: avatarUrl
          })
          .eq('id', user.id);

        if (error) throw error;
        toast.success('프로필 이미지가 변경 되었습니다.');

        setUpLoading(false);
      }
    } catch (error) {
      console.error(`이미지 업로드 오류: ${error.message}`);
      toast.error('이미지 업로드 중 오류가 발생하였습니다.');
    }
  };

  // 회원탈퇴
  const onResign = async () => {
    if (!user) return;
    const configDelete = window.confirm('회원 탈퇴 하시겠습니까? 이 작업은 되돌릴 수 없습니다.');
    if (!configDelete) return;

    try {
      const { _data, error: profileError } = await supabase.from('profiles').delete().eq('id', user.id);

      if (profileError) {
        console.error(profileError);
        return;
      }

      await signOut();
      toast.success('탈퇴가 완료되었습니다.');
      navigate('/');
    } catch (err) {
      console.error('회원 탈퇴 실패', err);
      toast.error('알 수 없는 오류로 인한 회원 탈퇴 실패');
    }
  };

  return (
    <>
      <div className="mt-20">
        <ul className="space-y-4">
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
                  onChange={onImageChange}
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
                  onChange={onImageChange}
                  className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
            )}
          </li>
          <li>
            <p className="flex flex-col text-sm font-semibold text-gray-500">
              <span className="mb-1 font-medium">이름</span>
              <span className="text-gray-700 text-[1.01rem]">{formData.user_name}</span>
            </p>
          </li>
          <li>
            <p className="flex flex-col text-sm font-semibold text-gray-500">
              <span className="mb-1 font-medium">닉네임</span>
              <span className="text-gray-700 text-[1.01rem]">{formData.nick_name}</span>
            </p>
          </li>
          <li>
            <p className="flex flex-col text-sm font-semibold text-gray-500">
              <span className="mb-1 font-medium">이메일</span>
              <span className="text-gray-700 text-[1.01rem]">{formData.email}</span>
            </p>
          </li>
          <li>
            <p className="flex flex-col text-sm font-semibold text-gray-500">
              <span className="mb-1 font-medium">포트폴리오</span>
              <Link to={formData.website_url} className="text-gray-700 text-[1.01rem]">
                {formData.website_url}
              </Link>
            </p>
          </li>
        </ul>

        <div className="flex w-full gap-2 pt-10">
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="inline-flex justify-center w-1/2 px-4 py-2 font-semibold text-white rounded-md text-sm/6 bg-gray-950 hover:bg-gray-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-950"
          >
            수정하기
          </button>

          <button
            onClick={onResign}
            className="inline-flex justify-center w-1/2 px-4 py-2 font-semibold text-white rounded-md text-sm/6 bg-gray-950 hover:bg-gray-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-950"
          >
            회원탈퇴
          </button>
        </div>
      </div>

      {/* 모달 */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} className="w-full">
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
                className={`w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  isSubmitted && errors.password ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {isSubmitted && errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
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
                className={`w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  isSubmitted && errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {isSubmitted && errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>
              )}
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

export default MyInfo;
