import React, { useEffect, useRef } from 'react';
import '../../styles/styles.css';

function AnswerList({ answers }) {
  const listRef = useRef(null);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [answers]);

  return (
    <div className="answer-list" ref={listRef}>
      {answers.map((answer, index) => (
        <div
          key={index}
          className={`answer-item ${answer.correct ? 'correct' : 'wrong'}`}
        >
          {answer.word || answer.song?.title} {answer.correct ? '✅' : '❌'}
        </div>
      ))}
    </div>
  );
}

export default AnswerList;