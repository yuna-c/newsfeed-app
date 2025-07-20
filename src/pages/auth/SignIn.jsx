import { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { supabase } from '../../supabase/Client';

function SignIn() {
  const navigate = useNavigate();
  const { signIn } = useContext(AuthContext);

  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [savedEmail, setSavedEmail] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const onChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = '이메일을 입력하세요.';
    }

    if (!formData.password) {
      newErrors.password = '비밀번호를 입력하세요.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitted(true);

    // 이메일 로컬스토리지 기억하기
    if (savedEmail) {
      localStorage.setItem('savedEmail', formData.email);
    } else {
      localStorage.removeItem('savedEmail');
    }

    if (validateForm()) {
      try {
        const { data, error } = await signIn({
          email: formData.email,
          password: formData.password
        });

        if (error) {
          setErrors({ email: '이메일 또는 비밀번호가 잘못되었습니다.' });
          console.error('로그인 오류:', error);
          return;
        }

        // 회원 탈퇴
        const signedInUser = data.user;

        if (signedInUser) {
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('id')
            .eq('id', signedInUser.id)
            .maybeSingle();

          if (!profileData || profileError) {
            await supabase.auth.signOut();
            toast.error('회원 가입 후 사용해 주세요.');
            return;
          }
        }

        // toast 알람 처리
        toast.success('로그인되었습니다.');
        navigate('/');
      } catch (error) {
        console.error('로그인 오류:', error);
      }
    }
  };

  // 이메일 로컬스토리지 기억하기
  const onSaved = () => {
    setSavedEmail(!savedEmail);
  };

  // 이메일 로컬스토리지 기억하기 : 컴포넌트 마운트 후 저장된 값을 읽어오게 하려고
  useEffect(() => {
    const saved = localStorage.getItem('savedEmail');

    if (saved) {
      setFormData((prev) => ({ ...prev, email: saved }));
      setSavedEmail(true);
    }
  }, []);

  return (
    <section className="flex items-center justify-center min-h-[calc(100vh-10rem)]">
      <article className="w-full space-y-6 xl:w-1/3">
        <h2 className="text-3xl font-extrabold">로그인</h2>

        <form onSubmit={onSubmit} className="space-y-4">
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
              autoFocus
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

          <div className="checkbox">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={savedEmail}
                onChange={onSaved}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded cursor-pointer checked:border-transparent focus:outline-none accent-gray-950"
              />
              <span className="text-sm text-gray-700">아이디 기억하기</span>
            </label>
          </div>

          <div className="flex w-full gap-2">
            <button
              type="submit"
              className="inline-flex justify-center w-1/2 px-4 py-2 font-semibold text-white rounded-md text-sm/6 bg-gray-950 hover:bg-gray-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-950"
            >
              로그인 하기
            </button>

            <Link
              to="/signup"
              className="inline-flex justify-center w-1/2 px-4 py-2 font-semibold text-white rounded-md text-sm/6 bg-gray-950 hover:bg-gray-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-950/"
            >
              회원가입 하기
            </Link>
          </div>
        </form>
      </article>
    </section>
  );
}

export default SignIn;
