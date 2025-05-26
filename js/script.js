document.addEventListener('DOMContentLoaded', () => {

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            const isSubmenuToggle = this.classList.contains('submenu-toggle');
            const isSubmenuItem = this.closest('.submenu');

            e.preventDefault(); 

            if (targetId && targetId !== '#' && !isSubmenuToggle) {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth'
                    });
                } else {
                    console.warn(`[Smooth Scroll] Elemen dengan ID "${targetId}" tidak ditemukan. Pastikan ID cocok dengan HTML.`);
                }
            }

            const navMenu = document.querySelector('.nav-menu');
            if (navMenu && navMenu.classList.contains('active')) {
                if (!isSubmenuToggle && !isSubmenuItem) {
                    navMenu.classList.remove('active');
                } else if (isSubmenuItem) {
                    const parentSubmenu = this.closest('.submenu');
                    if (parentSubmenu) {
                        parentSubmenu.classList.remove('active');
                    }
                    navMenu.classList.remove('active');
                }
            }
        });
    });

    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            
            if (!navMenu.classList.contains('active')) {
                document.querySelectorAll('.submenu.active').forEach(submenu => {
                    submenu.classList.remove('active');
                });
            }
        });
    }

    const submenuToggles = document.querySelectorAll('.submenu-toggle');

    submenuToggles.forEach(toggle => {
        toggle.addEventListener('click', (e) => {
            e.preventDefault();

            const parentLi = toggle.closest('.has-submenu');
            if (parentLi) {
                const submenu = parentLi.querySelector('.submenu');

                if (submenu) {
                    if (window.innerWidth <= 768) {
                        submenu.classList.toggle('active');

                        submenuToggles.forEach(otherToggle => {
                            const otherParentLi = otherToggle.closest('.has-submenu');
                            if (otherParentLi && otherParentLi !== parentLi) {
                                const otherSubmenu = otherParentLi.querySelector('.submenu');
                                if (otherSubmenu && otherSubmenu.classList.contains('active')) {
                                    otherSubmenu.classList.remove('active');
                                }
                            }
                        });
                    }
                }
            }
        });
    });

    const professionTextElement = document.getElementById('profession-text');
    const professions = ['Penulis', 'Editor Naskah', 'Content Writer', 'Scriptwriter', 'AI Trainer', 'Budding Spreadsheet User', 'Budding Web Developer'];
    let professionIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typingSpeed = 100;
    const deletingSpeed = 50;
    const delayBetweenProfessions = 2000;

    function typeProfession() {
        if (!professionTextElement) return;

        const currentProfession = professions[professionIndex];

        if (!isDeleting) {
            professionTextElement.textContent = currentProfession.substring(0, charIndex);
            charIndex++;
            if (charIndex <= currentProfession.length) {
                setTimeout(typeProfession, typingSpeed);
            } else {
                isDeleting = true;
                setTimeout(typeProfession, delayBetweenProfessions);
            }
        } else {
            professionTextElement.textContent = currentProfession.substring(0, charIndex);
            charIndex--;
            if (charIndex >= 0) {
                setTimeout(typeProfession, deletingSpeed);
            } else {
                isDeleting = false;
                professionIndex = (professionIndex + 1) % professions.length;
                setTimeout(typeProfession, typingSpeed);
            }
        }
    }

    if (professionTextElement) {
        typeProfession();
    }

    const currentYearSpan = document.getElementById('current-year');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    const TESTIMONIAL_GAS_WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbwSVFc5Kzzc-eJjB06CRkvbFQ6_Md0t_XSRoZMLrUGc3oeLeSEWxxzKmlqY60_wH_yN/exec';
    const CONTACT_GAS_WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbyi7CJxhdW4rCxItUXASdxxqCBuYGv4wAqbjTCyH2eOfMTVZo69vjVttiE1jWQICLksqg/exec';


    const testimonialSliderContainer = document.getElementById('testimonial-slider-container');
    const sliderPrevButton = document.querySelector('.slider-prev');
    const sliderNextButton = document.querySelector('.slider-next');
    let currentSlide = 0;
    let testimonialsData = [];

    async function fetchTestimonials() {
        if (!testimonialSliderContainer) return;

        testimonialSliderContainer.innerHTML = '<div class="loading-message">Memuat testimoni...</div>';

        try {
            const response = await fetch(TESTIMONIAL_GAS_WEB_APP_URL + '?action=getTestimonials');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();

            if (data.status === 'success' && data.data && data.data.length > 0) {
                testimonialsData = data.data;
                renderTestimonials();
                updateSliderControls();
            } else {
                testimonialSliderContainer.innerHTML = '<div class="loading-message">Belum ada testimoni. Jadilah yang pertama!</div>';
            }
        } catch (error) {
            console.error('Error fetching testimonials:', error);
            testimonialSliderContainer.innerHTML = '<div class="loading-message error">Gagal memuat testimoni. Silakan coba lagi nanti.</div>';
        }
    }

    function renderTestimonials() {
        if (!testimonialSliderContainer) return;

        testimonialSliderContainer.innerHTML = '';
        testimonialsData.forEach(testimonial => {
            const testimonialItem = document.createElement('div');
            testimonialItem.classList.add('testimonial-item');
            testimonialItem.innerHTML = `
                <blockquote>"${testimonial.Testimoni}"</blockquote>
                <cite>- ${testimonial.Nama}</cite>
            `;
            testimonialSliderContainer.appendChild(testimonialItem);
        });
    }

    function updateSliderControls() {
        if (!testimonialSliderContainer || testimonialsData.length === 0) {
            if (sliderPrevButton) sliderPrevButton.style.display = 'none';
            if (sliderNextButton) sliderNextButton.style.display = 'none';
            return;
        } else {
             if (sliderPrevButton) sliderPrevButton.style.display = '';
             if (sliderNextButton) sliderNextButton.style.display = '';
        }

        const testimonialItems = testimonialSliderContainer.querySelectorAll('.testimonial-item');
        if (testimonialItems.length === 0) {
            return;
        }

        const slideWidth = testimonialItems[0].offsetWidth;
        testimonialSliderContainer.style.transform = `translateX(-${currentSlide * slideWidth}px)`;

        if (sliderPrevButton) sliderPrevButton.disabled = currentSlide === 0;
        if (sliderNextButton) sliderNextButton.disabled = currentSlide >= testimonialsData.length - 1;
    }

    if (sliderPrevButton) {
        sliderPrevButton.addEventListener('click', () => {
            if (currentSlide > 0) {
                currentSlide--;
                updateSliderControls();
            }
        });
    }

    if (sliderNextButton) {
        sliderNextButton.addEventListener('click', () => {
            if (currentSlide < testimonialsData.length - 1) {
                currentSlide++;
                updateSliderControls();
            }
        });
    }

    if (testimonialSliderContainer) {
        fetchTestimonials();
        window.addEventListener('resize', updateSliderControls);
    }

    const testimonialForm = document.getElementById('testimonial-form');
    const testimonialMessage = document.getElementById('testimonial-message');

    if (testimonialForm && testimonialMessage) {
        testimonialForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            testimonialMessage.style.display = 'none';
            testimonialMessage.classList.remove('success', 'error');

            const formData = new FormData(testimonialForm);
            formData.append('action', 'addTestimonial');
            const data = Object.fromEntries(formData.entries());

            try {
                const response = await fetch(TESTIMONIAL_GAS_WEB_APP_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: new URLSearchParams(data).toString()
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const result = await response.json();

                if (result.status === 'success') {
                    testimonialMessage.textContent = 'Terima kasih! Testimoni Anda telah terkirim.';
                    testimonialMessage.classList.add('success');
                    testimonialForm.reset();
                    currentSlide = 0;
                    fetchTestimonials();
                } else {
                    testimonialMessage.textContent = 'Gagal mengirim testimoni: ' + (result.message || 'Terjadi kesalahan.');
                    testimonialMessage.classList.add('error');
                }
            } catch (error) {
                console.error('Error submitting testimonial:', error);
                testimonialMessage.textContent = 'Terjadi kesalahan saat mengirim testimoni. Silakan coba lagi.';
                testimonialMessage.classList.add('error');
            } finally {
                testimonialMessage.style.display = 'block';
            }
        });
    }

    const contactForm = document.getElementById('contact-form-main');
    const contactMessage = document.getElementById('contact-message');

    if (contactForm && contactMessage) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            contactMessage.style.display = 'none';
            contactMessage.classList.remove('success', 'error');

            const formData = new FormData(contactForm);
            formData.append('action', 'addContact');
            const data = Object.fromEntries(formData.entries());

            try {
                const response = await fetch(CONTACT_GAS_WEB_APP_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: new URLSearchParams(data).toString()
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const result = await response.json();

                if (result.status === 'success') {
                    contactMessage.textContent = 'Pesan Anda telah terkirim. Terima kasih!';
                    contactMessage.classList.add('success');
                    contactForm.reset();
                } else {
                    contactMessage.textContent = 'Gagal mengirim pesan: ' + (result.message || 'Terjadi kesalahan.');
                    contactMessage.classList.add('error');
                }
            } catch (error) {
                console.error('Error submitting contact form:', error);
                contactMessage.textContent = 'Terjadi kesalahan saat mengirim pesan. Silakan coba lagi.';
                contactMessage.classList.add('error');
            } finally {
                contactMessage.style.display = 'block';
            }
        });
    }
});