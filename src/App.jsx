import { useEffect } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './components/layout/Layout.jsx'
import { NotificationProvider, useNotification } from './hooks/useNotification.jsx'
import { FavoritesProvider } from './hooks/useFavorites.jsx'
import { STORAGE_KEYS, readString, writeString } from './services/storage.js'
import { Home } from './pages/Home.jsx'
import { About } from './pages/About.jsx'
import { Library } from './pages/Library.jsx'
import { Authors } from './pages/Authors.jsx'
import { AuthorDetails } from './pages/AuthorDetails.jsx'
import { Collections } from './pages/Collections.jsx'
import { CollectionDetails } from './pages/CollectionDetails.jsx'
import { BookDetails } from './pages/BookDetails.jsx'
import { Reader } from './pages/Reader.jsx'
import { Favorites } from './pages/Favorites.jsx'
import { Contact } from './pages/Contact.jsx'
import { JoinTeam } from './pages/JoinTeam.jsx'
import { Login } from './pages/Login.jsx'
import { Signup } from './pages/Signup.jsx'
import { NotFound } from './pages/NotFound.jsx'

function WelcomeNotice() {
  const notify = useNotification()

  useEffect(() => {
    if (!readString(STORAGE_KEYS.welcome)) {
      const timer = window.setTimeout(() => {
        notify.success('Bienvenue sur MIKANDA !', 4000)
        writeString(STORAGE_KEYS.welcome, 'true')
      }, 1200)
      return () => window.clearTimeout(timer)
    }
    return undefined
  }, [notify])

  return null
}

export default function App() {
  return (
    <NotificationProvider>
      <FavoritesProvider>
        <WelcomeNotice />
        <BrowserRouter>
          <Routes>
            <Route path="/connexion" element={<Login />} />
            <Route path="/inscription" element={<Signup />} />
            <Route path="/livres/:id/lire" element={<Reader />} />
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/apropos" element={<About />} />
              <Route path="/bibliotheque" element={<Library />} />
              <Route path="/auteurs" element={<Authors />} />
              <Route path="/auteurs/:id" element={<AuthorDetails />} />
              <Route path="/collections" element={<Collections />} />
              <Route path="/collections/:id" element={<CollectionDetails />} />
              <Route path="/livres/:id" element={<BookDetails />} />
              <Route path="/favoris" element={<Favorites />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/rejoindre-equipe" element={<JoinTeam />} />
              <Route path="/biblio.html" element={<Navigate to="/bibliotheque" replace />} />
              <Route path="/login.html" element={<Navigate to="/connexion" replace />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </FavoritesProvider>
    </NotificationProvider>
  )
}
