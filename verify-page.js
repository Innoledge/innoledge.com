const puppeteer = require('../innoledge.com/node_modules/puppeteer');

async function verifyPage(pagePath, expectedTitle, expectedContent = []) {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  
  console.log(`🔍 Verifying: ${pagePath}`);
  
  try {
    const response = await page.goto(`http://localhost:8001${pagePath}`, {
      waitUntil: 'networkidle0',
      timeout: 10000
    });
    
    if (response.status() !== 200) {
      throw new Error(`Page returned status ${response.status()}`);
    }
    
    // Check title
    const title = await page.title();
    const titleMatch = title === expectedTitle;
    console.log(`  ${titleMatch ? '✅' : '❌'} Title: "${title}" ${titleMatch ? '(correct)' : `(expected: "${expectedTitle}")`}`);
    
    // Check if page has main content
    const hasMainContent = await page.$('main') !== null;
    console.log(`  ${hasMainContent ? '✅' : '❌'} Has main content: ${hasMainContent}`);
    
    // Check if navigation is present
    const hasNavigation = await page.$('.main-navigation') !== null;
    console.log(`  ${hasNavigation ? '✅' : '❌'} Has navigation: ${hasNavigation}`);
    
    // Check if language switcher works
    const hasLangSwitcher = await page.$('.language-switcher') !== null;
    console.log(`  ${hasLangSwitcher ? '✅' : '❌'} Has language switcher: ${hasLangSwitcher}`);
    
    if (hasLangSwitcher) {
      await page.click('.lang-toggle');
      const langDropdownVisible = await page.waitForSelector('.lang-dropdown', { visible: true, timeout: 2000 }).then(() => true).catch(() => false);
      console.log(`  ${langDropdownVisible ? '✅' : '❌'} Language dropdown works: ${langDropdownVisible}`);
    }
    
    // Check for expected content
    for (const contentCheck of expectedContent) {
      const contentExists = await page.evaluate((text) => 
        document.body.textContent.includes(text), contentCheck
      );
      console.log(`  ${contentExists ? '✅' : '❌'} Contains "${contentCheck}": ${contentExists}`);
    }
    
    // Check for footer
    const hasFooter = await page.$('.site-footer') !== null;
    console.log(`  ${hasFooter ? '✅' : '❌'} Has footer: ${hasFooter}`);
    
    // Check internal links (sample a few)
    const internalLinks = await page.$$eval('a[href^="/"]', links => 
      links.slice(0, 5).map(link => link.getAttribute('href'))
    );
    console.log(`  ✅ Internal links found: ${internalLinks.length} (sample: ${internalLinks.slice(0, 3).join(', ')})`);
    
    console.log(`  ✅ Page verification complete for ${pagePath}\n`);
    
    await browser.close();
    return true;
    
  } catch (error) {
    console.log(`  ❌ Error verifying ${pagePath}: ${error.message}\n`);
    await browser.close();
    return false;
  }
}

// If script is run directly, verify the page passed as argument
if (require.main === module) {
  const args = process.argv.slice(2);
  if (args.length < 2) {
    console.log('Usage: node verify-page.js <path> <expected-title> [expected-content...]');
    process.exit(1);
  }
  
  const [path, title, ...content] = args;
  verifyPage(path, title, content).then(success => {
    process.exit(success ? 0 : 1);
  });
}

module.exports = { verifyPage };