import { useState, useEffect, useCallback } from 'react';
import { useLanguage, tKey, tReplace, type Lang } from '../../i18n';
import { useUIStore } from '../../store';
import { fetchAppById, submitReview } from '../../firebase/apps';
import { getCurrentUser } from '../../firebase/auth';
import type { User } from 'firebase/auth';
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
  // Review state
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewHover, setReviewHover] = useState(0);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewBody, setReviewBody] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [reviewMsg, setReviewMsg] = useState('');
  const user: User | null = getCurrentUser();

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

  const goToPreviousScene = useCallback(() => {
    if (sceneIndex > 0) {
      const prevScene = game?.scenes[sceneIndex - 1];
      setFeedback(null);
      if (prevScene?.type === 'conversation') {
        // Go to beginning of previous conversation
        setConvLineIdx(0);
      }
      setSceneIndex((i) => i - 1);
    }
  }, [sceneIndex, game]);

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
        <div className="t2q-player__loading">{tKey('player_loading', lang)}</div>
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

        {/* Inline review form */}
        <div className="story-review">
          <div className="review-form__header">
            <span className="review-form__header-icon">✍️</span>
            <span className="review-form__header-title">{tKey('review_title', lang)}</span>
          </div>

          {reviewMsg && <p className="review-form__msg">{reviewMsg}</p>}

          {!user ? (
            <div className="review-form__sign-in-box">
              <span className="review-form__sign-in-icon">🔒</span>
              <p className="review-form__sign-in">{tKey('review_sign_in', lang)}</p>
            </div>
          ) : (
            <form className="review-form__inner"
              onSubmit={async (e) => {
                e.preventDefault();
                if (reviewRating === 0) return;
                setSubmitting(true);
                setReviewMsg('');
                try {
                  await submitReview(appId, {
                    author: user.displayName ?? user.email ?? 'Anonymous',
                    rating: reviewRating,
                    title: reviewTitle,
                    content: reviewBody,
                  });
                  setReviewMsg(tKey('review_thanks', lang));
                  setReviewRating(0);
                  setReviewTitle('');
                  setReviewBody('');
                } catch {
                  setReviewMsg('Error submitting review');
                } finally {
                  setSubmitting(false);
                }
              }}
            >
              <div className="review-form__rating-area">
                <span className="review-form__rate-question">{tKey('review_rate', lang)}</span>
                <div className="review-form__stars">
                  {[1,2,3,4,5].map((s) => (
                    <span key={s}
                      className={`review-form__star ${s <= (reviewHover || reviewRating) ? 'review-form__star--fill' : 'review-form__star--empty'}`}
                      onClick={() => setReviewRating(s)}
                      onMouseEnter={() => setReviewHover(s)}
                      onMouseLeave={() => setReviewHover(0)}
                    >★</span>
                  ))}
                </div>
                {reviewRating > 0 && (
                  <div className="review-form__rating-label">
                    {['', '😞 Terrible', '🙁 Bad', '🙂 Good', '😊 Great', '🤩 Excellent!'][reviewRating]}
                  </div>
                )}
              </div>
              <div className="review-form__fields">
                <input className="review-form__input" type="text"
                  placeholder={tKey('review_placeholder_title', lang)}
                  value={reviewTitle}
                  onChange={(e) => setReviewTitle(e.target.value)} required />
                <textarea className="review-form__textarea"
                  placeholder={tKey('review_placeholder_body', lang)}
                  value={reviewBody}
                  onChange={(e) => setReviewBody(e.target.value)} rows={3} />
              </div>
              <button className="review-form__submit" type="submit" disabled={submitting || reviewRating === 0}>
                {submitting ? '⏳ Submitting…' : '📨 ' + tKey('review_submit', lang)}
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }

  if (!currentScene) {
    return (
      <div className="t2q-player">
        <div className="t2q-player__error">{tKey('player_no_content', lang)}</div>
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
          ✕
        </button>
        <span className="t2q-header__progress">
          {sceneIndex + 1}/{game?.scenes.length ?? 0}
        </span>
        {sceneIndex > 0 && (
          <button type="button" className="t2q-header__prev" onClick={goToPreviousScene}>
            ← {tKey('player_prev', lang)}
          </button>
        )}
        {totalQuiz > 0 && (
          <span className="t2q-header__score">{tKey('player_score_short', lang)} {score}/{totalQuiz}</span>
        )}
      </div>

      {/* Scene content */}
      <div className="t2q-scene">
        {currentScene.type === 'conversation' && (
          <ConversationView
            scene={currentScene}
            lineIdx={convLineIdx}
            onAdvance={advanceConversation}
            lang={lang}
          />
        )}
        {currentScene.type === 'quiz' && (
          <QuizView
            scene={currentScene}
            feedback={feedback}
            onAnswer={handleAnswer}
            onConfirm={continueAfterFeedback}
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
  lang,
}: {
  scene: ConversationScene;
  lineIdx: number;
  onAdvance: () => void;
  lang: Lang;
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
        {tKey('player_tap_continue', lang)}
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
  onConfirm,
  lang,
}: {
  scene: QuizScene;
  feedback: { correct: boolean; correctAnswer?: string } | null;
  onAnswer: (idx: number) => void;
  onConfirm: () => void;
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

      {/* Confirm button — only shown after answering */}
      {feedback && (
        <button
          type="button"
          className="t2q-btn t2q-btn--primary t2q-quiz__confirm"
          onClick={onConfirm}
          style={{ touchAction: 'manipulation' }}
        >
          {tKey('player_continue', lang)}
        </button>
      )}
    </div>
  );
}
