declare global {
  interface Window {
    Kakao: any;
  }
}

export function initKakao() {
  const key = import.meta.env.VITE_KAKAO_JAVASCRIPT_KEY;
  if (!key) {
    console.warn('Kakao JavaScript Key is missing in .env');
    return false;
  }

  if (window.Kakao && !window.Kakao.isInitialized()) {
    window.Kakao.init(key);
  }
  return true;
}

export function shareToKakao(cardId: string, message: string) {
  if (!window.Kakao || !window.Kakao.isInitialized()) {
    return false;
  }

  const url = `${window.location.origin}/card/${cardId}`;

  window.Kakao.Share.sendDefault({
    objectType: 'feed',
    content: {
      title: '부모님께 마음을 담은 카드가 도착했어요',
      description: message.substring(0, 40) + '...',
      imageUrl: 'https://images.unsplash.com/photo-1595113316349-9fa4ee24f884?q=80&w=400&auto=format&fit=crop', // Default fallback image
      link: {
        mobileWebUrl: url,
        webUrl: url,
      },
    },
    buttons: [
      {
        title: '카드 열어보기',
        link: {
          mobileWebUrl: url,
          webUrl: url,
        },
      },
    ],
  });
  return true;
}
