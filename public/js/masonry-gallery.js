class MasonryGallery {
    constructor(albumUrl) {
        this.grid = document.getElementById('masonryGrid');
        this.loading = document.getElementById('loading');
        this.lightbox = document.getElementById('lightbox');
        this.lightboxImage = document.getElementById('lightboxImage');
        this.lightboxClose = document.getElementById('lightboxClose');
        this.albumUrl = albumUrl;
        this.albumData = null;
        this.init();
    }

    async init() {
        this.setupEventListeners();
        await this.loadAlbum();
        await this.loadImages();
        this.setupMasonry();
        this.showGallery();
    }

    setupEventListeners() {
        this.lightboxClose.addEventListener('click', () => this.closeLightbox());
        this.lightbox.addEventListener('click', (e) => {
            if (e.target === this.lightbox) this.closeLightbox();
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.closeLightbox();
        });
        window.addEventListener('resize', () => {
            clearTimeout(this.resizeTimeout);
            this.resizeTimeout = setTimeout(() => {
                this.recalculateMasonry();
            }, 300);
        });
    }

    async loadAlbum() {
        try {
            const res = await fetch(this.albumUrl);
            this.albumData = await res.json();
        } catch (e) {
            this.loading.innerHTML = 'Erro ao carregar álbum.';
            throw e;
        }
    }

    async loadImages() {
        const imagePromises = this.albumData.images.map((img, index) => {
            return new Promise((resolve) => {
                const image = new window.Image();
                image.onload = () => {
                    const aspectRatio = image.naturalHeight / image.naturalWidth;
                    resolve({
                        src: img.url,
                        caption: img.caption,
                        aspectRatio,
                        index
                    });
                };
                image.onerror = () => resolve(null);
                image.src = img.url;
            });
        });
        const loadedImages = await Promise.all(imagePromises);
        this.imageData = loadedImages.filter(img => img !== null);
    }

    createImageElement(imageData) {
        const item = document.createElement('div');
        item.className = 'masonry-item';
        const gridRowHeight = 10;
        const gridGap = 15;
        const baseWidth = 300;
        const itemHeight = Math.ceil(baseWidth * imageData.aspectRatio);
        const gridRowSpan = Math.ceil((itemHeight + gridGap) / (gridRowHeight + gridGap));
        item.style.gridRowEnd = `span ${gridRowSpan}`;
        item.style.animationDelay = `${imageData.index * 0.1}s`;
        const img = document.createElement('img');
        img.src = imageData.src;
        img.alt = imageData.caption || `Foto ${imageData.index + 1}`;
        img.loading = 'lazy';
        const overlay = document.createElement('div');
        overlay.className = 'image-overlay';
        const info = document.createElement('div');
        info.className = 'image-info';
        info.textContent = imageData.caption || `Foto ${imageData.index + 1}`;
        overlay.appendChild(info);
        item.appendChild(img);
        item.appendChild(overlay);
        item.addEventListener('click', () => {
            this.openLightbox(imageData.src);
        });
        return item;
    }

    setupMasonry() {
        const shuffledImages = [...this.imageData].sort(() => Math.random() - 0.5);
        shuffledImages.forEach(imageData => {
            const element = this.createImageElement(imageData);
            this.grid.appendChild(element);
        });
    }

    recalculateMasonry() {
        const items = this.grid.querySelectorAll('.masonry-item');
        items.forEach((item, index) => {
            const img = item.querySelector('img');
            if (img.complete) {
                const aspectRatio = img.naturalHeight / img.naturalWidth;
                const gridRowHeight = 10;
                const gridGap = 15;
                const containerWidth = item.offsetWidth;
                const itemHeight = Math.ceil(containerWidth * aspectRatio);
                const gridRowSpan = Math.ceil((itemHeight + gridGap) / (gridRowHeight + gridGap));
                item.style.gridRowEnd = `span ${gridRowSpan}`;
            }
        });
    }

    showGallery() {
        this.loading.style.display = 'none';
        this.grid.style.display = 'grid';
        setTimeout(() => {
            this.recalculateMasonry();
        }, 100);
    }

    openLightbox(src) {
        this.lightboxImage.src = src;
        this.lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closeLightbox() {
        this.lightbox.classList.remove('active');
        document.body.style.overflow = 'auto';
        this.lightboxImage.src = '';
    }
}

// Função utilitária para obter o parâmetro do álbum na URL
function getAlbumParam() {
    const params = new URLSearchParams(window.location.search);
    return params.get('album');
}

document.addEventListener('DOMContentLoaded', () => {
    const album = getAlbumParam();
    if (album) {
        new MasonryGallery(`/albums/${album}.json`);
    } else {
        document.getElementById('loading').innerHTML = 'Álbum não encontrado.';
    }
});
