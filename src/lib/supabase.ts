import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

// URL이 유효한 형식인지 확인 (없으면 에러 방지용 가짜 URL 사용)
const isValidUrl = supabaseUrl.startsWith('http')

if (!isValidUrl || !supabaseAnonKey) {
  console.warn('⚠️ Supabase 설정이 누락되었습니다. .env 파일을 확인해주세요.')
}

// 앱이 크래시 나지 않도록 최소한의 방어 로직 추가
export const supabase = createClient(
  isValidUrl ? supabaseUrl : 'https://placeholder-url.supabase.co',
  supabaseAnonKey || 'placeholder-key'
)
