import { useContext, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from './../../context/AuthContext';
import { supabase } from '../../supabase/Client';

function DetailPost() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [post, setPost] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, error } = await supabase.from('posts').select(post.id).eq('id', id).single();

        if (error) throw error;
        setPost(data);
      } catch (error) {
        console.error(`데이터 로드 실패`, error.message);
      }
    };

    fetchData();
  }, [id]);

  const onDelete = async () => {};
  const onEdit = async () => {};
  return (
    <section className="flex items-center justify-center min-h-[calc(100vh-10rem)]">
      <article className="w-full space-y-6 xl:w-1/3">
        <ul className="flex flex-col flex-wrap w-full space-y-4">
          <li className="text-3xl font-extrabold">{post.title}</li>
          <li>
            <p className="flex flex-col space-y-1 text-sm font-semibold text-gray-500">
              <span>작성자</span>
              <span className="text-gray-700 text-[1.01rem]">{post.nick_name}</span>
            </p>
          </li>
          <li>
            <p className="flex flex-col space-y-1 text-sm font-semibold text-gray-500">
              <span>작성일</span>
              <span className="text-gray-700 text-[1.01rem]">
                {new Date(post.created_at).toLocaleDateString('ko-KR')}
              </span>
            </p>
          </li>

          <li className="flex flex-row w-full overflow-x-scroll border border-red-700">
            {post?.images?.map((image, index) => (
              <img key={index} src={image} alt={image + index} />
            ))}
          </li>
          <li className="flex justify-end text-sm font-semibold text-gray-700 ">
            {post.project_end_date} ~ {post.project_start_date}
          </li>
          <li>{post.content}</li>

          <li className="w-full px-3 py-2 pl-0 overflow-x-auto whitespace-nowrap">
            {post?.hash_tag
              ?.filter((tag) => tag.trim() !== '')
              .map((tag, idx) => (
                <span className="px-2 py-1 mb-1 mr-2 text-xs border rounded-full bg-zinc-200 " key={`${tag}-${idx}`}>
                  #{tag}
                </span>
              ))}
          </li>
        </ul>
        <div>댓글</div>
        <div className="flex w-full gap-2">
          <Link
            to={`/editpost/${id}`}
            className="inline-flex justify-center w-1/2 px-4 py-2 font-semibold text-white rounded-md text-sm/6 bg-gray-950 hover:bg-gray-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-950"
          >
            <button>수정</button>
          </Link>
          <button className="inline-flex justify-center w-1/2 px-4 py-2 font-semibold text-white rounded-md text-sm/6 bg-gray-950 hover:bg-gray-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-950">
            삭제
          </button>
        </div>
      </article>
    </section>
  );
}

export default DetailPost;
