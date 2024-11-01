export const gameSettings = {
  modes: {
    time: {
      name: '시간 제한 모드',
      description: '제한 시간 안에 최대한 많은 문제를 맞추세요!'
    },
    target: {
      name: '목표 달성 모드',
      description: '목표한 개수를 가장 빨리 달성하세요!'
    }
  },
  common: {
    minTimeLimit: 30,
    maxTimeLimit: 300,
    timeLimitStep: 30,
    minTargetScore: 3,
    maxTargetScore: 15,
    targetScoreStep: 3
  },
  wordchain: {
    timeLimit: 120,
    targetScore: 9
  },
  music: {
    targetScore: 9,
    categories: ['2024년', '2023년', '2022년', '2021년', '2020년', '2019년', '2018년', '2017년', '2016년', '2015년', '2014년', '2013년', '2012년', '2011년', '2010년', '2009년', '2008년', '2007년', '2006년', '2005년', '2004년', '2003년', '2002년', '2001년', '2000년']
  },
  whisper: {
    timeLimit: 120,
    targetScore: 9
  },
  charades: {
    timeLimit: 120,
    targetScore: 9
  }
};

export const SOUND_EFFECTS = {
  correct: '/sounds/correct.mp3',
  wrong: '/sounds/wrong.mp3',
  timeUp: '/sounds/timeup.mp3',
  gameStart: '/sounds/start.mp3',
  gameEnd: '/sounds/end.mp3',
  tick: '/sounds/tick.mp3'
};

export const ANIMATION_DURATION = {
  score: 500,
  teamSwitch: 300,
  gameTransition: 800
};