"use client";

import { supabase } from "@/services/supabase";
import { Session } from "@supabase/supabase-js";
import React, { createContext, useContext, useEffect, useState } from "react";

interface AuthContextValue {
  session: Session | null;
}

const AuthContext = createContext<AuthContextValue>({ session: null });

interface AuthProviderProps {
  children?: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    // 初始化會話
    const initializeSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          console.error("獲取會話錯誤:", error);
        } else if (data.session) {
          console.log("初始化會話:", data.session.user.email);
          setSession(data.session);
        }
      } catch (err) {
        console.error("初始化會話失敗:", err);
      }
    };

    initializeSession();

    // 監聽認證狀態變化
    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, sess) => {
        console.log("認證狀態變化:", event, sess?.user?.email);
        setSession(sess);

        if (sess?.access_token) {
          // 透過 monkey patch 為 fetch 自動加上 Bearer token
          window.fetch = (
            (origFetch) =>
            (url: RequestInfo | URL, opts: RequestInit = {}) => {
              opts.headers = {
                ...(opts.headers || {}),
                Authorization: `Bearer ${sess.access_token}`,
              } as HeadersInit;
              return origFetch(url, opts);
            }
          )(window.fetch);
        }
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ session }}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
