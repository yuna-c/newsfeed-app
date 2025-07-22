import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import MyInfo from './mypage/MyInfo';
import MyPost from './mypage/MyPost';
import MyStatus from './mypage/MyStatus';
import { useTabs } from '../hooks/useTabs';

const tabs = ['내 정보', '내 포스트', '좋아요'];

function MyPage() {
  const { user } = useContext(AuthContext);
  const { index, changeTab } = useTabs();

  return (
    <>
      <section className="flex items-center justify-center min-h-[calc(100vh-10rem)]">
        <article className="w-full space-y-6 xl:w-1/3">
          <h2 className="text-3xl font-extrabold">마이페이지</h2>

          <div className="flex w-auto border-b md:w-80">
            {tabs.map((tab, i) => {
              return (
                <button
                  key={i}
                  onClick={() => changeTab(i)}
                  className={`flex-1 p-2 text-center ${
                    index === i ? 'border-b-2 border-gray-500 font-semibold' : 'text-gray-500'
                  }`}
                >
                  {tab}
                </button>
              );
            })}
          </div>

          <div className="tab">
            {index === 0 && <MyInfo />}
            {index === 1 && <MyPost />}
            {index === 2 && <MyStatus />}
          </div>
        </article>
      </section>
    </>
  );
}

export default MyPage;
