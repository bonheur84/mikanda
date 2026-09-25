import { STORAGE_KEYS, readJson, writeJson } from './storage.js'

export function getCurrentUser() {
  return readJson(STORAGE_KEYS.user, null)
}

export function loginUser({ email, name }) {
  const user = {
    email,
    name: name || email.split('@')[0],
    loggedInAt: new Date().toISOString(),
  }
  writeJson(STORAGE_KEYS.user, user)
  return user
}

export function logoutUser() {
  localStorage.removeItem(STORAGE_KEYS.user)
}

export function registerUser({ firstName, lastName, email }) {
  return loginUser({
    email,
    name: `${firstName} ${lastName}`.trim(),
  })
}

export function getFollowedAuthors() {
  return readJson(STORAGE_KEYS.followedAuthors, [])
}

export function toggleFollowAuthor(authorId) {
  const followed = getFollowedAuthors()
  const index = followed.indexOf(authorId)
  if (index === -1) {
    followed.push(authorId)
  } else {
    followed.splice(index, 1)
  }
  writeJson(STORAGE_KEYS.followedAuthors, followed)
  return followed.includes(authorId)
}
