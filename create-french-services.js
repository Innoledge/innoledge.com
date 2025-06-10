const fs = require('fs');
const path = require('path');
const { verifyPage } = require('./verify-page.js');

// Template for French service pages
const createFrenchServicePage = (serviceName, title, description, content, highlights) => `<!DOCTYPE html>
<html lang="fr" dir="ltr">
<head>
  <title>${title} – Innoledge</title>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="${description}">
  <meta name="robots" content="max-image-preview:large">
  <meta name="generator" content="Static Site Generator">

  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://innoledge.com/fr/services/${serviceName}/">
  <meta property="og:title" content="${title} – Innoledge">
  <meta property="og:description" content="${description}">
  <meta property="og:image" content="https://innoledge.com/assets/images/innoledge-logo.png">
  <meta property="og:locale" content="fr-FR">
  <meta property="og:site_name" content="Innoledge">

  <!-- Language alternates -->
  <link rel="alternate" href="/en/services/${serviceName === 'france-marketing' ? 'marketing' : serviceName === 'sourcing-2' ? 'sourcing' : serviceName === 'investissement' ? 'investment' : serviceName === 'affaires-reglementaires' ? 'regulatory-affairs' : serviceName === 'business-consultant' ? 'business-consultancy' : serviceName === 'distribution-2' ? 'distribution' : serviceName}/" hreflang="en">
  <link rel="alternate" href="/fr/services/${serviceName}/" hreflang="fr">
  <link rel="alternate" href="/zh/services/${serviceName === 'france-marketing' ? 'marketing' : serviceName === 'sourcing-2' ? 'sourcing' : serviceName === 'investissement' ? 'investment' : serviceName === 'affaires-reglementaires' ? 'regulatory-affairs' : serviceName === 'business-consultant' ? 'business-consultancy' : serviceName === 'distribution-2' ? 'distribution' : serviceName}/" hreflang="zh">

  <!-- Favicon -->
  <link rel="icon" href="/assets/images/favicon.ico">
  <link rel="apple-touch-icon" href="/assets/images/apple-touch-icon.png">

  <!-- Stylesheets -->
  <link rel="stylesheet" href="/assets/css/main.css">
  <link rel="stylesheet" href="/assets/css/components.css">

  <!-- Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
</head>
<body class="service-page">
  <header class="site-header">
    <nav class="main-navigation" role="navigation" aria-label="Navigation principale">
      <div class="nav-container">
        <!-- Logo -->
        <div class="site-logo">
          <a href="/fr/" aria-label="Page d'accueil Innoledge">
            <img src="/assets/images/innoledge-logo.png" alt="Innoledge" width="222" height="96">
          </a>
        </div>

        <!-- Main Menu -->
        <div class="nav-menu">
          <ul class="menu-items">
            <li class="menu-item">
              <a href="/fr/">Page d'accueil</a>
            </li>
            <li class="menu-item current-menu-item">
              <a href="/fr/services/">Services</a>
            </li>
            <li class="menu-item">
              <a href="/fr/portfolio/">Portfolio</a>
            </li>
            <li class="menu-item">
              <a href="/fr/about/">Qui Sommes-Nous</a>
            </li>
            <li class="menu-item">
              <a href="/fr/contact/">Contactez-Nous</a>
            </li>
          </ul>
        </div>

        <!-- Language Switcher -->
        <div class="language-switcher">
          <button class="lang-toggle" aria-label="Options de langue" aria-expanded="false" aria-haspopup="true">
            <span class="current-lang">FR</span>
            <svg class="dropdown-arrow" width="12" height="8" viewBox="0 0 12 8" fill="none">
              <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
          <div class="lang-dropdown" role="menu">
            <a href="/en/services/${serviceName === 'france-marketing' ? 'marketing' : serviceName === 'sourcing-2' ? 'sourcing' : serviceName === 'investissement' ? 'investment' : serviceName === 'affaires-reglementaires' ? 'regulatory-affairs' : serviceName === 'business-consultant' ? 'business-consultancy' : serviceName === 'distribution-2' ? 'distribution' : serviceName}/" class="lang-option" role="menuitem" hreflang="en">
              <img src="/assets/images/flags/en.svg" alt="" width="20" height="15">
              <span>English</span>
            </a>
            <a href="/fr/services/${serviceName}/" class="lang-option current" role="menuitem" hreflang="fr">
              <img src="/assets/images/flags/fr.svg" alt="" width="20" height="15">
              <span>Français</span>
            </a>
            <a href="/zh/services/${serviceName === 'france-marketing' ? 'marketing' : serviceName === 'sourcing-2' ? 'sourcing' : serviceName === 'investissement' ? 'investment' : serviceName === 'affaires-reglementaires' ? 'regulatory-affairs' : serviceName === 'business-consultant' ? 'business-consultancy' : serviceName === 'distribution-2' ? 'distribution' : serviceName}/" class="lang-option" role="menuitem" hreflang="zh">
              <img src="/assets/images/flags/zh.svg" alt="" width="20" height="15">
              <span>中文</span>
            </a>
          </div>
        </div>

        <!-- Mobile Menu Toggle -->
        <button class="mobile-menu-toggle" aria-label="Basculer le menu mobile" aria-expanded="false">
          <span class="hamburger-line"></span>
          <span class="hamburger-line"></span>
          <span class="hamburger-line"></span>
        </button>
      </div>
    </nav>
  </header>

  <main id="main-content" class="main-content">
    <!-- Page Header -->
    <section class="page-header">
      <div class="page-header-container">
        <h1 class="page-title">${title}</h1>
        <nav class="breadcrumb" aria-label="Fil d'Ariane">
          <ol class="breadcrumb-list">
            <li class="breadcrumb-item">
              <a href="/fr/">Page d'accueil</a>
            </li>
            <li class="breadcrumb-item">
              <a href="/fr/services/">Services</a>
            </li>
            <li class="breadcrumb-item current" aria-current="page">
              ${title}
            </li>
          </ol>
        </nav>
      </div>
    </section>

    <!-- Service Content -->
    <section class="service-content">
      <div class="service-container">
        <div class="service-grid">
          <!-- Main Content -->
          <div class="service-main">
            <div class="service-intro">
              <img src="/assets/images/services/${serviceName === 'france-marketing' ? 'marketing' : serviceName === 'sourcing-2' ? 'sourcing' : serviceName === 'investissement' ? 'investment' : serviceName === 'affaires-reglementaires' ? 'regulatory-affairs' : serviceName === 'business-consultant' ? 'business-consultancy' : serviceName === 'distribution-2' ? 'distribution' : serviceName}-edited.jpg" alt="Services ${title}" loading="eager" class="service-hero-image">
            </div>

            ${content}

            <!-- Call to Action -->
            <div class="service-cta">
              <h3>Besoin de Services ${title} ?</h3>
              <p>Contactez-nous pour découvrir comment notre expertise en ${title.toLowerCase()} peut aider votre entreprise à réussir en Asie.</p>
              <div class="cta-actions">
                <a href="/fr/contact/" class="btn btn-primary">Nous Contacter</a>
                <a href="/fr/portfolio/" class="btn btn-secondary">Voir Notre Portfolio</a>
              </div>
            </div>
          </div>

          <!-- Sidebar -->
          <div class="service-sidebar">
            <div class="related-services">
              <h3>Nos Services</h3>
              <nav class="services-nav">
                <ul>
                  <li${serviceName === 'france-marketing' ? ' class="current-service"' : ''}>
                    <a href="/fr/services/france-marketing/">Marketing</a>
                  </li>
                  <li${serviceName === 'sourcing-2' ? ' class="current-service"' : ''}>
                    <a href="/fr/services/sourcing-2/">Sourcing</a>
                  </li>
                  <li${serviceName === 'investissement' ? ' class="current-service"' : ''}>
                    <a href="/fr/services/investissement/">Investissement</a>
                  </li>
                  <li${serviceName === 'affaires-reglementaires' ? ' class="current-service"' : ''}>
                    <a href="/fr/services/affaires-reglementaires/">Affaires Réglementaires</a>
                  </li>
                  <li${serviceName === 'business-consultant' ? ' class="current-service"' : ''}>
                    <a href="/fr/services/business-consultant/">Conseil en Affaires</a>
                  </li>
                  <li${serviceName === 'distribution-2' ? ' class="current-service"' : ''}>
                    <a href="/fr/services/distribution-2/">Distribution</a>
                  </li>
                </ul>
              </nav>
            </div>

            <div class="service-highlights">
              <h3>Expertise ${title}</h3>
              <ul>
                ${highlights.map(item => `<li>${item}</li>`).join('\n                ')}
              </ul>
            </div>

            <div class="contact-info-sidebar">
              <h3>Commencer</h3>
              <p>Prêt à discuter de vos besoins en ${title.toLowerCase()} ?</p>
              <a href="/fr/contact/" class="btn btn-primary">Contactez Notre Équipe</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>

  <footer class="site-footer">
    <div class="footer-container">
      <!-- Company Info -->
      <div class="footer-section company-info">
        <div class="footer-logo">
          <img src="/assets/images/innoledge-logo.png" alt="Innoledge" width="180" height="78">
        </div>
        <div class="company-details">
          <h3>INNOLEDGE INTERNATIONAL LTD.</h3>
          <address class="company-address">
            Room 1708, One Midtown<br>
            11 Hoi Shing Road, Tsuen Wan<br>
            Hong Kong
          </address>
        </div>
      </div>

      <!-- Contact Info -->
      <div class="footer-section contact-info">
        <h4>Informations de Contact</h4>
        <div class="contact-details">
          <div class="contact-item">
            <span class="contact-label">Téléphone :</span>
            <a href="tel:+85228037784">+852 2803 7784</a>
          </div>
          <div class="contact-item">
            <span class="contact-label">Fax :</span>
            <span>+852 3568 4410</span>
          </div>
          <div class="contact-item">
            <span class="contact-label">Email :</span>
            <a href="mailto:info@innoledge.com">info@innoledge.com</a>
          </div>
        </div>
      </div>

      <!-- Quick Links -->
      <div class="footer-section quick-links">
        <h4>Liens Rapides</h4>
        <nav class="footer-nav">
          <ul>
            <li><a href="/fr/">Page d'accueil</a></li>
            <li><a href="/fr/services/">Services</a></li>
            <li><a href="/fr/portfolio/">Portfolio</a></li>
            <li><a href="/fr/about/">Qui Sommes-Nous</a></li>
            <li><a href="/fr/contact/">Contactez-Nous</a></li>
          </ul>
        </nav>
      </div>

      <!-- Services -->
      <div class="footer-section services-links">
        <h4>Services</h4>
        <nav class="services-nav">
          <ul>
            <li><a href="/fr/services/france-marketing/">Marketing</a></li>
            <li><a href="/fr/services/sourcing-2/">Sourcing</a></li>
            <li><a href="/fr/services/investissement/">Investissement</a></li>
            <li><a href="/fr/services/affaires-reglementaires/">Affaires Réglementaires</a></li>
            <li><a href="/fr/services/business-consultant/">Business Consultant</a></li>
            <li><a href="/fr/services/distribution-2/">Distribution</a></li>
          </ul>
        </nav>
      </div>
    </div>

    <!-- Footer Bottom -->
    <div class="footer-bottom">
      <div class="footer-bottom-container">
        <div class="copyright">
          <p>Copyright © 2024 Innoledge</p>
        </div>
        <div class="powered-by">
          <p>Powered by TR Digital Services</p>
        </div>
      </div>
    </div>
  </footer>

  <!-- Scripts -->
  <script src="/assets/js/main.js"></script>
  <script src="/assets/js/language-switcher.js"></script>
</body>
</html>`;

// French service definitions
const frenchServices = {
  'france-marketing': {
    title: 'Marketing',
    description: 'Innoledge International exécute les fonctions de pré-marketing, mène des enquêtes de marché, prépare les dossiers d\'enregistrement et administre les essais cliniques pour les produits de santé, cosmétiques et de santé animale sur les marchés asiatiques.',
    content: `
            <div class="service-section">
              <h2>Produits de Santé</h2>
              <div class="service-content-block">
                <p class="intro-text">Innoledge International exécute les fonctions de pré-marketing, mène des enquêtes de marché, prépare les dossiers d'enregistrement, administre les essais cliniques et sert d'interface entre les fabricants et les autorités sanitaires pour le marché chinois.</p>
                <p>Les produits des fabricants pharmaceutiques européens comprennent des antibiotiques et des médicaments pour la gastro-entérologie, la gynécologie et l'ophtalmologie.</p>
                <p>Les représentants médicaux d'Innoledge International feront la promotion des produits conformément aux attentes des fabricants. Nous organisons également des séminaires promotionnels pour les leaders d'opinion de chaque marché cible.</p>
                <p>L'émergence du marketing OTC et la réforme de la santé en Chine créent des opportunités de développement très prometteuses pour les industries de la santé.</p>
                <p><strong>Nos dispositifs médicaux :</strong> Lentilles de contrôle de la myopie sur mesure basées sur le traitement d'orthokératologie.</p>
              </div>
            </div>

            <div class="service-section">
              <h2>Cosmétiques</h2>
              <div class="service-content-block">
                <p>Innoledge International importe des marques cosmétiques de premier plan de France directement sur le marché chinois.</p>
                <p>Notre équipe contrôle les fonctions de marketing et de vente, c'est-à-dire l'importation et le point de vente.</p>
              </div>
            </div>

            <div class="service-section">
              <h2>Santé Animale</h2>
              <div class="service-content-block">
                <p>Innoledge International dessert les entraîneurs et éleveurs d'Asie, d'Australie et d'Europe.</p>
                <p>Nous sommes le distributeur international d'Amino Eclipse, un supplément pour chevaux de course. Nous fournissons du lait de remplacement de fabrication européenne dans l'industrie alimentaire d'Asie.</p>
              </div>
            </div>`,
    highlights: [
      'Fonctions de Pré-marketing',
      'Enquêtes de Marché',
      'Dossiers d\'Enregistrement',
      'Administration d\'Essais Cliniques',
      'Séminaires Promotionnels',
      'Distribution Réseau Logistique',
      'Produits de Santé & Suppléments',
      'Dispositifs Médicaux',
      'Marketing Cosmétiques',
      'Produits de Santé Animale'
    ]
  },
  'sourcing-2': {
    title: 'Sourcing',
    description: 'Innoledge International fournit des services de sourcing complets pour les produits de soins de santé, pharmaceutiques et fournitures médicales de Chine et d\'autres pays asiatiques avec une expertise en contrôle qualité.',
    content: `
            <div class="service-section">
              <h2>Sourcing de Produits de Soins de Santé</h2>
              <div class="service-content-block">
                <p class="intro-text">L'Asie est une bonne source d'approvisionnement, mais trouver le bon fournisseur est toujours chronophage et parfois frustrant. Innoledge International possède une longue expérience dans ces domaines et peut vous aider à sourcer vos besoins.</p>
                <p><strong>Le sourcing de produits de soins de santé de Chine et d'autres pays asiatiques</strong> incluant les produits pharmaceutiques et fournitures médicales est l'une des principales fonctions de notre société. Nous surveillons en permanence le contrôle qualité pour protéger les activités de nos clients.</p>
                <p>Le vaste réseau de fabricants en Chine et au Japon est une source précieuse et compétitive de produits en raison des grands groupes chimiques organiques et non-organiques intégrés qui existent dans ces pays.</p>
              </div>
            </div>

            <div class="service-section">
              <h2>Assurance Qualité</h2>
              <div class="service-content-block">
                <p><strong>La qualité est la préoccupation principale de notre société</strong> dans tous les aspects incluant le service, la compétitivité et les spécifications produits et documentation.</p>
                <p>Pour assurer la qualité, au fil des années les pharmaciens d'Innoledge International ont audité et sélectionné des usines avec de bons antécédents de rapport qualité/prix pour l'exportation de produits finis et d'ingrédients actifs.</p>
                <p>Le sourcing nécessite les bonnes connexions pour sécuriser les quotas d'exportation, et une équipe de contrôleurs qualité fiables.</p>
              </div>
            </div>

            <div class="service-section">
              <h2>Fabrication Sur Mesure</h2>
              <div class="service-content-block">
                <p>Innoledge International peut organiser la production d'articles spéciaux dans lesquels les matières premières et l'artisanat sont disponibles localement. Nous transférons et contrôlons également la conception pour satisfaire nos clients étrangers.</p>
              </div>
            </div>`,
    highlights: [
      'Produits de Soins de Santé',
      'Pharmaceutiques & Fournitures Médicales',
      'Surveillance Contrôle Qualité',
      'Audits & Sélection d\'Usines',
      'Gestion Quotas d\'Exportation',
      'Fabrication Sur Mesure',
      'Transfert & Contrôle de Conception',
      'Médecines Chinoises Traditionnelles',
      'Produits à Base de Plantes Naturelles',
      'Ingrédients Actifs'
    ]
  },
  'investissement': {
    title: 'Investissement',
    description: 'Innoledge offre son expertise en investissement aux parties de joint-venture pour la sélection de partenaires opérationnels et financiers, évaluation, opportunités de fusion, acquisition et gestion de négociation sur les marchés asiatiques.',
    content: `
            <div class="service-section">
              <h2>Partenaires Opérationnels</h2>
              <div class="service-content-block">
                <p class="intro-text">Investir est un bon moyen de devenir une figure importante et proéminente dans l'économie asiatique. Innoledge offre son expertise aux parties de joint-venture pour la sélection de partenaires et d'opportunités d'investissement.</p>
                <p><strong>Partenaires opérationnels</strong> dans le cadre d'évaluation, fusion, acquisition, opportunités, recherche de partenaires de joint-venture, négociation et gestion de joint-ventures.</p>
                <p>Notre expertise couvre tout le spectre du développement de partenariats opérationnels, de la recherche de marché initiale à la mise en œuvre finale et la gestion continue.</p>
              </div>
            </div>

            <div class="service-section">
              <h2>Partenaires Financiers</h2>
              <div class="service-content-block">
                <p><strong>Partenaires financiers</strong> qui peuvent proposer des projets d'investissement pour faciliter et coordonner les propositions d'investissement.</p>
                <p>Nous travaillons avec un réseau d'institutions financières et d'investisseurs de confiance qui comprennent la dynamique du marché asiatique et peuvent fournir le capital et l'expertise nécessaires pour des entreprises réussies.</p>
              </div>
            </div>

            <div class="service-section">
              <h2>Stratégie d'Investissement & Désinvestissement</h2>
              <div class="service-content-block">
                <p>Des activités non-essentielles aux investissements inadéquats, une entreprise se désinvestit parce que le cœur de ses opérations n'est pas stable.</p>
                <p><strong>S'il est difficile de gérer un joint-venture, il est encore plus difficile de s'en désinvestir.</strong> Notre équipe fournit des conseils stratégiques sur les stratégies d'entrée et de sortie d'investissement.</p>
              </div>
            </div>`,
    highlights: [
      'Sélection Partenaires Opérationnels',
      'Coordination Partenaires Financiers',
      'Recherche Joint-Venture',
      'Support Fusion & Acquisition',
      'Évaluation Opportunités d\'Investissement',
      'Gestion de Négociation',
      'Stratégie de Désinvestissement',
      'Planification Entrée Marché',
      'Développement Stratégie de Sortie',
      'Évaluation des Risques'
    ]
  },
  'affaires-reglementaires': {
    title: 'Affaires Réglementaires',
    description: 'Innoledge International fournit des services complets d\'affaires réglementaires incluant la protection des marques, les demandes de brevets et l\'enregistrement de produits auprès de diverses agences d\'état en Chine et au Japon.',
    content: `
            <div class="service-section">
              <h2>Enregistrement & Licences</h2>
              <div class="service-content-block">
                <p class="intro-text">Les besoins d'enregistrements et de licences peuvent être vus comme des obstacles laborieux et chronophages mais c'est aussi une protection utile pour investir dans le développement commercial.</p>
                <p>Diverses Agences d'État en Chine contrôlent toutes les affaires réglementaires liées à l'Alimentation, Aliments Santé, Médicaments, Dispositifs Médicaux et Cosmétiques.</p>
                <p>INNOLEDGE INTERNATIONAL a acquis l'expérience dans l'obtention de licences d'importation pendant 15 ans et les activités principales du bureau de Beijing consistent à maintenir des contacts réguliers avec divers bureaux d'Agences d'État.</p>
              </div>
            </div>

            <div class="service-section">
              <h2>Protection des Marques</h2>
              <div class="service-content-block">
                <p><strong>La protection des marques</strong> en langue chinoise nécessite une bonne maîtrise du droit des marques ainsi que de la littérature chinoise et l'équipe locale d'Innoledge possède ces capacités.</p>
                <p>Ils ont conçu et protégé de nombreuses marques qui permettent aux utilisateurs chinois de comprendre le mérite des produits étrangers.</p>
              </div>
            </div>

            <div class="service-section">
              <h2>Brevets en Chine</h2>
              <div class="service-content-block">
                <p><strong>INNOLEDGE INTERNATIONAL peut aider à préparer les demandes de brevets</strong> et utiliser des experts en brevets locaux.</p>
                <p>Nous avons enregistré de nombreux produits au nom et pour le compte de fabricants européens. Plus de 20 médicaments et encore plus de cosmétiques...</p>
              </div>
            </div>

            <div class="service-section">
              <h2>Services d'Enregistrement au Japon</h2>
              <div class="service-content-block">
                <p><strong>Au Japon,</strong> INNOLEDGE INTERNATIONAL a la capacité d'enregistrer les Cosmétiques, Aliments Fonctionnels et Dispositifs Médicaux.</p>
                <p>Pour les Médicaments, elle a développé un approvisionnement direct de Hong Kong vers les médecins prescripteurs japonais.</p>
              </div>
            </div>`,
    highlights: [
      'Demandes de Licence d\'Importation',
      'Support Licence de Fabrication',
      'Protection des Marques',
      'Assistance Demande de Brevet',
      'Liaison Agences d\'État',
      'Enregistrement de Produits',
      'Conformité Réglementaire',
      'Préparation Documentation',
      'Expertise Chine & Japon',
      'Industries Santé & Beauté'
    ]
  },
  'business-consultant': {
    title: 'Conseil en Affaires',
    description: 'Innoledge International fournit des services complets de conseil en affaires pour aider les investisseurs, partenaires de joint-venture et entrepreneurs à développer des stratégies commerciales réussies en Asie tout en s\'adaptant aux cultures et sensibilités locales.',
    content: `
            <div class="service-section">
              <h2>Solutions à Tous Problèmes</h2>
              <div class="service-content-block">
                <p class="intro-text"><strong>SOLUTIONS AUX PROBLÈMES, "TOUS LES PROBLÈMES".</strong> C'est le service qu'INNOLEDGE INTERNATIONAL offre aux investisseurs, partenaires de joint-venture et entrepreneurs pour développer les affaires en Asie et avec l'Asie.</p>
                <p>Parce que la mondialisation qui facilite beaucoup la communication internationale n'implique pas le changement des cultures locales, il y a une adaptation essentielle aux sensibilités locales de tout modèle commercial importé !</p>
              </div>
            </div>

            <div class="service-section">
              <h2>Adaptation Culturelle</h2>
              <div class="service-content-block">
                <p>INNOLEDGE INTERNATIONAL a l'expertise et l'expérience pour conseiller et adapter les modèles commerciaux étrangers à l'environnement asiatique sans sacrifice aux concepts originaux.</p>
                <p>Notre compréhension approfondie des cultures commerciales asiatiques, pratiques et dynamiques de marché nous permet de fournir des conseils stratégiques qui respectent les coutumes locales.</p>
              </div>
            </div>

            <div class="service-section">
              <h2>Planification Stratégique</h2>
              <div class="service-content-block">
                <p>Nous travaillons étroitement avec nos clients pour développer des stratégies commerciales complètes qui tiennent compte des défis et opportunités uniques présents sur les marchés asiatiques.</p>
                <p>Des stratégies d'entrée sur le marché à l'optimisation opérationnelle, nos services de conseil couvrent tous les aspects du développement commercial en Asie.</p>
              </div>
            </div>

            <div class="service-section">
              <h2>Expertise du Marché Local</h2>
              <div class="service-content-block">
                <p>Avec des bureaux à Hong Kong, Beijing, Shanghai et Tokyo, notre équipe fournit des aperçus et un support sur le terrain pour les entreprises cherchant à établir ou étendre leur présence en Asie.</p>
                <p>Nous aidons à combler le fossé entre les pratiques commerciales occidentales et les exigences du marché asiatique.</p>
              </div>
            </div>`,
    highlights: [
      'Adaptation Modèle Commercial',
      'Formation Sensibilité Culturelle',
      'Stratégies d\'Entrée Marché',
      'Planification Stratégique',
      'Analyse Marché Local',
      'Support Joint-Venture',
      'Évaluation des Risques',
      'Optimisation Opérationnelle',
      'Communication Interculturelle',
      'Solutions de Résolution de Problèmes'
    ]
  },
  'distribution-2': {
    title: 'Distribution',
    description: 'Innoledge International fournit des services de distribution complets à travers l\'Asie, tirant parti des partenariats avec les grands détaillants et distributeurs spécialisés à Hong Kong, en Chine et au Japon pour les médicaments, cosmétiques et produits de santé.',
    content: `
            <div class="service-section">
              <h2>Distribution Hong Kong</h2>
              <div class="service-content-block">
                <p class="intro-text">En raison de la réglementation relativement simple concernant les importations à Hong Kong de Médicaments et Cosmétiques, INNOLEDGE INTERNATIONAL approvisionne les distributeurs locaux et utilisateurs directs.</p>
                <p><strong>Parmi les partenaires se trouvent :</strong></p>
                <ul>
                  <li>SASA Cosmetics International</li>
                  <li>Watson's</li>
                  <li>Mannings</li>
                  <li>NULIFE (Marketing Multiniveau)</li>
                  <li>PRIMAL CHEMICAL</li>
                  <li>The HK Jockey Club</li>
                  <li>Wingwai Trading Company</li>
                </ul>
              </div>
            </div>

            <div class="service-section">
              <h2>Réseau de Distribution Chine</h2>
              <div class="service-content-block">
                <p>Parce que la distribution de Médicaments n'est pas ouverte aux entreprises étrangères, INNOLEDGE INTERNATIONAL a établi des partenariats avec des distributeurs locaux selon leur portefeuille de produits, couverture géographique, ressources financières et capacités promotionnelles.</p>
                <p><strong>Actuellement les partenariats incluent des distributeurs spécialisés en :</strong> Oncologie, Urologie, Gynécologie, Pédiatrie, Gastro-Entérologie, Ophtalmologie, Dermatologie et Chirurgie.</p>
                <p>En cosmétiques, INNOLEDGE INTERNATIONAL a établi sa propre division de distribution facturant en RMB aux distributeurs régionaux et chaînes de magasins et pharmacies.</p>
              </div>
            </div>

            <div class="service-section">
              <h2>Canaux Internet & Numériques</h2>
              <div class="service-content-block">
                <p><strong>Internet :</strong> Parce que c'est un canal très bien adapté à la Chine (couverture géographique, promotionnelle, informative et réduisant les facteurs humains) INNOLEDGE INTERNATIONAL établit l'approvisionnement de produits importés pour des sites web B2C célèbres.</p>
                <p>Un nouveau concept est de promouvoir les produits de santé (cosmétiques et alimentation) aux médecins prescripteurs.</p>
              </div>
            </div>

            <div class="service-section">
              <h2>Distribution Japon</h2>
              <div class="service-content-block">
                <p>Pour des médicaments spécifiques, INNOLEDGE INTERNATIONAL approvisionne directement de Hong Kong les médecins japonais qui importent des médicaments exclusivement pour leurs propres patients. (Chirurgie esthétique, Gériatrie).</p>
                <p>Ce canal de distribution spécialisé donne accès au marché japonais tout en maintenant la conformité avec les réglementations locales.</p>
              </div>
            </div>`,
    highlights: [
      'Partenariats Détail Hong Kong',
      'Distribution Régionale Chine',
      'Canaux Médicaux Spécialisés',
      'Plateformes Internet & B2C',
      'Solutions Logistique & Stockage',
      'Capacité Facturation RMB',
      'Support Marketing Multiniveau',
      'Canaux Prescription Médecin',
      'Approvisionnement Transfrontalier',
      'Conformité Réglementaire'
    ]
  }
};

async function createAllFrenchServices() {
  console.log('🚀 Creating all French service pages...\n');
  
  for (const [serviceName, serviceData] of Object.entries(frenchServices)) {
    const filePath = `fr/services/${serviceName}/index.html`;
    const fullPath = path.join(__dirname, filePath);
    
    const htmlContent = createFrenchServicePage(
      serviceName,
      serviceData.title,
      serviceData.description,
      serviceData.content,
      serviceData.highlights
    );
    
    fs.writeFileSync(fullPath, htmlContent);
    console.log(`✅ Created: ${filePath}`);
    
    // Verify the page
    const success = await verifyPage(
      `/fr/services/${serviceName}/`,
      `${serviceData.title} – Innoledge`,
      [serviceData.title, 'INNOLEDGE INTERNATIONAL']
    );
    
    if (!success) {
      console.log(`❌ Verification failed for ${serviceName}`);
      process.exit(1);
    }
  }
  
  console.log('\n🎉 All French service pages created and verified successfully!');
}

createAllFrenchServices().catch(console.error);