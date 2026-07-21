export type Role = 'STUDENT' | 'ALUMNI' | 'ADMIN' | 'PROFESSOR';
export type Branch = 'CSE' | 'ECE' | 'MECH' | 'CIVIL' | 'CHEMICAL' | 'BIOTECH' | 'ELECTRICAL' | 'INSTRUMENTATION' | 'AEROSPACE' | 'MATERIALS' | 'INDUSTRIAL' | 'PRODUCTION';
export type Campus = 'MAIN' | 'EAST' | 'WEST';
export type Profile = { userId: string; batch: number; branch: Branch; campus: Campus; city: string | null; country: string | null; currentCompany: string | null; currentRole: string | null; profilePicture: string | null };
export type Experience = { id?: string; company: string; role: string; startDate: string | null; endDate: string | null; isCurrent: boolean };
export type User = { id: string; firstName: string; lastName: string; email: string; role: Role; emailVerified: boolean; profileCompleted: boolean; profile: Profile | null; socialMedia: Record<string, string | null> | null; experiences: Experience[] };
type Envelope<T> = { success: true; message: string; data: T };
const baseUrl = process.env.EXPO_PUBLIC_API_URL ?? '/api';
let accessToken: string | null = null;
let refreshing: Promise<string | null> | null = null;
export const getToken = () => accessToken;
export const clearToken = () => { accessToken = null; };
async function refresh() {
  if (!refreshing) refreshing = fetch(`${baseUrl}/auth/refresh`, { method: 'POST', credentials: 'include' })
    .then(async r => r.ok ? (await r.json() as Envelope<{ accessToken: string }>).data.accessToken : null)
    .catch(() => null).finally(() => { refreshing = null; });
  accessToken = await refreshing;
  return accessToken;
}
export async function api<T>(path: string, init: RequestInit = {}, retry = true): Promise<T> {
  const headers = new Headers(init.headers);
  if (accessToken) headers.set('Authorization', `Bearer ${accessToken}`);
  const response = await fetch(`${baseUrl}${path}`, { ...init, headers, credentials: 'include' });
  if (response.status === 401 && retry && await refresh()) return api<T>(path, init, false);
  const payload = await response.json().catch(() => null) as Envelope<T> | { message?: string } | null;
  if (!response.ok) throw new Error(payload && 'message' in payload ? payload.message ?? 'Request failed' : 'Request failed');
  return (payload as Envelope<T>).data;
}
export const authApi = {
  restore: async () => { await refresh(); return api<User>('/users/me'); },
  login: (email: string, password: string) => api<{ accessToken: string }>('/auth/login', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ email, password }) }).then(async x => { accessToken = x.accessToken; return api<User>('/users/me'); }),
  register: (input: {firstName:string;lastName:string;email:string;password:string;role:Role}) => api<{accessToken:string;user:User}>('/auth/register', { method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(input)}).then(x=>{accessToken=x.accessToken;return {...x.user,profile:null,socialMedia:null,experiences:[]};}),
  logout: async () => { await api('/auth/logout', { method:'POST' }); clearToken(); },
  sendOtp: () => api('/auth/email-verification/send', {method:'POST'}),
  verifyOtp: (otp:string) => api('/auth/email-verification/verify', {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({otp})}),
  googleUrl: `${baseUrl}/auth/login/google`,
};
export const profileApi = {
  create: (input: Pick<Profile,'batch'|'branch'|'campus'>) => api<Profile>('/profile/', {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(input)}),
  update: (form: FormData) => api<Profile>('/profile/', {method:'PUT',body:form}),
};
export const usersApi = (params: Record<string,string | number | boolean | undefined>) => {
  const query = new URLSearchParams(Object.entries(params).filter(([,v]) => v !== undefined && v !== '').map(([k,v]) => [k,String(v)])).toString();
  return api<{users:User[];total:number;limit:number;offset:number}>(`/users/search${query ? `?${query}` : ''}`);
};
