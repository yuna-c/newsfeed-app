import { createContext, useEffect, useState } from 'react';
import { supabase } from './../supabase/Client';

/**
 * Supabase Auth + Profile 정보를 Context로 관리
 * - 로그인/회원가입/로그아웃 지원
 * - 로그인 시 profiles 테이블에서 닉네임, 아바타 등 유저 정보 불러오기
 */

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const dummyUser = {
      id: '67bcfbf9-c083-40c9-9685-2475075ddd16',
      email: 'cat@naver.com',
      created_at: '2025-07-18T09:00:00.000Z'
    };

    // profiles : Supabase user 객체 (이메일, 프로필, 닉네임) 가져오기
    const getProfiles = async (user) => {
      if (!user) return;

      try {
        const { id, email, created_at } = user;

        const { data: profiles, error } = await supabase
          .from('profiles')
          .select('email, avatar_url, user_name, nick_name')
          .eq('id', id)
          .maybeSingle();

        if (error) {
          console.error('🧠 프로필 쿼리 에러:', error.message);
          setUser(null);
          return;
        }

        if (!profiles) {
          console.log('로그인 전 입니다');
          setUser(null);
        }

        const userData = { ...profiles, id, email, created_at };
        console.log('🧠 프로필 성공 :', userData);
        setUser(userData);
      } catch (err) {
        console.error('🚨 예외 발생:', err.message);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    getProfiles(dummyUser);
    console.log(user);

    // session : 로그인/로그아웃 세션 가져오기
    const getSession = async () => {
      try {
        const {
          data: { session },
          error
        } = await supabase.auth.getSession();

        if (error) {
          console.error('🧠 프로필 세션 에러:', error.message);
          setUser(null);
          return;
        }

        if (!session) {
          console.log('🧠 로그아웃(세션 없음)', session);
          setUser(null);
          return;
        }

        if (session.user) await getProfiles(session.user);
      } catch (err) {
        console.error('🚨 예외 발생 (getSession):', err.message);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    getSession();

    // onAuthStateChange : 로그인/로그아웃 시 session을 기반으로 사용자 정보 업데이트
    const { data: authListener } = supabase.auth.onAuthStateChange((_error, session) => {
      if (session?.user) {
        getProfiles(session.user);
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => {
      // 컴포넌트 unmount 시 구독 해제
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  return <AuthContext.Provider value={{ user, setUser }}>{!loading && children}</AuthContext.Provider>;
};
