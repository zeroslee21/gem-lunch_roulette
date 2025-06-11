// 캐시 이름 정의
const CACHE_NAME = 'lunch-roulette-cache-v2';
// 캐시할 파일 목록
const urlsToCache = [
  './',
  './index.html',
  './main.png',
  './og_image.png',
  'https://cdn.jsdelivr.net/npm/canvas-confetti@1.5.1/dist/confetti.browser.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js',
  'https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;700&display=swap'
];

// 서비스 워커 설치 이벤트
self.addEventListener('install', (event) => {
  // 캐시를 열고 정의된 파일들을 모두 추가
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// fetch 이벤트: 네트워크 요청 가로채기
self.addEventListener('fetch', (event) => {
  event.respondWith(
    // 먼저 캐시에서 일치하는 요청이 있는지 확인
    caches.match(event.request)
      .then((response) => {
        // 캐시에 응답이 있으면 그것을 반환, 없으면 네트워크로 요청
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});

// 서비스 워커 활성화 및 이전 캐시 정리
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});