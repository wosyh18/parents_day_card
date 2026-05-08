import type { CardBackground } from '../types/card';

export const backgrounds: CardBackground[] = [
  { id: 'bg-white', name: '기본 화이트', value: '#ffffff', type: 'color' },
  { id: 'bg-rose-50', name: '은은한 로즈', value: '#fff1f2', type: 'color' },
  { id: 'bg-cream', name: '부드러운 크림', value: '#fffbeb', type: 'color' },
  { id: 'grad-rose', name: '로즈 그라데이션', value: 'linear-gradient(to bottom right, #ffe4e6, #fecdd3)', type: 'gradient' },
  { id: 'grad-sunset', name: '선셋 그라데이션', value: 'linear-gradient(to bottom right, #ffedd5, #fed7aa)', type: 'gradient' },
  { id: 'grad-lavender', name: '라벤더 그라데이션', value: 'linear-gradient(to bottom right, #f3e8ff, #e9d5ff)', type: 'gradient' },
  { id: 'grad-mint', name: '민트 그라데이션', value: 'linear-gradient(to bottom right, #f0fdf4, #dcfce7)', type: 'gradient' },
  { id: 'grad-blue', name: '스카이 그라데이션', value: 'linear-gradient(to bottom right, #eff6ff, #dbeafe)', type: 'gradient' },
];
