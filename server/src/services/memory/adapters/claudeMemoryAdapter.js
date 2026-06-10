export function formatForClaude(memories = []) {
  if (!memories.length) {
    return 'Nessuna memoria permanente disponibile.';
  }

  return [
    '<mind_memory>',
    ...memories.map(
      (m) =>
        `<memory type="${m.type}" importance="${m.importance}">` +
        `<title>${m.title}</title>` +
        `<content>${m.summary || m.content}</content>` +
        (m.tags?.length ? `<tags>${m.tags.join(', ')}</tags>` : '') +
        `</memory>`
    ),
    '</mind_memory>',
  ].join('\n');
}
