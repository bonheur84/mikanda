export function setupNavigation() {
  const menuButton = document.querySelector('#menu-button')
  const mobileMenu = document.getElementById('mobile-menu')
  
  if (!menuButton || !mobileMenu) {
    console.warn('Éléments de navigation non trouvés')
    return
  }
  
  let isMenuOpen = false
  
  menuButton.addEventListener('click', () => {
    isMenuOpen = !isMenuOpen
    mobileMenu.classList.toggle('hidden')
    
    const icon = menuButton.querySelector('i')
    if (icon) {
      icon.setAttribute('data-lucide', isMenuOpen ? 'x' : 'menu')
      window.lucide?.createIcons()
    }
  })
  
  const mobileLinks = mobileMenu.querySelectorAll('a')
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.add('hidden')
      isMenuOpen = false
      const icon = menuButton.querySelector('i')
      if (icon) {
        icon.setAttribute('data-lucide', 'menu')
        window.lucide?.createIcons()
      }
    })
  })
}

export function setupSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault()
      const target = document.querySelector(this.getAttribute('href'))
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        })
      }
    })
  })
}

export function setupActiveNavigation() {
  const currentPath = window.location.pathname
  const navLinks = document.querySelectorAll('nav a')
  
  navLinks.forEach(link => {
    const linkPath = new URL(link.href).pathname
    if (linkPath === currentPath) {
      link.classList.add('text-[#133a28]', 'font-medium')
    }
  })
}
