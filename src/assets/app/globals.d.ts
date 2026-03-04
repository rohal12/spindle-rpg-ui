import type { StoryAPI } from '@rohal12/spindle';

declare global {
  interface Window {
    Story: StoryAPI;
  }
}
