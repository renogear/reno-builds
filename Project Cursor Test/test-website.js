// Website Test Script
// Run this in browser console to test functionality

console.log('🔍 Starting PropGrid Website Test...');

// Test 1: Check critical elements
function testCriticalElements() {
    console.log('\n📋 Test 1: Critical Elements');
    const criticalElements = [
        'signup-form',
        'email-list', 
        'mobile-menu-btn',
        'progress-bar',
        'current-step',
        'next-btn',
        'prev-btn',
        'submit-btn',
        'mobile-menu',
        'faq-accordion'
    ];
    
    let foundCount = 0;
    criticalElements.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            console.log(`✅ ${id}: Found`);
            foundCount++;
        } else {
            console.log(`❌ ${id}: Missing`);
        }
    });
    
    console.log(`📊 Found ${foundCount}/${criticalElements.length} critical elements`);
    return foundCount === criticalElements.length;
}

// Test 2: Check form structure
function testFormStructure() {
    console.log('\n📝 Test 2: Form Structure');
    const form = document.getElementById('signup-form');
    if (!form) {
        console.log('❌ Form not found');
        return false;
    }
    
    const steps = document.querySelectorAll('.step-content');
    console.log(`📊 Found ${steps.length} form steps`);
    
    const requiredFields = form.querySelectorAll('[required]');
    console.log(`📋 Found ${requiredFields.length} required fields`);
    
    const radioGroups = form.querySelectorAll('input[type="radio"]');
    console.log(`🔘 Found ${radioGroups.length} radio buttons`);
    
    // Check for accessibility attributes
    const hasAriaLabels = form.querySelectorAll('[aria-describedby]').length;
    const hasErrorMessages = form.querySelectorAll('.error-message').length;
    console.log(`♿ Found ${hasAriaLabels} fields with ARIA labels`);
    console.log(`⚠️ Found ${hasErrorMessages} error message containers`);
    
    return steps.length >= 2 && requiredFields.length >= 3;
}

// Test 3: Check FAQ functionality
function testFAQ() {
    console.log('\n❓ Test 3: FAQ Functionality');
    const faqButtons = document.querySelectorAll('.faq-accordion-btn');
    console.log(`📋 Found ${faqButtons.length} FAQ buttons`);
    
    const accordionContent = document.querySelectorAll('.accordion-content');
    console.log(`📄 Found ${accordionContent.length} accordion content areas`);
    
    // Test if FAQ buttons are clickable
    let hasHandlers = 0;
    faqButtons.forEach((btn, index) => {
        const hasClickHandler = btn.onclick || btn._listeners;
        if (hasClickHandler) hasHandlers++;
        console.log(`🔘 FAQ ${index + 1}: ${hasClickHandler ? 'Has handlers' : 'No handlers'}`);
    });
    
    // Check accessibility attributes
    const hasAriaExpanded = document.querySelectorAll('[aria-expanded]').length;
    const hasAriaControls = document.querySelectorAll('[aria-controls]').length;
    console.log(`♿ Found ${hasAriaExpanded} buttons with aria-expanded`);
    console.log(`♿ Found ${hasAriaControls} buttons with aria-controls`);
    
    return faqButtons.length > 0 && hasHandlers === faqButtons.length;
}

// Test 4: Check navigation
function testNavigation() {
    console.log('\n🧭 Test 4: Navigation');
    const logoLinks = document.querySelectorAll('a[href="/"]');
    console.log(`🏠 Found ${logoLinks.length} logo links`);
    
    const navLinks = document.querySelectorAll('nav a[href^="#"]');
    console.log(`🔗 Found ${navLinks.length} navigation links`);
    
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    console.log(`📱 Mobile menu: ${mobileMenuBtn ? 'Button found' : 'Button missing'}`);
    console.log(`📱 Mobile menu: ${mobileMenu ? 'Menu found' : 'Menu missing'}`);
    
    // Check accessibility attributes
    if (mobileMenuBtn) {
        const hasAriaLabel = mobileMenuBtn.hasAttribute('aria-label');
        const hasAriaExpanded = mobileMenuBtn.hasAttribute('aria-expanded');
        const hasAriaControls = mobileMenuBtn.hasAttribute('aria-controls');
        console.log(`♿ Mobile menu button: aria-label=${hasAriaLabel}, aria-expanded=${hasAriaExpanded}, aria-controls=${hasAriaControls}`);
    }
    
    // Check if logo links to homepage, not directory
    let validLogoLinks = 0;
    logoLinks.forEach(link => {
        if (link.href.endsWith('/') || link.href.endsWith('/index.html')) {
            validLogoLinks++;
        }
    });
    console.log(`✅ ${validLogoLinks}/${logoLinks.length} logo links point to homepage`);
    
    return logoLinks.length > 0 && mobileMenuBtn && mobileMenu;
}

// Test 5: Check JavaScript errors
function testJavaScriptErrors() {
    console.log('\n🐛 Test 5: JavaScript Errors');
    
    // Override console.error to catch errors
    const originalError = console.error;
    const errors = [];
    
    console.error = (...args) => {
        errors.push(args);
        originalError.apply(console, args);
    };
    
    // Trigger some interactions
    setTimeout(() => {
        console.error = originalError;
        console.log(`🚨 Found ${errors.length} JavaScript errors`);
        if (errors.length > 0) {
            errors.forEach((error, index) => {
                console.log(`Error ${index + 1}:`, error);
            });
        }
    }, 2000);
}

// Test 6: Check form validation
function testFormValidation() {
    console.log('\n✅ Test 6: Form Validation');
    
    const form = document.getElementById('signup-form');
    if (!form) {
        console.log('❌ Form not found for validation test');
        return;
    }
    
    // Test required field validation
    const requiredFields = form.querySelectorAll('[required]');
    console.log(`📋 Testing ${requiredFields.length} required fields`);
    
    requiredFields.forEach((field, index) => {
        const hasValidation = field.hasAttribute('aria-describedby') || 
                             field.parentNode.querySelector('.error-message');
        console.log(`Field ${index + 1} (${field.name || field.id}): ${hasValidation ? 'Has validation' : 'No validation'}`);
    });
}

// Test 7: Check interactive elements
function testInteractiveElements() {
    console.log('\n🎮 Test 7: Interactive Elements');
    
    // Check if components are initialized
    if (window.app) {
        console.log('✅ Main app initialized');
        const components = window.app.getComponent ? window.app.getComponent() : 'No getComponent method';
        console.log('📦 Components:', components);
    } else {
        console.log('❌ Main app not initialized');
    }
    
    // Check for email simulation
    const emailList = document.getElementById('email-list');
    if (emailList) {
        console.log('📧 Email list found');
        const emailCount = emailList.children.length;
        console.log(`📊 Email count: ${emailCount}`);
    } else {
        console.log('❌ Email list not found');
    }
}

// Run all tests
function runAllTests() {
    console.log('🚀 Starting comprehensive website test...\n');
    
    const results = {
        criticalElements: testCriticalElements(),
        formStructure: testFormStructure(),
        faq: testFAQ(),
        navigation: testNavigation(),
        formValidation: testFormValidation(),
        interactiveElements: testInteractiveElements()
    };
    
    // Delay error test to catch runtime errors
    setTimeout(() => {
        testJavaScriptErrors();
        
        // Summary
        console.log('\n📊 Test Summary:');
        const passedTests = Object.values(results).filter(Boolean).length;
        const totalTests = Object.keys(results).length;
        console.log(`✅ ${passedTests}/${totalTests} tests passed`);
        
        if (passedTests === totalTests) {
            console.log('🎉 All tests passed! Website is ready for launch.');
        } else {
            console.log('⚠️ Some tests failed. Please review the issues above.');
        }
        
        console.log('\n✅ All tests completed!');
    }, 1000);
    
    return results;
}

// Auto-run tests
runAllTests();

// Export for manual testing
window.testWebsite = {
    runAllTests,
    testCriticalElements,
    testFormStructure,
    testFAQ,
    testNavigation,
    testFormValidation,
    testInteractiveElements,
    testJavaScriptErrors
}; 