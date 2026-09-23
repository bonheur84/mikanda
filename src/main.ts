// ========================================
// DÉFINITIONS DES TYPES
// ========================================

// Interface pour les éléments du DOM
interface DOMElements {
  menuButton: HTMLButtonElement | null
  nav: HTMLElement | null
}

// ========================================
// FONCTIONS UTILITAIRES
// ========================================

/**
 * Initialise les icônes Lucide si disponibles
 */
function initializeLucideIcons(): void {
  if (window.lucide && typeof window.lucide.createIcons === 'function') {
    window.lucide.createIcons()
  }
}

/**
 * Sélectionne les éléments du DOM nécessaires
 */
function selectDOMElements(): DOMElements {
  return {
    menuButton: document.querySelector<HTMLButtonElement>('button.lg:hidden'),
    nav: document.querySelector('nav')
  }
}

/**
 * Bascule les classes CSS pour le menu mobile
 */
function toggleMobileMenu(nav: HTMLElement): void {
  const classesToToggle = [
    'hidden',
    'flex', 
    'flex-col',
    'absolute',
    'top-16',
    'left-0',
    'right-0',
    'bg-[#f8f3e9]',
    'p-4',
    'border',
    'border-[#d9d1c6]'
  ]
  
  classesToToggle.forEach(className => {
    nav.classList.toggle(className)
  })
}

/**
 * Configure le menu mobile
 */
function setupMobileNavigation(elements: DOMElements): void {
  const { menuButton, nav } = elements
  
  if (!menuButton || !nav) {
    console.warn('Éléments de navigation non trouvés')
    return
  }
  
  menuButton.addEventListener('click', () => {
    toggleMobileMenu(nav)
  })
}

// ========================================
// INITIALISATION PRINCIPALE
// ========================================

document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 MIKANDA - Site chargé avec succès')
  
  // 1. Initialiser les icônes
  initializeLucideIcons()
  
  // 2. Sélectionner les éléments
  const elements = selectDOMElements()
  
  // 3. Configurer la navigation
  setupMobileNavigation(elements)
})