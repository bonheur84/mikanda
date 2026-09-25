import { setupSearch } from './components/search.js'
import { notification } from './components/notifications.js'
import { setupNavigation, setupSmoothScroll, setupActiveNavigation } from './navigation.js'

function initializeLucideIcons() {
  if (window.lucide && typeof window.lucide.createIcons === 'function') {
    window.lucide.createIcons()
  }
}

function setupAnimations() {
  const animatedElements = document.querySelectorAll('.nav-link, section > div')
  
  animatedElements.forEach((element, index) => {
    element.style.opacity = '0'
    element.style.transform = 'translateY(20px)'
    element.style.transition = 'opacity 0.6s ease, transform 0.6s ease'
    
    setTimeout(() => {
      element.style.opacity = '1'
      element.style.transform = 'translateY(0)'
    }, 100 + (index * 50))
  })
}

function setupScrollEffects() {
  const header = document.querySelector('header')
  if (!header) return
  
  let lastScroll = 0
  
  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset
    
    if (currentScroll > 50) {
      header.classList.add('shadow-md')
    } else {
      header.classList.remove('shadow-md')
    }
    
    if (currentScroll > lastScroll && currentScroll > 100) {
      header.style.transform = 'translateY(-100%)'
      header.style.transition = 'transform 0.3s ease'
    } else {
      header.style.transform = 'translateY(0)'
    }
    
    lastScroll = currentScroll
  })
  
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  }
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const element = entry.target
        element.classList.add('animate-in')
        element.style.opacity = '1'
        element.style.transform = 'translateY(0)'
      }
    })
  }, observerOptions)
  
  const sections = document.querySelectorAll('section, .group')
  sections.forEach(section => {
    section.style.opacity = '0'
    section.style.transform = 'translateY(30px)'
    section.style.transition = 'opacity 0.8s ease, transform 0.8s ease'
    observer.observe(section)
  })
}

function setupButtonAnimations() {
  const buttons = document.querySelectorAll('a, button')
  
  buttons.forEach(button => {
    button.addEventListener('mouseenter', () => {
      button.style.transform = 'scale(1.05)'
      button.style.transition = 'transform 0.2s ease'
    })
    
    button.addEventListener('mouseleave', () => {
      button.style.transform = 'scale(1)'
    })
    
    button.addEventListener('mousedown', () => {
      button.style.transform = 'scale(0.95)'
    })
    
    button.addEventListener('mouseup', () => {
      button.style.transform = 'scale(1.05)'
    })
  })
  
  const bookCards = document.querySelectorAll('.group')
  bookCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.transform = 'translateY(-8px) scale(1.02)'
      card.style.boxShadow = '0 20px 40px rgba(0,0,0,0.15)'
      card.style.transition = 'all 0.3s ease'
    })
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'translateY(0) scale(1)'
      card.style.boxShadow = 'none'
    })
  })
}

function setupFormInteractions() {
  const forms = document.querySelectorAll('form')
  
  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault()
      
      const submitButton = form.querySelector('button[type="submit"]')
      if (submitButton) {
        const originalText = submitButton.textContent
        submitButton.textContent = 'Envoi en cours...'
        submitButton.disabled = true
        
        setTimeout(() => {
          notification.success('Formulaire envoyé avec succès !', 3000)
          submitButton.textContent = originalText
          submitButton.disabled = false
          form.reset()
        }, 1500)
      }
    })
  })
}

function setupFavoriteButtons() {
  const favoriteButtons = document.querySelectorAll('[aria-label*="favoris"], [aria-label*="Ajouter aux favoris"]')
  
  favoriteButtons.forEach(button => {
    button.addEventListener('click', () => {
      const icon = button.querySelector('i')
      if (icon) {
        const isFavorited = icon.getAttribute('data-lucide') === 'heart' && button.classList.contains('text-[#c17248]')
        
        if (isFavorited) {
          icon.setAttribute('data-lucide', 'heart')
          button.classList.remove('text-[#c17248]')
          notification.info('Retiré des favoris', 2000)
        } else {
          icon.setAttribute('data-lucide', 'heart')
          button.classList.add('text-[#c17248]')
          notification.success('Ajouté aux favoris', 2000)
        }
        
        window.lucide?.createIcons()
      }
    })
  })
}

document.addEventListener('DOMContentLoaded', () => {
  console.log('MIKANDA - Site chargé avec succès')
  
  initializeLucideIcons()
  
  setupNavigation()
  setupSmoothScroll()
  setupActiveNavigation()
  
  setupAnimations()
  setupScrollEffects()
  setupButtonAnimations()
  
  setupSearch()
  
  setupFormInteractions()
  setupFavoriteButtons()
  
  setTimeout(() => {
    notification.success('Bienvenue sur MIKANDA !', 4000)
  }, 1500)
})
