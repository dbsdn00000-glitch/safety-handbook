// 현장안전 핸드북 - 서비스워커
// 이 파일은 인터넷이 안 되는 현장에서도 앱이 열리도록
// 필요한 파일들을 스마트폰에 미리 저장(캐시)해두는 역할을 합니다.
// ※ 앱 내용을 수정한 뒤에는 아래 CACHE_NAME의 버전 숫자를 올려주세요.
//   (v1 -> v2 로 바꾸면 스마트폰이 새 버전을 다시 받아갑니다)

const CACHE_NAME = 'safety-handbook-v3';

const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './images/그림1.jpg',
  './images/그림2.png',
  './images/그림3-1.jpg',
  './images/그림3-2.jpg',
  './images/그림3-3.jpg',
  './images/그림4.jpg',
  './images/그림5.jpg',
  './images/그림6.jpg',
  './images/그림7.jpg',
  './images/그림8.jpg',
  './images/그림9.jpg',
  './images/그림10.jpg',
  './images/그림11.jpg',
  './images/그림12.jpg',
  './images/그림13.png',
  './images/그림14.jpg',
  './images/그림15.jpg',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => {
      const fetchPromise = fetch(event.request)
        .then((networkRes) => {
          if (networkRes && networkRes.status === 200) {
            const clone = networkRes.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return networkRes;
        })
        .catch(() => cached);
      return cached || fetchPromise;
    })
  );
});
