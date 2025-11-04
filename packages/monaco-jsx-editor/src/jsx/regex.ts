const MATCH_TAG_AND_ATTRIBUTES = /<([a-zA-Z_][\w-]*)(.*?)$/;
const MATCH_ATTRIBUTES =
  /([\w-]+)(?:=(?:"[^"]*"|'[^']*'|\{(?:[^{}]|\{[^}]*\})*\}))?/g;
const MATCH_FULL_TAG =
  /<\/?([a-zA-Z_][\w-]*)((?:\s+[\w-]+(?:=(?:"[^"]*"|'[^']*'|\{(?:[^{}]|\{[^}]*\})*\}))?)*)\s*\/?>/g;

export const matchTagNameAndAttributes = (text: string) => {
  const match = text.match(MATCH_TAG_AND_ATTRIBUTES);
  if (!match) {
    return null;
  }

  const [, componentName, attributesText] = match;
  const attributes: string[] = [];
  const propMatches = attributesText.matchAll(
    /([\w-]+)(?:=(?:"[^"]*"|'[^']*'|\{(?:[^{}]|\{[^}]*\})*\}))?/g
  );
  for (const match of propMatches) {
    attributes.push(match[1]);
  }
  return { componentName, attributes, attributesText };
};

export const matchLastHalfAttributes = (text: string) => {
  const attributes: string[] = [];
  const propMatches = text.matchAll(MATCH_ATTRIBUTES);
  for (const match of propMatches) {
    attributes.push(match[1]);
  }
  return attributes;
};

export const matchFullTags = (text: string) => {
  const tags: {
    tagName: string;
    attributes: string[];
    index: number;
    isClosing: boolean;
  }[] = [];
  const tagMatches = text.matchAll(MATCH_FULL_TAG);
  for (const match of tagMatches) {
    const fullMatch = match[0];
    const isClosing = fullMatch.startsWith("</");
    const attributes: string[] = [];

    // Only parse attributes for opening tags
    if (!isClosing && match[2]) {
      const propMatches = match[2].matchAll(MATCH_ATTRIBUTES);
      for (const propMatch of propMatches) {
        attributes.push(propMatch[1]);
      }
    }

    tags.push({
      tagName: match[1],
      attributes,
      index: match.index || 0,
      isClosing,
    });
  }
  return tags;
};
