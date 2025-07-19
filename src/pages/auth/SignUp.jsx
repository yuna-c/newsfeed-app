import { useContext, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

function SignUp() {
  const navigate = useNavigate();
  const { signUp } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    email: '',
    username: '',
    nickname: '',
    password: '',
    confirmPassword: '',
    avatarUrl: null
  });

  const onChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data, error } = await signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            user_name: formData.username,
            nick_name: formData.nickname,
            avatar_url: formData.avatarUrl
          }
        }
      });

      if (error) {
        setErrors({ email: '회원가입 오류: ' + error.message });
        console.error('🚨 회원가입 오류:', error);
        console.log(error);
        return;
      }

      alert('회원가입 완료!');
      console.log('회원가입 성공', data);
      navigate('/signin');
    } catch (err) {
      console.error('🚨 회원가입 오류:', err.message);
    }
  };

  return (
    <section className="flex items-center justify-center min-h-[calc(100vh-10rem)]">
      <article className="w-full space-y-6 xl:w-1/3">
        <h2 className="text-3xl font-extrabold">회원가입</h2>

        <form onSubmit={onSubmit} className="space-y-4">
          <fieldset className="flex flex-col">
            <label htmlFor="username" className="mb-1 text-sm font-medium text-gray-700">
              이름
            </label>

            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              placeholder="이름"
              onChange={onChange}
              className={`w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
            />
          </fieldset>

          <fieldset className="flex flex-col">
            <label htmlFor="nickname" className="mb-1 text-sm font-medium text-gray-700">
              닉네임
            </label>
            <input
              type="text"
              id="nickname"
              name="nickname"
              value={formData.nickname}
              placeholder="닉네임"
              onChange={onChange}
              className={`w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent `}
            />
          </fieldset>

          <fieldset className="flex flex-col">
            <label htmlFor="email" className="mb-1 text-sm font-medium text-gray-700">
              이메일
            </label>

            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              placeholder="이메일"
              onChange={onChange}
              className={`w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent `}
              autoFocus
            />
          </fieldset>

          <fieldset className="flex flex-col">
            <label htmlFor="password" className="mb-1 text-sm font-medium text-gray-700">
              비밀번호
            </label>

            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              placeholder="비밀번호"
              onChange={onChange}
              className={`w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent `}
            />
          </fieldset>

          <fieldset className="flex flex-col">
            <label htmlFor="confirmPassword" className="mb-1 text-sm font-medium text-gray-700">
              비밀번호 확인
            </label>

            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              placeholder="비밀번호 확인"
              onChange={onChange}
              className={`w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent `}
            />
          </fieldset>

          <div className="flex w-full gap-2">
            <button
              type="submit"
              className="inline-flex justify-center w-1/2 px-4 py-2 font-semibold text-white rounded-md text-sm/6 bg-gray-950 hover:bg-gray-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-950"
            >
              Sign up
            </button>

            <Link
              to="/signin"
              className="inline-flex justify-center w-1/2 px-4 py-2 font-semibold text-white rounded-md text-sm/6 bg-gray-950 hover:bg-gray-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-950/"
            >
              Sign in
            </Link>
          </div>
        </form>
      </article>
    </section>
  );
}

export default SignUp;
