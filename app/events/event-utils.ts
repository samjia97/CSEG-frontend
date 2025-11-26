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