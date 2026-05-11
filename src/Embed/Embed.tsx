import React, { useEffect, useLayoutEffect, useRef } from 'react';

export interface EmbedProps {
  slot?: React.ReactNode;
}

// useLayoutEffect on the client (avoids the unprocessed-text paint),
// useEffect on the server (no DOM there, no warning).
const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

function attrsOf(el: Element): Record<string, string> {
  const out: Record<string, string> = {};
  for (const attr of Array.from(el.attributes)) out[attr.name] = attr.value;
  return out;
}

interface MacroMatch {
  start: number;
  end: number;
  body: string;
}

// Scan for {{wf <body> }} where <body> is either a bare identifier
// (e.g. "name") or a JSON object (e.g. {"path":"name","type":"PlainText"}).
// JSON objects may contain nested objects/arrays, so brace tracking is
// required — a flat regex would mis-terminate on the first inner '}'.
function findMacros(text: string): MacroMatch[] {
  const PREFIX = '{{wf';
  const out: MacroMatch[] = [];
  let i = 0;
  while (i < text.length) {
    const start = text.indexOf(PREFIX, i);
    if (start === -1) break;

    let j = start + PREFIX.length;
    // Require whitespace after "{{wf"
    if (j >= text.length || !isSpace(text[j])) {
      i = j;
      continue;
    }
    while (j < text.length && isSpace(text[j])) j++;

    let body = '';
    let ok = false;

    if (text[j] === '{') {
      // Brace- and string-aware scan for a JSON object literal.
      const bodyStart = j;
      let depth = 0;
      let inString = false;
      let escape = false;
      while (j < text.length) {
        const c = text[j];
        if (escape) {
          escape = false;
        } else if (inString) {
          if (c === '\\') escape = true;
          else if (c === '"') inString = false;
        } else {
          if (c === '"') inString = true;
          else if (c === '{') depth++;
          else if (c === '}') {
            depth--;
            if (depth === 0) {
              j++;
              ok = true;
              break;
            }
          }
        }
        j++;
      }
      if (!ok) {
        i = start + PREFIX.length;
        continue;
      }
      body = text.slice(bodyStart, j);
    } else {
      const bodyStart = j;
      while (j < text.length && isIdent(text[j])) j++;
      body = text.slice(bodyStart, j);
      if (body.length === 0) {
        i = start + PREFIX.length;
        continue;
      }
    }

    while (j < text.length && isSpace(text[j])) j++;
    if (text[j] !== '}' || text[j + 1] !== '}') {
      i = start + PREFIX.length;
      continue;
    }
    j += 2;

    out.push({ start, end: j, body });
    i = j;
  }
  return out;
}

function isSpace(c: string) {
  return c === ' ' || c === '\t' || c === '\n' || c === '\r';
}
function isIdent(c: string) {
  return /[\w:.-]/.test(c);
}

// Resolve a macro body to the attribute name to look up.
// Bare identifier → use as-is. JSON object → use the `path` field.
function resolveKey(body: string): string | null {
  if (body.length === 0) return null;
  if (body[0] !== '{') return body;
  try {
    const parsed = JSON.parse(body) as unknown;
    if (parsed && typeof parsed === 'object' && 'path' in parsed) {
      const p = (parsed as { path: unknown }).path;
      if (typeof p === 'string' && p.length > 0) return p;
    }
  } catch {
    /* fall through */
  }
  return null;
}

function expandText(text: string, attrs: Record<string, string>): string {
  if (text.indexOf('{{wf') === -1) return text;
  const matches = findMacros(text);
  if (matches.length === 0) return text;

  let out = '';
  let cursor = 0;
  for (const m of matches) {
    out += text.slice(cursor, m.start);
    const key = resolveKey(m.body);
    if (key !== null && Object.prototype.hasOwnProperty.call(attrs, key)) {
      out += attrs[key];
    } else {
      out += text.slice(m.start, m.end);
    }
    cursor = m.end;
  }
  out += text.slice(cursor);
  return out;
}

// Walk every text node inside a single .w-embed and expand against the
// embed's own attributes. Text-node mutation (vs. innerHTML rewrite)
// preserves any event listeners or hydrated state on nested elements.
function expandWithinEmbed(embed: Element) {
  const attrs = attrsOf(embed);
  const walker = document.createTreeWalker(embed, NodeFilter.SHOW_TEXT);
  let node = walker.nextNode();
  while (node) {
    const v = node.nodeValue;
    if (v && v.indexOf('{{wf') !== -1) {
      const next = expandText(v, attrs);
      if (next !== v) node.nodeValue = next;
    }
    node = walker.nextNode();
  }
}

export function Embed({ slot }: EmbedProps) {
  const ref = useRef<HTMLDivElement>(null);

  useIsoLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const root = el.getRootNode();
    if (!(root instanceof ShadowRoot)) return;
    const host = root.host;

    // Webflow projects slot contents as direct light-DOM children of the
    // <code-island> host with slot="slot". Walk only those subtrees.
    const projected = host.querySelectorAll(':scope > [slot="slot"]');
    for (const subtree of Array.from(projected)) {
      const embeds = subtree.matches('.w-embed')
        ? [subtree]
        : Array.from(subtree.querySelectorAll('.w-embed'));
      for (const embed of embeds) expandWithinEmbed(embed);
    }
  });

  return (
    <div ref={ref} style={{ display: 'contents' }}>
      {slot}
    </div>
  );
}
