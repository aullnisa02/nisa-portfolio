document.addEventListener('DOMContentLoaded', () => {
    const certificateThumbnails = document.querySelectorAll('.certificate-thumbnail');
    
    const modal = document.getElementById('lightbox-overlay'); 
    const modalImage = document.querySelector('.lightbox-image'); 
    const closeButton = document.querySelector('.lightbox-close'); 
    const modalCaption = document.querySelector('.lightbox-caption'); 

    if (modal && modalImage && closeButton) {
        certificateThumbnails.forEach(thumbnail => {
            thumbnail.addEventListener('click', () => {
                modalImage.src = thumbnail.src; 
                modalImage.alt = thumbnail.alt; 

                const parentItem = thumbnail.closest('.certificate-item');
                if (parentItem && modalCaption) {
                    const captionText = parentItem.querySelector('p')?.textContent;
                    modalCaption.textContent = captionText || thumbnail.alt; 
                }
                
                modal.classList.add('active');
            });
        });

        closeButton.addEventListener('click', () => {
            modal.classList.remove('active');
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) { 
                modal.classList.remove('active');
            }
        });
    } else {
        console.error("Lightbox elements (overlay, image, close button) not found. Check your HTML IDs/classes.");
    }
});