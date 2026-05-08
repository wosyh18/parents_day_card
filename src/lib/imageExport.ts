import html2canvas from 'html2canvas';

export async function exportCardAsImage(elementId: string, fileName: string = 'parents-day-card.png') {
  const element = document.getElementById(elementId);
  if (!element) return;

  try {
    const canvas = await html2canvas(element, {
      useCORS: true,
      scale: 2, // Better quality
      backgroundColor: null,
    });

    const link = document.createElement('a');
    link.download = fileName;
    link.href = canvas.toDataURL('image/png');
    link.click();
  } catch (error) {
    console.error('Failed to export image:', error);
    alert('이미지 저장 중 오류가 발생했습니다.');
  }
}
