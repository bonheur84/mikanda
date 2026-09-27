import { useEffect } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './components/layout/Layout.jsx'
import { NotificationProvider, useNotification } from './hooks/useNotification.jsx'
import { FavoritesProvider } from './hooks/useFavorites.jsx'
import { STORAGE_KEYS, readString, writeString } from './services/storage.js'
import { AuthProvider } from './context/AuthContext.jsx'
import { ProtectedRoute, AdminRoute } from './components/auth/ProtectedRoute.jsx'

// Pages Publiques
import { Home } from './pages/Home.jsx'
import { About } from './pages/About.jsx'
import { Library } from './pages/Library.jsx'
import { Authors } from './pages/Authors.jsx'
import { AuthorDetails } from './pages/AuthorDetails.jsx'
import { Collections } from './pages/Collections.jsx'
import { CollectionDetails } from './pages/CollectionDetails.jsx'
import { BookDetails } from './pages/BookDetails.jsx'
import { Reader } from './pages/Reader.jsx'
import { Contact } from './pages/Contact.jsx'
import { JoinTeam } from './pages/JoinTeam.jsx'
import { Login } from './pages/Login.jsx'
import { Signup } from './pages/Signup.jsx'
import { NotFound } from './pages/NotFound.jsx'

// Pages Protégées (Utilisateur)
import { Profile } from './pages/Profile.jsx'
import { Favorites } from './pages/Favorites.jsx'

// Pages Administrateur
import { AdminLayout } from './admin/layouts/AdminLayout.jsx'
import { AdminDashboard } from './admin/pages/AdminDashboard.jsx'
import { AdminBooks } from './admin/pages/AdminBooks.jsx'
import { AdminAuthors } from './admin/pages/AdminAuthors.jsx'
import { AdminCollections } from './admin/pages/AdminCollections.jsx'
import { AdminUsers } from './admin/pages/AdminUsers.jsx'
import { AdminComments } from './admin/pages/AdminComments.jsx'
import { AdminMessages } from './admin/pages/AdminMessages.jsx'
import { AdminStatistics } from './admin/pages/AdminStatistics.jsx'
import { AdminActivity } from './admin/pages/AdminActivity.jsx'
import { AdminSettings } from './admin/pages/AdminSettings.jsx'

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
      <AuthProvider>
        <FavoritesProvider>
          <WelcomeNotice />
          <BrowserRouter>
            <Routes>
              {/* Authentification */}
              <Route path="/connexion" element={<Login />} />
              <Route path="/inscription" element={<Signup />} />
              
              {/* Lecteur (accessible publiquement mais certaines actions requièrent d'être connecté) */}
              <Route path="/livres/:id/lire" element={<Reader />} />
              
              {/* Layout principal (Front) */}
              <Route element={<Layout />}>
                <Route path="/" element={<Home />} />
                <Route path="/apropos" element={<About />} />
                <Route path="/bibliotheque" element={<Library />} />
                <Route path="/auteurs" element={<Authors />} />
                <Route path="/auteurs/:id" element={<AuthorDetails />} />
                <Route path="/collections" element={<Collections />} />
                <Route path="/collections/:id" element={<CollectionDetails />} />
                <Route path="/livres/:id" element={<BookDetails />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/rejoindre-equipe" element={<JoinTeam />} />
                
                {/* Routes Protégées Utilisateur */}
                <Route path="/profil" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                <Route path="/favoris" element={<ProtectedRoute><Favorites /></ProtectedRoute>} />
                
                {/* Redirections legacy */}
                <Route path="/biblio.html" element={<Navigate to="/bibliotheque" replace />} />
                <Route path="/login.html" element={<Navigate to="/connexion" replace />} />
                
                {/* 404 front */}
                <Route path="*" element={<NotFound />} />
              </Route>
              
              {/* Espace d'Administration */}
              <Route path="/admin/login" element={<Navigate to="/connexion" replace />} />
              
              <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
                <Route index element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="books" element={<AdminBooks />} />
                <Route path="authors" element={<AdminAuthors />} />
                <Route path="collections" element={<AdminCollections />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="comments" element={<AdminComments />} />
                <Route path="messages" element={<AdminMessages />} />
                <Route path="statistics" element={<AdminStatistics />} />
                <Route path="activity" element={<AdminActivity />} />
                <Route path="settings" element={<AdminSettings />} />
                <Route path="*" element={<NotFound />} />
              </Route>

            </Routes>
          </BrowserRouter>
        </FavoritesProvider>
      </AuthProvider>
    </NotificationProvider>
  )
}
