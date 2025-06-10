/**
 * Language Switcher Functionality
 * Handles language switching and URL mapping for multilingual site
 */

(function() {
  'use strict';

  // Language configuration
  const LANGUAGES = {
    'en': {
      code: 'en',
      name: 'English',
      flag: '/assets/images/flags/en.svg',
      display: 'EN'
    },
    'fr': {
      code: 'fr', 
      name: 'Français',
      flag: '/assets/images/flags/fr.svg',
      display: 'FR'
    },
    'zh': {
      code: 'zh',
      name: '中文',
      flag: '/assets/images/flags/zh.svg', 
      display: '中文'
    }
  };

  // URL mapping between languages
  const URL_MAPPINGS = {
    // English to French
    '/': '/fr/',
    '/en/services/': '/fr/services/',
    '/en/services/marketing/': '/fr/services/france-marketing/',
    '/en/services/sourcing/': '/fr/services/sourcing-2/',
    '/en/services/investment/': '/fr/services/investissement/',
    '/en/services/regulatory-affairs/': '/fr/services/affaires-reglementaires/',
    '/en/services/business-consultancy/': '/fr/services/business-consultant/',
    '/en/services/distribution/': '/fr/services/distribution-2/',
    '/en/portfolio/': '/fr/portfolio/',
    '/en/about/': '/fr/qui-sommes-nous/',
    '/en/contact/': '/fr/contactez-nous/',

    // English to Chinese
    '/': '/zh/',
    '/en/services/': '/zh/services/',
    '/en/services/marketing/': '/zh/services/marketing/',
    '/en/services/sourcing/': '/zh/services/sourcing/',
    '/en/services/investment/': '/zh/services/investment/',
    '/en/services/regulatory-affairs/': '/zh/services/regulatory-affairs/',
    '/en/services/business-consultancy/': '/zh/services/business-consultancy/',
    '/en/services/distribution/': '/zh/services/distribution/',
    '/en/portfolio/': '/zh/portfolio/',
    '/en/about/': '/zh/about/',
    '/en/contact/': '/zh/contact/',

    // French to English
    '/fr/': '/',
    '/fr/services/': '/en/services/',
    '/fr/services/france-marketing/': '/en/services/marketing/',
    '/fr/services/sourcing-2/': '/en/services/sourcing/',
    '/fr/services/investissement/': '/en/services/investment/',
    '/fr/services/affaires-reglementaires/': '/en/services/regulatory-affairs/',
    '/fr/services/business-consultant/': '/en/services/business-consultancy/',
    '/fr/services/distribution-2/': '/en/services/distribution/',
    '/fr/portfolio/': '/en/portfolio/',
    '/fr/qui-sommes-nous/': '/en/about/',
    '/fr/contactez-nous/': '/en/contact/',

    // French to Chinese  
    '/fr/': '/zh/',
    '/fr/services/': '/zh/services/',
    '/fr/services/france-marketing/': '/zh/services/marketing/',
    '/fr/services/sourcing-2/': '/zh/services/sourcing/',
    '/fr/services/investissement/': '/zh/services/investment/',
    '/fr/services/affaires-reglementaires/': '/zh/services/regulatory-affairs/',
    '/fr/services/business-consultant/': '/zh/services/business-consultancy/',
    '/fr/services/distribution-2/': '/zh/services/distribution/',
    '/fr/portfolio/': '/zh/portfolio/',
    '/fr/qui-sommes-nous/': '/zh/about/',
    '/fr/contactez-nous/': '/zh/contact/',

    // Chinese to English
    '/zh/': '/',
    '/zh/services/': '/en/services/',
    '/zh/services/marketing/': '/en/services/marketing/',
    '/zh/services/sourcing/': '/en/services/sourcing/',
    '/zh/services/investment/': '/en/services/investment/',
    '/zh/services/regulatory-affairs/': '/en/services/regulatory-affairs/',
    '/zh/services/business-consultancy/': '/en/services/business-consultancy/',
    '/zh/services/distribution/': '/en/services/distribution/',
    '/zh/portfolio/': '/en/portfolio/',
    '/zh/about/': '/en/about/',
    '/zh/contact/': '/en/contact/',

    // Chinese to French
    '/zh/': '/fr/',
    '/zh/services/': '/fr/services/',
    '/zh/services/marketing/': '/fr/services/france-marketing/',
    '/zh/services/sourcing/': '/fr/services/sourcing-2/',
    '/zh/services/investment/': '/fr/services/investissement/',
    '/zh/services/regulatory-affairs/': '/fr/services/affaires-reglementaires/',
    '/zh/services/business-consultancy/': '/fr/services/business-consultant/',
    '/zh/services/distribution/': '/fr/services/distribution-2/',
    '/zh/portfolio/': '/fr/portfolio/',
    '/zh/about/': '/fr/qui-sommes-nous/',
    '/zh/contact/': '/fr/contactez-nous/'
  };

  // Initialize language switcher when DOM is ready
  document.addEventListener('DOMContentLoaded', function() {
    initLanguageSwitcher();
    setCurrentLanguage();
    updateLanguageLinks();
  });

  /**
   * Initialize language switcher functionality
   */
  function initLanguageSwitcher() {
    const langToggle = document.querySelector('.lang-toggle');
    const langDropdown = document.querySelector('.lang-dropdown');
    
    if (!langToggle || !langDropdown) return;

    // Toggle dropdown on click
    langToggle.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      const isExpanded = this.getAttribute('aria-expanded') === 'true';
      this.setAttribute('aria-expanded', !isExpanded);
      
      // Close dropdown when clicking outside
      if (!isExpanded) {
        document.addEventListener('click', closeDropdown);
      }
    });

    // Handle keyboard navigation
    langToggle.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.click();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        this.click();
        const firstOption = langDropdown.querySelector('.lang-option');
        if (firstOption) firstOption.focus();
      }
    });

    // Handle dropdown option navigation
    const langOptions = langDropdown.querySelectorAll('.lang-option');
    langOptions.forEach((option, index) => {
      option.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          const nextOption = langOptions[index + 1] || langOptions[0];
          nextOption.focus();
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          const prevOption = langOptions[index - 1] || langOptions[langOptions.length - 1];
          prevOption.focus();
        } else if (e.key === 'Escape') {
          e.preventDefault();
          closeDropdown();
          langToggle.focus();
        } else if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.click();
        }
      });
    });

    function closeDropdown() {
      langToggle.setAttribute('aria-expanded', 'false');
      document.removeEventListener('click', closeDropdown);
    }
  }

  /**
   * Detect and set current language based on URL
   */
  function setCurrentLanguage() {
    const currentPath = window.location.pathname;
    let currentLang = 'en'; // default

    if (currentPath.startsWith('/fr/')) {
      currentLang = 'fr';
    } else if (currentPath.startsWith('/zh/')) {
      currentLang = 'zh';
    }

    // Update current language display
    const currentLangElement = document.querySelector('.current-lang');
    if (currentLangElement && LANGUAGES[currentLang]) {
      currentLangElement.textContent = LANGUAGES[currentLang].display;
    }

    // Update language options
    const langOptions = document.querySelectorAll('.lang-option');
    langOptions.forEach(option => {
      const hreflang = option.getAttribute('hreflang');
      option.classList.toggle('current', hreflang === currentLang);
    });

    // Set document language
    document.documentElement.lang = currentLang;
  }

  /**
   * Update language links based on current page
   */
  function updateLanguageLinks() {
    const currentPath = window.location.pathname;
    const langOptions = document.querySelectorAll('.lang-option');

    langOptions.forEach(option => {
      const targetLang = option.getAttribute('hreflang');
      const mappedUrl = getTranslatedUrl(currentPath, targetLang);
      
      if (mappedUrl) {
        option.href = mappedUrl;
      }
    });
  }

  /**
   * Get translated URL for target language
   */
  function getTranslatedUrl(currentPath, targetLang) {
    // Normalize current path
    const normalizedPath = currentPath.endsWith('/') ? currentPath : currentPath + '/';
    
    // Build mapping key based on current path and target language
    const currentLang = getCurrentLanguageFromPath(normalizedPath);
    
    if (currentLang === targetLang) {
      return normalizedPath; // Same language, return current path
    }

    // Look for direct mapping
    for (const [fromPath, toPath] of Object.entries(URL_MAPPINGS)) {
      if (fromPath === normalizedPath) {
        // Check if this mapping goes to the target language
        const mappingTargetLang = getCurrentLanguageFromPath(toPath);
        if (mappingTargetLang === targetLang) {
          return toPath;
        }
      }
    }

    // Fallback: construct URL based on pattern
    return constructTranslatedUrl(normalizedPath, currentLang, targetLang);
  }

  /**
   * Get current language from URL path
   */
  function getCurrentLanguageFromPath(path) {
    if (path.startsWith('/fr/')) return 'fr';
    if (path.startsWith('/zh/')) return 'zh';
    return 'en';
  }

  /**
   * Construct translated URL when direct mapping not found
   */
  function constructTranslatedUrl(currentPath, currentLang, targetLang) {
    // Remove current language prefix
    let basePath = currentPath;
    if (currentLang === 'fr' && basePath.startsWith('/fr/')) {
      basePath = basePath.substring(3);
    } else if (currentLang === 'zh' && basePath.startsWith('/zh/')) {
      basePath = basePath.substring(3);
    } else if (currentLang === 'en' && basePath.startsWith('/en/')) {
      basePath = basePath.substring(3);
    }

    // Add target language prefix
    if (targetLang === 'en') {
      return basePath === '/' ? '/' : '/en' + basePath;
    } else {
      return '/' + targetLang + (basePath === '/' ? '/' : basePath);
    }
  }

  /**
   * Store user's language preference
   */
  function storeLanguagePreference(lang) {
    try {
      localStorage.setItem('innoledge_preferred_language', lang);
    } catch (e) {
      // Silently fail if localStorage is not available
    }
  }

  /**
   * Get user's stored language preference
   */
  function getStoredLanguagePreference() {
    try {
      return localStorage.getItem('innoledge_preferred_language');
    } catch (e) {
      return null;
    }
  }

  /**
   * Auto-redirect based on browser language (optional)
   */
  function autoRedirectBasedOnBrowserLanguage() {
    // Only redirect on homepage and if no stored preference
    if (window.location.pathname !== '/' || getStoredLanguagePreference()) {
      return;
    }

    const browserLang = navigator.language || navigator.languages[0];
    let targetLang = 'en'; // default

    if (browserLang.startsWith('fr')) {
      targetLang = 'fr';
    } else if (browserLang.startsWith('zh')) {
      targetLang = 'zh';
    }

    if (targetLang !== 'en') {
      const targetUrl = getTranslatedUrl('/', targetLang);
      if (targetUrl && targetUrl !== '/') {
        window.location.href = targetUrl;
      }
    }
  }

  // Language switcher click handlers
  document.addEventListener('click', function(e) {
    if (e.target.matches('.lang-option')) {
      const targetLang = e.target.getAttribute('hreflang');
      storeLanguagePreference(targetLang);
      
      // Analytics tracking (if implemented)
      if (typeof gtag !== 'undefined') {
        gtag('event', 'language_switch', {
          'language': targetLang,
          'page_title': document.title
        });
      }
    }
  });

  // Expose utilities for external use
  window.LanguageSwitcher = {
    getCurrentLanguage: () => getCurrentLanguageFromPath(window.location.pathname),
    getTranslatedUrl,
    setCurrentLanguage,
    updateLanguageLinks,
    LANGUAGES
  };

})();