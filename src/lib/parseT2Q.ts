import type { Scene, QuizScene, ParseResult, ParseError } from '../types/t2q';

/**
 * Parse raw T2Q text into a GameObject.
 *
 * T2Q format:
 *   > Speaker: Text          → conversation line
 *   ? Question text          → quiz question
 *   1) Option A              → quiz option (up to 6)
 *   = 3                      → correct answer (1-indexed)
 *
 * Blank lines separate scenes.
 * No blank lines inside a quiz block.
 */
export function parseT2Q(rawText: string): ParseResult {
  const errors: ParseError[] = [];
  const lines = rawText.split('\n');

  // Pre-process: track original line numbers (1-indexed)
  const scenes: Scene[] = [];
  let i = 0;

  while (i < lines.length) {
    // Skip blank lines between scenes
    while (i < lines.length && lines[i].trim() === '') {
      i++;
    }
    if (i >= lines.length) break;

    const firstLine = lines[i].trim();
    const lineNum = i + 1;

    if (firstLine.startsWith('>')) {
      // --- Conversation scene ---
      const convLines: { speaker: string; text: string }[] = [];

      while (i < lines.length && lines[i].trim().startsWith('>')) {
        const convLine = parseConversationLine(lines[i].trim(), i + 1, errors);
        if (convLine) {
          convLines.push(convLine);
        }
        i++;
      }

      if (convLines.length > 0) {
        scenes.push({ type: 'conversation', lines: convLines });
      }
    } else if (firstLine.startsWith('?')) {
      // --- Quiz scene ---
      const quizResult = parseQuizBlock(lines, i, errors);
      if (quizResult) {
        scenes.push(quizResult.scene);
        i = quizResult.nextIndex;
      } else {
        i++; // skip the ? line and continue
      }
    } else {
      errors.push({
        line: lineNum,
        message: `Unexpected line: "${firstLine}". Expected ">" for conversation or "?" for quiz.`,
      });
      i++;
    }
  }

  if (errors.length > 0) {
    return { ok: false, errors };
  }

  if (scenes.length === 0) {
    return { ok: false, errors: [{ line: 0, message: 'No valid scenes found. T2Q content must contain at least one conversation or quiz block.' }] };
  }

  return { ok: true, game: { scenes } };
}

function parseConversationLine(
  line: string,
  lineNum: number,
  errors: ParseError[],
): { speaker: string; text: string } | null {
  // Remove leading '> ' or '>'
  const content = line.startsWith('> ') ? line.slice(2) : line.slice(1);
  const colonIdx = content.indexOf(': ');

  if (colonIdx === -1) {
    errors.push({
      line: lineNum,
      message: `Invalid conversation format: "${line}". Expected "> Speaker: Text" with a colon and space after the speaker name.`,
    });
    return null;
  }

  const speaker = content.slice(0, colonIdx).trim();
  const text = content.slice(colonIdx + 2).trim();

  if (!speaker) {
    errors.push({
      line: lineNum,
      message: `Speaker name is empty on line ${lineNum}.`,
    });
    return null;
  }

  if (!text) {
    errors.push({
      line: lineNum,
      message: `Conversation text is empty on line ${lineNum}.`,
    });
    return null;
  }

  return { speaker, text };
}

function parseQuizBlock(
  lines: string[],
  startIdx: number,
  errors: ParseError[],
): { scene: QuizScene; nextIndex: number } | null {
  const questionLine = lines[startIdx].trim();
  const question = questionLine.startsWith('? ') ? questionLine.slice(2) : questionLine.slice(1);

  if (!question.trim()) {
    errors.push({
      line: startIdx + 1,
      message: 'Quiz question text is empty.',
    });
    return null;
  }

  const options: string[] = [];
  let correctIndex = -1;
  let i = startIdx + 1;
  let hasError = false;

  // Parse options
  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    // Blank line inside quiz block → error
    if (trimmed === '') {
      errors.push({
        line: i + 1,
        message: 'Blank line inside quiz block is not allowed. Quiz blocks must be continuous (no blank lines between "?" and "=").',
      });
      hasError = true;
      i++;
      continue;
    }

    // Option line: 1) ... 2) ... etc.
    const optionMatch = trimmed.match(/^(\d+)\)\s*(.+)/);
    if (optionMatch) {
      if (options.length >= 6) {
        errors.push({
          line: i + 1,
          message: 'Too many options. Maximum 6 options per quiz.',
        });
        hasError = true;
      } else {
        options.push(optionMatch[2].trim());
      }
      i++;
      continue;
    }

    // Correct answer line: = number
    const correctMatch = trimmed.match(/^=\s*(\d+)/);
    if (correctMatch) {
      correctIndex = parseInt(correctMatch[1], 10) - 1; // convert to 0-based
      i++; // move past the = line
      break;
    }

    // If we hit another ? or >, the quiz block ended without =
    if (trimmed.startsWith('?') || trimmed.startsWith('>')) {
      break;
    }

    // Unknown line inside quiz block
    errors.push({
      line: i + 1,
      message: `Unexpected line inside quiz block: "${trimmed}". Expected a numbered option (e.g. "1) Answer") or correct answer (e.g. "= 1").`,
    });
    hasError = true;
    i++;
  }

  // Validation
  if (options.length === 0) {
    errors.push({
      line: startIdx + 1,
      message: 'Quiz has no options. Add at least one numbered option like "1) Answer text".',
    });
    hasError = true;
  }

  if (correctIndex === -1) {
    errors.push({
      line: startIdx + 1,
      message: 'Quiz is missing the correct answer. Add a line like "= 1" after the options.',
    });
    hasError = true;
  }

  if (correctIndex !== -1 && (correctIndex < 0 || correctIndex >= options.length)) {
    errors.push({
      line: startIdx + 1,
      message: `Correct answer index ${correctIndex + 1} is out of range. There are ${options.length} option(s).`,
    });
    hasError = true;
  }

  if (hasError) return null;

  return {
    scene: { type: 'quiz', question, options, correctIndex },
    nextIndex: i,
  };
}
