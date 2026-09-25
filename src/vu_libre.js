const RATING_KEY = 'mikanda-ratings'
const COMMENTS_KEY = 'mikanda-comments'
const COMMENT_LIKES_KEY = 'mikanda-comment-likes'
const BOOK_ID = 'book-1'

function getBookId() {
  const pathParts = window.location.pathname.split('/')
  const fileName = pathParts[pathParts.length - 1]
  return fileName || 'book-1'
}

function showNotification(message, type = 'success') {
  const container = document.getElementById('notification-container-top')
  
  if (!container) {
    const newContainer = document.createElement('div')
    newContainer.id = 'notification-container-top'
    newContainer.className = 'fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none'
    document.body.appendChild(newContainer)
  }
  
  const notification = document.createElement('div')
  const bgColor = type === 'success' ? 'bg-green-50 text-green-800 border-green-200' : 
                   type === 'error' ? 'bg-red-50 text-red-800 border-red-200' : 
                   'bg-blue-50 text-blue-800 border-blue-200'
  
  notification.className = `notification pointer-events-auto min-w-80 max-w-md p-4 rounded-lg shadow-lg flex items-start gap-3 transition-all duration-300 transform translate-x-full opacity-0 border ${bgColor}`
  
  notification.innerHTML = `
    <div class="flex-1">
      <p class="text-sm font-medium">${message}</p>
    </div>
    <button class="flex-shrink-0 text-current opacity-60 hover:opacity-100 transition-opacity" onclick="this.parentElement.remove()">
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
      </svg>
    </button>
  `
  
  document.getElementById('notification-container-top').appendChild(notification)
  
  requestAnimationFrame(() => {
    notification.classList.add('show')
    notification.classList.remove('translate-x-full', 'opacity-0')
  })
  
  setTimeout(() => {
    notification.classList.add('translate-x-full', 'opacity-0')
    setTimeout(() => {
      notification.remove()
    }, 300)
  }, 3000)
}

function openShareModal() {
  if (navigator.share) {
    navigator.share({
      title: document.title,
      text: 'Découvrez ce livre sur MIKANDA',
      url: window.location.href
    }).catch(() => {
      showShareModal()
    })
  } else {
    showShareModal()
  }
}

function showShareModal() {
  const existingModal = document.getElementById('share-modal')
  if (existingModal) {
    existingModal.remove()
  }
  
  const modal = document.createElement('div')
  modal.id = 'share-modal'
  modal.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black/50 opacity-0 transition-opacity duration-300'
  
  modal.innerHTML = `
    <div class="bg-white rounded-lg shadow-xl max-w-sm w-full mx-4 transform scale-95 transition-transform duration-300">
      <div class="p-6">
        <h3 class="font-serif text-xl text-[#281e19] mb-4">Partager ce livre</h3>
        <div class="space-y-2">
          <a href="https://wa.me/?text=${encodeURIComponent('Découvrez ce livre sur MIKANDA: ' + window.location.href)}" target="_blank" class="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
            <svg class="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            <span class="text-sm text-[#281e19]">WhatsApp</span>
          </a>
          <a href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}" target="_blank" class="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
            <svg class="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            <span class="text-sm text-[#281e19]">Facebook</span>
          </a>
          <a href="https://twitter.com/intent/tweet?text=${encodeURIComponent('Découvrez ce livre sur MIKANDA: ' + window.location.href)}" target="_blank" class="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
            <svg class="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            <span class="text-sm text-[#281e19]">X / Twitter</span>
          </a>
          <button id="copy-link-btn" class="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors w-full text-left">
            <svg class="w-5 h-5 text-[#281e19]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
            <span class="text-sm text-[#281e19]">Copier le lien</span>
          </button>
        </div>
        <button id="close-share-modal" class="mt-4 w-full py-2 text-sm text-[#705f57] hover:text-[#281e19] transition-colors">Fermer</button>
      </div>
    </div>
  `
  
  document.body.appendChild(modal)
  
  requestAnimationFrame(() => {
    modal.classList.remove('opacity-0')
    modal.querySelector('div').classList.remove('scale-95')
  })
  
  document.getElementById('close-share-modal').addEventListener('click', closeShareModal)
  document.getElementById('copy-link-btn').addEventListener('click', copyBookLink)
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeShareModal()
  })
  document.addEventListener('keydown', handleEscapeKey)
}

function closeShareModal() {
  const modal = document.getElementById('share-modal')
  if (modal) {
    modal.classList.add('opacity-0')
    modal.querySelector('div').classList.add('scale-95')
    setTimeout(() => {
      modal.remove()
    }, 300)
    document.removeEventListener('keydown', handleEscapeKey)
  }
}

function handleEscapeKey(e) {
  if (e.key === 'Escape') closeShareModal()
}

function copyBookLink() {
  navigator.clipboard.writeText(window.location.href).then(() => {
    showNotification('Lien copié')
    closeShareModal()
  }).catch(() => {
    showNotification('Impossible de copier le lien', 'error')
  })
}

function setupRatingSystem() {
  const bookId = getBookId()
  const ratingInputs = document.querySelectorAll('input[name="rating"]')
  const ratingLabels = document.querySelectorAll('label')
  
  const savedRating = getRating(bookId)
  if (savedRating) {
    updateStarsDisplay(savedRating)
    ratingInputs.forEach(input => {
      if (parseInt(input.value) === savedRating) {
        input.checked = true
      }
    })
  }
  
  ratingLabels.forEach((label, index) => {
    const input = label.querySelector('input[type="radio"]')
    if (!input || input.name !== 'rating') return
    
    label.addEventListener('mouseenter', () => {
      updateStarsDisplay(index + 1)
    })
    
    label.addEventListener('mouseleave', () => {
      const checkedInput = document.querySelector('input[name="rating"]:checked')
      if (checkedInput) {
        updateStarsDisplay(parseInt(checkedInput.value))
      } else {
        updateStarsDisplay(0)
      }
    })
    
    label.addEventListener('click', () => {
      const rating = parseInt(input.value)
      saveRating(bookId, rating)
      showNotification(`Votre note de ${rating} étoile${rating > 1 ? 's' : ''} a été enregistrée`)
    })
  })
}

function updateStarsDisplay(count) {
  const ratingInputs = document.querySelectorAll('input[name="rating"]')
  ratingInputs.forEach((input, index) => {
    const label = input.parentElement
    const icon = label.querySelector('i, svg')
    if (!icon) return
    
    if (index < count) {
      icon.classList.add('text-[#c17248]')
      icon.classList.remove('text-[#d9d1c6]')
    } else {
      icon.classList.remove('text-[#c17248]')
      icon.classList.add('text-[#d9d1c6]')
    }
  })
}

function getRating(bookId) {
  try {
    const ratings = JSON.parse(localStorage.getItem(RATING_KEY) || '{}')
    return ratings[bookId]
  } catch {
    return null
  }
}

function saveRating(bookId, rating) {
  try {
    const ratings = JSON.parse(localStorage.getItem(RATING_KEY) || '{}')
    ratings[bookId] = rating
    localStorage.setItem(RATING_KEY, JSON.stringify(ratings))
  } catch {
    showNotification('Impossible de sauvegarder la note', 'error')
  }
}

function setupCommentSystem() {
  const form = document.querySelector('form[action="."]')
  if (!form) return
  
  form.addEventListener('submit', (e) => {
    e.preventDefault()
    
    const commentInput = document.getElementById('comment')
    const comment = commentInput.value.trim()
    
    if (!comment) {
      showNotification('Veuillez écrire un commentaire', 'error')
      return
    }
    
    const checkedInput = document.querySelector('input[name="rating"]:checked')
    const rating = checkedInput ? parseInt(checkedInput.value) : null
    
    if (!rating) {
      showNotification('Veuillez sélectionner une note', 'error')
      return
    }
    
    const bookId = getBookId()
    const replyToId = form.dataset.replyToId
    
    saveComment(bookId, comment, rating, replyToId)
    
    commentInput.value = ''
    checkedInput.checked = false
    updateStarsDisplay(0)
    
    if (form.dataset.originalPlaceholder) {
      commentInput.placeholder = form.dataset.originalPlaceholder
      delete form.dataset.originalPlaceholder
    }
    
    if (replyToId) {
      delete form.dataset.replyToId
      const replyCancelButton = document.getElementById('cancel-reply')
      if (replyCancelButton) replyCancelButton.remove()
    }
    
    showNotification('Commentaire envoyé')
    
    renderComments()
    updateCommentCount()
  })
  
  renderComments()
  setupCommentFilter()
}

function saveComment(bookId, comment, rating, parentCommentId = null) {
  try {
    const comments = JSON.parse(localStorage.getItem(COMMENTS_KEY) || '{}')
    
    if (!comments[bookId]) {
      comments[bookId] = []
    }
    
    const newComment = {
      id: `comment-${Date.now()}`,
      text: comment,
      rating: rating,
      parentId: parentCommentId,
      likes: 0,
      dislikes: 0,
      date: new Date().toISOString()
    }
    
    comments[bookId].unshift(newComment)
    localStorage.setItem(COMMENTS_KEY, JSON.stringify(comments))
    
    saveRating(bookId, rating)
  } catch {
    showNotification('Impossible d\'envoyer le commentaire', 'error')
  }
}

function getComments(bookId) {
  try {
    const comments = JSON.parse(localStorage.getItem(COMMENTS_KEY) || '{}')
    return comments[bookId] || []
  } catch {
    return []
  }
}

function renderComments() {
  const bookId = getBookId()
  const comments = getComments(bookId)
  const commentsSection = document.getElementById('commentaires')
  
  if (!commentsSection) return
  
  const existingUserComments = commentsSection.querySelectorAll('article[id^="comment-"]')
  existingUserComments.forEach(el => el.remove())
  
  const headings = commentsSection.querySelectorAll('h3')
  const readerReviewsHeading = Array.from(headings).find(h => h.textContent.includes('lecteurs'))
  
  if (!readerReviewsHeading) return
  
  const topLevelComments = comments.filter(c => !c.parentId)
  
  topLevelComments.forEach(comment => {
    const date = new Date(comment.date)
    const timeAgo = getTimeAgo(date)
    const ratingStars = comment.rating ? '★'.repeat(comment.rating) + '☆'.repeat(5 - comment.rating) : ''
    const replies = comments.filter(c => c.parentId === comment.id)
    
    const commentHTML = `
      <article id="${comment.id}" class="flex gap-4 py-6 sm:gap-5">
        <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#133a28] font-serif text-base text-white">V</div>
        <div class="min-w-0 flex-1">
          <div class="flex flex-wrap items-center gap-x-3 gap-y-1">
            <h4 class="text-sm font-semibold">Vous</h4>
            <span class="text-[11px] text-[#8f7770]">${timeAgo}</span>
            ${ratingStars ? `<span class="text-xs tracking-widest text-[#b7924b]" aria-label="${comment.rating} étoiles">${ratingStars}</span>` : ''}
          </div>
          <p class="mt-3 max-w-3xl text-sm leading-7 text-[#705f57]">${comment.text}</p>
          <div class="mt-3 flex items-center gap-4">
            <button class="like-btn flex items-center gap-1 text-[11px] text-[#8f7770] hover:text-[#b7924b] transition-colors" data-comment-id="${comment.id}">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 10h4.764a2 2 0 011.789 2.894l-6.783 6.783a2 2 0 01-2.894 0l-6.783-6.783a2 2 0 010-2.894L14 10z"></path></svg>
              <span class="like-count">${comment.likes || 0}</span>
            </button>
            <button class="dislike-btn flex items-center gap-1 text-[11px] text-[#8f7770] hover:text-[#b7924b] transition-colors" data-comment-id="${comment.id}">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14H5.236a2 2 0 01-1.789-2.894l6.783-6.783a2 2 0 012.894 0l6.783 6.783a2 2 0 010 2.894L10 14z"></path></svg>
              <span class="dislike-count">${comment.dislikes || 0}</span>
            </button>
            <button class="reply-btn text-[11px] text-[#8f7770] hover:text-[#133a28] transition-colors" data-comment-id="${comment.id}">
              Répondre
            </button>
            <button class="delete-comment-btn text-[11px] text-[#8f7770] hover:text-red-500 transition-colors" data-comment-id="${comment.id}">
              Supprimer
            </button>
          </div>
        </div>
      </article>
    `
    
    readerReviewsHeading.parentElement.insertAdjacentHTML('afterend', commentHTML)
    
    if (replies.length > 0) {
      renderCommentReplies(comment.id, replies)
    }
  })
  
  document.querySelectorAll('.delete-comment-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const commentId = btn.dataset.commentId
      deleteComment(commentId)
    })
  })
  
  document.querySelectorAll('.like-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const commentId = btn.dataset.commentId
      toggleCommentLike(commentId, 'like')
    })
  })
  
  document.querySelectorAll('.dislike-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const commentId = btn.dataset.commentId
      toggleCommentLike(commentId, 'dislike')
    })
  })
  
  document.querySelectorAll('.reply-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const commentId = btn.dataset.commentId
      showReplyForm(commentId)
    })
  })
  
  updateCommentLikeCounts()
}

function getTimeAgo(date) {
  const seconds = Math.floor((new Date() - date) / 1000)
  
  if (seconds < 60) return 'À l\'instant'
  if (seconds < 3600) return `Il y a ${Math.floor(seconds / 60)} min`
  if (seconds < 86400) return `Il y a ${Math.floor(seconds / 3600)} h`
  if (seconds < 604800) return `Il y a ${Math.floor(seconds / 86400)} j`
  
  return date.toLocaleDateString('fr-FR')
}

function deleteComment(commentId) {
  const bookId = getBookId()
  
  try {
    const comments = JSON.parse(localStorage.getItem(COMMENTS_KEY) || '{}')
    
    if (comments[bookId]) {
      comments[bookId] = comments[bookId].filter(c => c.id !== commentId && c.parentId !== commentId)
      localStorage.setItem(COMMENTS_KEY, JSON.stringify(comments))
      
      const commentElement = document.getElementById(commentId)
      if (commentElement) {
        const repliesContainer = commentElement.nextElementSibling
        if (repliesContainer && repliesContainer.classList.contains('replies-container')) {
          repliesContainer.remove()
        }
        commentElement.remove()
      }
      
      updateCommentCount()
      showNotification('Commentaire supprimé')
    }
  } catch {
    showNotification('Impossible de supprimer le commentaire', 'error')
  }
}

function setupCommentFilter() {
  const sortButton = document.querySelector('#commentaires button[type="button"]')
  if (!sortButton) return
  
  sortButton.addEventListener('click', () => {
    const bookId = getBookId()
    const comments = getComments(bookId)
    
    const currentSort = sortButton.dataset.sort || 'recent'
    const newSort = currentSort === 'recent' ? 'oldest' : 'recent'
    
    if (newSort === 'oldest') {
      comments.sort((a, b) => new Date(a.date) - new Date(b.date))
    } else {
      comments.sort((a, b) => new Date(b.date) - new Date(a.date))
    }
    
    localStorage.setItem(COMMENTS_KEY, JSON.stringify({ [bookId]: comments }))
    
    sortButton.dataset.sort = newSort
    sortButton.innerHTML = `Trier : ${newSort === 'recent' ? 'plus récents' : 'plus anciens'} <i data-lucide="chevron-down" class="inline h-3 w-3"></i>`
    
    window.lucide.createIcons()
    renderComments()
  })
}

function toggleCommentLike(commentId, type) {
  const bookId = getBookId()
  
  try {
    const likes = JSON.parse(localStorage.getItem(COMMENT_LIKES_KEY) || '{}')
    const key = `${bookId}-${commentId}`
    
    if (!likes[key]) {
      likes[key] = { like: false, dislike: false }
    }
    
    if (type === 'like') {
      if (likes[key].like) {
        likes[key].like = false
      } else {
        likes[key].like = true
        likes[key].dislike = false
      }
    } else {
      if (likes[key].dislike) {
        likes[key].dislike = false
      } else {
        likes[key].dislike = true
        likes[key].like = false
      }
    }
    
    localStorage.setItem(COMMENT_LIKES_KEY, JSON.stringify(likes))
    
    updateCommentLikeCounts()
  } catch {
    showNotification('Impossible de mettre à jour', 'error')
  }
}

function getCommentLikeCounts(bookId, commentId) {
  try {
    const likes = JSON.parse(localStorage.getItem(COMMENT_LIKES_KEY) || '{}')
    const key = `${bookId}-${commentId}`
    const userLike = likes[key] || { like: false, dislike: false }
    
    const comments = getComments(bookId)
    const comment = comments.find(c => c.id === commentId)
    
    return {
      userLike: userLike.like,
      userDislike: userLike.dislike,
      likes: comment ? comment.likes : 0,
      dislikes: comment ? comment.dislikes : 0
    }
  } catch {
    return { userLike: false, userDislike: false, likes: 0, dislikes: 0 }
  }
}

function updateCommentLikeCounts() {
  const bookId = getBookId()
  const likeButtons = document.querySelectorAll('.like-btn, .dislike-btn')
  
  likeButtons.forEach(btn => {
    const commentId = btn.dataset.commentId
    const counts = getCommentLikeCounts(bookId, commentId)
    
    if (btn.classList.contains('like-btn')) {
      if (counts.userLike) {
        btn.classList.add('text-[#b7924b]')
        btn.classList.remove('text-[#8f7770]')
      } else {
        btn.classList.remove('text-[#b7924b]')
        btn.classList.add('text-[#8f7770]')
      }
    } else {
      if (counts.userDislike) {
        btn.classList.add('text-[#b7924b]')
        btn.classList.remove('text-[#8f7770]')
      } else {
        btn.classList.remove('text-[#b7924b]')
        btn.classList.add('text-[#8f7770]')
      }
    }
  })
}

function showReplyForm(commentId) {
  const form = document.querySelector('form[action="."]')
  if (!form) return
  
  form.dataset.replyToId = commentId
  form.dataset.originalPlaceholder = form.querySelector('#comment').placeholder
  
  const commentElement = document.getElementById(commentId)
  const existingCancelButton = document.getElementById('cancel-reply')
  if (existingCancelButton) existingCancelButton.remove()
  
  const commentInput = document.getElementById('comment')
  commentInput.placeholder = 'Écrivez votre réponse...'
  
  const cancelButton = document.createElement('button')
  cancelButton.id = 'cancel-reply'
  cancelButton.type = 'button'
  cancelButton.className = 'mt-2 text-xs text-[#705f57] hover:text-[#281e19] transition-colors'
  cancelButton.textContent = 'Annuler la réponse'
  
  cancelButton.addEventListener('click', () => {
    delete form.dataset.replyToId
    delete form.dataset.originalPlaceholder
    commentInput.placeholder = 'Écrivez quelques lignes sur votre lecture...'
    cancelButton.remove()
  })
  
  form.insertBefore(cancelButton, form.firstChild)
  
  commentElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
  commentInput.focus()
  
  showNotification('Répondez à ce commentaire')
}

function renderCommentReplies(commentId, replies) {
  const commentElement = document.getElementById(commentId)
  if (!commentElement) return
  
  const existingReplies = commentElement.nextElementSibling?.classList.contains('replies-container')
  if (existingReplies) {
    existingReplies.remove()
  }
  
  if (replies.length === 0) return
  
  const repliesHTML = `
    <div class="replies-container ml-12 mt-4 space-y-4 border-l-2 border-[#d9d1c6] pl-4">
      ${replies.map(reply => {
        const date = new Date(reply.date)
        const timeAgo = getTimeAgo(date)
        const ratingStars = reply.rating ? '★'.repeat(reply.rating) + '☆'.repeat(5 - reply.rating) : ''
        
        return `
          <div class="flex gap-3 py-3">
            <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#281e19] font-serif text-sm text-white">V</div>
            <div class="min-w-0 flex-1">
              <div class="flex flex-wrap items-center gap-x-2 gap-y-1">
                <h4 class="text-sm font-semibold">Vous</h4>
                <span class="text-[10px] text-[#8f7770]">${timeAgo}</span>
                ${ratingStars ? `<span class="text-xs tracking-widest text-[#b7924b]">${ratingStars}</span>` : ''}
              </div>
              <p class="mt-2 text-sm leading-6 text-[#705f57]">${reply.text}</p>
              <button class="delete-comment-btn mt-2 text-[10px] text-[#8f7770] hover:text-red-500 transition-colors" data-comment-id="${reply.id}">Supprimer</button>
            </div>
          </div>
        `
      }).join('')}
    </div>
  `
  
  commentElement.insertAdjacentHTML('afterend', repliesHTML)
  
  commentElement.querySelectorAll('.delete-comment-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const replyId = btn.dataset.commentId
      deleteComment(replyId)
    })
  })
}

function updateCommentCount() {
  const bookId = getBookId()
  const comments = getComments(bookId)
  const countElement = document.querySelector('#commentaires p.text-sm')
  
  if (countElement) {
    const staticCount = 214
    const totalCount = staticCount + comments.length
    countElement.textContent = `${totalCount} lecteurs ont partagé leur expérience de cette œuvre.`
  }
}

function openPreviewModal() {
  const existingModal = document.getElementById('preview-modal')
  if (existingModal) {
    existingModal.remove()
  }
  
  const modal = document.createElement('div')
  modal.id = 'preview-modal'
  modal.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black/70 opacity-0 transition-opacity duration-300'
  
  modal.innerHTML = `
    <div class="bg-[#f8f3e9] rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden transform scale-95 transition-transform duration-300 flex flex-col">
      <div class="flex items-center justify-between p-4 border-b border-[#d9d1c6]">
        <h3 class="font-serif text-xl text-[#281e19]">Aperçu du livre</h3>
        <button id="close-preview-modal" class="text-[#705f57] hover:text-[#281e19] transition-colors">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      </div>
      <div class="flex-1 overflow-y-auto p-6">
        <div class="max-w-2xl mx-auto">
          <p class="font-serif text-2xl text-[#281e19] mb-4">Extrait de "La vie et demie"</p>
          <p class="text-sm leading-7 text-[#705f57] mb-4">
            Dans une écriture baroque et incisive, Sony Labou Tansi compose une fable politique sur la violence, la mémoire et la résistance. Ce texte propose une vision singulière de l'histoire contemporaine du Congo.
          </p>
          <p class="text-sm leading-7 text-[#705f57] mb-4">
            L'auteur déploie une langue inventive qui transforme le récit en une expérience littéraire unique, mêlant réalisme et onirisme pour interroger les mécanismes du pouvoir.
          </p>
          <p class="text-sm leading-7 text-[#705f57]">
            Œuvre majeure de la littérature africaine francophone, ce roman s'impose comme une référence incontournable pour comprendre les voix qui ont façonné le continent.
          </p>
        </div>
      </div>
      <div class="p-4 border-t border-[#d9d1c6] bg-[#f2ede3]">
        <a href="lire.html" class="inline-flex items-center justify-center gap-2 bg-[#133a28] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#245743] rounded-lg w-full sm:w-auto">
          <i data-lucide="play" class="h-4 w-4"></i> Lire le livre complet
        </a>
      </div>
    </div>
  `
  
  document.body.appendChild(modal)
  
  window.lucide.createIcons()
  
  requestAnimationFrame(() => {
    modal.classList.remove('opacity-0')
    modal.querySelector('div').classList.remove('scale-95')
  })
  
  document.getElementById('close-preview-modal').addEventListener('click', closePreviewModal)
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closePreviewModal()
  })
  document.addEventListener('keydown', handlePreviewEscapeKey)
}

function closePreviewModal() {
  const modal = document.getElementById('preview-modal')
  if (modal) {
    modal.classList.add('opacity-0')
    modal.querySelector('div').classList.add('scale-95')
    setTimeout(() => {
      modal.remove()
    }, 300)
    document.removeEventListener('keydown', handlePreviewEscapeKey)
  }
}

function handlePreviewEscapeKey(e) {
  if (e.key === 'Escape') closePreviewModal()
}

function initVuLibre() {
  const shareButton = document.querySelector('[aria-label="Partager"]')
  if (shareButton) {
    shareButton.addEventListener('click', openShareModal)
  }
  
  const previewButton = document.querySelector('[aria-label="Aperçu"]')
  if (previewButton) {
    previewButton.addEventListener('click', openPreviewModal)
  }
  
  setupRatingSystem()
  setupCommentSystem()
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initVuLibre)
} else {
  initVuLibre()
}
