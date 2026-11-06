/**
 * Comprehensive Automated Test Suite
 * Bharat Space Education Research Centre - GenAI Internship (Week 2)
 * Scope: All 17 Projects Verification Suite
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

let passedTests = 0;
let totalTests = 0;

function assert(condition, message) {
  totalTests++;
  if (!condition) {
    console.error(`  ❌ FAIL: ${message}`);
    process.exitCode = 1;
  } else {
    passedTests++;
    console.log(`  ✓ PASS: ${message}`);
  }
}

console.log('\n===============================================================');
console.log('🧪 BHARAT SPACE GENAI INTERNSHIP — WEEK 2 TEST SUITE');
console.log('===============================================================\n');

// 1. Verify Project Folders
console.log('📁 Test Group 1: Verifying All 17 Project Directories...');
const EXPECTED_PROJECTS = [
  'project-01-pdf-studio',
  'project-02-form-photo-fixer',
  'project-03-resume-builder',
  'project-04-cbt-mock-test',
  'project-05-scribbly-notes',
  'project-06-reel-monster',
  'project-07-bill-book',
  'project-08-auto-rally',
  'project-09-youtube-focus-board',
  'project-10-job-clipper',
  'project-11-circle-to-fix',
  'project-12-chat-saver',
  'project-13-style-spy',
  'project-14-tab-goblin',
  'project-15-one-minute-reel-cut',
  'project-16-your-own-skill',
  'project-17-same-page-new-design'
];

EXPECTED_PROJECTS.forEach(proj => {
  assert(fs.existsSync(proj) && fs.statSync(proj).isDirectory(), `Project directory exists: ${proj}`);
});

// 2. Verify Essential Files in Each Project
console.log('\n📄 Test Group 2: Verifying Core Files in Every Project...');
EXPECTED_PROJECTS.forEach(proj => {
  assert(fs.existsSync(path.join(proj, 'index.html')), `${proj} contains index.html`);
  assert(fs.existsSync(path.join(proj, 'README.md')), `${proj} contains README.md`);
  assert(fs.existsSync(path.join(proj, 'prompts.md')), `${proj} contains prompts.md`);
  assert(fs.existsSync(path.join(proj, 'verification.md')), `${proj} contains verification.md`);
});

// 3. Verify Chrome Extension Manifests
console.log('\n🧩 Test Group 3: Verifying Chrome Extension Manifest V3 Specifications...');
const EXT_PROJECTS = [
  'project-09-youtube-focus-board',
  'project-10-job-clipper',
  'project-11-circle-to-fix',
  'project-12-chat-saver',
  'project-13-style-spy',
  'project-14-tab-goblin'
];

EXT_PROJECTS.forEach(proj => {
  const manifestPath = path.join(proj, 'manifest.json');
  assert(fs.existsSync(manifestPath), `${proj} has manifest.json`);
  if (fs.existsSync(manifestPath)) {
    try {
      const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
      assert(manifest.manifest_version === 3, `${proj} uses manifest_version 3`);
      assert(Boolean(manifest.name && manifest.version), `${proj} has valid name & version`);
    } catch (e) {
      assert(false, `${proj} manifest.json is valid JSON: ${e.message}`);
    }
  }
});

// 4. Verify PWA Manifests and Service Workers
console.log('\n📱 Test Group 4: Verifying Mobile PWA Manifests & Service Workers...');
const PWA_PROJECTS = [
  'project-06-reel-monster',
  'project-07-bill-book',
  'project-08-auto-rally'
];

PWA_PROJECTS.forEach(proj => {
  assert(fs.existsSync(path.join(proj, 'manifest.json')), `${proj} has manifest.json`);
  assert(fs.existsSync(path.join(proj, 'sw.js')), `${proj} has service worker (sw.js)`);
});

// 5. Verify Offline Local Vendor Assets
console.log('\n📦 Test Group 5: Verifying Bundled Offline Vendor Assets...');
const ASSETS_CHECK = [
  'project-01-pdf-studio/assets/pdf-lib.min.js',
  'project-01-pdf-studio/assets/pdf.min.js',
  'project-03-resume-builder/assets/jspdf.umd.min.js',
  'project-05-scribbly-notes/assets/jspdf.umd.min.js',
  'project-07-bill-book/assets/qrious.min.js',
  'project-07-bill-book/assets/html2canvas.min.js',
  'project-11-circle-to-fix/assets/html2canvas.min.js',
  'project-12-chat-saver/assets/jspdf.umd.min.js'
];

ASSETS_CHECK.forEach(assetPath => {
  assert(fs.existsSync(assetPath) && fs.statSync(assetPath).size > 1000, `Asset bundled locally: ${assetPath}`);
});

// 6. Validate JavaScript Syntax for All Repo Scripts
console.log('\n⚡ Test Group 6: Validating JavaScript Code Compilation & Syntax...');
function findJsFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    if (file === 'node_modules' || file === '.git' || file === 'assets') continue;
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      findJsFiles(fullPath, fileList);
    } else if (file.endsWith('.js') && !file.endsWith('.min.js')) {
      fileList.push(fullPath);
    }
  }
  return fileList;
}

const jsFiles = findJsFiles('.');
jsFiles.forEach(file => {
  try {
    const code = fs.readFileSync(file, 'utf8');
    new vm.Script(code);
    assert(true, `Syntax valid: ${file}`);
  } catch (err) {
    assert(false, `Syntax error in ${file}: ${err.message}`);
  }
});

// 7. Verify Master Hub Connections
console.log('\n🌐 Test Group 7: Verifying Master Project Hub Connections...');
assert(fs.existsSync('project-hub.html'), 'project-hub.html exists with title Project Hub');
const hubHtml = fs.readFileSync('project-hub.html', 'utf8');
assert(hubHtml.includes('<title>Project Hub'), 'project-hub.html has title "Project Hub"');
EXPECTED_PROJECTS.forEach(proj => {
  const targetLink = `${proj}/index.html`;
  assert(hubHtml.includes(targetLink), `project-hub.html links to ${targetLink}`);
  const projHtml = fs.readFileSync(path.join(proj, 'index.html'), 'utf8');
  assert(projHtml.includes('../project-hub.html'), `${proj} links back to Project Hub`);
});

// Summary
console.log('\n===============================================================');
console.log(`🏁 TEST SUITE SUMMARY: ${passedTests} of ${totalTests} tests passed (${Math.round((passedTests/totalTests)*100)}%)`);
console.log('===============================================================\n');

if (passedTests === totalTests) {
  console.log('🎉 ALL 17 PROJECTS PASSED VERIFICATION WITH ZERO FAILURES!\n');
  process.exit(0);
} else {
  console.error('❌ Some tests failed. Check log above.\n');
  process.exit(1);
}
