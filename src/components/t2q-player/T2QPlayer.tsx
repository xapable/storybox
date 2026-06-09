import { useState, useEffect, useCallback } from 'react';
import { useLanguage, tKey, tReplace } from '../../i18n';
import type { Lang } from '../../i18n';
import { useUIStore } from '../../store';
import { fetchAppById } from '../../firebase/apps';
import { parseT2Q } from '../../lib/parseT2Q';
import type { GameObject, Scene, ConversationScene, QuizScene } from '../../types/t2q';
import './T2QPlayer.css';

interface T2QPlayerProps {
  appId: string;
  /** If true, this is a preview (no Firebase fetch, content passed directly) */
  previewContent?: string;
}

export default function T2QPlayer({ appId, previewContent }: T2QPlayerProps) {
  const { lang } = useLanguage();
  const { playApp } = useUIStore();
  const [game, setGame] = useState<GameObject | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(!previewContent);
  const [sceneIndex, setSceneIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [totalQuiz, setTotalQuiz] = useState(0);
  const [finished, setFinished] = useState(false);
  const [feedback, setFeedback] = useState<{ correct: boolean; correctAnswer?: string } | null>(null);
  const [convLineIdx, setConvLineIdx] = useState(0);

  // Load content
  useEffect(() => {
    if (previewContent) {
      const result = parseT2Q(previewContent);
      if (result.ok) {
        setGame(result.game);
        const quizCount = result.game.scenes.filter((s): s is QuizScene => s.type === 'quiz').length;
        setTotalQuiz(quizCount);
        setError(null);
      } else {
        setError('Sorry, this quiz has an error. Please notify the app creator.');
      }
      setLoading(false);
      return;
    }

    let cancelled = false;
    fetchAppById(appId)
      .then((doc) => {
        if (cancelled) return;
        if (!doc || !doc.t2qContent) {
          setError('Quiz not found.');
          setLoading(false);
          return;
        }
        const result = parseT2Q(doc.t2qContent);
        if (result.ok) {
          setGame(result.game);
          const quizCount = result.game.scenes.filter((s): s is QuizScene => s.type === 'quiz').length;
          setTotalQuiz(quizCount);
        } else {
          setError('Sorry, this quiz has an error. Please notify the app creator.');
        }
      })
      .catch(() => {
        if (!cancelled) setError('Failed to load quiz.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [appId, previewContent]);

  // Reset state when game changes
  useEffect(() => {
    setSceneIndex(0);
    setScore(0);
    setFinished(false);
    setFeedback(null);
    setConvLineIdx(0);
  }, [game]);

  const currentScene: Scene | undefined = game?.scenes[sceneIndex];

  const handleAnswer = useCallback((optionIdx: number) => {
    if (!game || !currentScene || currentScene.type !== 'quiz') return;
    const correct = optionIdx === currentScene.correctIndex;
    if (correct) setScore((s) => s + 1);
    setFeedback({
      correct,
      correctAnswer: correct ? undefined : currentScene.options[currentScene.correctIndex],
    });
  }, [game, currentScene]);

  const advanceConversation = useCallback(() => {
    if (!currentScene || currentScene.type !== 'conversation') return;
    if (convLineIdx + 1 < currentScene.lines.length) {
      setConvLineIdx((i) => i + 1);
    } else {
      // Move to next scene
      setConvLineIdx(0);
      if (sceneIndex + 1 < (game?.scenes.length ?? 0)) {
        setSceneIndex((i) => i + 1);
      } else {
        setFinished(true);
      }
    }
  }, [currentScene, convLineIdx, sceneIndex, game]);

  const continueAfterFeedback = useCallback(() => {
    setFeedback(null);
    if (sceneIndex + 1 < (game?.scenes.length ?? 0)) {
      setSceneIndex((i) => i + 1);
    } else {
      setFinished(true);
    }
  }, [sceneIndex, game]);

  // Auto-advance after feedback
  useEffect(() => {
    if (!feedback) return;
    const timer = setTimeout(() => {
      continueAfterFeedback();
    }, 1200);
    return () => clearTimeout(timer);
  }, [feedback, continueAfterFeedback]);

  const restart = useCallback(() => {
    setSceneIndex(0);
    setScore(0);
    setFinished(false);
    setFeedback(null);
    setConvLineIdx(0);
  }, []);

  if (loading) {
    return (
      <div className="t2q-player">
        <div className="t2q-player__loading">Loading quiz...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="t2q-player">
        <div className="t2q-player__error">{error}</div>
        <button type="button" className="t2q-btn t2q-btn--back" onClick={() => playApp(null)}>
          ← Back
        </button>
      </div>
    );
  }

  if (finished) {
    const total = totalQuiz || (game?.scenes.filter((s): s is QuizScene => s.type === 'quiz').length ?? 0);
    return (
      <div className="t2q-player t2q-player--finished">
        <div className="t2q-finish-card">
          <div className="t2q-finish__emoji">{score === total && total > 0 ? '🎉' : score >= total / 2 ? '👍' : '📚'}</div>
          <h2 className="t2q-finish__title">{tKey('player_finish_title', lang)}</h2>
          <p className="t2q-finish__score">
            {tReplace('player_score', lang, { score, total })}
          </p>
          <div className="t2q-finish__actions">
            <button type="button" className="t2q-btn t2q-btn--primary" onClick={restart}>
              {tKey('player_play_again', lang)}
            </button>
            <button type="button" className="t2q-btn t2q-btn--back" onClick={() => playApp(null)}>
              {tKey('player_back', lang)}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!currentScene) {
    return (
      <div className="t2q-player">
        <div className="t2q-player__error">No content to display.</div>
        <button type="button" className="t2q-btn t2q-btn--back" onClick={() => playApp(null)}>
          ← Back
        </button>
      </div>
    );
  }

  return (
    <div className="t2q-player">
      {/* Header bar */}
      <div className="t2q-header">
        <button type="button" className="t2q-header__back" onClick={() => playApp(null)}>
          ← Back
        </button>
        <span className="t2q-header__progress">
          Scene {sceneIndex + 1}/{game?.scenes.length ?? 0}
        </span>
        {totalQuiz > 0 && (
          <span className="t2q-header__score">Score: {score}/{totalQuiz}</span>
        )}
      </div>

      {/* Scene content */}
      <div className="t2q-scene">
        {currentScene.type === 'conversation' && (
          <ConversationView
            scene={currentScene}
            lineIdx={convLineIdx}
            onAdvance={advanceConversation}
          />
        )}
        {currentScene.type === 'quiz' && (
          <QuizView
            scene={currentScene}
            feedback={feedback}
            onAnswer={handleAnswer}
            lang={lang}
          />
        )}
      </div>
    </div>
  );
}

/* ---- Sub-components ---- */

function ConversationView({
  scene,
  lineIdx,
  onAdvance,
}: {
  scene: ConversationScene;
  lineIdx: number;
  onAdvance: () => void;
}) {
  const line = scene.lines[lineIdx];
  if (!line) return null;

  return (
    <button
      type="button"
      className="t2q-conversation"
      onClick={onAdvance}
      style={{ touchAction: 'manipulation' }}
    >
      <div className="t2q-conversation__speaker">{line.speaker}</div>
      <p className="t2q-conversation__text">{line.text}</p>
      <span className="t2q-conversation__hint">
        {lineIdx + 1 < scene.lines.length ? 'Tap to continue →' : 'Tap to continue'}
      </span>
      <div className="t2q-conversation__progress">
        {scene.lines.map((_, i) => (
          <span
            key={i}
            className={`t2q-dot ${i === lineIdx ? 't2q-dot--active' : i < lineIdx ? 't2q-dot--done' : ''}`}
          />
        ))}
      </div>
    </button>
  );
}

function QuizView({
  scene,
  feedback,
  onAnswer,
  lang,
}: {
  scene: QuizScene;
  feedback: { correct: boolean; correctAnswer?: string } | null;
  onAnswer: (idx: number) => void;
  lang: Lang;
}) {
  return (
    <div className="t2q-quiz">
      <h3 className="t2q-quiz__question">{scene.question}</h3>
      <div className="t2q-quiz__options">
        {scene.options.map((opt, i) => (
          <button
            key={i}
            type="button"
            className={`t2q-option ${feedback ? (i === scene.correctIndex ? 't2q-option--correct' : 't2q-option--wrong') : ''}`}
            onClick={() => !feedback && onAnswer(i)}
            disabled={!!feedback}
            style={{ touchAction: 'manipulation' }}
          >
            <span className="t2q-option__num">{i + 1}</span>
            <span className="t2q-option__text">{opt}</span>
          </button>
        ))}
      </div>

      {/* Feedback shown inline on options + status text */}
      {feedback && (
        <div className="t2q-feedback-bar">
          <span className={`t2q-feedback-bar__icon ${feedback.correct ? 't2q-feedback-bar__icon--correct' : 't2q-feedback-bar__icon--wrong'}`}>
            {feedback.correct ? '✅' : '❌'}
          </span>
          <span className="t2q-feedback-bar__text">
            {feedback.correct
              ? tKey('player_correct', lang)
              : `${tKey('player_wrong', lang)}${feedback.correctAnswer}`}
          </span>
        </div>
      )}
    </div>
  );
}
