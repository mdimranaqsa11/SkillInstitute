import { Platform } from 'react-native';
import { API_URL, API_PROTOCOL, API_PORT, API_HOST } from '@env';

// Android emulator maps the host machine's localhost to 10.0.2.2; iOS simulator
// shares the host's localhost directly. A physical device needs the host's LAN IP,
// set via API_HOST in .env, instead. API_URL overrides all of this — set it to
// point straight at a deployed backend (e.g. the Railway production URL).
const DEFAULT_HOST = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';

const baseUrl = API_URL || `${API_PROTOCOL || 'http'}://${API_HOST || DEFAULT_HOST}:${API_PORT || '8000'}`;

export const API_BASE_URL = `${baseUrl}/api/v1`;
