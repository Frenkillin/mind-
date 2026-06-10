export function formatForOpenAI(memories = []) {
  if (!memories.length) {
    return [{ role: 'system', content: 'Nessuna memoria permanente disponibile.' }];
  }

  const content = memories
    .map(
      (m, i) =>
        `Memory ${i + 1} [${m.type}]: ${m.title}\n${m.summary || m.content}` +
        (m.tags?.length ? `\nTags: ${m.tags.join(', ')}` : '')
    )
    .join('\n\n');

  return [
    {
      role: 'system',
      content: `Permanent memory context from MIND:\n\n${content}`,
    },
  ];
}
