import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { getFavorites, isFavorite as checkFavorite, toggleFavorite as toggleFavoriteService } from '../services/favorites.js'
import { useNotification } from './useNotification.jsx'

const FavoritesContext = createContext(null)

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState(() => getFavorites())
  const notify = useNotification()

  const isFavorite = useCallback((bookId) => checkFavorite(bookId), [favorites])

  const toggleFavorite = useCallback(
    (book) => {
      const added = toggleFavoriteService(book)
      setFavorites(getFavorites())
      if (added) {
        notify.success('Ajouté aux favoris', 2000)
      } else {
        notify.info('Retiré des favoris', 2000)
      }
      return added
    },
    [notify],
  )

  const value = useMemo(
    () => ({
      favorites,
      count: favorites.length,
      isFavorite,
      toggleFavorite,
    }),
    [favorites, isFavorite, toggleFavorite],
  )

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>
}

export function useFavorites() {
  const context = useContext(FavoritesContext)
  if (!context) {
    throw new Error('useFavorites must be used within FavoritesProvider')
  }
  return context
}
