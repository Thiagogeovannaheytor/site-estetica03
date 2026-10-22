document.addEventListener('DOMContentLoaded', () => {
    // 1. Configuração de UTMs para rastreamento de origem
    const urlParams = new URLSearchParams(window.location.search);
    const utmSource = urlParams.get('utm_source') || 'organico';
    const utmCampaign = urlParams.get('utm_campaign') || 'site_institucional';

    // Atualiza todos os links do WhatsApp com a origem da campanha
    const waMessage = `Olá! Conheci a Juh Estética pelo site (Origem: ${utmSource} / Campanha: ${utmCampaign}) e gostaria de informações sobre os tratamentos e agendamentos.`;
    const waLink = `https://wa.me/5511969767773?text=${encodeURIComponent(waMessage)}`;
    
    document.querySelectorAll('.wa-link').forEach(link => {
        link.setAttribute('href', waLink);
    });

    // 2. Menu Mobile
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');
    if (menuBtn && navMenu) {
        menuBtn.addEventListener('click', () => {
            const isExpanded = menuBtn.getAttribute('aria-expanded') === 'true';
            menuBtn.setAttribute('aria-expanded', !isExpanded);
            navMenu.classList.toggle('active');
        });
        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                menuBtn.setAttribute('aria-expanded', 'false');
            });
        });
    }

    // 3. Header Glassmorphism ao Rolar
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        header.classList.toggle('scrolled', window.scrollY > 50);
    });

    // 4. Scroll Reveal (Intersection Observer)
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    // 5. FAQ Accordion
    document.querySelectorAll('.faq-question').forEach(question => {
        question.addEventListener('click', () => {
            const answer = question.nextElementSibling;
            const isExpanded = question.getAttribute('aria-expanded') === 'true';
            
            document.querySelectorAll('.faq-question').forEach(q => {
                q.setAttribute('aria-expanded', 'false');
                q.nextElementSibling.style.maxHeight = null;
            });
            
            if (!isExpanded) {
                question.setAttribute('aria-expanded', 'true');
                answer.style.maxHeight = answer.scrollHeight + "px";
            }
        });
    });

    // 6. Formulário para WhatsApp (Fallback sem backend)
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            trackEvent('form_start');
            
            const nome = document.getElementById('nome').value.trim();
            const interesse = document.getElementById('interesse').value;
            const mensagem = document.getElementById('mensagem').value.trim();
            
            if (!nome || !interesse || !mensagem) {
                alert('Por favor, preencha todos os campos obrigatórios.');
                return;
            }
            
            const texto = `Olá! Meu nome é ${nome}.%0A%0ATenho interesse em: ${interesse}.%0A%0AMensagem: ${mensagem}%0A%0A(Origem: Site Institucional - ${utmSource})`;
            window.open(`https://wa.me/5511969767773?text=${texto}`, '_blank');
            
            contactForm.reset();
            trackEvent('form_submit');
        });
    }

    // 7. Gestão de Cookies e Consentimento
    const cookieBanner = document.getElementById('cookie-banner');
    const consent = localStorage.getItem('juh_cookie_consent');
    
    if (!consent) {
        setTimeout(() => cookieBanner.classList.add('show'), 1500);
    }
    
    document.getElementById('accept-cookies').addEventListener('click', () => {
        localStorage.setItem('juh_cookie_consent', 'accepted');
        cookieBanner.classList.remove('show');
        initAnalytics(); // Ativa scripts se houver
    });
    
    document.getElementById('reject-cookies').addEventListener('click', () => {
        localStorage.setItem('juh_cookie_consent', 'rejected');
        cookieBanner.classList.remove('show');
    });

    // 8. Função de Rastreamento Segura (GA4 Ready)
    window.trackEvent = function(eventName, params = {}) {
        const userConsent = localStorage.getItem('juh_cookie_consent');
        
        // Adiciona parâmetros de contexto automaticamente
        params.page_location = window.location.href;
        params.utm_source = utmSource;

        if (userConsent === 'accepted') {
            // Se o GA4 (gtag) estiver configurado no futuro, descomente a linha abaixo:
            // if (typeof gtag === 'function') { gtag('event', eventName, params); }
            
            // Log para desenvolvimento (remover em produção se desejado)
            console.log(`[GA4 Event] ${eventName}`, params);
        } else {
            console.log(`[Event Blocked] ${eventName} (Consent: ${userConsent})`);
        }
    };

    // Função placeholder para inicializar analytics reais
    function initAnalytics() {
        // Exemplo: Injetar script do GTM ou GA4 aqui se o ID for fornecido
        console.log("Analytics initialized (Pending real ID configuration)");
    }
});