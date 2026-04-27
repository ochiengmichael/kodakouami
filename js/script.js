// Kodak Ouami Frontend JavaScript
// Connects to backend API

const API_BASE_URL = 'http://localhost:3000/api';

// DOM Elements
const contactForm = document.getElementById('contact-form');
const subscribeForm = document.getElementById('subscribe-form');
const servicesContainer = document.getElementById('services-container');
const projectsContainer = document.getElementById('projects-container');
const testimonialsContainer = document.getElementById('testimonials-container');

// Show notification message
function showNotification(message, type = 'success') {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">&times;</button>
    `;

    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        animation: slideIn 0.3s ease;
        background: ${type === 'success' ? '#4caf50' : '#f44336'};
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    `;

    document.body.appendChild(notification);

    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.remove();
    }, 5000);
}

// Add slideIn animation
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
`;
document.head.appendChild(style);

// ============ Contact Form Handling ============
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;

        const formData = {
            name: contactForm.querySelector('input[name="name"]').value,
            email: contactForm.querySelector('input[name="email"]').value,
            phone: contactForm.querySelector('input[name="phone"]')?.value || '',
            subject: contactForm.querySelector('input[name="subject"]')?.value || '',
            message: contactForm.querySelector('textarea[name="message"]').value
        };

        try {
            const response = await fetch(`${API_BASE_URL}/contact`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (result.success) {
                showNotification(result.message, 'success');
                contactForm.reset();
            } else {
                showNotification(result.message || 'Failed to send message', 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            showNotification('Failed to connect to server', 'error');
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });
}

// ============ Newsletter Subscription ============
if (subscribeForm) {
    subscribeForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const emailInput = subscribeForm.querySelector('input[type="email"]');
        const submitBtn = subscribeForm.querySelector('button[type="submit"]');

        const email = emailInput.value;

        try {
            const response = await fetch(`${API_BASE_URL}/subscribe`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email })
            });

            const result = await response.json();

            if (result.success) {
                showNotification(result.message, 'success');
                emailInput.value = '';
            } else {
                showNotification(result.message || 'Failed to subscribe', 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            showNotification('Failed to connect to server', 'error');
        }
    });
}

// ============ Load Services from API ============
async function loadServices() {
    if (!servicesContainer) return;

    try {
        const response = await fetch(`${API_BASE_URL}/services`);
        const result = await response.json();

        if (result.success) {
            servicesContainer.innerHTML = result.data.map(service => `
                <div class="card">
                    <img src="${service.image}" alt="${service.title}" class="service-img">
                    <h3>${service.title}</h3>
                    <p>${service.description}</p>
                </div>
            `).join('');
        }
    } catch (error) {
        console.error('Error loading services:', error);
    }
}

// ============ Load Projects from API ============
async function loadProjects() {
    if (!projectsContainer) return;

    try {
        const response = await fetch(`${API_BASE_URL}/projects`);
        const result = await response.json();

        if (result.success) {
            projectsContainer.innerHTML = result.data.map(project => `
                <div class="project-item">
                    <img src="${project.image}" alt="${project.title}" class="project-img">
                    <h3>${project.title}</h3>
                    <p>${project.description}</p>
                </div>
            `).join('');
        }
    } catch (error) {
        console.error('Error loading projects:', error);
    }
}

// ============ Load Testimonials from API ============
async function loadTestimonials() {
    if (!testimonialsContainer) return;

    try {
        const response = await fetch(`${API_BASE_URL}/testimonials`);
        const result = await response.json();

        if (result.success) {
            const stars = (rating) => {
                let starHtml = '';
                for (let i = 0; i < 5; i++) {
                    starHtml += i < rating 
                        ? '<i class="fa-solid fa-star"></i>' 
                        : '<i class="fa-regular fa-star"></i>';
                }
                return starHtml;
            };

            testimonialsContainer.innerHTML = result.data.map(testimonial => `
                <div class="testimonial-card">
                    <p class="testimonial-text">"${testimonial.text}"</p>
                    <div class="client-info">
                        <h4>${testimonial.name}</h4>
                        <span>${testimonial.role}</span>
                    </div>
                    <div class="stars">${stars(testimonial.rating)}</div>
                </div>
            `).join('');
        }
    } catch (error) {
        console.error('Error loading testimonials:', error);
    }
}

// ============ Smooth Scrolling ============
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ============ Navbar Scroll Effect ============
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        if (window.scrollY > 50) {
            navbar.style.boxShadow = '0 5px 20px rgba(242, 86, 35, 0.4)';
        } else {
            navbar.style.boxShadow = '0 5px 20px var(--orange)';
        }
    }
});

// ============ Mobile Menu Toggle ============
const navbarToggle = document.createElement('button');
navbarToggle.className = 'navbar-toggle';
navbarToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
navbarToggle.style.cssText = `
    display: none;
    background: none;
    border: none;
    font-size: 24px;
    color: var(--black);
    cursor: pointer;
`;

const navbar = document.querySelector('#navbar');
if (navbar) {
    // Add toggle button for mobile
    const navbarContainer = document.querySelector('.navbar nav');
    if (navbarContainer && window.innerWidth <= 768) {
        navbarToggle.style.display = 'block';
        navbarContainer.prepend(navbarToggle);
        
        navbarToggle.addEventListener('click', () => {
            navbar.classList.toggle('active');
        });
    }
}

// ============ Initialize on Load ============
document.addEventListener('DOMContentLoaded', () => {
    // Only load from API if containers exist (for dynamic loading)
    // Otherwise, the static HTML will be used
    
    // Add loading animation to images
    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('load', () => {
            img.style.opacity = '1';
        });
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.3s ease';
    });
    
    // Trigger load for images
    document.querySelectorAll('img').forEach(img => {
        if (img.complete) {
            img.style.opacity = '1';
        }
    });

    console.log('🚀 Kodak Ouami Frontend Loaded');
});

// ============ Form Validation Helpers ============
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePhone(phone) {
    const re = /^[\d\s\-\+\(\)]+$/;
    return re.test(phone) && phone.replace(/\D/g, '').length >= 10;
}

// Real-time validation feedback
if (contactForm) {
    const emailInput = contactForm.querySelector('input[name="email"]');
    const phoneInput = contactForm.querySelector('input[name="phone"]');

    if (emailInput) {
        emailInput.addEventListener('blur', () => {
            if (!validateEmail(emailInput.value)) {
                emailInput.style.borderColor = '#f44336';
            } else {
                emailInput.style.borderColor = '#4caf50';
            }
        });
    }

    if (phoneInput) {
        phoneInput.addEventListener('blur', () => {
            if (phoneInput.value && !validatePhone(phoneInput.value)) {
                phoneInput.style.borderColor = '#f44336';
            } else {
                phoneInput.style.borderColor = '';
            }
        });
    }
}

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        API_BASE_URL,
        showNotification,
        loadServices,
        loadProjects,
        loadTestimonials
    };
}