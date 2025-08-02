"use client";

import { supabase } from "@/services/supabase";
import { Session } from "@supabase/supabase-js";
import React, { createContext, useContext, useEffect, useState } from "react";

interface AuthContextValue {
  session: Session | null;
}

const AuthContext = createContext<AuthContextValue>({ session: null });

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    const currSession = supabase.auth.getSession().then(({ data }) => {
      if (data.session) setSession(data.session);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_evt, sess) => {
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
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ session }}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
