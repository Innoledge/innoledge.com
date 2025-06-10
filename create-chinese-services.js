const fs = require('fs');
const path = require('path');
const { verifyPage } = require('./verify-page.js');

// Template for Chinese service pages
const createChineseServicePage = (serviceName, title, description, content, highlights) => `<!DOCTYPE html>
<html lang="zh" dir="ltr">
<head>
  <title>${title} – Innoledge</title>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="${description}">
  <meta name="robots" content="max-image-preview:large">
  <meta name="generator" content="Static Site Generator">

  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://innoledge.com/zh/services/${serviceName}/">
  <meta property="og:title" content="${title} – Innoledge">
  <meta property="og:description" content="${description}">
  <meta property="og:image" content="https://innoledge.com/assets/images/innoledge-logo.png">
  <meta property="og:locale" content="zh-HK">
  <meta property="og:site_name" content="Innoledge">

  <!-- Language alternates -->
  <link rel="alternate" href="/en/services/${serviceName}/" hreflang="en">
  <link rel="alternate" href="/fr/services/${serviceName === 'marketing' ? 'france-marketing' : serviceName === 'sourcing' ? 'sourcing-2' : serviceName === 'investment' ? 'investissement' : serviceName === 'regulatory-affairs' ? 'affaires-reglementaires' : serviceName === 'business-consultancy' ? 'business-consultant' : serviceName === 'distribution' ? 'distribution-2' : serviceName}/" hreflang="fr">
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
    <nav class="main-navigation" role="navigation" aria-label="主要导航">
      <div class="nav-container">
        <!-- Logo -->
        <div class="site-logo">
          <a href="/zh/" aria-label="Innoledge 主页">
            <img src="/assets/images/innoledge-logo.png" alt="Innoledge" width="222" height="96">
          </a>
        </div>

        <!-- Main Menu -->
        <div class="nav-menu">
          <ul class="menu-items">
            <li class="menu-item">
              <a href="/zh/">主页</a>
            </li>
            <li class="menu-item current-menu-item">
              <a href="/zh/services/">服务</a>
            </li>
            <li class="menu-item">
              <a href="/zh/portfolio/">我们的产品</a>
            </li>
            <li class="menu-item">
              <a href="/zh/about/">公司简介</a>
            </li>
            <li class="menu-item">
              <a href="/zh/contact/">联系我们</a>
            </li>
          </ul>
        </div>

        <!-- Language Switcher -->
        <div class="language-switcher">
          <button class="lang-toggle" aria-label="语言选项" aria-expanded="false" aria-haspopup="true">
            <span class="current-lang">中文</span>
            <svg class="dropdown-arrow" width="12" height="8" viewBox="0 0 12 8" fill="none">
              <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
          <div class="lang-dropdown" role="menu">
            <a href="/en/services/${serviceName}/" class="lang-option" role="menuitem" hreflang="en">
              <img src="/assets/images/flags/en.svg" alt="" width="20" height="15">
              <span>English</span>
            </a>
            <a href="/fr/services/${serviceName === 'marketing' ? 'france-marketing' : serviceName === 'sourcing' ? 'sourcing-2' : serviceName === 'investment' ? 'investissement' : serviceName === 'regulatory-affairs' ? 'affaires-reglementaires' : serviceName === 'business-consultancy' ? 'business-consultant' : serviceName === 'distribution' ? 'distribution-2' : serviceName}/" class="lang-option" role="menuitem" hreflang="fr">
              <img src="/assets/images/flags/fr.svg" alt="" width="20" height="15">
              <span>Français</span>
            </a>
            <a href="/zh/services/${serviceName}/" class="lang-option current" role="menuitem" hreflang="zh">
              <img src="/assets/images/flags/zh.svg" alt="" width="20" height="15">
              <span>中文</span>
            </a>
          </div>
        </div>

        <!-- Mobile Menu Toggle -->
        <button class="mobile-menu-toggle" aria-label="切换移动菜单" aria-expanded="false">
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
        <nav class="breadcrumb" aria-label="面包屑导航">
          <ol class="breadcrumb-list">
            <li class="breadcrumb-item">
              <a href="/zh/">主页</a>
            </li>
            <li class="breadcrumb-item">
              <a href="/zh/services/">服务</a>
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
              <img src="/assets/images/services/${serviceName}-edited.jpg" alt="${title}服务" loading="eager" class="service-hero-image">
            </div>

            ${content}

            <!-- Call to Action -->
            <div class="service-cta">
              <h3>需要${title}服务？</h3>
              <p>联系我们，了解我们的${title}专业知识如何帮助您的企业在亚洲取得成功。</p>
              <div class="cta-actions">
                <a href="/zh/contact/" class="btn btn-primary">联系我们</a>
                <a href="/zh/portfolio/" class="btn btn-secondary">查看我们的产品</a>
              </div>
            </div>
          </div>

          <!-- Sidebar -->
          <div class="service-sidebar">
            <div class="related-services">
              <h3>我们的服务</h3>
              <nav class="services-nav">
                <ul>
                  <li${serviceName === 'marketing' ? ' class="current-service"' : ''}>
                    <a href="/zh/services/marketing/">市场营销</a>
                  </li>
                  <li${serviceName === 'sourcing' ? ' class="current-service"' : ''}>
                    <a href="/zh/services/sourcing/">采购</a>
                  </li>
                  <li${serviceName === 'investment' ? ' class="current-service"' : ''}>
                    <a href="/zh/services/investment/">投资</a>
                  </li>
                  <li${serviceName === 'regulatory-affairs' ? ' class="current-service"' : ''}>
                    <a href="/zh/services/regulatory-affairs/">注册事务</a>
                  </li>
                  <li${serviceName === 'business-consultancy' ? ' class="current-service"' : ''}>
                    <a href="/zh/services/business-consultancy/">商务咨询</a>
                  </li>
                  <li${serviceName === 'distribution' ? ' class="current-service"' : ''}>
                    <a href="/zh/services/distribution/">分布</a>
                  </li>
                </ul>
              </nav>
            </div>

            <div class="service-highlights">
              <h3>${title}专业知识</h3>
              <ul>
                ${highlights.map(item => `<li>${item}</li>`).join('\n                ')}
              </ul>
            </div>

            <div class="contact-info-sidebar">
              <h3>开始合作</h3>
              <p>准备讨论您的${title}需求？</p>
              <a href="/zh/contact/" class="btn btn-primary">联系我们的团队</a>
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
          <h3>乐奇国际有限公司</h3>
          <address class="company-address">
            Room 1708, One Midtown<br>
            11 Hoi Shing Road, Tsuen Wan<br>
            Hong Kong
          </address>
        </div>
      </div>

      <!-- Contact Info -->
      <div class="footer-section contact-info">
        <h4>联系信息</h4>
        <div class="contact-details">
          <div class="contact-item">
            <span class="contact-label">电话：</span>
            <a href="tel:+85228037784">+852 2803 7784</a>
          </div>
          <div class="contact-item">
            <span class="contact-label">传真：</span>
            <span>+852 3568 4410</span>
          </div>
          <div class="contact-item">
            <span class="contact-label">邮箱：</span>
            <a href="mailto:info@innoledge.com">info@innoledge.com</a>
          </div>
        </div>
      </div>

      <!-- Quick Links -->
      <div class="footer-section quick-links">
        <h4>快速链接</h4>
        <nav class="footer-nav">
          <ul>
            <li><a href="/zh/">主页</a></li>
            <li><a href="/zh/services/">服务</a></li>
            <li><a href="/zh/portfolio/">我们的产品</a></li>
            <li><a href="/zh/about/">公司简介</a></li>
            <li><a href="/zh/contact/">联系我们</a></li>
          </ul>
        </nav>
      </div>

      <!-- Services -->
      <div class="footer-section services-links">
        <h4>服务</h4>
        <nav class="services-nav">
          <ul>
            <li><a href="/zh/services/marketing/">市场营销</a></li>
            <li><a href="/zh/services/sourcing/">采购</a></li>
            <li><a href="/zh/services/investment/">投资</a></li>
            <li><a href="/zh/services/regulatory-affairs/">注册事务</a></li>
            <li><a href="/zh/services/business-consultancy/">商务咨询</a></li>
            <li><a href="/zh/services/distribution/">分布</a></li>
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

// Chinese service definitions
const chineseServices = {
  'marketing': {
    title: '市场营销',
    description: '乐奇国际有限公司执行预营销功能，进行市场调研，准备注册档案，管理临床试验，为亚洲市场的健康产品、化妆品和动物保健产品提供服务。',
    content: `
            <div class="service-section">
              <h2>健康产品</h2>
              <div class="service-content-block">
                <p class="intro-text">乐奇国际有限公司执行预营销功能，进行市场调研，准备注册档案，管理临床试验，作为制造商和中国市场卫生当局之间的接口。</p>
                <p>来自欧洲制药制造商的产品包括抗生素和胃肠病学、妇科学和眼科学药物。</p>
                <p>乐奇国际有限公司的医药代表将根据制造商的期望推广产品。我们还为每个目标市场的意见领袖组织推广研讨会。</p>
                <p>OTC营销的出现和中国的卫生改革为健康产业创造了非常有前景的发展机会。</p>
                <p><strong>我们的医疗器械：</strong>基于角膜塑形治疗的定制近视控制镜片。</p>
              </div>
            </div>

            <div class="service-section">
              <h2>化妆品</h2>
              <div class="service-content-block">
                <p>乐奇国际有限公司直接从法国进口知名化妆品品牌到中国市场。</p>
                <p>我们的团队控制营销和销售功能，即进口和销售点。</p>
              </div>
            </div>

            <div class="service-section">
              <h2>动物保健</h2>
              <div class="service-content-block">
                <p>乐奇国际有限公司为来自亚洲、澳大利亚和欧洲的训练师和饲养员提供服务。</p>
                <p>我们是Amino Eclipse（赛马补充剂）的国际分销商。我们在亚洲饲料行业供应欧洲制造的代乳品。</p>
              </div>
            </div>`,
    highlights: [
      '预营销功能',
      '市场调研',
      '注册档案',
      '临床试验管理',
      '推广研讨会',
      '物流网络分销',
      '健康产品和补充剂',
      '医疗器械',
      '化妆品营销',
      '动物保健产品'
    ]
  },
  'sourcing': {
    title: '采购',
    description: '乐奇国际有限公司为来自中国和其他亚洲国家的医疗保健产品、药品和医疗用品提供全面的采购服务，具备质量控制专业知识。',
    content: `
            <div class="service-section">
              <h2>医疗保健产品采购</h2>
              <div class="service-content-block">
                <p class="intro-text">亚洲是一个很好的供应来源，但找到好的供应商总是耗时且有时令人沮丧的。乐奇国际有限公司在这些领域拥有长期经验，可以帮助您采购所需。</p>
                <p><strong>从中国和其他亚洲国家采购医疗保健产品</strong>包括药品和医疗用品是我们公司的主要功能之一。我们持续监控质量控制以保护客户的业务。</p>
                <p>中国和日本制造商的庞大网络是产品的宝贵和有竞争力的来源，因为这些国家存在大型综合有机和无机化工集团。</p>
              </div>
            </div>

            <div class="service-section">
              <h2>质量保证</h2>
              <div class="service-content-block">
                <p><strong>质量是我们公司的首要关注</strong>在所有方面包括服务、竞争力和产品规格和文档。</p>
                <p>为确保质量，多年来乐奇国际有限公司的药剂师已经审核并选择了在成品和活性成分出口方面具有良好性价比记录的工厂。</p>
                <p>采购需要正确的联系以确保出口配额，以及一支可靠的质量控制团队。</p>
              </div>
            </div>

            <div class="service-section">
              <h2>定制制造</h2>
              <div class="service-content-block">
                <p>乐奇国际有限公司可以安排生产特殊物品，其中原材料和工艺在本地可用。我们还转移和控制设计以满足我们的海外客户。</p>
              </div>
            </div>`,
    highlights: [
      '医疗保健产品',
      '药品和医疗用品',
      '质量控制监控',
      '工厂审核和选择',
      '出口配额管理',
      '定制制造',
      '设计转移和控制',
      '中药传统医学',
      '天然草本产品',
      '活性成分'
    ]
  },
  'investment': {
    title: '投资',
    description: '乐奇国际有限公司为合资企业各方在运营和财务合作伙伴选择、评估、并购机会和亚洲市场谈判管理方面提供投资专业知识。',
    content: `
            <div class="service-section">
              <h2>运营合作伙伴</h2>
              <div class="service-content-block">
                <p class="intro-text">投资是成为亚洲经济重要和杰出人物的好方法。乐奇为合资企业各方在合作伙伴和投资机会选择方面提供专业知识。</p>
                <p><strong>运营合作伙伴</strong>在评估、兼并、收购、机会、合资企业伙伴研究、谈判和合资企业管理框架内。</p>
                <p>我们的专业知识涵盖运营伙伴关系发展的完整范围，从初始市场研究到最终实施和持续管理。</p>
              </div>
            </div>

            <div class="service-section">
              <h2>财务合作伙伴</h2>
              <div class="service-content-block">
                <p><strong>财务合作伙伴</strong>可以提出投资项目以促进和协调投资建议。</p>
                <p>我们与了解亚洲市场动态并能提供成功企业所需资本和专业知识的可信金融机构和投资者网络合作。</p>
              </div>
            </div>

            <div class="service-section">
              <h2>投资策略和撤资</h2>
              <div class="service-content-block">
                <p>从非核心业务到不当投资，公司撤资是因为其运营核心不稳定。</p>
                <p><strong>如果经营合资企业很困难，那么从中撤资就更困难了。</strong>我们的团队在投资进入和退出策略方面提供战略指导。</p>
              </div>
            </div>`,
    highlights: [
      '运营合作伙伴选择',
      '财务合作伙伴协调',
      '合资企业研究',
      '并购支持',
      '投资机会评估',
      '谈判管理',
      '撤资策略',
      '市场进入规划',
      '退出策略开发',
      '风险评估'
    ]
  },
  'regulatory-affairs': {
    title: '注册事务',
    description: '乐奇国际有限公司提供全面的注册事务服务，包括商标保护、专利申请以及在中国和日本各种国家机构的产品注册。',
    content: `
            <div class="service-section">
              <h2>注册和许可</h2>
              <div class="service-content-block">
                <p class="intro-text">注册和许可的需求可能被视为繁重和耗时的障碍，但这也是投资商业发展的有用保护。</p>
                <p>中国的各种国家机构控制与食品、保健食品、药品、医疗器械和化妆品相关的所有监管事务。</p>
                <p>乐奇国际有限公司在获得进口许可证方面拥有15年的经验，北京办事处的主要活动包括与国家机构的各个办公室保持定期联系。</p>
              </div>
            </div>

            <div class="service-section">
              <h2>商标保护</h2>
              <div class="service-content-block">
                <p><strong>中文商标保护</strong>需要很好地掌握商标法以及中文文学，乐奇的本地团队具有这些能力。</p>
                <p>他们设计和保护了许多商标，使中国用户了解外国产品的优点。</p>
              </div>
            </div>

            <div class="service-section">
              <h2>中国专利</h2>
              <div class="service-content-block">
                <p><strong>乐奇国际有限公司可以协助准备专利申请</strong>并使用本地专利专家。</p>
                <p>我们已经以欧洲制造商的名义和代表注册了许多产品。超过20种药物和更多化妆品...</p>
              </div>
            </div>

            <div class="service-section">
              <h2>日本注册服务</h2>
              <div class="service-content-block">
                <p><strong>在日本，</strong>乐奇国际有限公司有能力注册化妆品、功能食品和医疗器械。</p>
                <p>对于药品，它已经开发了从香港直接供应给日本处方医生的渠道。</p>
              </div>
            </div>`,
    highlights: [
      '进口许可证申请',
      '制造许可证支持',
      '商标保护',
      '专利申请协助',
      '国家机构联络',
      '产品注册',
      '监管合规',
      '文档准备',
      '中国和日本专业知识',
      '健康和美容行业'
    ]
  },
  'business-consultancy': {
    title: '商务咨询',
    description: '乐奇国际有限公司提供全面的商务咨询服务，帮助投资者、合资企业伙伴和企业家在亚洲发展成功的商业策略，同时适应当地文化和敏感性。',
    content: `
            <div class="service-section">
              <h2>任何问题的解决方案</h2>
              <div class="service-content-block">
                <p class="intro-text"><strong>问题解决方案，"任何问题"。</strong>这是乐奇国际有限公司为投资者、合资企业伙伴和企业家在亚洲和与亚洲发展业务提供的服务。</p>
                <p>因为使国际交流更容易的全球化并不意味着当地文化的改变，任何进口商业模式都需要对当地敏感性进行基本适应！</p>
              </div>
            </div>

            <div class="service-section">
              <h2>文化适应</h2>
              <div class="service-content-block">
                <p>乐奇国际有限公司拥有建议和适应外国商业模式到亚洲环境而不牺牲原始概念的专业知识和经验。</p>
                <p>我们对亚洲商业文化、实践和市场动态的深入了解使我们能够提供尊重当地习俗的战略指导。</p>
              </div>
            </div>

            <div class="service-section">
              <h2>战略规划</h2>
              <div class="service-content-block">
                <p>我们与客户密切合作，制定考虑亚洲市场独特挑战和机遇的全面商业策略。</p>
                <p>从市场进入策略到运营优化，我们的咨询服务涵盖亚洲业务发展的各个方面。</p>
              </div>
            </div>

            <div class="service-section">
              <h2>本地市场专业知识</h2>
              <div class="service-content-block">
                <p>在香港、北京、上海和东京设有办事处，我们的团队为寻求在亚洲建立或扩展业务的企业提供实地洞察和支持。</p>
                <p>我们帮助弥合西方商业实践和亚洲市场要求之间的差距。</p>
              </div>
            </div>`,
    highlights: [
      '商业模式适应',
      '文化敏感性培训',
      '市场进入策略',
      '战略规划',
      '本地市场分析',
      '合资企业支持',
      '风险评估',
      '运营优化',
      '跨文化沟通',
      '问题解决方案'
    ]
  },
  'distribution': {
    title: '分布',
    description: '乐奇国际有限公司在亚洲提供全面的分销服务，利用与香港、中国和日本主要零售商和专业分销商的合作伙伴关系，为药品、化妆品和健康产品提供服务。',
    content: `
            <div class="service-section">
              <h2>香港分销</h2>
              <div class="service-content-block">
                <p class="intro-text">由于香港药品和化妆品进口监管相对简单，乐奇国际有限公司为本地分销商和直接用户供货。</p>
                <p><strong>合作伙伴包括：</strong></p>
                <ul>
                  <li>莎莎化妆品国际</li>
                  <li>屈臣氏</li>
                  <li>万宁</li>
                  <li>NULIFE（多层次营销）</li>
                  <li>PRIMAL CHEMICAL</li>
                  <li>香港赛马会</li>
                  <li>永威贸易公司</li>
                </ul>
              </div>
            </div>

            <div class="service-section">
              <h2>中国分销网络</h2>
              <div class="service-content-block">
                <p>由于药品分销不对外国公司开放，乐奇国际有限公司已根据其产品组合、地理覆盖、财务资源和推广能力与本地分销商建立了合作伙伴关系。</p>
                <p><strong>目前的合作伙伴关系包括专门从事以下领域的分销商：</strong>肿瘤学、泌尿学、妇科学、儿科、胃肠病学、眼科学、皮肤科和外科。</p>
                <p>在化妆品方面，乐奇国际有限公司建立了自己的分销部门，以人民币向区域分销商和连锁店及药店开票。</p>
              </div>
            </div>

            <div class="service-section">
              <h2>互联网和数字渠道</h2>
              <div class="service-content-block">
                <p><strong>互联网：</strong>因为这是一个非常适合中国的渠道（地理覆盖、推广、信息和减少人为因素），乐奇国际有限公司正在为著名的B2C网站建立进口产品供应。</p>
                <p>一个新概念是向处方医生推广健康产品（化妆品和食品）。</p>
              </div>
            </div>

            <div class="service-section">
              <h2>日本分销</h2>
              <div class="service-content-block">
                <p>对于特定药物，乐奇国际有限公司直接从香港向专门为自己患者进口药物的日本医生供货。（美容外科、老年医学）。</p>
                <p>这个专门的分销渠道提供了进入日本市场的机会，同时保持与当地法规的合规性。</p>
              </div>
            </div>`,
    highlights: [
      '香港零售合作伙伴关系',
      '中国区域分销',
      '专业医疗渠道',
      '互联网和B2C平台',
      '物流和存储解决方案',
      '人民币开票能力',
      '多层次营销支持',
      '医生处方渠道',
      '跨境供应',
      '监管合规'
    ]
  }
};

async function createAllChineseServices() {
  console.log('🚀 Creating all Chinese service pages...\n');
  
  for (const [serviceName, serviceData] of Object.entries(chineseServices)) {
    const filePath = `zh/services/${serviceName}/index.html`;
    const fullPath = path.join(__dirname, filePath);
    
    const htmlContent = createChineseServicePage(
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
      `/zh/services/${serviceName}/`,
      `${serviceData.title} – Innoledge`,
      [serviceData.title, '乐奇国际']
    );
    
    if (!success) {
      console.log(`❌ Verification failed for ${serviceName}`);
      process.exit(1);
    }
  }
  
  console.log('\n🎉 All Chinese service pages created and verified successfully!');
  console.log('\n🎊 CONGRATULATIONS! ALL 30 PAGES COMPLETE! 🎊');
}

createAllChineseServices().catch(console.error);