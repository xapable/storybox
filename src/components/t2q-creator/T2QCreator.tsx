import { useState, useCallback } from 'react';
import { useUIStore } from '../../store';
import { useLanguage, tKey, tReplace } from '../../i18n';
import { createApp, updateApp } from '../../firebase/apps';
import { getCurrentUser } from '../../firebase/auth';
import { parseT2Q } from '../../lib/parseT2Q';
import T2QPlayer from '../t2q-player/T2QPlayer';
import type { ParseError } from '../../types/t2q';
import './T2QCreator.css';

interface T2QCreatorProps {
  editId?: string;
  initialData?: {
    title: string;
    description: string;
    thumbnail: string;
    t2qContent: string;
  };
}

export default function T2QCreator({ editId, initialData }: T2QCreatorProps) {
  const { toggleCreator } = useUIStore();
  const { lang } = useLanguage();

  const [title, setTitle] = useState(initialData?.title ?? '');
  const [description, setDescription] = useState(initialData?.description ?? '');
  const [thumbnail, setThumbnail] = useState(initialData?.thumbnail ?? '');
  const [thumbnailPreview, setThumbnailPreview] = useState(initialData?.thumbnail ?? '');
  const [t2qContent, setT2qContent] = useState(initialData?.t2qContent ?? '');
  const [appType, setAppType] = useState<'story' | 't2q_quiz'>('t2q_quiz');

  const [errors, setErrors] = useState<ParseError[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');
  const [genTopic, setGenTopic] = useState('');
  const [showGenInput, setShowGenInput] = useState(false);

  const handleThumbnailUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        // Crop to 1:1 square (center crop)
        const size = Math.min(img.width, img.height);
        const sx = (img.width - size) / 2;
        const sy = (img.height - size) / 2;

        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 256;
        const ctx = canvas.getContext('2d')!;
        ctx.drawImage(img, sx, sy, size, size, 0, 0, 256, 256);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        setThumbnail(dataUrl);
        setThumbnailPreview(dataUrl);
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  }, []);

  const handleGenClick = useCallback(() => {
    if (t2qContent.trim().length === 0) {
      alert(tKey('creator_think_first', lang));
      return;
    }
    setShowGenInput((v) => !v);
  }, [t2qContent, lang]);

  const handleValidate = useCallback(() => {
    const result = parseT2Q(t2qContent);
    if (result.ok) {
      setErrors([]);
      alert(tReplace('creator_valid', lang, { count: result.game.scenes.length }));
    } else {
      setErrors(result.errors);
    }
  }, [t2qContent, lang]);

  const handleSave = useCallback(async () => {
    setSaveMsg('');

    if (appType === 't2q_quiz') {
      const result = parseT2Q(t2qContent);
      if (!result.ok) {
        setErrors(result.errors);
        return;
      }
    } else {
      if (!t2qContent.trim()) {
        setSaveMsg(tKey('creator_no_content', lang));
        return;
      }
    }

    const user = getCurrentUser();
    if (!user) {
      setSaveMsg(tKey('creator_need_signin', lang));
      return;
    }

    try {
      setSaving(true);
      const data: Record<string, unknown> = {
        title: title.trim(),
        description: description.trim(),
        thumbnail: thumbnail.trim() || '',
        appType,
        createdBy: user.uid,
        isPublic: true,
      };

      if (appType === 't2q_quiz') {
        data.t2qContent = t2qContent.trim();
      } else {
        data.storyContent = t2qContent.trim();
      }

      if (editId) {
        await updateApp(editId, data as any);
        setSaveMsg(tKey('creator_updated', lang));
      } else {
        await createApp(data as any);
        setSaveMsg(tKey('creator_saved', lang));
      }

      setTimeout(() => toggleCreator(false), 1500);
    } catch (e: any) {
      setSaveMsg(tReplace('creator_save_error', lang, { msg: e.message }));
    } finally {
      setSaving(false);
    }
  }, [t2qContent, title, description, thumbnail, appType, editId, toggleCreator, lang]);

  const handleGenerate = useCallback(async () => {
    if (!genTopic.trim()) return;

    const apiKey = import.meta.env.VITE_DEEPSEEK_API_KEY;
    if (!apiKey) {
      setSaveMsg(tKey('creator_ai_no_fn', lang));
      return;
    }

    setGenerating(true);
    setSaveMsg('');
    try {
      const response = await fetch('https://api.deepseek.com/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            {
              role: 'system',
              content: `You are a T2Q story generator. Output only valid T2Q content using the format:
- > Speaker: Text for conversation
- ? Question text
- Numbered options 1) ... 2) ...
- = correct number (1-indexed)
- Blank lines between scenes.
Do not output any extra text, markdown, or explanations. Output only the T2Q content.`,
            },
            { role: 'user', content: `Topic: ${genTopic.trim()}` },
          ],
          temperature: 0.7,
          max_tokens: 2000,
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(errText || `HTTP ${response.status}`);
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content?.trim();

      if (!content) {
        throw new Error('Empty response from AI');
      }

      setT2qContent(content);
      setShowGenInput(false);
      setErrors([]);
    } catch (e: any) {
      setSaveMsg(tReplace('creator_ai_failed', lang, { msg: e.message || 'unknown' }));
    } finally {
      setGenerating(false);
    }
  }, [genTopic, lang]);

  // Preview mode
  if (showPreview) {
    const result = parseT2Q(t2qContent);
    if (!result.ok) {
      return (
        <div className="t2q-creator">
          <div className="t2q-creator__header">
            <button type="button" className="t2q-creator__back" onClick={() => setShowPreview(false)}>
              ← Back to editor
            </button>
          </div>
          <div className="t2q-creator__error-list">
            <h3>{tKey('creator_no_preview', lang)}</h3>
            {result.errors.map((e, i) => (
              <div key={i} className="t2q-creator__error-item">
                Line {e.line}: {e.message}
              </div>
            ))}
          </div>
        </div>
      );
    }
    return (
      <div className="t2q-creator t2q-creator--preview">
        <div className="t2q-creator__header">
          <button type="button" className="t2q-creator__back" onClick={() => setShowPreview(false)}>
            {tKey('creator_back_editor', lang)}
          </button>
        </div>
        <T2QPlayer appId="preview" previewContent={t2qContent} />
      </div>
    );
  }

  return (
    <div className="t2q-creator">
      <div className="t2q-creator__header">
        <h2 className="t2q-creator__title">
          {editId ? tKey('creator_title_edit', lang) : tKey('creator_title_new', lang)}
        </h2>
        <button type="button" className="t2q-creator__close" onClick={() => toggleCreator(false)}>
          ✕
        </button>
      </div>

      <div className="t2q-creator__body">
        {/* Title */}
        <label className="t2q-field">
          <span className="t2q-field__label">{tKey('creator_field_title', lang)}</span>
          <input
            type="text"
            className="t2q-field__input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={tKey('creator_field_title', lang)}
          />
        </label>

        {/* Description */}
        <label className="t2q-field">
          <span className="t2q-field__label">{tKey('creator_field_desc', lang)}</span>
          <input
            type="text"
            className="t2q-field__input"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={tKey('creator_field_desc', lang)}
          />
        </label>

        {/* Thumbnail upload (1:1 square) */}
        <label className="t2q-field">
          <span className="t2q-field__label">{tKey('creator_field_thumb', lang)}</span>
          <div className="t2q-thumb-upload">
            {thumbnailPreview ? (
              <div className="t2q-thumb-preview">
                <img src={thumbnailPreview} alt="" className="t2q-thumb-preview__img" />
                <button
                  type="button"
                  className="t2q-thumb-preview__remove"
                  onClick={() => { setThumbnail(''); setThumbnailPreview(''); }}
                >
                  ✕
                </button>
              </div>
            ) : (
              <label className="t2q-thumb-placeholder">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleThumbnailUpload}
                  className="t2q-thumb-input"
                />
                <span className="t2q-thumb-placeholder__icon">📷</span>
                <span className="t2q-thumb-placeholder__text">1:1</span>
              </label>
            )}
          </div>
        </label>

        {/* App Type */}
        <div className="t2q-field">
          <span className="t2q-field__label">{tKey('creator_field_type', lang)}</span>
          <div className="t2q-type-toggle">
            <button
              type="button"
              className={`t2q-type-btn ${appType === 'story' ? 't2q-type-btn--active' : ''}`}
              onClick={() => setAppType('story')}
            >
              {tKey('creator_type_story', lang)}
            </button>
            <button
              type="button"
              className={`t2q-type-btn ${appType === 't2q_quiz' ? 't2q-type-btn--active' : ''}`}
              onClick={() => setAppType('t2q_quiz')}
            >
              {tKey('creator_type_quiz', lang)}
            </button>
          </div>
        </div>

        {/* Content textarea (always visible, adapts to app type) */}
        <label className="t2q-field">
          <span className="t2q-field__label">
            {appType === 't2q_quiz'
              ? tKey('creator_field_content_quiz', lang)
              : tKey('creator_field_content_story', lang)}
            {appType === 't2q_quiz' && (
              <span className="t2q-field__hint">{tKey('creator_hint_quiz', lang)}</span>
            )}
          </span>
          <textarea
            className="t2q-field__textarea"
            value={t2qContent}
            onChange={(e) => setT2qContent(e.target.value)}
            placeholder={
              appType === 't2q_quiz'
                ? tKey('creator_placeholder_quiz', lang)
                : tKey('creator_placeholder_story', lang)
            }
            rows={14}
          />
        </label>

        {/* Action buttons */}
        <div className="t2q-creator__actions">
          {appType === 't2q_quiz' && (
            <>
              <button type="button" className="t2q-btn t2q-btn--outline" onClick={handleValidate}>
                {tKey('creator_btn_validate', lang)}
              </button>
              <button
                type="button"
                className="t2q-btn t2q-btn--outline"
                onClick={() => setShowPreview(true)}
              >
                {tKey('creator_btn_preview', lang)}
              </button>
              <button
                type="button"
                className="t2q-btn t2q-btn--outline"
                onClick={handleGenClick}
                disabled={generating}
              >
                {generating ? tKey('creator_generating', lang) : tKey('creator_btn_generate', lang)}
              </button>
            </>
          )}
          <button
            type="button"
            className="t2q-btn t2q-btn--primary"
            onClick={handleSave}
            disabled={saving || !title.trim()}
          >
            {saving ? tKey('creator_saving', lang) : tKey('creator_btn_save', lang)}
          </button>
        </div>

        {/* AI topic input */}
        {showGenInput && (
          <div className="t2q-gen-panel">
            <label className="t2q-field">
              <span className="t2q-field__label">{tKey('creator_gen_topic', lang)}</span>
              <div className="t2q-gen-row">
                <input
                  type="text"
                  className="t2q-field__input"
                  value={genTopic}
                  onChange={(e) => setGenTopic(e.target.value)}
                  placeholder={tKey('creator_gen_topic', lang)}
                />
                <button
                  type="button"
                  className="t2q-btn t2q-btn--primary t2q-btn--small"
                  onClick={handleGenerate}
                  disabled={generating || !genTopic.trim()}
                >
                  {generating ? '...' : tKey('creator_gen_btn', lang)}
                </button>
              </div>
            </label>
          </div>
        )}

        {/* Save message */}
        {saveMsg && <div className="t2q-creator__msg">{saveMsg}</div>}

        {/* Validation errors */}
        {errors.length > 0 && (
          <div className="t2q-creator__error-list">
            <h4>Parse Errors ({errors.length})</h4>
            {errors.map((e, i) => (
              <div key={i} className="t2q-creator__error-item">
                <span className="t2q-creator__error-line">Line {e.line}:</span> {e.message}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
