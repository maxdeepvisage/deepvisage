// Portfolio categories data
const portfolioData = {
    'Wedding Photography': {
        description: 'Capturing the most important day of your life with elegance and emotion',
        images: [
            'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=800&h=600&fit=crop'
        ],
        count: '150+ Photos'
    },
    'Coffee & Restaurants': {
        description: 'Showcasing culinary artistry and atmospheric dining experiences',
        images: [
            'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1559116315-702b0b4774ce?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop'
        ],
        count: '200+ Photos'
    },
    'Music Videos': {
        description: 'Dynamic visual storytelling for artists and creative projects',
        images: [
            'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&h=600&fit=crop'
        ],
        count: '75+ Projects'
    },
    'Portrait Sessions': {
        description: 'Personal and professional portraits that tell your unique story',
        images: [
            'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1494790108755-2616c273ca83?w=800&h=600&fit=crop'
        ],
        count: '300+ Sessions'
    },
    'Corporate Events': {
        description: 'Professional event coverage that captures the essence of your brand',
        images: [
            'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1528605105345-5344ea20e269?w=800&h=600&fit=crop'
        ],
        count: '100+ Events'
    }
};

let currentIndex = 0;
const categories = Object.keys(portfolioData);
let autoRotateInterval;

// Configuração do tempo do carrossel
const AUTO_ROTATE_DELAY = 10000; // 10 segundos

function createGalleryItems(galleryId) {
    const gallery = document.getElementById(galleryId);
    if (!gallery) return;
    gallery.innerHTML = '';
    categories.forEach((category, index) => {
        const item = document.createElement('div');
        item.className = 'gallery-item';
        item.innerHTML = `
            <img src="${portfolioData[category].images[0]}" alt="${category}">
            <div class="gallery-overlay">
                <div class="gallery-category">${category}</div>
                <div class="gallery-count">${portfolioData[category].count}</div>
            </div>
        `;
        // Redireciona para a página de categoria correspondente
        if (category === 'Wedding Photography') {
            item.addEventListener('click', () => {
                window.location.href = 'wedding.html';
            });
        } else if (category === 'Corporate Events') {
            item.addEventListener('click', () => {
                window.location.href = 'corporate.html';
            });
        } else if (category === 'Portrait Sessions') {
            item.addEventListener('click', () => {
                window.location.href = 'portraits.html';
            });
        } else if (category === 'Music Videos') {
            item.addEventListener('click', () => {
                window.location.href = 'music.html';
            });
        } else if (category === 'Coffee & Restaurants') {
            item.addEventListener('click', () => {
                window.location.href = 'coffee.html';
            });
        } else {
            item.addEventListener('click', () => selectCategory(index));
        }
        gallery.appendChild(item);
    });
    updateGalleryLayout(galleryId);
}

function updateGalleryLayout(galleryId) {
    const gallery = document.getElementById(galleryId);
    if (!gallery) return;
    const items = gallery.querySelectorAll('.gallery-item');
    const visibleCount = 7;
    const spacing = 70;
    const galleryHeight = 600;
    const centerY = 0;
    const totalItems = items.length;
    items.forEach((item, i) => {
        let offset = (i - currentIndex + totalItems) % totalItems;
        if (offset > totalItems / 2) offset -= totalItems;
        let y = centerY + offset * spacing;
        let scale = 1 - Math.min(Math.abs(offset) * 0.08, 0.32);
        let opacity = 1 - Math.min(Math.abs(offset) * 0.22, 0.55);
        let blur = Math.abs(offset) > 2 ? 'blur(3px)' : Math.abs(offset) === 2 ? 'blur(1.5px)' : 'blur(0px)';
        if (Math.abs(offset) > visibleCount / 2) opacity = 0.1;
        if (Math.abs(offset) > visibleCount) opacity = 0;
        item.style.transform = `translateY(${y}px) scale(${scale})`;
        item.style.opacity = opacity;
        item.style.filter = blur;
        item.style.zIndex = totalItems - Math.abs(offset);
        item.style.pointerEvents = opacity > 0.2 ? 'auto' : 'none';
        item.classList.toggle('active', i === currentIndex);
    });
}

function updatePreviewImages(previewStackId, previewInfoSelector) {
    const previewStack = document.getElementById(previewStackId);
    const previewInfo = document.querySelector(previewInfoSelector);
    const currentCategory = categories[currentIndex];
    const data = portfolioData[currentCategory];
    if (previewStack) {
        previewStack.innerHTML = '';
        const imageDiv = document.createElement('div');
        imageDiv.className = 'preview-image';
        imageDiv.innerHTML = `<img src="${data.images[0]}" alt="${currentCategory}">`;
        previewStack.appendChild(imageDiv);
        // Força reflow para garantir transição
        void imageDiv.offsetWidth;
        setTimeout(() => {
            imageDiv.classList.add('active');
        }, 20);
    }
    if (previewInfo) {
        const cat = previewInfo.querySelector('.preview-category');
        const desc = previewInfo.querySelector('.preview-description');
        if (cat) cat.textContent = currentCategory;
        if (desc) desc.textContent = data.description;
        // Atualiza o botão Explore Gallery
        const btn = previewInfo.querySelector('.explore-btn');
        if (btn) {
            // Define o link de acordo com a categoria
            let href = '#';
            if (currentCategory === 'Wedding Photography') href = 'wedding.html';
            else if (currentCategory === 'Corporate Events') href = 'corporate.html';
            else if (currentCategory === 'Portrait Sessions') href = 'portraits.html';
            else if (currentCategory === 'Music Videos') href = 'music.html';
            else if (currentCategory === 'Coffee & Restaurants') href = 'coffee.html';
            btn.setAttribute('onclick', `window.location.href='${href}'`);
            btn.textContent = `Explore ${currentCategory}`;
        }
    }
}

function updateAllPreviews() {
    updatePreviewImages('previewStack', '.hero-row .preview-info');
    updatePreviewImages('previewStackMobile', '.mobile-main-block .preview-info');
}

function updateAllGalleries() {
    updateGalleryLayout('verticalGallery');
    updateGalleryLayout('verticalGalleryMobile');
}

function selectCategory(index) {
    currentIndex = index;
    updateAllGalleries();
    updateAllPreviews();
    resetAutoRotate();
}

function nextCategory() {
    currentIndex = (currentIndex + 1) % categories.length;
    updateAllGalleries();
    updateAllPreviews();
}

function prevCategory() {
    currentIndex = (currentIndex - 1 + categories.length) % categories.length;
    updateAllGalleries();
    updateAllPreviews();
}

function startAutoRotate() {
    autoRotateInterval = setInterval(() => {
        nextCategory();
    }, AUTO_ROTATE_DELAY);
}

function resetAutoRotate() {
    clearInterval(autoRotateInterval);
    startAutoRotate();
}

// Event listeners
document.getElementById('nextBtn').addEventListener('click', () => {
    nextCategory();
    resetAutoRotate();
});

document.getElementById('prevBtn').addEventListener('click', () => {
    prevCategory();
    resetAutoRotate();
});

document.getElementById('verticalGallery').addEventListener('wheel', (e) => {
    e.preventDefault();
    if (e.deltaY > 0) {
        nextCategory();
    } else {
        prevCategory();
    }
    resetAutoRotate();
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        prevCategory();
        resetAutoRotate();
    } else if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        nextCategory();
        resetAutoRotate();
    }
});

// Atualiza listeners para mobile
if (document.getElementById('nextBtnMobile')) {
    document.getElementById('nextBtnMobile').onclick = () => { nextCategory(); resetAutoRotate(); };
}
if (document.getElementById('prevBtnMobile')) {
    document.getElementById('prevBtnMobile').onclick = () => { prevCategory(); resetAutoRotate(); };
}
if (document.getElementById('verticalGalleryMobile')) {
    document.getElementById('verticalGalleryMobile').addEventListener('wheel', (e) => {
        e.preventDefault();
        if (e.deltaY > 0) {
            nextCategory();
        } else {
            prevCategory();
        }
        resetAutoRotate();
    });
    document.getElementById('verticalGalleryMobile').addEventListener('mouseenter', () => {
        clearInterval(autoRotateInterval);
    });
    document.getElementById('verticalGalleryMobile').addEventListener('mouseleave', () => {
        startAutoRotate();
    });
}

// Inicialização para ambos layouts
createGalleryItems('verticalGallery');
createGalleryItems('verticalGalleryMobile');
updateAllPreviews();
startAutoRotate();

// Intersection Observer for .fade-in elements (Process section)
document.addEventListener('DOMContentLoaded', function() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, observerOptions);
  document.querySelectorAll('.fade-in').forEach(el => {
    observer.observe(el);
  });
});

// WhatsApp para Investment Cards Estáticos
window.sendWhatsApp = function(service) {
  const phoneNumbers = ['+353833621561', '+353830165462'];
  const primaryPhone = phoneNumbers[0];
  let message = '';
  switch(service) {
    case 'portrait':
      message = "Hello! I would like to inquire about your Portrait Session package. Could you please provide more details about availability and the booking process?";
      break;
    case 'wedding':
      message = "Hello! I am interested in your Wedding Photography package for my upcoming wedding. Could we schedule a consultation to discuss the details and check your availability?";
      break;
    case 'commercial':
      message = "Hello! I would like to get a custom quote for commercial photography services. Could you please contact me to discuss my specific business requirements?";
      break;
    default:
      message = "Hello! I would like to inquire about your photography services. Could you please provide more information?";
  }
  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${primaryPhone.replace('+', '')}?text=${encodedMessage}`;
  window.open(whatsappUrl, '_blank');
};

// --- Testimonials Carousel Logic (Fade/Scale Animation, No Container Shift) ---
document.addEventListener('DOMContentLoaded', function() {
  const slider = document.getElementById('testimonialsSlider');
  const prevBtn = document.querySelector('.testimonial-nav.prev');
  const nextBtn = document.querySelector('.testimonial-nav.next');
  if (!slider || !prevBtn || !nextBtn) return;
  let isAnimating = false;
  let cards = Array.from(slider.querySelectorAll('.testimonial-card'));
  let current = 0;

  function render() {
    cards.forEach((card, i) => {
      card.style.opacity = i === current ? '1' : '0.35';
      card.style.transform = i === current ? 'scale(1) translateY(0)' : 'scale(0.92) translateY(12px)';
      card.style.zIndex = i === current ? '2' : '1';
      card.style.transition = 'all 0.6s cubic-bezier(.77,0,.18,1)';
    });
    // Centraliza o card ativo
    slider.scrollTo({
      left: cards[current].offsetLeft - slider.offsetWidth / 2 + cards[current].offsetWidth / 2,
      behavior: 'smooth'
    });
  }

  function moveNext() {
    if (isAnimating) return;
    isAnimating = true;
    current = (current + 1) % cards.length;
    render();
    setTimeout(() => { isAnimating = false; }, 650);
  }

  function movePrev() {
    if (isAnimating) return;
    isAnimating = true;
    current = (current - 1 + cards.length) % cards.length;
    render();
    setTimeout(() => { isAnimating = false; }, 650);
  }

  nextBtn.addEventListener('click', moveNext);
  prevBtn.addEventListener('click', movePrev);

  // Impede scroll manual
  slider.addEventListener('wheel', e => e.preventDefault());
  slider.addEventListener('touchmove', e => e.preventDefault(), { passive: false });

  // Inicializa
  render();
});

// --- Investment Cards Slider Dots Automation ---
document.addEventListener('DOMContentLoaded', function() {
  const cardsContainer = document.querySelector('.investment-cards');
  const dots = document.querySelectorAll('.investment-slider-dot');
  if (!cardsContainer || dots.length === 0) return;

  function updateActiveDot() {
    // Calcula o card mais centralizado na viewport
    const containerRect = cardsContainer.getBoundingClientRect();
    let minDiff = Infinity;
    let activeIdx = 0;
    cardsContainer.querySelectorAll('.investment-card').forEach((card, idx) => {
      const cardRect = card.getBoundingClientRect();
      const cardCenter = cardRect.left + cardRect.width / 2;
      const viewportCenter = window.innerWidth / 2;
      const diff = Math.abs(cardCenter - viewportCenter);
      if (diff < minDiff) {
        minDiff = diff;
        activeIdx = idx;
      }
    });
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === activeIdx);
    });
  }

  // Atualiza ao scrollar
  cardsContainer.addEventListener('scroll', updateActiveDot, { passive: true });
  // Atualiza ao redimensionar
  window.addEventListener('resize', updateActiveDot);
  // Atualiza ao carregar
  setTimeout(updateActiveDot, 300);

  // Permite clicar no dot para ir ao card
  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      const card = cardsContainer.querySelectorAll('.investment-card')[i];
      if (card) {
        // Corrige para centralizar suavemente o card na viewport
        const cardRect = card.getBoundingClientRect();
        const containerRect = cardsContainer.getBoundingClientRect();
        const scrollLeft = cardsContainer.scrollLeft;
        const cardOffset = cardRect.left - containerRect.left;
        const centerOffset = cardOffset - (containerRect.width / 2 - cardRect.width / 2);
        cardsContainer.scrollTo({ left: scrollLeft + centerOffset, behavior: 'smooth' });
      }
    });
  });

  // Garante scroll suave sempre
  cardsContainer.style.scrollBehavior = 'smooth';
});

// --- Testimonials Dots Navegação Mobile + Hover Desktop ---
document.addEventListener('DOMContentLoaded', function() {
  const slider = document.getElementById('testimonialsSlider');
  const dots = document.querySelectorAll('#testimonialsDots .testimonials-dot');
  if (!slider || dots.length === 0) return;
  let cards = Array.from(slider.querySelectorAll('.testimonial-card'));
  let current = 0;

  function render() {
    cards.forEach((card, i) => {
      card.style.opacity = i === current ? '1' : '0.5';
      card.style.transform = i === current ? 'scale(1)' : 'scale(0.97)';
      card.style.zIndex = i === current ? '2' : '1';
    });
    dots.forEach((dot, i) => dot.classList.toggle('active', i === current));
    slider.scrollTo({
      left: cards[current].offsetLeft - slider.offsetWidth / 2 + cards[current].offsetWidth / 2,
      behavior: 'smooth'
    });
  }

  function moveTo(idx) {
    current = idx;
    render();
  }

  // Dots click
  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => moveTo(i));
  });

  // Swipe touch
  let startX = 0;
  slider.addEventListener('touchstart', e => {
    startX = e.touches[0].clientX;
  });
  slider.addEventListener('touchend', e => {
    let endX = e.changedTouches[0].clientX;
    if (endX < startX - 30) moveTo((current + 1) % cards.length);
    else if (endX > startX + 30) moveTo((current - 1 + cards.length) % cards.length);
  });

  // Hover desktop: ativa o card ao passar o mouse
  cards.forEach((card, i) => {
    card.addEventListener('mouseenter', () => moveTo(i));
  });

  render();
});
