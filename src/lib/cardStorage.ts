import type { CardState } from '../types/card';

const STORAGE_KEY = 'parents_day_cards';

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
