import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import MyInfo from './mypage/MyInfo';
import MyPost from './mypage/MyPost';
import MyStatus from './mypage/MyStatus';

const tabs = ['내 정보', '내 포스트', '좋아요'];

function MyPage() {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState(0);

  return (
    <>
      <section className="min-h-[calc(100vh-10rem)] flex justify-center">
        <article className="md:w-[90%] w-full">
          <h2 className="pt-10 pb-20 text-3xl font-extrabold">마이페이지</h2>

          <div className="flex w-auto border-b md:w-80">
            {tabs.map((tab, index) => {
              return (
                <button
                  key={index}
                  onClick={() => setActiveTab(index)}
                  className={`flex-1 p-2 text-center ${
                    activeTab === index ? 'border-b-2 border-gray-500 font-semibold' : 'text-gray-500'
                  }`}
                >
                  {tab}
                </button>
              );
            })}
          </div>

          <div className="flex flex-col items-center justify-center w-full p-4">
            {activeTab === 0 && <MyInfo />}
            {activeTab === 1 && <MyPost />}
            {activeTab === 2 && <MyStatus />}
          </div>
        </article>
      </section>
    </>
  );
}

export default MyPage;
