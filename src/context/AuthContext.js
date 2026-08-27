import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import * as authApi from '../api/auth';
import { getMyInstitute } from '../api/institute';
import { saveSession, loadSession, clearSession } from '../api/tokenStorage';
import { setSessionExpiredHandler } from '../api/client';

const AuthContext = createContext(null);

async function withInstituteType(user) {
  if (!user || user.is_super_admin) return user;
  try {
    const { data: institute } = await getMyInstitute();
    return { ...user, institute_type: institute.institute_type };
  } catch (e) {
    return user;
  }
}

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [bootstrapping, setBootstrapping] = useState(true);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const refreshTokenRef = useRef(null);

  useEffect(() => {
    setSessionExpiredHandler(() => {
      setIsAuthenticated(false);
      setUser(null);
      refreshTokenRef.current = null;
    });

    (async () => {
      try {
        const session = await loadSession();
        if (session.accessToken && session.refreshToken && session.user) {
          refreshTokenRef.current = session.refreshToken;
          setUser(session.user);
          setIsAuthenticated(true);
        }
      } catch (e) {
        console.error('Auth bootstrap failed:', e);
      } finally {
        setBootstrapping(false);
      }
    })();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await authApi.login(email, password);
      // Save tokens first so the /institute/me lookup below has an access token
      // to read from storage — withInstituteType makes an authenticated request.
      await saveSession({
        access_token: data.access_token,
        refresh_token: data.refresh_token,
        user: data.user,
      });
      const enrichedUser = await withInstituteType(data.user);
      await saveSession({
        access_token: data.access_token,
        refresh_token: data.refresh_token,
        user: enrichedUser,
      });
      refreshTokenRef.current = data.refresh_token;
      setUser(enrichedUser);
      setIsAuthenticated(true);
      return true;
    } catch (e) {
      setError(e.message || 'Login failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    const token = refreshTokenRef.current;
    setIsAuthenticated(false);
    setUser(null);
    refreshTokenRef.current = null;
    await clearSession();
    if (token) authApi.logout(token).catch(() => {});
  };

  const value = useMemo(
    () => ({
      isAuthenticated,
      user,
      bootstrapping,
      loading,
      error,
      login,
      logout,
    }),
    [isAuthenticated, user, bootstrapping, loading, error],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
