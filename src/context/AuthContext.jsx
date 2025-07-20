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
          console.error('❌ [getProfiles] 프로필 조회 실패:', error.message);
          setUser(null);
          return;
        } else if (!profiles) {
          console.warn('⚠️ [getProfiles] 프로필 데이터 없음 (로그인 전 상태)');
          setUser(null);
          return;
        } else {
          const userData = { ...profiles, id, email, created_at };
          // console.log('✅ [getProfiles] 프로필 로드 완료:', userData);
          setUser(userData);
        }
      } catch (err) {
        console.error('🔥 [getProfiles] 예외 발생:', err.message);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    getProfiles(user);
    // console.log(user);

    // session : 로그인/로그아웃 세션 가져오기
    const getSession = async () => {
      try {
        const {
          data: { session },
          error
        } = await supabase.auth.getSession();

        if (error || !session) {
          console.error('❌ [getSession] 세션 조회 실패:', error.message);
          setUser(null);
          return;
        }

        if (!session) {
          console.log('ℹ️ [getSession] 현재 세션 없음 (로그아웃 상태)', session);
          setUser(null);
          return;
        } else if (session.user) {
          await getProfiles(session.user);
        }
        setLoading(false);
      } catch (err) {
        console.warn('🔥 [getSession] 예외 발생:', err.message);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    getSession();

    // onAuthStateChange : 로그인/로그아웃 시 session을 기반으로 사용자 정보 업데이트
    const { data: authListener } = supabase.auth.onAuthStateChange((_error, session) => {
      if (session?.user) {
        console.info('🔄 [AuthChange] 로그인 감지됨 → 프로필 갱신');
        getProfiles(session.user);
      } else {
        console.info('🔒 [AuthChange] 로그아웃 감지됨 → 유저 초기화');
        setUser(null);
        setLoading(false);
      }
    });

    return () => {
      // 컴포넌트 unmount 시 구독 해제
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  const signUp = async (info) => {
    const { data, error } = await supabase.auth.signUp(info);

    if (error) {
      // return {객체} : 확장성 + 명시성 + 유지보수
      console.error('❌ [signUp] 회원가입 실패:', error.message);
      return { error };
    }
    return { data };
  };

  const signIn = async (info) => {
    const { data, error } = await supabase.auth.signInWithPassword(info);

    if (error) {
      console.error('❌ [signIn] 로그인 실패:', error.message);
      return { error };
    }
    return { data };
  };

  const signOut = async () => {
    const { _data, error } = await supabase.auth.signOut();

    if (error) {
      console.error('❌ [signOut] 로그아웃 실패:', error.message);
    } else {
      console.log('✅ [signOut] 로그아웃 완료');
      setUser(null);
    }
  };
  return (
    <AuthContext.Provider value={{ user, setUser, signUp, signIn, signOut }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
