import { useContext, useEffect, useState } from 'react';
import { supabase } from '../supabase/Client';
import { FaHeart } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';

function Home() {
  const { user } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, error } = await supabase.from('posts').select(
          `
          *,
          profiles(avatar_url)
          `
        );

        if (error) throw error; // 오류 발생 시 catch로 던짐
        setPosts(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchLikes = async () => {
      try {
        const { data, error } = await supabase.from('likes').select('post_id').eq('user_id', user.id);

        if (error) throw error;
        setLikedPosts(data.map((like) => like.post_id));
        console.log(data.map((like) => like.post_id));
      } catch (error) {
        console.error(error);
      }
    };

    fetchLikes();
  }, [user]);

  const onToggle = async (postId) => {
    if (!user) return;
    const alreadyLikes = likedPosts.includes(postId);

    try {
      // 좋아요 취소
      if (alreadyLikes) {
        const { _data, error } = await supabase.from('likes').delete().eq('post_id', postId).eq('user_id', user.id);

        if (error) throw error;
        setLikedPosts((prev) => prev.filter((id) => id !== postId));
      } else {
        // 좋아요
        const likePost = {
          user_id: user.id,
          post_id: postId // onToggle(postId)에서 받은 값 그대로 사용!
          // likedPosts는 배열이기 때문에 likedPosts.postId를 넣으면 undefined가 나온다
        };

        const { _data, error } = await supabase.from('likes').insert([likePost]);

        if (error) throw error;
        setLikedPosts((prev) => [...prev, postId]);
      }

      toast.dismiss();
      toast.success(alreadyLikes ? '좋아요 취소' : '좋아요');
    } catch (error) {
      console.error('좋아요 실패', error.message);
    }
  };

  return (
    <section className="flex items-center justify-center min-h-[calc(100vh-10rem)]">
      <article>
        <ul className="grid grid-cols-1 gap-8 pt-8 sm:grid-cols-2 lg:grid-cols-3 md:p-12 xl:grid-cols-4">
          {posts.map((post) => {
            return (
              <li
                key={post.id}
                className="relative space-y-3 overflow-hidden border rounded-sm shadow-sm cursor-pointer xl:w-72"
              >
                <FaHeart
                  className={`absolute w-5 h-5 top-2 right-2 z-10 
                    ${likedPosts.includes(post.id) ? 'text-red-700' : 'text-black'}
                `}
                  onClick={() => onToggle(post.id)}
                />

                <Link to={`detailpost/${post.id}`}>
                  {/* 썸네일 */}
                  <div className="relative">
                    <div className="object-cover h-[350px] overflow-hidden border-b">
                      <img
                        src={post.thumb_nail || 'https://placehold.co/286x500'}
                        alt={post.thumb_nail}
                        className="object-cover w-full h-full transition-transform duration-300 ease-in-out hover:scale-105"
                      />
                    </div>

                    {/* 업로드 날짜 */}
                    <p className="absolute text-xs text-white cursor-pointer bottom-2 left-3 z-1">{post.updated_at}</p>

                    {/* 이미지 */}
                    <div className="absolute flex flex-row items-center px-3 py-2 space-x-3 overflow-hidden rounded-full shadow-2xl cursor-pointer h-14 w-14 -bottom-7 right-3">
                      <div className="absolute top-0 left-0 ">
                        {post.profiles.avatar_url ? (
                          <span className="block">
                            <img src={post.profiles?.avatar_url} alt={post.avatar_url} className="w-full h-full" />
                          </span>
                        ) : (
                          <span className="block overflow-hidden rounded-full">
                            <img
                              src="https://placehold.co/100x100"
                              alt="프로필 기본 이미지"
                              className="w-full h-full"
                            />
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* 타이틀 */}
                  <div className="p-3 text-base font-semibold">
                    <p>{post.title}</p>
                  </div>

                  {/* 닉네임 */}
                  <p className="pb-3 pr-3 !-mt-3 text-xs font-semibold text-right text-gray-600">{post.nick_name}</p>

                  {/* 해시태그 */}
                  <div>
                    <div className="w-full overflow-x-auto whitespace-nowrap">
                      <div className="px-3 py-2">
                        <p className="flex flex-row w-full overflow-auto">
                          {post.hash_tag.map((tag, idx) => {
                            return (
                              <span
                                key={`${tag}-${idx}`}
                                className="block w-auto px-2 py-1 mb-1 mr-2 text-xs border rounded-full bg-zinc-200"
                              >
                                #{tag}
                              </span>
                            );
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </article>
    </section>
  );
}

export default Home;
