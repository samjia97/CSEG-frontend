/**
 * Returns sorted tagName tagId map of tags in an event
 * @param eventItem
 */
export function getEventTagAndId(eventItem: any): {tagName: string, tagId: number}[] {
  const eventTags: {tagName: string, tagId: number}[] = []
  for (const tagItem of eventItem.event_tags) {
    eventTags.push({
      tagName: tagItem.tagName,
      tagId: tagItem.id as number
    });
  }
  eventTags.sort((a, b) => {
    return a.tagName.localeCompare(b.tagName);
  });
  return eventTags;
}

/**
 * Returns sorted list of tags in an event
 * @param eventItem
 */
export function getEventTags(eventItem: any) {
  const eventTags: string[] = []
  for (const tagItem of eventItem.event_tags) {
    eventTags.push(tagItem.tagName);
  }
  eventTags.sort();
  return eventTags;
}