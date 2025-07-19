import { Link } from 'react-router-dom';

function SignIn() {
  const onChange = (e) => {};
  const onSubmit = async (e) => {};
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
              placeholder="이메일"
              onChange={onChange}
              className={`w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
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
              placeholder="비밀번호"
              onChange={onChange}
              className={`w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
            />
          </fieldset>

          <div className="checkbox">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                className="w-4 h-4 text-blue-600 border-gray-300 rounded cursor-pointer checked:border-transparent focus:outline-none accent-gray-950"
              />
              <span className="text-sm text-gray-700">Remember me</span>
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
