export const STORAGE_KEYS = {
  favorites: 'mikanda-favorites',
  welcome: 'mikanda-welcome-seen',
  bookView: 'bookView',
  progress: 'mikanda-reading-progress',
  theme: 'mikanda-reading-theme',
  fontSize: 'mikanda-reading-font-size',
  width: 'mikanda-reading-width',
  spacing: 'mikanda-reading-spacing',
  immersive: 'mikanda-reading-immersive',
  bookmarks: 'mikanda-bookmarks',
  highlights: 'mikanda-highlights',
  notes: 'mikanda-notes',
  ratings: 'mikanda-ratings',
  comments: 'mikanda-comments',
  commentLikes: 'mikanda-comment-likes',
  user: 'mikanda-user',
  followedAuthors: 'mikanda-followed-authors',
}

export function readJson(key, fallback) {
  try {
    const stored = localStorage.getItem(key)
    return stored ? JSON.parse(stored) : fallback
  } catch {
    return fallback
  }
}

export function writeJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

export function readString(key, fallback = '') {
  try {
    return localStorage.getItem(key) ?? fallback
  } catch {
    return fallback
  }
}

export function writeString(key, value) {
  localStorage.setItem(key, value)
}
