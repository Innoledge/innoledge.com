const puppeteer = require('../innoledge.com/node_modules/puppeteer');
const fs = require('fs');
const path = require('path');

// All expected pages for the complete site
const EXPECTED_PAGES = {
  // Core pages
  en: [
    '/',
    '/en/about/',
    '/en/portfolio/',
    '/en/contact/'
  ],
  fr: [
    '/fr/',
    '/fr/about/',
    '/fr/portfolio/',
    '/fr/contact/'
  ],
  zh: [
    '/zh/',
    '/zh/about/',
    '/zh/portfolio/',
    '/zh/contact/'
  ],
  // Service pages
  services: {
    en: [
      '/en/services/marketing/',
      '/en/services/sourcing/',
      '/en/services/investment/',
      '/en/services/regulatory-affairs/',
      '/en/services/business-consultancy/',
      '/en/services/distribution/'
    ],
    fr: [
      '/fr/services/france-marketing/',
      '/fr/services/sourcing-2/',
      '/fr/services/investissement/',
      '/fr/services/affaires-reglementaires/',
      '/fr/services/business-consultant/',
      '/fr/services/distribution-2/'
    ],
    zh: [
      '/zh/services/marketing/',
      '/zh/services/sourcing/',
      '/zh/services/investment/',
      '/zh/services/regulatory-affairs/',
      '/zh/services/business-consultancy/',
      '/zh/services/distribution/'
    ]
  }
};

async function testSiteComprehensively() {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  
  const results = {
    working: [],
    missing: [],
    errors: [],
    linkIssues: [],
    languageSwitchingIssues: [],
    formIssues: []
  };

  const baseUrl = 'http://localhost:8888';
  
  console.log('🚀 Starting comprehensive site test...\n');

  // Test all expected core pages
  const allCorePages = [
    ...EXPECTED_PAGES.en,
    ...EXPECTED_PAGES.fr,
    ...EXPECTED_PAGES.zh
  ];

  for (const pagePath of allCorePages) {
    try {
      console.log(`Testing: ${pagePath}`);
      const response = await page.goto(`${baseUrl}${pagePath}`, { 
        waitUntil: 'networkidle0',
        timeout: 10000 
      });
      
      if (response.status() === 200) {
        // Check if page has proper content
        const title = await page.title();
        const hasContent = await page.$eval('main', el => el.textContent.length > 100);
        
        if (hasContent) {
          results.working.push({ path: pagePath, title, status: 'OK' });
          console.log(`  ✅ Working: ${title}`);
        } else {
          results.errors.push({ path: pagePath, error: 'Empty content' });
          console.log(`  ⚠️  Empty content: ${pagePath}`);
        }
      } else {
        results.missing.push({ path: pagePath, status: response.status() });
        console.log(`  ❌ Missing: ${pagePath} (${response.status()})`);
      }
    } catch (error) {
      results.missing.push({ path: pagePath, error: error.message });
      console.log(`  ❌ Error: ${pagePath} - ${error.message}`);
    }
  }

  // Test all expected service pages
  console.log('\n📋 Testing Service Pages...');
  const allServicePages = [
    ...EXPECTED_PAGES.services.en,
    ...EXPECTED_PAGES.services.fr,
    ...EXPECTED_PAGES.services.zh
  ];

  for (const servicePath of allServicePages) {
    try {
      const response = await page.goto(`${baseUrl}${servicePath}`, { 
        waitUntil: 'networkidle0',
        timeout: 5000 
      });
      
      if (response.status() === 200) {
        const title = await page.title();
        results.working.push({ path: servicePath, title, status: 'OK' });
        console.log(`  ✅ Working: ${title}`);
      } else {
        results.missing.push({ path: servicePath, status: response.status() });
        console.log(`  ❌ Missing: ${servicePath} (${response.status()})`);
      }
    } catch (error) {
      results.missing.push({ path: servicePath, error: error.message });
      console.log(`  ❌ Missing: ${servicePath} - ${error.message}`);
    }
  }

  // Test language switching on working pages
  console.log('\n🌐 Testing Language Switching...');
  for (const pageInfo of results.working.slice(0, 5)) { // Test first 5 working pages
    try {
      await page.goto(`${baseUrl}${pageInfo.path}`);
      
      // Test language switcher functionality
      const langSwitcher = await page.$('.language-switcher');
      if (langSwitcher) {
        await page.click('.lang-toggle');
        await page.waitForSelector('.lang-dropdown', { visible: true, timeout: 2000 });
        
        const langOptions = await page.$$('.lang-option');
        if (langOptions.length === 3) {
          console.log(`  ✅ Language switcher working on ${pageInfo.path}`);
        } else {
          results.languageSwitchingIssues.push({ 
            path: pageInfo.path, 
            issue: `Only ${langOptions.length} language options found` 
          });
        }
      } else {
        results.languageSwitchingIssues.push({ 
          path: pageInfo.path, 
          issue: 'No language switcher found' 
        });
      }
    } catch (error) {
      results.languageSwitchingIssues.push({ 
        path: pageInfo.path, 
        issue: error.message 
      });
    }
  }

  // Test contact forms
  console.log('\n📧 Testing Contact Forms...');
  const contactPages = ['/en/contact/', '/fr/contact/', '/zh/contact/'];
  
  for (const contactPath of contactPages) {
    try {
      const response = await page.goto(`${baseUrl}${contactPath}`);
      if (response.status() === 200) {
        const form = await page.$('.contact-form');
        if (form) {
          const nameField = await page.$('input[name="name"]');
          const emailField = await page.$('input[name="email"]');
          const messageField = await page.$('textarea[name="message"]');
          const submitButton = await page.$('button[type="submit"]');
          
          if (nameField && emailField && messageField && submitButton) {
            console.log(`  ✅ Contact form complete on ${contactPath}`);
          } else {
            results.formIssues.push({ 
              path: contactPath, 
              issue: 'Missing form fields' 
            });
          }
        } else {
          results.formIssues.push({ 
            path: contactPath, 
            issue: 'No contact form found' 
          });
        }
      }
    } catch (error) {
      results.formIssues.push({ 
        path: contactPath, 
        issue: error.message 
      });
    }
  }

  // Test internal navigation links
  console.log('\n🔗 Testing Internal Navigation...');
  for (const pageInfo of results.working.slice(0, 3)) {
    try {
      await page.goto(`${baseUrl}${pageInfo.path}`);
      
      const navLinks = await page.$$eval('.menu-items a', links => 
        links.map(link => ({ href: link.getAttribute('href'), text: link.textContent.trim() }))
      );
      
      let brokenLinks = 0;
      for (const link of navLinks) {
        if (link.href && link.href.startsWith('/')) {
          try {
            const linkResponse = await page.goto(`${baseUrl}${link.href}`, { timeout: 3000 });
            if (linkResponse.status() !== 200) {
              brokenLinks++;
            }
          } catch (error) {
            brokenLinks++;
          }
        }
      }
      
      if (brokenLinks > 0) {
        results.linkIssues.push({ 
          path: pageInfo.path, 
          brokenLinks: brokenLinks,
          totalLinks: navLinks.length 
        });
      }
    } catch (error) {
      results.linkIssues.push({ 
        path: pageInfo.path, 
        issue: error.message 
      });
    }
  }

  await browser.close();

  // Generate comprehensive report
  console.log('\n' + '='.repeat(60));
  console.log('📊 COMPREHENSIVE SITE TEST RESULTS');
  console.log('='.repeat(60));
  
  console.log(`\n✅ WORKING PAGES (${results.working.length}):`);
  results.working.forEach(page => {
    console.log(`  ${page.path} - ${page.title}`);
  });
  
  console.log(`\n❌ MISSING PAGES (${results.missing.length}):`);
  results.missing.forEach(page => {
    console.log(`  ${page.path} - ${page.error || page.status}`);
  });
  
  if (results.languageSwitchingIssues.length > 0) {
    console.log(`\n🌐 LANGUAGE SWITCHING ISSUES (${results.languageSwitchingIssues.length}):`);
    results.languageSwitchingIssues.forEach(issue => {
      console.log(`  ${issue.path} - ${issue.issue}`);
    });
  }
  
  if (results.linkIssues.length > 0) {
    console.log(`\n🔗 NAVIGATION ISSUES (${results.linkIssues.length}):`);
    results.linkIssues.forEach(issue => {
      console.log(`  ${issue.path} - ${issue.brokenLinks || 0} broken links`);
    });
  }
  
  if (results.formIssues.length > 0) {
    console.log(`\n📧 FORM ISSUES (${results.formIssues.length}):`);
    results.formIssues.forEach(issue => {
      console.log(`  ${issue.path} - ${issue.issue}`);
    });
  }

  // Generate priority task list
  console.log('\n' + '='.repeat(60));
  console.log('📋 PRIORITY TASK LIST');
  console.log('='.repeat(60));
  
  console.log('\n🔥 HIGH PRIORITY:');
  if (results.missing.some(p => p.path === '/fr/' || p.path === '/zh/')) {
    console.log('  1. Create missing homepage variants (/fr/, /zh/)');
  }
  
  const missingServices = results.missing.filter(p => p.path.includes('/services/'));
  if (missingServices.length > 0) {
    console.log(`  2. Create ${missingServices.length} missing service pages`);
  }
  
  console.log('\n⚠️  MEDIUM PRIORITY:');
  if (results.linkIssues.length > 0) {
    console.log('  1. Fix broken navigation links');
  }
  if (results.languageSwitchingIssues.length > 0) {
    console.log('  2. Fix language switching issues');
  }
  
  console.log('\n📊 SUMMARY:');
  console.log(`  Total Pages Expected: ${allCorePages.length + allServicePages.length}`);
  console.log(`  Working Pages: ${results.working.length}`);
  console.log(`  Missing Pages: ${results.missing.length}`);
  console.log(`  Completion: ${Math.round((results.working.length / (allCorePages.length + allServicePages.length)) * 100)}%`);

  // Save detailed results to file
  fs.writeFileSync(
    path.join(__dirname, 'site-test-results.json'),
    JSON.stringify(results, null, 2)
  );
  
  console.log('\n💾 Detailed results saved to: site-test-results.json');
  
  return results;
}

// Run the test
testSiteComprehensively().catch(console.error);