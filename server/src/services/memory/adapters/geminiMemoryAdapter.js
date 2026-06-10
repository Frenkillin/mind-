export function formatForGemini(memories = []) {
  if (!memories.length) {
    return 'Nessuna memoria permanente disponibile.';
  }

  return memories
    .map(
      (m, i) =>
        `[Memoria ${i + 1} | ${m.type} | importanza ${m.importance}]\n` +
        `Titolo: ${m.title}\n` +
        `Contenuto: ${m.summary || m.content}` +
        (m.tags?.length ? `\nTag: ${m.tags.join(', ')}` : '')
    )
    .join('\n\n');
}
