import AsyncStorage from '@react-native-async-storage/async-storage';

const ACCESS_KEY = 'auth.accessToken';
const REFRESH_KEY = 'auth.refreshToken';
const USER_KEY = 'auth.user';

export async function saveSession({ access_token, refresh_token, user }) {
  const entries = {
    [ACCESS_KEY]: access_token,
    [REFRESH_KEY]: refresh_token,
  };
  if (user) entries[USER_KEY] = JSON.stringify(user);
  await AsyncStorage.setMany(entries);
}

export async function saveTokens({ access_token, refresh_token }) {
  await AsyncStorage.setMany({
    [ACCESS_KEY]: access_token,
    [REFRESH_KEY]: refresh_token,
  });
}

export async function loadSession() {
  const values = await AsyncStorage.getMany([ACCESS_KEY, REFRESH_KEY, USER_KEY]);
  const userJson = values[USER_KEY];
  return {
    accessToken: values[ACCESS_KEY] || null,
    refreshToken: values[REFRESH_KEY] || null,
    user: userJson ? JSON.parse(userJson) : null,
  };
}

export async function clearSession() {
  await AsyncStorage.removeMany([ACCESS_KEY, REFRESH_KEY, USER_KEY]);
}
