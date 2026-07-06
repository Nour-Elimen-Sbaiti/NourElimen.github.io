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

// Contact form — submits directly to Formspree (works on static hosts like GitHub Pages, no PHP needed)
const contactForm = document.querySelector('#contact-form');
const banner = document.querySelector('#form-banner');
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/mdarjejl';

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Honeypot check — if this hidden field got filled in, it's almost certainly a bot.
        // Formspree also checks _gotcha server-side, but bailing out early here saves a request.
        const honeypot = contactForm.querySelector('input[name="_gotcha"]');
        if (honeypot && honeypot.value) {
            return;
        }

        const submitBtn = contactForm.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';

        try {
            const response = await fetch(FORMSPREE_ENDPOINT, {
                method: 'POST',
                body: new FormData(contactForm),
                headers: { 'Accept': 'application/json' }
            });

            if (response.ok) {
                banner.textContent = "Thanks! Your message has been sent — I'll get back to you soon.";
                banner.classList.remove('error');
                banner.classList.add('show', 'success');
                contactForm.reset();
            } else {
                const data = await response.json().catch(() => null);
                const errMsg = data?.errors?.[0]?.message;
                banner.textContent = errMsg
                    ? `Couldn't send your message: ${errMsg}`
                    : "Something went wrong sending your message. Please try again or email me directly.";
                banner.classList.remove('success');
                banner.classList.add('show', 'error');
            }
        } catch (err) {
            banner.textContent = "Couldn't reach the server. Check your connection and try again.";
            banner.classList.remove('success');
            banner.classList.add('show', 'error');
        }

        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Message';
    });
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