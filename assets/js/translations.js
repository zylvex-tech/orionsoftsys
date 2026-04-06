/**
 * Orion Multilingual Translation Engine
 * Supports: English (default), French, Spanish, German
 */

(function() {
  'use strict';

  // ========================================
  // TRANSLATION DICTIONARY
  // ========================================
  const TRANSLATIONS = {
    // --- NAVBAR ---
    'nav.home': { en: 'Home', fr: 'Accueil', es: 'Inicio', de: 'Startseite' },
    'nav.about': { en: 'About', fr: 'À propos', es: 'Acerca de', de: 'Über uns' },
    'nav.services': { en: 'Services', fr: 'Services', es: 'Servicios', de: 'Dienste' },
    'nav.products': { en: 'Products', fr: 'Produits', es: 'Productos', de: 'Produkte' },
    'nav.projects': { en: 'Projects', fr: 'Projets', es: 'Proyectos', de: 'Projekte' },
    'nav.pricing': { en: 'Pricing', fr: 'Tarifs', es: 'Precios', de: 'Preise' },
    'nav.contact': { en: 'Contact', fr: 'Contact', es: 'Contacto', de: 'Kontakt' },
    'nav.download': { en: 'Download', fr: 'Telecharger', es: 'Descargar', de: 'Herunterladen' },
    'nav.demo': { en: 'Book a Demo', fr: 'Reserver une demo', es: 'Reservar una demo', de: 'Demo buchen' },

    // --- DOWNLOAD PAGE ---
    'download_hero_title': { en: 'Download <span class="text-gradient">MIC Enterprise</span>', fr: 'Telecharger <span class="text-gradient">MIC Enterprise</span>', es: 'Descargar <span class="text-gradient">MIC Enterprise</span>', de: 'Herunterladen <span class="text-gradient">MIC Enterprise</span>' },
    'download_hero_subtitle': { en: 'Enterprise-grade management software built for modern businesses.', fr: 'Logiciel de gestion de niveau entreprise conçu pour les entreprises modernes.', es: 'Software de gestión de nivel empresarial diseñado para empresas modernas.', de: 'Management-Software in Unternehmensqualität für moderne Unternehmen.' },
    'download_hero_cta': { en: 'Start 14-Day Free Trial', fr: 'Commencer l\'essai gratuit de 14 jours', es: 'Iniciar prueba gratuita de 14 días', de: '14-Tage kostenlose Testversion starten' },
    'download_trial_badge': { en: 'Start your 14-day free trial. No credit card required.', fr: 'Commencez votre essai gratuit de 14 jours. Aucune carte de crédit requise.', es: 'Inicie su prueba gratuita de 14 días. No se requiere tarjeta de crédito.', de: 'Starten Sie Ihre 14-tägige kostenlose Testversion. Keine Kreditkarte erforderlich.' },
    'download_product_title': { en: 'What is <span class="text-gradient">MIC Enterprise?</span>', fr: 'Qu\'est-ce que <span class="text-gradient">MIC Enterprise?</span>', es: '¿Qué es <span class="text-gradient">MIC Enterprise?</span>', de: 'Was ist <span class="text-gradient">MIC Enterprise?</span>' },
    'download_desc_1': { en: 'MIC Enterprise is a comprehensive business management platform designed to streamline operations, reduce overhead, and boost productivity. Built for modern enterprises, it brings together inventory control, staff management, financial tracking, and customer relations into a single, powerful system.', fr: 'MIC Enterprise est une plateforme de gestion d\'entreprise complète conçue pour rationaliser les opérations, réduire les coûts généraux et augmenter la productivité.', es: 'MIC Enterprise es una plataforma completa de gestión empresarial diseñada para optimizar las operaciones, reducir los gastos generales y aumentar la productividad.', de: 'MIC Enterprise ist eine umfassende Geschäftsmanagementplattform, die darauf ausgelegt ist, Abläufe zu optimieren, накладные расходы zu reduzieren und die Produktivität zu steigern.' },
    'download_desc_2': { en: 'Whether you run a single office or a multi-branch organisation, MIC Enterprise gives you real-time visibility into every aspect of your business. With automated reporting, intelligent alerts, and an intuitive interface, your team can focus on what matters most - growing your business.', fr: 'Que vous dirigiez un seul bureau ou une organisation multi-sites, MIC Enterprise vous donne une visibilité en temps réel sur chaque aspect de votre entreprise.', es: 'Ya sea que dirija una sola oficina o una organización con varias sucursales, MIC Enterprise le da visibilidad en tiempo real de cada aspecto de su negocio.', de: 'Ob Sie ein einzelnes Büro oder eine Multi-Branch-Organisation führen, MIC Enterprise gibt Ihnen Echtzeit-Einblick in jeden Aspekt Ihres Unternehmens.' },
    'download_desc_3': { en: 'Trusted by businesses across industries, MIC Enterprise has helped companies reduce operational costs by up to 30% while improving accuracy and compliance across all departments.', fr: 'Approuvé par des entreprises de tous secteurs, MIC Enterprise a aidé des entreprises à réduire les coûts opérationnels jusqu\'à 30% tout en améliorant la précision et la conformité.', es: 'Confiado por empresas de todas las industrias, MIC Enterprise ha ayudado a las empresas a reducir los costos operativos hasta en un 30% mientras mejora la precisión y el cumplimiento.', de: 'Vertraut von Unternehmen aller Branchen, hat MIC Enterprise Unternehmen geholfen, die Betriebskosten um bis zu 30% zu senken und gleichzeitig Genauigkeit und Compliance zu verbessern.' },
    'download_features_title': { en: 'Key <span class="text-gradient">Features</span>', fr: 'Fonctionnalités <span class="text-gradient">Clés</span>', es: 'Características <span class="text-gradient">Principales</span>', de: 'Wichtige <span class="text-gradient">Funktionen</span>' },
    'download_features_subtitle': { en: 'Everything you need to manage your business in one place.', fr: 'Tout ce dont vous avez besoin pour gérer votre entreprise en un seul endroit.', es: 'Todo lo que necesita para gestionar su negocio en un solo lugar.', de: 'Alles, was Sie zur Verwaltung Ihres Unternehmens an einem Ort benötigen.' },
    'feature_inventory_title': { en: 'Inventory Management', fr: 'Gestion des Stocks', es: 'Gestión de Inventario', de: 'Inventarverwaltung' },
    'feature_inventory_desc': { en: 'Track stock levels, automate reordering, and manage suppliers from a centralised dashboard.', fr: 'Suivez les niveaux de stock, automatisez les réapprovisionnements et gérez les fournisseurs depuis un tableau de bord centralisé.', es: 'Rastree niveles de stock, automatice reabastecimiento y gestione proveedores desde un panel centralizado.', de: 'Verfolgen Sie Lagerbestände, automatisieren Sie Nachbestellungen und verwalten Sie Lieferanten von einem zentralen Dashboard aus.' },
    'feature_staffing_title': { en: 'Staff Scheduling', fr: 'Planification du Personnel', es: 'Programación de Personal', de: 'Personalplanung' },
    'feature_staffing_desc': { en: 'Create shift rosters, manage leave requests, and optimise workforce allocation effortlessly.', fr: 'Créez des plannings d\'équipe, gérez les demandes de congé et optimisez l\'allocation du personnel sans effort.', es: 'Cree turnos, gestione solicitudes de licencia y optimice la asignación de personal sin esfuerzo.', de: 'Erstellen Sie Schichtpläne, verwalten Sie Urlaubsanträge und optimieren Sie die Personalzuweisung mühelos.' },
    'feature_finance_title': { en: 'Financial Reporting', fr: 'Rapports Financiers', es: 'Informes Financieros', de: 'Finanzberichte' },
    'feature_finance_desc': { en: 'Generate profit & loss statements, balance sheets, and custom financial reports in seconds.', fr: 'Générez des comptes de résultat, des bilans et des rapports financiers personnalisés en quelques secondes.', es: 'Genere estados de pérdidas y ganancias, balances e informes financieros personalizados en segundos.', de: 'Erstellen Sie Gewinn- und Verlustrechnungen, Bilanzen und individuelle Finanzberichte in Sekunden.' },
    'feature_multibranch_title': { en: 'Multi-Branch Support', fr: 'Support Multi-Sites', es: 'Soporte Multi-Sucursal', de: 'Multi-Standort-Unterstützung' },
    'feature_multibranch_desc': { en: 'Manage multiple locations from a single interface with branch-level permissions and reporting.', fr: 'Gérez plusieurs sites depuis une seule interface avec des autorisations et des rapports au niveau de chaque site.', es: 'Gestione múltiples ubicaciones desde una sola interfaz con permisos e informes a nivel de sucursal.', de: 'Verwalten Sie mehrere Standorte von einer einzigen Oberfläche aus mit Berechtigungen und Berichten auf Standortebene.' },
    'feature_customer_title': { en: 'Customer Database', fr: 'Base de Données Clients', es: 'Base de Datos de Clientes', de: 'Kundendatenbank' },
    'feature_customer_desc': { en: 'Store customer profiles, purchase history, and communication logs for personalised service.', fr: 'Stockez les profils clients, l\'historique des achats et les journaux de communication pour un service personnalisé.', es: 'Almacene perfiles de clientes, historial de compras y registros de comunicación para un servicio personalizado.', de: 'Speichern Sie Kundenprofile, Kaufhistorie und Kommunikationsprotokolle für personalisierten Service.' },
    'feature_alerts_title': { en: 'Automated Alerts', fr: 'Alertes Automatisées', es: 'Alertas Automatizadas', de: 'Automatisierte Benachrichtigungen' },
    'feature_alerts_desc': { en: 'Receive timely notifications for low stock, overdue payments, and critical business events.', fr: 'Recevez des notifications en temps opportun pour les stocks faibles, les paiements en retard et les événements commerciaux critiques.', es: 'Reciba notificaciones oportunas por stock bajo, pagos vencidos y eventos comerciales críticos.', de: 'Erhalten Sie zeitnahe Benachrichtigungen für niedrige Lagerbestände, überfällige Zahlungen und kritische Geschäftsereignisse.' },
    'download_requirements_title': { en: 'System <span class="text-gradient">Requirements</span>', fr: 'Configuration <span class="text-gradient">Requise</span>', es: 'Requisitos <span class="text-gradient">del Sistema</span>', de: 'System<span class="text-gradient">anforderungen</span>' },
    'download_requirements_subtitle': { en: 'Make sure your system meets the minimum requirements.', fr: 'Assurez-vous que votre système répond aux exigences minimales.', es: 'Asegúrese de que su sistema cumple con los requisitos mínimos.', de: 'Stellen Sie sicher, dass Ihr System die Mindestanforderungen erfüllt.' },
    'req_os_label': { en: 'OS:', fr: 'OS:', es: 'SO:', de: 'BS:' },
    'req_os_value': { en: 'Windows 10+, macOS 11+, Linux Ubuntu 20+', fr: 'Windows 10+, macOS 11+, Linux Ubuntu 20+', es: 'Windows 10+, macOS 11+, Linux Ubuntu 20+', de: 'Windows 10+, macOS 11+, Linux Ubuntu 20+' },
    'req_ram_label': { en: 'RAM:', fr: 'RAM:', es: 'RAM:', de: 'RAM:' },
    'req_ram_value': { en: '4GB minimum, 8GB recommended', fr: '4 Go minimum, 8 Go recommandés', es: '4 GB mínimo, 8 GB recomendados', de: '4 GB Minimum, 8 GB empfohlen' },
    'req_storage_label': { en: 'Storage:', fr: 'Stockage:', es: 'Almacenamiento:', de: 'Speicher:' },
    'req_storage_value': { en: '500MB available space', fr: '500 Mo d\'espace disponible', es: '500 MB de espacio disponible', de: '500 MB verfügbarer Speicherplatz' },
    'req_internet_label': { en: 'Internet:', fr: 'Internet:', es: 'Internet:', de: 'Internet:' },
    'req_internet_value': { en: 'Required for cloud features', fr: 'Requis pour les fonctionnalités cloud', es: 'Requerido para funciones en la nube', de: 'Erforderlich für Cloud-Funktionen' },
    'download_screenshots_title': { en: 'Product <span class="text-gradient">Screenshots</span>', fr: 'Captures <span class="text-gradient">d\'Écran</span>', es: 'Capturas <span class="text-gradient">de Pantalla</span>', de: 'Produkt<span class="text-gradient">screenshots</span>' },
    'download_screenshots_subtitle': { en: 'Take a look at MIC Enterprise in action.', fr: 'Découvrez MIC Enterprise en action.', es: 'Vea MIC Enterprise en acción.', de: 'Werfen Sie einen Blick auf MIC Enterprise in Aktion.' },
    'screenshot_1': { en: 'Dashboard Overview', fr: 'Vue du Tableau de Bord', es: 'Vista del Panel', de: 'Dashboard-Übersicht' },
    'screenshot_2': { en: 'Inventory Management', fr: 'Gestion des Stocks', es: 'Gestión de Inventario', de: 'Inventarverwaltung' },
    'screenshot_3': { en: 'Financial Reports', fr: 'Rapports Financiers', es: 'Informes Financieros', de: 'Finanzberichte' },
    'download_form_title': { en: 'Download <span class="text-gradient">MIC Enterprise</span>', fr: 'Telecharger <span class="text-gradient">MIC Enterprise</span>', es: 'Descargar <span class="text-gradient">MIC Enterprise</span>', de: 'Herunterladen <span class="text-gradient">MIC Enterprise</span>' },
    'download_form_subtitle': { en: 'Enter your email to download MIC Enterprise', fr: 'Entrez votre email pour telecharger MIC Enterprise', es: 'Ingrese su correo electrónico para descargar MIC Enterprise', de: 'Geben Sie Ihre E-Mail-Adresse ein, um MIC Enterprise herunterzuladen' },
    'download_email_placeholder': { en: 'Enter your email address', fr: 'Entrez votre adresse email', es: 'Ingrese su correo electrónico', de: 'Geben Sie Ihre E-Mail-Adresse ein' },
    'download_btn': { en: 'Download Now', fr: 'Telecharger Maintenant', es: 'Descargar Ahora', de: 'Jetzt Herunterladen' },
    'download_note': { en: 'Start your 14-day free trial. No credit card required.', fr: 'Commencez votre essai gratuit de 14 jours. Aucune carte de crédit requise.', es: 'Inicie su prueba gratuita de 14 días. No se requiere tarjeta de crédito.', de: 'Starten Sie Ihre 14-tägige kostenlose Testversion. Keine Kreditkarte erforderlich.' },
    'download_cta_title': { en: 'Have Questions About <span class="text-gradient">MIC Enterprise?</span>', fr: 'Des Questions sur <span class="text-gradient">MIC Enterprise?</span>', es: '¿Tiene Preguntas sobre <span class="text-gradient">MIC Enterprise?</span>', de: 'Fragen zu <span class="text-gradient">MIC Enterprise?</span>' },
    'download_cta_subtitle': { en: 'Our team is ready to help you get started.', fr: 'Notre équipe est prête à vous aider à démarrer.', es: 'Nuestro equipo está listo para ayudarle a comenzar.', de: 'Unser Team ist bereit, Ihnen beim Einstieg zu helfen.' },
    'download_cta_contact': { en: 'Contact Us', fr: 'Contactez-nous', es: 'Contáctenos', de: 'Kontaktieren Sie uns' },
    'download_cta_demo': { en: 'Book a Demo', fr: 'Reserver une demo', es: 'Reservar una demo', de: 'Demo buchen' },

    // --- HOMEPAGE ---
    'hero.title': { en: 'We Build <span class="text-gradient">AI Systems</span> That Help Your Business Grow', fr: 'Nous construisons des <span class="text-gradient">systèmes IA</span> qui aident votre entreprise à croître', es: 'Creamos <span class="text-gradient">sistemas de IA</span> que ayudan a crecer su negocio', de: 'Wir bauen <span class="text-gradient">KI-Systeme</span>, die Ihrem Unternehmen helfen zu wachsen' },
    'hero.subtitle': { en: 'Automate customer responses, capture leads, and scale your business with intelligent systems.', fr: 'Automatisez les réponses clients, capturez des leads et développez votre entreprise avec des systèmes intelligents.', es: 'Automatice las respuestas al cliente, capture clientes potenciales y escale su negocio con sistemas inteligentes.', de: 'Automatisieren Sie Kundenantworten, erfassen Sie Leads und skalieren Sie Ihr Unternehmen mit intelligenten Systemen.' },
    'hero.cta.primary': { en: 'Get Your AI Assistant', fr: 'Obtenez votre assistant IA', es: 'Obtenga su asistente de IA', de: 'Erhalten Sie Ihren KI-Assistenten' },
    'hero.cta.secondary': { en: 'Book a Demo', fr: 'Réserver une démo', es: 'Reservar una demo', de: 'Demo buchen' },

    'trust.projects': { en: 'Projects Delivered', fr: 'Projets Livrés', es: 'Proyectos Entregados', de: 'Gelieferte Projekte' },
    'trust.systems': { en: 'Systems Built', fr: 'Systèmes Construits', es: 'Sistemas Construidos', de: 'Gebaute Systeme' },
    'trust.tech': { en: 'Technologies Used', fr: 'Technologies Utilisées', es: 'Tecnologías Utilizadas', de: 'Verwendete Technologien' },

    'product.title': { en: 'Our AI Products', fr: 'Nos Produits IA', es: 'Nuestros Productos de IA', de: 'Unsere KI-Produkte' },
    'product.name': { en: 'Orion AI Assistant', fr: 'Orion Assistant IA', es: 'Orion Asistente de IA', de: 'Orion KI-Assistent' },
    'product.desc': { en: 'An AI assistant that replies instantly to customers, works 24/7, and helps businesses never miss a lead.', fr: 'Un assistant IA qui répond instantanément aux clients, fonctionne 24h/24 et 7j/7, et aide les entreprises à ne jamais manquer un lead.', es: 'Un asistente de IA que responde instantáneamente a los clientes, funciona 24/7 y ayuda a las empresas a nunca perder un cliente potencial.', de: 'Ein KI-Assistent, der sofort auf Kunden antwortet, 24/7 arbeitet und Unternehmen hilft, nie einen Lead zu verpassen.' },
    'product.feature.1': { en: 'Instant replies', fr: 'Réponses instantanées', es: 'Respuestas instantáneas', de: 'Sofortige Antworten' },
    'product.feature.2': { en: 'WhatsApp + Website integration', fr: 'Intégration WhatsApp + Site web', es: 'Integración WhatsApp + Sitio web', de: 'WhatsApp + Website-Integration' },
    'product.feature.3': { en: 'Lead capture', fr: 'Capture de leads', es: 'Captura de clientes potenciales', de: 'Lead-Erfassung' },
    'product.feature.4': { en: 'Custom-trained AI', fr: 'IA personnalisée', es: 'IA personalizada', de: 'Individuell trainierte KI' },

    'services.title': { en: 'Our Services', fr: 'Nos Services', es: 'Nuestros Servicios', de: 'Unsere Dienste' },
    'services.subtitle': { en: 'Intelligent solutions designed to grow your business', fr: 'Solutions intelligentes conçues pour développer votre entreprise', es: 'Soluciones inteligentes diseñadas para hacer crecer su negocio', de: 'Intelligente Lösungen, die Ihr Unternehmen wachsen lassen' },
    'services.webdev': { en: 'Web Development', fr: 'Développement Web', es: 'Desarrollo Web', de: 'Webentwicklung' },
    'services.ai': { en: 'AI Solutions', fr: 'Solutions IA', es: 'Soluciones de IA', de: 'KI-Lösungen' },
    'services.automation': { en: 'Automation Systems', fr: 'Systèmes d\'automatisation', es: 'Sistemas de automatización', de: 'Automatisierungssysteme' },
    'services.custom': { en: 'Custom Software', fr: 'Logiciel Personnalisé', es: 'Software Personalizado', de: 'Individuelle Software' },

    'why.title': { en: 'Why Choose Orion?', fr: 'Pourquoi choisir Orion ?', es: '¿Por qué elegir Orion?', de: 'Warum Orion wählen?' },
    'why.1': { en: 'We build systems, not just software', fr: 'Nous construisons des systèmes, pas seulement des logiciels', es: 'Creamos sistemas, no solo software', de: 'Wir bauen Systeme, nicht nur Software' },
    'why.2': { en: 'AI-first approach', fr: 'Approche IA en premier', es: 'Enfoque de IA primero', de: 'KI-First-Ansatz' },
    'why.3': { en: 'Scalable architecture', fr: 'Architecture évolutive', es: 'Arquitectura escalable', de: 'Skalierbare Architektur' },
    'why.4': { en: 'Built for real-world use', fr: 'Conçu pour une utilisation réelle', es: 'Construido para uso real', de: 'Für den echten Einsatz gebaut' },

    'projects.title': { en: 'Recent Projects', fr: 'Projets Récents', es: 'Proyectos Recientes', de: 'Aktuelle Projekte' },
    'projects.viewall': { en: 'View All Projects', fr: 'Voir Tous les Projets', es: 'Ver Todos los Proyectos', de: 'Alle Projekte anzeigen' },

    'cta.title': { en: "Let's Build Something That Works", fr: 'Construisons quelque chose qui fonctionne', es: 'Construyamos algo que funcione', de: 'Lassen Sie uns etwas bauen, das funktioniert' },
    'cta.start': { en: 'Start a Project', fr: 'Démarrer un Projet', es: 'Iniciar un Proyecto', de: 'Ein Projekt starten' },
    'cta.contact': { en: 'Contact Us', fr: 'Contactez-nous', es: 'Contáctenos', de: 'Kontaktieren Sie uns' },

    // --- FOOTER ---
    'footer.desc': { en: 'Building intelligent systems that solve real-world business problems with AI.', fr: 'Construire des systèmes intelligents qui résolvent les problèmes commerciaux réels avec l\'IA.', es: 'Construyendo sistemas inteligentes que resuelven problemas empresariales reales con IA.', de: 'Intelligente Systeme, die reale Geschäftsprobleme mit KI lösen.' },
    'footer.quick': { en: 'Quick Links', fr: 'Liens Rapides', es: 'Enlaces Rápidos', de: 'Schnelllinks' },
    'footer.services': { en: 'Our Services', fr: 'Nos Services', es: 'Nuestros Servicios', de: 'Unsere Dienste' },
    'footer.contact': { en: 'Contact Info', fr: 'Infos Contact', es: 'Información de Contacto', de: 'Kontaktinformationen' },
    'footer.email': { en: 'Email', fr: 'Email', es: 'Correo', de: 'E-Mail' },
    'footer.whatsapp': { en: 'WhatsApp', fr: 'WhatsApp', es: 'WhatsApp', de: 'WhatsApp' },
    'footer.rights': { en: 'All rights reserved.', fr: 'Tous droits réservés.', es: 'Todos los derechos reservados.', de: 'Alle Rechte vorbehalten.' },
    'footer.company': { en: 'Orion Soft Systems. Building Intelligent Systems for a Smarter Future.', fr: 'Orion Soft Systems. Construire des systèmes intelligents pour un avenir plus intelligent.', es: 'Orion Soft Systems. Construyendo sistemas inteligentes para un futuro más inteligente.', de: 'Orion Soft Systems. Intelligente Systeme für eine intelligentere Zukunft.' },

    // --- COMMON ---
    'common.see_more': { en: 'Learn More', fr: 'En Savoir Plus', es: 'Más Información', de: 'Mehr erfahren' },
    'common.get_started': { en: 'Get Started', fr: 'Commencer', es: 'Comenzar', de: 'Loslegen' },
    'common.request_demo': { en: 'Request Demo', fr: 'Demander une démo', es: 'Solicitar demo', de: 'Demo anfordern' },
  };

  // ========================================
  // TRANSLATION ENGINE
  // ========================================
  const TranslationEngine = {
    currentLang: 'en',
    supportedLangs: ['en', 'fr', 'es', 'de'],

    init() {
      // Load saved language
      const saved = localStorage.getItem('orion_language');
      if (saved && this.supportedLangs.includes(saved)) {
        this.currentLang = saved;
      }

      this.bindLanguageSwitcher();
      this.applyTranslations();
    },

    bindLanguageSwitcher() {
      const switcherBtn = document.getElementById('langSwitcherBtn');
      const dropdown = document.getElementById('langDropdown');
      const langOptions = document.querySelectorAll('.lang-option');

      if (switcherBtn) {
        switcherBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          if (dropdown) dropdown.classList.toggle('active');
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', () => {
          if (dropdown) dropdown.classList.remove('active');
        });
      }

      langOptions.forEach(option => {
        option.addEventListener('click', () => {
          const lang = option.dataset.lang;
          this.setLanguage(lang);
          if (dropdown) dropdown.classList.remove('active');
        });
      });

      // Update active state
      this.updateActiveLang();
    },

    setLanguage(lang) {
      if (!this.supportedLangs.includes(lang)) return;
      this.currentLang = lang;
      localStorage.setItem('orion_language', lang);
      this.applyTranslations();
      this.updateActiveLang();

      // Update switcher button label
      const btn = document.getElementById('langSwitcherBtn');
      if (btn) {
        const labels = { en: 'EN', fr: 'FR', es: 'ES', de: 'DE' };
        btn.textContent = labels[lang] || 'EN';
      }

      // Update html lang attribute
      document.documentElement.lang = lang;
    },

    updateActiveLang() {
      document.querySelectorAll('.lang-option').forEach(opt => {
        opt.classList.toggle('active', opt.dataset.lang === this.currentLang);
      });
    },

    applyTranslations() {
      // Translate elements with data-i18n attribute
      const elements = document.querySelectorAll('[data-i18n]');
      elements.forEach(el => {
        const key = el.dataset.i18n;
        if (TRANSLATIONS[key] && TRANSLATIONS[key][this.currentLang]) {
          el.innerHTML = TRANSLATIONS[key][this.currentLang];
        }
      });

      // Translate elements with data-i18n-placeholder
      const placeholders = document.querySelectorAll('[data-i18n-placeholder]');
      placeholders.forEach(el => {
        const key = el.dataset.i18nPlaceholder;
        if (TRANSLATIONS[key] && TRANSLATIONS[key][this.currentLang]) {
          el.placeholder = TRANSLATIONS[key][this.currentLang];
        }
      });

      // Translate elements with data-i18n-title
      const titles = document.querySelectorAll('[data-i18n-title]');
      titles.forEach(el => {
        const key = el.dataset.i18nTitle;
        if (TRANSLATIONS[key] && TRANSLATIONS[key][this.currentLang]) {
          el.title = TRANSLATIONS[key][this.currentLang];
        }
      });
    },

    t(key) {
      if (TRANSLATIONS[key] && TRANSLATIONS[key][this.currentLang]) {
        return TRANSLATIONS[key][this.currentLang];
      }
      if (TRANSLATIONS[key] && TRANSLATIONS[key].en) {
        return TRANSLATIONS[key].en;
      }
      return key;
    }
  };

  // ========================================
  // INITIALIZE
  // ========================================
  document.addEventListener('DOMContentLoaded', () => {
    TranslationEngine.init();
  });

  // Make available globally
  window.TranslationEngine = TranslationEngine;

})();
