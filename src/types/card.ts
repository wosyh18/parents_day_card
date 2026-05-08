export interface CardBackground {
  id: string;
  name: string;
  value: string; // CSS background value or color class
  type: 'color' | 'gradient' | 'image';
}

export interface CardSticker {
  id: string;
  name: string;
  emoji: string;
}

export interface PlacedSticker {
  id: string; // unique instance id
  stickerId: string;
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  rotation: number;
  scale: number;
}

export interface PhotoTransform {
  x: number;
  y: number;
  scale: number;
  rotation: number;
}

export interface CardState {
  selectedBackgroundId: string;
  photoDataUrl: string | null;
  photoTransform: PhotoTransform;
  placedStickers: PlacedSticker[];
  letter: string;
  audioDataUrl: string | null;
}
