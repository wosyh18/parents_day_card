import { supabase } from './supabase';
import type { CardState } from '../types/card';

const STORAGE_KEY = 'parents_day_cards';

/**
 * Data URL을 Blob으로 변환하여 Supabase Storage에 업로드합니다.
 */
async function uploadDataUrl(dataUrl: string, bucket: string, path: string): Promise<string | null> {
  try {
    const res = await fetch(dataUrl);
    const blob = await res.blob();
    const { data, error } = await supabase.storage.from(bucket).upload(path, blob, {
      upsert: true,
      contentType: blob.type,
    });

    if (error) throw error;
    
    const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(data.path);
    return publicUrl;
  } catch (error) {
    console.error(`Upload error (${bucket}):`, error);
    return null;
  }
}

/**
 * 카드를 Supabase DB에 저장합니다.
 */
export async function saveCardToCloud(state: CardState): Promise<string | null> {
  const cardId = crypto.randomUUID();
  
  let photoUrl = null;
  let audioUrl = null;

  // 1. 사진 업로드 (있다면)
  if (state.photoDataUrl) {
    photoUrl = await uploadDataUrl(state.photoDataUrl, 'photos', `${cardId}/photo.png`);
  }

  // 2. 음성 업로드 (있다면)
  if (state.audioDataUrl) {
    audioUrl = await uploadDataUrl(state.audioDataUrl, 'voices', `${cardId}/voice.webm`);
  }

  // 3. DB 저장
  const { data, error } = await supabase
    .from('cards')
    .insert([
      {
        id: cardId,
        background_id: state.selectedBackgroundId,
        photo_url: photoUrl,
        photo_transform: state.photoTransform,
        placed_stickers: state.placedStickers,
        letter: state.letter,
        audio_url: audioUrl,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error('Database save error:', error);
    return null;
  }

  return data.id;
}

/**
 * Supabase DB에서 카드 정보를 불러옵니다.
 */
export async function loadCardFromCloud(id: string): Promise<CardState | null> {
  const { data, error } = await supabase
    .from('cards')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) {
    console.error('Database load error:', error);
    return null;
  }

  return {
    selectedBackgroundId: data.background_id,
    photoDataUrl: data.photo_url, // 여기서는 실제 Data URL이 아니라 공개 URL임
    photoTransform: data.photo_transform,
    placedStickers: data.placed_stickers,
    letter: data.letter,
    audioDataUrl: data.audio_url,
  };
}

// --- Legacy localStorage (for local development only) ---

export function saveCardToLocal(state: CardState): string {
  const id = crypto.randomUUID();
  const existingData = localStorage.getItem(STORAGE_KEY);
  const cards = existingData ? JSON.parse(existingData) : {};
  
  cards[id] = {
    ...state,
    createdAt: new Date().toISOString(),
  };
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
  return id;
}

export function loadCardFromLocal(id: string): CardState | null {
  const existingData = localStorage.getItem(STORAGE_KEY);
  if (!existingData) return null;
  
  const cards = JSON.parse(existingData);
  return cards[id] || null;
}
