const menuIcon = document.querySelector('#menu-icon');
const navbar = document.querySelector('.navbar');
const navLinks = document.querySelectorAll('.navbar a');

menuIcon.onclick = () => {
    menuIcon.classList.toggle('bx-x');
    navbar.classList.toggle('active');
};

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        menuIcon.classList.remove('bx-x');
        navbar.classList.remove('active');
    });
});

window.onscroll = () => {
    menuIcon.classList.remove('bx-x');
    navbar.classList.remove('active');
};

// Dark Mode Toggle
const themeToggle = document.querySelector('#theme-toggle');
const themeIcon = themeToggle ? themeToggle.querySelector('i') : null;

function applyTheme(isDark) {
    document.body.classList.toggle('dark-mode', isDark);
    if (themeIcon) {
        themeIcon.classList.toggle('fa-moon', !isDark);
        themeIcon.classList.toggle('fa-sun', isDark);
    }
}

const savedTheme = localStorage.getItem('theme');
applyTheme(savedTheme === 'dark');

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const isDark = !document.body.classList.contains('dark-mode');
        applyTheme(isDark);
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });
}

// Contact form result banner (contact.php redirects back with ?contact=success/error/invalid)
const params = new URLSearchParams(window.location.search);
const contactStatus = params.get('contact');
const banner = document.querySelector('#form-banner');

if (banner && contactStatus) {
    const messages = {
        success: 'Thanks! Your message has been sent — I\'ll get back to you soon.',
        error: 'Something went wrong sending your message. Please try again or email me directly.',
        invalid: 'Please fill in all required fields with a valid email address.'
    };

    const type = contactStatus === 'success' ? 'success' : 'error';
    banner.textContent = messages[contactStatus] || messages.error;
    banner.classList.add('show', type);

    // Clean the URL so refreshing doesn't re-show the banner
    window.history.replaceState({}, document.title, window.location.pathname + '#contact');
}

// Dynamic year in footer
const currentYear = document.querySelector('#currentYear');
if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
}

// Scroll-to-Top Button
const scrollTopBtn = document.querySelector('#scrollTopBtn');

if (scrollTopBtn) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollTopBtn.classList.add('show');
        } else {
            scrollTopBtn.classList.remove('show');
        }
    });

    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}