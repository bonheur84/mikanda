function showNotification(options) {
  const {
    message,
    type = 'info',
    duration = 3000,
    position = 'top'
  } = options
  
  const container = getOrCreateNotificationContainer(position)
  const notification = createNotificationElement(message, type)
  
  container.appendChild(notification)
  
  requestAnimationFrame(() => {
    notification.classList.add('show')
  })
  
  setTimeout(() => {
    notification.classList.remove('show')
    notification.classList.add('hide')
    
    setTimeout(() => {
      notification.remove()
    }, 300)
  }, duration)
}

function getOrCreateNotificationContainer(position) {
  let container = document.getElementById(`notification-container-${position}`)
  
  if (!container) {
    container = document.createElement('div')
    container.id = `notification-container-${position}`
    container.className = `fixed ${getPositionClasses(position)} z-50 flex flex-col gap-2 pointer-events-none`
    document.body.appendChild(container)
  }
  
  return container
}

function getPositionClasses(position) {
  const positions = {
    'top': 'top-4 left-1/2 -translate-x-1/2',
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4'
  }
  return positions[position] || positions['top']
}

function createNotificationElement(message, type) {
  const notification = document.createElement('div')
  notification.className = `notification pointer-events-auto min-w-80 max-w-md p-4 rounded-lg shadow-lg flex items-start gap-3 transition-all duration-300 transform translate-x-full opacity-0 ${getTypeClasses(type)}`
  
  const icon = getIconForType(type)
  
  notification.innerHTML = `
    <div class="flex-shrink-0">
      ${icon}
    </div>
    <div class="flex-1">
      <p class="text-sm font-medium">${message}</p>
    </div>
    <button class="flex-shrink-0 text-current opacity-60 hover:opacity-100 transition-opacity" onclick="this.parentElement.remove()">
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
      </svg>
    </button>
  `
  
  return notification
}

function getTypeClasses(type) {
  const types = {
    success: 'bg-green-50 text-green-800 border border-green-200',
    error: 'bg-red-50 text-red-800 border border-red-200',
    warning: 'bg-yellow-50 text-yellow-800 border border-yellow-200',
    info: 'bg-blue-50 text-blue-800 border border-blue-200'
  }
  return types[type]
}

function getIconForType(type) {
  const icons = {
    success: `<svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
    </svg>`,
    error: `<svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
    </svg>`,
    warning: `<svg class="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
    </svg>`,
    info: `<svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
    </svg>`
  }
  return icons[type]
}

export const notification = {
  success: (message, duration) => showNotification({ message, type: 'success', duration }),
  error: (message, duration) => showNotification({ message, type: 'error', duration }),
  warning: (message, duration) => showNotification({ message, type: 'warning', duration }),
  info: (message, duration) => showNotification({ message, type: 'info', duration })
}
