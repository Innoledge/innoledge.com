const fs = require('fs');
const path = require('path');
const { verifyPage } = require('./verify-page.js');

// Template for service pages
const createServicePage = (serviceName, title, description, content, highlights) => `<!DOCTYPE html>
<html lang="en" dir="ltr">
<head>
  <title>${title} – Innoledge</title>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="${description}">
  <meta name="robots" content="max-image-preview:large">
  <meta name="generator" content="Static Site Generator">

  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://innoledge.com/en/services/${serviceName}/">
  <meta property="og:title" content="${title} – Innoledge">
  <meta property="og:description" content="${description}">
  <meta property="og:image" content="https://innoledge.com/assets/images/innoledge-logo.png">
  <meta property="og:locale" content="en-GB">
  <meta property="og:site_name" content="Innoledge">

  <!-- Language alternates -->
  <link rel="alternate" href="/en/services/${serviceName}/" hreflang="en">
  <link rel="alternate" href="/fr/services/${serviceName === 'regulatory-affairs' ? 'affaires-reglementaires' : serviceName === 'business-consultancy' ? 'business-consultant' : serviceName}/" hreflang="fr">
  <link rel="alternate" href="/zh/services/${serviceName}/" hreflang="zh">

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
    <nav class="main-navigation" role="navigation" aria-label="Main navigation">
      <div class="nav-container">
        <!-- Logo -->
        <div class="site-logo">
          <a href="/" aria-label="Innoledge Homepage">
            <img src="/assets/images/innoledge-logo.png" alt="Innoledge" width="222" height="96">
          </a>
        </div>

        <!-- Main Menu -->
        <div class="nav-menu">
          <ul class="menu-items">
            <li class="menu-item">
              <a href="/">Home</a>
            </li>
            <li class="menu-item current-menu-item">
              <a href="/en/services/">Services</a>
            </li>
            <li class="menu-item">
              <a href="/en/portfolio/">Our Portfolio</a>
            </li>
            <li class="menu-item">
              <a href="/en/about/">About Us</a>
            </li>
            <li class="menu-item">
              <a href="/en/contact/">Contact Us</a>
            </li>
          </ul>
        </div>

        <!-- Language Switcher -->
        <div class="language-switcher">
          <button class="lang-toggle" aria-label="Language options" aria-expanded="false" aria-haspopup="true">
            <span class="current-lang">EN</span>
            <svg class="dropdown-arrow" width="12" height="8" viewBox="0 0 12 8" fill="none">
              <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
          <div class="lang-dropdown" role="menu">
            <a href="/en/services/${serviceName}/" class="lang-option current" role="menuitem" hreflang="en">
              <img src="/assets/images/flags/en.svg" alt="" width="20" height="15">
              <span>English</span>
            </a>
            <a href="/fr/services/${serviceName === 'regulatory-affairs' ? 'affaires-reglementaires' : serviceName === 'business-consultancy' ? 'business-consultant' : serviceName}/" class="lang-option" role="menuitem" hreflang="fr">
              <img src="/assets/images/flags/fr.svg" alt="" width="20" height="15">
              <span>Français</span>
            </a>
            <a href="/zh/services/${serviceName}/" class="lang-option" role="menuitem" hreflang="zh">
              <img src="/assets/images/flags/zh.svg" alt="" width="20" height="15">
              <span>中文</span>
            </a>
          </div>
        </div>

        <!-- Mobile Menu Toggle -->
        <button class="mobile-menu-toggle" aria-label="Toggle mobile menu" aria-expanded="false">
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
        <nav class="breadcrumb" aria-label="Breadcrumb">
          <ol class="breadcrumb-list">
            <li class="breadcrumb-item">
              <a href="/">Home</a>
            </li>
            <li class="breadcrumb-item">
              <a href="/en/services/">Services</a>
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
              <img src="/assets/images/services/${serviceName}-edited.jpg" alt="${title} Services" loading="eager" class="service-hero-image">
            </div>

            ${content}

            <!-- Call to Action -->
            <div class="service-cta">
              <h3>Need ${title} Services?</h3>
              <p>Contact us to learn how our ${title.toLowerCase()} expertise can help your business succeed in Asia.</p>
              <div class="cta-actions">
                <a href="/en/contact/" class="btn btn-primary">Contact Us</a>
                <a href="/en/portfolio/" class="btn btn-secondary">View Our Portfolio</a>
              </div>
            </div>
          </div>

          <!-- Sidebar -->
          <div class="service-sidebar">
            <div class="related-services">
              <h3>Our Services</h3>
              <nav class="services-nav">
                <ul>
                  <li${serviceName === 'marketing' ? ' class="current-service"' : ''}>
                    <a href="/en/services/marketing/">Marketing</a>
                  </li>
                  <li${serviceName === 'sourcing' ? ' class="current-service"' : ''}>
                    <a href="/en/services/sourcing/">Sourcing</a>
                  </li>
                  <li${serviceName === 'investment' ? ' class="current-service"' : ''}>
                    <a href="/en/services/investment/">Investment</a>
                  </li>
                  <li${serviceName === 'regulatory-affairs' ? ' class="current-service"' : ''}>
                    <a href="/en/services/regulatory-affairs/">Regulatory Affairs</a>
                  </li>
                  <li${serviceName === 'business-consultancy' ? ' class="current-service"' : ''}>
                    <a href="/en/services/business-consultancy/">Business Consultancy</a>
                  </li>
                  <li${serviceName === 'distribution' ? ' class="current-service"' : ''}>
                    <a href="/en/services/distribution/">Distribution</a>
                  </li>
                </ul>
              </nav>
            </div>

            <div class="service-highlights">
              <h3>${title} Expertise</h3>
              <ul>
                ${highlights.map(item => `<li>${item}</li>`).join('\n                ')}
              </ul>
            </div>

            <div class="contact-info-sidebar">
              <h3>Get Started</h3>
              <p>Ready to discuss your ${title.toLowerCase()} needs?</p>
              <a href="/en/contact/" class="btn btn-primary">Contact Our Team</a>
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
        <h4>Contact Information</h4>
        <div class="contact-details">
          <div class="contact-item">
            <span class="contact-label">Phone:</span>
            <a href="tel:+85228037784">+852 2803 7784</a>
          </div>
          <div class="contact-item">
            <span class="contact-label">Fax:</span>
            <span>+852 3568 4410</span>
          </div>
          <div class="contact-item">
            <span class="contact-label">Email:</span>
            <a href="mailto:info@innoledge.com">info@innoledge.com</a>
          </div>
        </div>
      </div>

      <!-- Quick Links -->
      <div class="footer-section quick-links">
        <h4>Quick Links</h4>
        <nav class="footer-nav">
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/en/services/">Services</a></li>
            <li><a href="/en/portfolio/">Our Portfolio</a></li>
            <li><a href="/en/about/">About Us</a></li>
            <li><a href="/en/contact/">Contact Us</a></li>
          </ul>
        </nav>
      </div>

      <!-- Services -->
      <div class="footer-section services-links">
        <h4>Services</h4>
        <nav class="services-nav">
          <ul>
            <li><a href="/en/services/marketing/">Marketing</a></li>
            <li><a href="/en/services/sourcing/">Sourcing</a></li>
            <li><a href="/en/services/investment/">Investment</a></li>
            <li><a href="/en/services/regulatory-affairs/">Regulatory Affairs</a></li>
            <li><a href="/en/services/business-consultancy/">Business Consultancy</a></li>
            <li><a href="/en/services/distribution/">Distribution</a></li>
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

// Service definitions
const services = {
  'regulatory-affairs': {
    title: 'Regulatory Affairs',
    description: 'Innoledge International provides comprehensive regulatory affairs services including trademark protection, patent applications, and registration of products across various state agencies in China and Japan.',
    content: `
            <div class="service-section">
              <h2>Registration & Licensing</h2>
              <div class="service-content-block">
                <p class="intro-text">The needs of registrations and licenses can be seen as laborious and time consuming hurdles but it is also a useful protection to invest in business development.</p>
                <p>Various State Agencies in China control all regulatory affairs related to Food, Health Food, Medicines, Medical Devices and Cosmetics. It covers most industries related to health and beauty. The registrations of any product in these industries are the keys to the China market.</p>
                <p>INNOLEDGE INTERNATIONAL has gained experience in obtaining Import licenses for 15 years and the Beijing office main activities consist of keeping regular contacts with various offices of State Agencies to secure the registrations in the shortest possible time frame.</p>
              </div>
            </div>

            <div class="service-section">
              <h2>Trademark Protection</h2>
              <div class="service-content-block">
                <p><strong>Trade mark protection</strong> in Chinese language requires a good command of the trade mark law as well as the Chinese literature and the local team of Innoledge has these abilities.</p>
                <p>They have designed and protected numerous trademarks that make the Chinese users understand the merit of the foreign products.</p>
              </div>
            </div>

            <div class="service-section">
              <h2>Patents in China</h2>
              <div class="service-content-block">
                <p><strong>INNOLEDGE INTERNATIONAL can assist in preparing the patents application</strong> and use local patent experts.</p>
                <p>We have registered numerous products in the name and on behalf of European manufacturers. More than 20 medicines and even more cosmetics... Using INNOLEDGE INTERNATIONAL as registration company allows the manufacturers to keep the freedom to select and if necessary change the distributors for each product.</p>
              </div>
            </div>

            <div class="service-section">
              <h2>Japan Registration Services</h2>
              <div class="service-content-block">
                <p><strong>In Japan,</strong> INNOLEDGE INTERNATIONAL has the ability to register Cosmetics, Functional Food and Medical Devices.</p>
                <p>For Medicines, it has developed a supply directly from Hong Kong to Japanese prescribing doctors. This channel can bypass the registration of foreign medicines that is extremely laborious to secure.</p>
              </div>
            </div>`,
    highlights: [
      'Import License Applications',
      'Manufacturing License Support',
      'Trademark Protection',
      'Patent Application Assistance',
      'State Agency Liaison',
      'Product Registration',
      'Regulatory Compliance',
      'Documentation Preparation',
      'China & Japan Expertise',
      'Health & Beauty Industries'
    ]
  },
  'business-consultancy': {
    title: 'Business Consultancy',
    description: 'Innoledge International provides comprehensive business consultancy services to help investors, joint-venture partners and entrepreneurs develop successful business strategies in Asia while adapting to local cultures and sensitivities.',
    content: `
            <div class="service-section">
              <h2>Solutions to Any Problems</h2>
              <div class="service-content-block">
                <p class="intro-text"><strong>SOLUTIONS TO PROBLEMS, "ANY PROBLEMS".</strong> That is the service INNOLEDGE INTERNATIONAL offers investors, joint-venture partners and entrepreneurs for developing business in Asia and with Asia.</p>
                <p>Because the globalization that makes international communication much easier does not imply the change of local cultures, there is an essential adaptation to local sensitivities of any imported business model!</p>
              </div>
            </div>

            <div class="service-section">
              <h2>Cultural Adaptation</h2>
              <div class="service-content-block">
                <p>INNOLEDGE INTERNATIONAL has the expertise and experience to advise and adapt foreign business models to Asian environment without sacrifice to the original concepts.</p>
                <p>Our deep understanding of Asian business cultures, practices, and market dynamics enables us to provide strategic guidance that respects local customs while maintaining the integrity of your business vision.</p>
              </div>
            </div>

            <div class="service-section">
              <h2>Strategic Planning</h2>
              <div class="service-content-block">
                <p>We work closely with our clients to develop comprehensive business strategies that account for the unique challenges and opportunities present in Asian markets.</p>
                <p>From market entry strategies to operational optimization, our consultancy services cover every aspect of business development in Asia.</p>
              </div>
            </div>

            <div class="service-section">
              <h2>Local Market Expertise</h2>
              <div class="service-content-block">
                <p>With offices in Hong Kong, Beijing, Shanghai, and Tokyo, our team provides on-the-ground insights and support for businesses looking to establish or expand their presence in Asia.</p>
                <p>We help bridge the gap between Western business practices and Asian market requirements, ensuring successful implementation of your business objectives.</p>
              </div>
            </div>`,
    highlights: [
      'Business Model Adaptation',
      'Cultural Sensitivity Training',
      'Market Entry Strategies',
      'Strategic Planning',
      'Local Market Analysis',
      'Joint Venture Support',
      'Risk Assessment',
      'Operational Optimization',
      'Cross-Cultural Communication',
      'Problem-Solving Solutions'
    ]
  },
  'distribution': {
    title: 'Distribution',
    description: 'Innoledge International provides comprehensive distribution services across Asia, leveraging partnerships with major retailers and specialized distributors in Hong Kong, China, and Japan for medicines, cosmetics, and health products.',
    content: `
            <div class="service-section">
              <h2>Hong Kong Distribution</h2>
              <div class="service-content-block">
                <p class="intro-text">Because of the relatively simple regulation concerning imports in Hong Kong of Medicines and Cosmetics, INNOLEDGE INTERNATIONAL supplies local distributors and direct users.</p>
                <p><strong>Among the partners are:</strong></p>
                <ul>
                  <li>SASA Cosmetics International</li>
                  <li>Watson's</li>
                  <li>Mannings</li>
                  <li>NULIFE (Multilevel Marketing)</li>
                  <li>PRIMAL CHEMICAL</li>
                  <li>The HK Jockey Club</li>
                  <li>Wingwai Trading Company</li>
                </ul>
              </div>
            </div>

            <div class="service-section">
              <h2>China Distribution Network</h2>
              <div class="service-content-block">
                <p>Because the distribution of Medicines is not open to foreign companies INNOLEDGE INTERNATIONAL has established partnerships with local distributors according to their products portfolio, geographic coverage, financial resources and promotional abilities.</p>
                <p><strong>Presently the partnerships include specialized distributors in:</strong> Oncology, Urology, Gynecology, Pediatrics, Gastro-Enterology, Ophthalmology, Dermatology and Surgery.</p>
                <p>In cosmetics INNOLEDGE INTERNATIONAL has established its own distribution division invoicing in RMB to the regional distributors and chain stores and drugstores. Logistic includes storage and deliveries throughout China.</p>
              </div>
            </div>

            <div class="service-section">
              <h2>Internet & Digital Channels</h2>
              <div class="service-content-block">
                <p><strong>Internet:</strong> Because it is a channel very well adapted to china (geographic coverage, promotional, informative and reducing human factors) INNOLEDGE INTERNATIONAL is establishing supply of imported products for famous B2C websites.</p>
                <p>A new concept is to promote health products (cosmetics and food) to prescribing doctors. Such health products are supply exclusively to the local dispensaries serving doctors prescriptions.</p>
              </div>
            </div>

            <div class="service-section">
              <h2>Japan Distribution</h2>
              <div class="service-content-block">
                <p>For specific medicines INNOLEDGE INTERNATIONAL supplies directly from Hong Kong Japanese doctors who import medicines exclusively for their own patients. (Esthetic surgery, Geriatrics).</p>
                <p>This specialized distribution channel provides access to the Japanese market while maintaining compliance with local regulations and medical standards.</p>
              </div>
            </div>`,
    highlights: [
      'Hong Kong Retail Partnerships',
      'China Regional Distribution',
      'Specialized Medical Channels',
      'Internet & B2C Platforms',
      'Logistic & Storage Solutions',
      'RMB Invoicing Capability',
      'Multi-Level Marketing Support',
      'Doctor Prescription Channels',
      'Cross-Border Supply',
      'Regulatory Compliance'
    ]
  }
};

async function createAllServices() {
  console.log('🚀 Creating remaining English service pages...\n');
  
  for (const [serviceName, serviceData] of Object.entries(services)) {
    const filePath = `en/services/${serviceName}/index.html`;
    const fullPath = path.join(__dirname, filePath);
    
    const htmlContent = createServicePage(
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
      `/en/services/${serviceName}/`,
      `${serviceData.title} – Innoledge`,
      [serviceData.title, 'INNOLEDGE INTERNATIONAL']
    );
    
    if (!success) {
      console.log(`❌ Verification failed for ${serviceName}`);
      process.exit(1);
    }
  }
  
  console.log('\n🎉 All English service pages created and verified successfully!');
}

createAllServices().catch(console.error);