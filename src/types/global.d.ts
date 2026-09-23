// Définitions globales pour les bibliothèques externes
declare global {
  interface Window {
    lucide?: {
      createIcons: () => void
    }
  }
}

export {}