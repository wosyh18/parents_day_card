import { toPng } from 'html-to-image';

export async function exportCardAsImage(elementId: string, fileName: string = 'parents-day-card.png') {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error('Element not found:', elementId);
    return;
  }

  try {
    // 폰트와 이미지가 로드될 때까지 약간의 여유를 둠
    const dataUrl = await toPng(element, {
      quality: 0.95,
      pixelRatio: 2,
      backgroundColor: '#ffffff',
      cacheBust: true,
    });

    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
  } catch (error) {
    console.error('Image Export Error:', error);
    throw error;
  }
}
