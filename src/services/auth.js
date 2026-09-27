// ============================================================
// MIKANDA — Service d'authentification (simulation LocalStorage)
//
// ⚠️  ATTENTION SÉCURITÉ :
// Ce module simule une authentification côté frontend uniquement.
// Les mots de passe sont hachés simplement (non sécurisés réellement).
// Ce système DOIT être remplacé par une authentification backend
// (Node.js / Express + JWT + bcrypt + PostgreSQL) en production.
//
// Ne jamais utiliser cette approche pour des données sensibles réelles.
// ============================================================

import { STORAGE_KEYS, readJson, writeJson, removeKey } from './storage.js'

// ---------- Utilitaires internes ----------------------------

/**
 * Hachage minimal (non cryptographique) — simulation uniquement.
 * En production, utiliser bcrypt côté serveur.
 */
function hashPassword(password) {
  // Simple obfuscation : NE PAS utiliser en production
  return btoa(encodeURIComponent(password + '_mikanda_salt'))
}

function verifyPassword(password, hash) {
  return hashPassword(password) === hash
}

function generateId() {
  return `user_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
}

// ---------- Compte administrateur ---------------------------

/**
 * Crée automatiquement un compte admin par défaut dans LocalStorage
 * si aucun compte admin n'existe encore.
 *
 * ⚠️ DÉMO UNIQUEMENT — Remplacer par un vrai backend en production.
 * Email : admin@mikanda.cd | Mot de passe : Admin2024!
 */
export function ensureAdminAccount() {
  const users = readJson(STORAGE_KEYS.users, [])
  const adminExists = users.some((u) => u.isAdmin)
  if (!adminExists) {
    const admin = {
      id: 'admin_default',
      firstName: 'Admin',
      lastName: 'MIKANDA',
      email: 'admin@mikanda.cd',
      passwordHash: hashPassword('Admin2024!'),
      isAdmin: true,
      isActive: true,
      createdAt: new Date().toISOString(),
      loginMethod: 'email',
      avatar: null,
      bio: 'Administrateur de la bibliothèque MIKANDA',
    }
    writeJson(STORAGE_KEYS.users, [admin])
    console.info(
      '[MIKANDA] Compte admin créé (DÉMO — non sécurisé pour la production)\n' +
      'Email : admin@mikanda.cd\nMot de passe : Admin2024!'
    )
  }
}

// ---------- Authentification utilisateur --------------------

/**
 * Connexion d'un utilisateur.
 * Retourne l'utilisateur connecté ou lance une erreur.
 */
export function loginUser({ email, password }) {
  const users = readJson(STORAGE_KEYS.users, [])
  const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase())

  if (!user) throw new Error('Aucun compte trouvé avec cet email.')
  if (!user.isActive) throw new Error('Ce compte a été désactivé.')
  if (!verifyPassword(password, user.passwordHash)) {
    throw new Error('Mot de passe incorrect.')
  }

  const session = {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    isAdmin: user.isAdmin || false,
    avatar: user.avatar || null,
    loginMethod: user.loginMethod || 'email',
    createdAt: user.createdAt,
    loggedInAt: new Date().toISOString(),
  }

  writeJson(STORAGE_KEYS.user, session)
  return session
}

/**
 * Inscription d'un nouvel utilisateur.
 * Retourne l'utilisateur créé ou lance une erreur.
 */
export function registerUser({ firstName, lastName, email, password }) {
  const users = readJson(STORAGE_KEYS.users, [])
  const exists = users.some((u) => u.email.toLowerCase() === email.toLowerCase())
  if (exists) throw new Error('Un compte existe déjà avec cet email.')

  const newUser = {
    id: generateId(),
    firstName: firstName.trim(),
    lastName: lastName.trim(),
    email: email.toLowerCase().trim(),
    passwordHash: hashPassword(password),
    isAdmin: false,
    isActive: true,
    createdAt: new Date().toISOString(),
    loginMethod: 'email',
    avatar: null,
    bio: '',
  }

  users.push(newUser)
  writeJson(STORAGE_KEYS.users, users)

  // Connecter directement après inscription
  const session = {
    id: newUser.id,
    firstName: newUser.firstName,
    lastName: newUser.lastName,
    email: newUser.email,
    isAdmin: false,
    avatar: null,
    loginMethod: 'email',
    createdAt: newUser.createdAt,
    loggedInAt: new Date().toISOString(),
  }
  writeJson(STORAGE_KEYS.user, session)
  return session
}

/**
 * Déconnexion de l'utilisateur courant.
 */
export function logoutUser() {
  removeKey(STORAGE_KEYS.user)
}

/**
 * Retourne l'utilisateur actuellement connecté (ou null).
 */
export function getCurrentUser() {
  return readJson(STORAGE_KEYS.user, null)
}

/**
 * Vérifie si l'utilisateur courant est admin.
 */
export function isCurrentUserAdmin() {
  const user = getCurrentUser()
  return user?.isAdmin === true
}

// ---------- Profil utilisateur ------------------------------

/**
 * Mise à jour du profil de l'utilisateur courant.
 */
export function updateUserProfile({ firstName, lastName, bio, avatar }) {
  const session = getCurrentUser()
  if (!session) throw new Error('Aucun utilisateur connecté.')

  // Mettre à jour dans la liste des utilisateurs
  const users = readJson(STORAGE_KEYS.users, [])
  const index = users.findIndex((u) => u.id === session.id)
  if (index !== -1) {
    if (firstName !== undefined) users[index].firstName = firstName.trim()
    if (lastName !== undefined) users[index].lastName = lastName.trim()
    if (bio !== undefined) users[index].bio = bio
    if (avatar !== undefined) users[index].avatar = avatar
    writeJson(STORAGE_KEYS.users, users)
  }

  // Mettre à jour la session courante
  const updatedSession = {
    ...session,
    firstName: firstName ?? session.firstName,
    lastName: lastName ?? session.lastName,
    avatar: avatar ?? session.avatar,
  }
  writeJson(STORAGE_KEYS.user, updatedSession)
  return updatedSession
}

// ---------- Gestion Google OAuth (préparé pour le futur) ----

/**
 * Connexion via Google OAuth (préparé pour intégration future).
 *
 * ⚠️ Cette fonction ne simule pas une authentification Google réelle.
 * Elle est prête à recevoir les données retournées par le serveur OAuth.
 *
 * Pour l'intégrer :
 *   1. Configurer VITE_GOOGLE_CLIENT_ID dans .env
 *   2. Implémenter le flow OAuth côté backend (Node.js)
 *   3. Appeler cette fonction avec les données utilisateur retournées
 *
 * @param {Object} googleProfile - Données retournées par Google OAuth
 * @param {string} googleProfile.googleId - ID unique Google
 * @param {string} googleProfile.email
 * @param {string} googleProfile.firstName
 * @param {string} googleProfile.lastName
 * @param {string} googleProfile.avatar - URL photo de profil Google
 */
export function loginWithGoogle(googleProfile) {
  const users = readJson(STORAGE_KEYS.users, [])
  let user = users.find(
    (u) => u.googleId === googleProfile.googleId || u.email === googleProfile.email
  )

  if (!user) {
    user = {
      id: generateId(),
      ...googleProfile,
      passwordHash: null,
      isAdmin: false,
      isActive: true,
      createdAt: new Date().toISOString(),
      loginMethod: 'google',
    }
    users.push(user)
    writeJson(STORAGE_KEYS.users, users)
  }

  const session = {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    isAdmin: user.isAdmin || false,
    avatar: user.avatar || googleProfile.avatar,
    loginMethod: 'google',
    createdAt: user.createdAt,
    loggedInAt: new Date().toISOString(),
  }

  writeJson(STORAGE_KEYS.user, session)
  return session
}

// ---------- Suivi des auteurs -------------------------------

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

// ---------- Administration ----------------------------------

/**
 * Retourne tous les utilisateurs (usage admin uniquement).
 */
export function getAllUsers() {
  return readJson(STORAGE_KEYS.users, [])
}

/**
 * Active ou désactive un utilisateur (usage admin).
 */
export function toggleUserStatus(userId) {
  const users = readJson(STORAGE_KEYS.users, [])
  const index = users.findIndex((u) => u.id === userId)
  if (index !== -1) {
    users[index].isActive = !users[index].isActive
    writeJson(STORAGE_KEYS.users, users)
  }
  return users
}

/**
 * Supprime un utilisateur (usage admin). Ne peut pas supprimer un admin.
 */
export function deleteUser(userId) {
  const users = readJson(STORAGE_KEYS.users, [])
  const filtered = users.filter((u) => u.id !== userId || u.isAdmin)
  writeJson(STORAGE_KEYS.users, filtered)
  return filtered
}
