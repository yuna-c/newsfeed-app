import { useContext, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { EMAIL_REGEX, NAME_REGEX, NICKNAME_REGEX } from '../../components/constants/regex';

function SignUp() {
  const navigate = useNavigate();
  const { signUp } = useContext(AuthContext);

  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    username: '',
    nickname: '',
    password: '',
    confirmPassword: '',
    avatarUrl: null
  });

  const validateForm = () => {
    const newErrors = {};

    if (!NAME_REGEX.test(formData.username)) {
      newErrors.username = '이름은 2~20자의 한글 또는 영문자여야 합니다.';
    }

    if (!NICKNAME_REGEX.test(formData.nickname)) {
      newErrors.nickname = '닉네임은 2~15자의 한글, 영문자, 숫자, _만 허용됩니다.';
    }

    if (!EMAIL_REGEX.test(formData.email)) {
      newErrors.email = '유효한 이메일을 입력하세요.';
    }

    if (formData.password.length < 6) {
      newErrors.password = '비밀번호는 최소 6자 이상이어야 합니다.';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = '비밀번호가 일치하지 않습니다.';
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitted(true);

    if (validateForm()) {
      try {
        const { _data, error } = await signUp({
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
          return;
        }

        toast.success('가입을 축하합니다.');
        // 회원가입 성공 후 navigate()로 전달된 추가 state 데이터 { fromSignUp: true } 전달
        navigate('/signin', { state: { fromSignUp: true } });
      } catch (error) {
        console.error('회원가입 오류:', error.message);
      }
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
              className={`w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                isSubmitted && errors.username ? 'border-red-500' : 'border-gray-300'
              }`}
              autoFocus
            />
            {isSubmitted && errors.username && <p className="mt-1 text-sm text-red-500">{errors.username}</p>}
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
              className={`w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                isSubmitted && errors.nickname ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {isSubmitted && errors.nickname && <p className="mt-1 text-sm text-red-500">{errors.nickname}</p>}
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
              className={`w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                isSubmitted && errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {isSubmitted && errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
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
              className={`w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                isSubmitted && errors.password ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {isSubmitted && errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
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
              회원가입 하기
            </button>

            <Link
              to="/signin"
              className="inline-flex justify-center w-1/2 px-4 py-2 font-semibold text-white rounded-md text-sm/6 bg-gray-950 hover:bg-gray-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-950/"
            >
              로그인 하기
            </Link>
          </div>
        </form>
      </article>
    </section>
  );
}

export default SignUp;
