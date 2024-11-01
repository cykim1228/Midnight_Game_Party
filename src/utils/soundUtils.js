// 효과음 객체 캐시
let audioCache = {};
let isSoundInitialized = false;

// 효과음 파일 경로
const SOUND_PATHS = {
  correct: '/assets/sounds/correct.mp3',    // 정답 효과음
  wrong: '/assets/sounds/wrong.mp3',        // 오답 효과음
  timeUp: '/assets/sounds/timeup.mp3',      // 시간 종료 효과음
  gameStart: '/assets/sounds/start.mp3',    // 게임 시작 효과음
  gameEnd: '/assets/sounds/end.mp3',        // 게임 종료 효과음
  tick: '/assets/sounds/tick.mp3'           // 타이머 틱 소리
};

// 효과음 초기화
export const initializeSounds = () => {
  if (isSoundInitialized) return;

  Object.entries(SOUND_PATHS).forEach(([name, path]) => {
    const audio = new Audio(path);
    audio.preload = 'auto';
    audioCache[name] = audio;
  });

  isSoundInitialized = true;
};

// 효과음 재생
export const playSound = (soundName) => {
  if (!isSoundInitialized) {
    initializeSounds();
  }

  const audio = audioCache[soundName];
  if (audio) {
    // 이미 재생 중이면 처음부터 다시 재생
    audio.currentTime = 0;
    
    // 재생 시도
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch(error => {
        console.warn('효과음 재생 실패:', error);
      });
    }
  }
};

// 특정 효과음 정지
export const stopSound = (soundName) => {
  const audio = audioCache[soundName];
  if (audio) {
    audio.pause();
    audio.currentTime = 0;
  }
};

// 모든 효과음 정지
export const stopAllSounds = () => {
  Object.values(audioCache).forEach(audio => {
    audio.pause();
    audio.currentTime = 0;
  });
};