/**
 * PropGrid Landing Page - Optimized JavaScript
 * Performance-focused with accessibility and modern best practices
 */

// --- Utility functions used throughout the app ---
const utils = {
  /**
   * Throttle a function to only run once every 'wait' ms
   * @param {Function} fn - The function to throttle
   * @param {number} wait - The minimum time (ms) between calls
   * @returns {Function}
   */
  throttle(fn, wait) {
    let lastTime = 0;
    let timeout;
    return function(...args) {
      const now = Date.now();
      if (now - lastTime >= wait) {
        lastTime = now;
        fn.apply(this, args);
      } else {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          lastTime = Date.now();
          fn.apply(this, args);
        }, wait - (now - lastTime));
      }
    };
  },

  /**
   * Smoothly scroll to an element by ID
   * @param {string} id - The ID of the element to scroll to
   */
  scrollToElement(id) {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  },

  /**
   * Safely get element by ID with null check
   * @param {string} id - The ID of the element to find
   * @returns {Element|null} The element or null if not found
   */
  getElement(id) {
    return document.getElementById(id);
  },

  /**
   * Safely add event listener with error handling
   * @param {Element} element - The element to add listener to
   * @param {string} event - The event type
   * @param {Function} handler - The event handler
   * @param {Object} options - Event listener options
   */
  addEventListener(element, event, handler, options = {}) {
    if (element && typeof element.addEventListener === 'function') {
      try {
        element.addEventListener(event, handler, options);
      } catch (error) {
        if (typeof console !== 'undefined' && console.error) {
          console.error(`Failed to add ${event} listener:`, error);
        }
      }
    }
  },

  /**
   * Safely remove event listener with error handling
   * @param {Element} element - The element to remove listener from
   * @param {string} event - The event type
   * @param {Function} handler - The event handler
   * @param {Object} options - Event listener options
   */
  removeEventListener(element, event, handler, options = {}) {
    if (element && typeof element.removeEventListener === 'function') {
      try {
        element.removeEventListener(event, handler, options);
      } catch (error) {
        if (typeof console !== 'undefined' && console.error) {
          console.error(`Failed to remove ${event} listener:`, error);
        }
      }
    }
  }
};

// --- Ensure AppState and emailDeals are defined before use ---
if (typeof window.AppState === 'undefined') {
  window.AppState = {
    currentEmailStep: 0,
    visibleEmails: [],
    isSimulationRunning: false,
    isTyping: false
  };
}
if (typeof window.emailDeals === 'undefined') {
  window.emailDeals = [
    // Example deals for simulation; replace with real data as needed
    {
      id: 'deal1',
      avatar: '🏠',
      subject: 'New DEAL: 3BR Rental in Austin',
      sender: 'PropGrid Deals',
      time: '09:15 AM',
      preview: 'High CoC, strong cap rate, off-market opportunity.',
      status: 'new'
    },
    {
      id: 'deal2',
      avatar: '🏢',
      subject: 'Commercial DEAL: Retail Plaza, Phoenix',
      sender: 'PropGrid Deals',
      time: '10:02 AM',
      preview: '8.2% cap rate, value-add, high traffic area.',
      status: 'starred'
    },
    {
      id: 'deal3',
      avatar: '🌳',
      subject: 'Land Opportunity: Tampa Suburbs',
      sender: 'PropGrid Deals',
      time: '11:30 AM',
      preview: 'Development potential, distressed seller.',
      status: 'new'
    }
  ];
}

// --- DRY Global Error Handler ---
function showCriticalError(msg) {
  let errorDiv = document.getElementById('critical-error');
  if (!errorDiv) {
    errorDiv = document.createElement('div');
    errorDiv.id = 'critical-error';
    errorDiv.style.position = 'fixed';
    errorDiv.style.top = '0';
    errorDiv.style.left = '0';
    errorDiv.style.width = '100vw';
    errorDiv.style.background = '#fee2e2';
    errorDiv.style.color = '#b91c1c';
    errorDiv.style.fontSize = '1.25rem';
    errorDiv.style.padding = '1.5rem';
    errorDiv.style.zIndex = '9999';
    errorDiv.style.textAlign = 'center';
    errorDiv.setAttribute('role', 'alert');
    errorDiv.setAttribute('aria-live', 'assertive');
    errorDiv.innerText = 'A critical error occurred: ' + msg;
    document.body.appendChild(errorDiv);
  } else {
    errorDiv.innerText = 'A critical error occurred: ' + msg;
  }
  if (document.body) {
    document.body.style.display = '';
    document.body.style.opacity = '1';
  }
}

// --- Essential error handler ---
window.addEventListener('error', function(e) {
  console.error('Error:', e.error || e.message);
  showCriticalError(e.error ? e.error.message : e.message);
  e.preventDefault();
});

window.addEventListener('unhandledrejection', function(e) {
  console.error('Promise rejection:', e.reason);
  showCriticalError(e.reason ? e.reason.message : e.reason);
  e.preventDefault();
});

// Add error boundary for component initialization
window.addEventListener('DOMContentLoaded', function() {
  // Monitor for DOM mutations that might indicate errors
  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.type === 'childList') {
        // Check if critical elements were removed
        const criticalElements = ['email-list', 'signup-form'];
        criticalElements.forEach(id => {
          if (!document.getElementById(id) && window.app) {
            if (typeof console !== 'undefined' && console.warn) {
              console.warn(`⚠️ Critical element ${id} was removed, attempting recovery`);
            }
            // Attempt to recover
            setTimeout(() => {
              if (!document.getElementById(id)) {
                if (typeof console !== 'undefined' && console.warn) {
                  console.warn(`⚠️ Critical element ${id} is missing - this may affect functionality`);
                }
                // Only show critical error for truly essential elements
                if (id === 'signup-form') {
                  showCriticalError(`Critical element ${id} is missing`);
                }
              }
            }, 1000);
          }
        });
      }
    });
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
});

// --- Enhanced Defensive Initialization and Logging ---

// --- Debug Utilities ---
const debug = {
    enabled: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1',
    
    log(message, data = null) {
        if (this.enabled && typeof console !== 'undefined' && console.log) {
            console.log(`🔍 [DEBUG] ${message}`, data || '');
        }
    },
    
    warn(message, data = null) {
        if (this.enabled && typeof console !== 'undefined' && console.warn) {
            console.warn(`⚠️ [DEBUG] ${message}`, data || '');
        }
    },
    
    error(message, data = null) {
        if (this.enabled && typeof console !== 'undefined' && console.error) {
            console.error(`❌ [DEBUG] ${message}`, data || '');
        }
    },
    
    // Check for common issues
    diagnose() {
        this.log('Starting diagnostic check...');
        
        // Check critical elements
        const criticalElements = ['email-list', 'signup-form'];
        criticalElements.forEach(id => {
            const element = document.getElementById(id);
            if (!element) {
                this.error(`Critical element missing: ${id}`);
            } else {
                this.log(`✅ Element found: ${id}`);
            }
        });
        
        // Check for console errors
        const originalError = console.error;
        const errors = [];
        console.error = (...args) => {
            errors.push(args);
            originalError.apply(console, args);
        };
        
        setTimeout(() => {
            if (errors.length > 0) {
                this.warn(`Found ${errors.length} console errors during initialization`);
            }
            console.error = originalError;
        }, 1000);
        
        // Check performance
        if ('performance' in window) {
            const timing = performance.timing;
            if (timing) {
                const loadTime = timing.loadEventEnd - timing.navigationStart;
                this.log(`Page load time: ${loadTime}ms`);
            }
        }
    }
};

// --- Log AppState and emailDeals at the top for debugging ---
debug.log('AppState:', typeof AppState !== 'undefined' ? AppState : 'undefined');
debug.log('emailDeals:', typeof emailDeals !== 'undefined' ? emailDeals : 'undefined');

// Run diagnostic on page load
window.addEventListener('load', () => {
    setTimeout(() => debug.diagnose(), 1000);
});

// Add debug console to window for manual debugging
window.debugConsole = {
    // Show all critical elements
    showElements() {
        const elements = ['email-list', 'signup-form', 'navbar'];
        elements.forEach(id => {
            const el = document.getElementById(id);
            console.log(`${id}:`, el ? '✅ Found' : '❌ Missing', el);
        });
    },
    
    // Force visibility on all animated elements
    forceVisibility() {
        const animatedElements = document.querySelectorAll('.animate-fade-in, .animate-slide-up, .animate-slide-down, .animate-scale-in');
        animatedElements.forEach(el => {
            el.classList.add('force-visible');
            el.style.opacity = '1';
            el.style.transform = 'none';
        });
        console.log(`Forced visibility on ${animatedElements.length} elements`);
    },
    
    // Check app state
    checkAppState() {
        console.log('App State:', window.AppState);
        console.log('App Instance:', window.app);
        console.log('Email Deals:', window.emailDeals);
    },
    
    // Restart app
    restartApp() {
        if (window.app) {
            window.app.destroy();
        }
        appInitialized = false;
        initializationAttempts = 0;
        initializeApp();
        console.log('App restarted');
    },
    
    // Show performance metrics
    showMetrics() {
        const monitor = window.app?.getComponent('performanceMonitor');
        if (monitor) {
            console.log('Performance Metrics:', monitor.getMetrics());
        } else {
            console.log('Performance Monitor not available');
        }
    }
};

// Essential debug command: Press Ctrl+Shift+D
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        console.log('Debug: Press Ctrl+Shift+D again to force visibility');
        const elements = document.querySelectorAll('.animate-fade-in, .animate-slide-up, .animate-slide-down, .animate-scale-in');
        elements.forEach(el => el.classList.add('force-visible'));
    }
});

class EmailSimulation {
    constructor() {
        if (typeof console !== 'undefined' && console.log) {
            console.log('[EmailSimulation] Initializing...');
        }
        this.container = utils.getElement('email-list');
        this.emailCount = utils.getElement('emailCount');
        this.intervalId = null;
        this.animationFrame = null;
        this.isRunning = false;
        this.emailCache = new Map(); // Cache for email elements
        this.eventListeners = new Map(); // Track event listeners for cleanup
        
        if (!this.container) {
            if (typeof console !== 'undefined' && console.error) {
                console.error('[EmailSimulation] Missing #email-list element. Skipping initialization.');
            }
            // Don't show critical error for missing email simulation - it's not essential
            return;
        }
        if (!this.emailCount) {
            if (typeof console !== 'undefined' && console.error) {
                console.error('[EmailSimulation] Missing #emailCount element. Skipping initialization.');
            }
            // Don't show critical error for missing email count - it's not essential
            return;
        }
        try {
            this.init();
        } catch (err) {
            if (typeof console !== 'undefined' && console.error) {
                console.error('[EmailSimulation] Initialization error:', err);
            }
            showCriticalError('Email simulation failed to initialize: ' + (err && err.message ? err.message : err));
        }
    }

    init() {
        // Initialize immediately if elements are available
        if (this.container && this.emailCount) {
            // Reset state
            AppState.currentEmailStep = 0;
            AppState.visibleEmails = [];
            
            // Start simulation after a short delay
            setTimeout(() => {
                this.startSimulation();
            }, 2000);
        } else {
            // Retry initialization after DOM is ready
            setTimeout(() => {
                this.delayedInit();
            }, 1000);
        }
    }
    
    delayedInit() {
        // Check if elements are now available
        if (this.container && this.emailCount) {
            // Reset state
            AppState.currentEmailStep = 0;
            AppState.visibleEmails = [];
            
            // Start simulation
            this.startSimulation();
        } else {
            if (typeof console !== 'undefined' && console.warn) {
                console.warn('[EmailSimulation] Elements still not found after retry');
            }
        }
    }

    startSimulation() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
        
        if (this.isRunning) return;
        
        // Check if we have the required elements
        if (!this.container || !this.emailCount) {
            if (typeof console !== 'undefined' && console.warn) {
                console.warn('Email simulation elements not found');
            }
            return;
        }
        
        this.isRunning = true;
        this.intervalId = setInterval(() => {
            if (AppState.currentEmailStep < emailDeals.length) {
                this.setTypingState(true);
                
                setTimeout(() => {
                    this.addEmail(emailDeals[AppState.currentEmailStep]);
                    this.setTypingState(false);
                    AppState.currentEmailStep++;
                }, 1500);
            } else {
                this.stopSimulation();
            }
        }, 3000);
    }

    stopSimulation() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
        this.isRunning = false;
        AppState.isSimulationRunning = false;
    }

    setTypingState(typing) {
        AppState.isTyping = typing;
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.style.display = typing ? 'block' : 'none';
        }
    }

    addEmail(email) {
        if (!email || !this.container) return;
        
        // Create email element efficiently
        const emailElement = this.createEmailElement(email);
        this.container.appendChild(emailElement);
        
        // Update visible emails array
        AppState.visibleEmails.push(email);
        
        // Update count
        this.updateEmailCount();
        
        // Animate in
        requestAnimationFrame(() => {
            emailElement.classList.add('email-item');
        });
    }

    createEmailElement(email) {
        // Check cache first
        if (this.emailCache.has(email.id)) {
            return this.emailCache.get(email.id).cloneNode(true);
        }
        
        const emailDiv = document.createElement('div');
        emailDiv.className = 'bg-white border border-gray-200 rounded-lg p-4 mb-3 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer opacity-0';
        
        // Determine status indicator
        let statusIndicator = '';
        if (email.status === 'new') {
            statusIndicator = '<div class="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>';
        } else if (email.status === 'starred') {
            statusIndicator = '<i class="fas fa-star text-yellow-400 text-sm"></i>';
        }
        
        emailDiv.innerHTML = `
            <div class="flex items-start space-x-3">
                <div class="w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
                    ${email.avatar}
                </div>
                <div class="flex-1 min-w-0">
                    <div class="flex items-center justify-between mb-2">
                        <h4 class="text-sm font-semibold text-gray-900 truncate pr-2">${email.subject}</h4>
                        <span class="text-xs text-gray-500 flex-shrink-0">${email.time}</span>
                    </div>
                    <p class="text-xs text-gray-600 mb-2 font-medium">${email.sender}</p>
                    <p class="text-sm text-gray-700 leading-relaxed">${email.preview}</p>
                    
                    <!-- Deal Metrics (for deal emails) -->
                    ${email.subject.includes('DEAL') || email.subject.includes('Commercial') || email.subject.includes('Land') ? `
                        <div class="mt-3 flex flex-wrap gap-2">
                            ${email.preview.includes('CoC') ? '<span class="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium">High Cash Flow</span>' : ''}
                            ${email.preview.includes('cap rate') ? '<span class="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full font-medium">Strong Cap Rate</span>' : ''}
                            ${email.preview.includes('off-market') ? '<span class="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full font-medium">Off-Market</span>' : ''}
                            ${email.preview.includes('distressed') ? '<span class="bg-orange-100 text-orange-700 text-xs px-2 py-1 rounded-full font-medium">Distressed</span>' : ''}
                            ${email.preview.includes('development') ? '<span class="bg-indigo-100 text-indigo-700 text-xs px-2 py-1 rounded-full font-medium">Development</span>' : ''}
                        </div>
                    ` : ''}
                </div>
                <div class="flex flex-col items-center space-y-2">
                    ${statusIndicator}
                    <div class="text-xs text-gray-400">
                        <i class="fas fa-eye"></i>
                    </div>
                </div>
            </div>
        `;
        
        // Cache the element
        this.emailCache.set(email.id, emailDiv.cloneNode(true));
        
        return emailDiv;
    }

    resetEmails() {
        if (this.container) {
            this.container.innerHTML = '';
        }
        AppState.visibleEmails = [];
        AppState.currentEmailStep = 0;
        this.updateEmailCount();
    }

    updateEmailCount() {
        if (this.emailCount) {
            this.emailCount.textContent = AppState.visibleEmails.length;
        }
    }

    renderEmails() {
        if (!this.container) return;
        
        // Clear container
        this.container.innerHTML = '';
        
        // Render existing emails
        AppState.visibleEmails.forEach(email => {
            const emailElement = this.createEmailElement(email);
            this.container.appendChild(emailElement);
            
            // Animate in with staggered delay
            setTimeout(() => {
                emailElement.classList.add('email-item');
            }, AppState.visibleEmails.indexOf(email) * 100);
        });
    }

    destroy() {
        this.stopSimulation();
        
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
            this.animationFrame = null;
        }
        
        // Clear event listeners
        this.eventListeners.forEach(({ element, event, handler, options }) => {
            utils.removeEventListener(element, event, handler, options);
        });
        this.eventListeners.clear();
        
        // Clear cache
        this.emailCache.clear();
        
        // Clear references
        this.container = null;
        this.emailCount = null;
        this.isRunning = false;
    }
}

// Navigation system with performance optimizations
class Navigation {
    constructor() {
        this.navbar = utils.getElement('navbar');
        this.mobileMenu = utils.getElement('mobile-menu');
        this.mobileMenuButton = utils.getElement('mobile-menu-btn');
        this.mobileMenuClose = utils.getElement('mobile-menu-close');
        this.scrollTimeout = null;
        this.isScrolling = false;
        this.eventListeners = new Map(); // Track event listeners for cleanup
        
        this.init();
    }

    init() {
        if (!this.navbar) return;
        
        this.setupScrollEffects();
        this.setupMobileMenu();
        this.setupSmoothScrolling();
        this.setupKeyboardNavigation();
    }

    setupScrollEffects() {
        // Use throttled scroll handler for better performance
        const handleScroll = utils.throttle(() => {
            if (this.scrollTimeout) {
                clearTimeout(this.scrollTimeout);
            }
            
            this.isScrolling = true;
            if (this.navbar) {
                this.navbar.classList.add('bg-white/95', 'backdrop-blur-md', 'shadow-sm');
                this.navbar.classList.remove('bg-transparent');
            }
            
            this.scrollTimeout = setTimeout(() => {
                this.isScrolling = false;
                if (window.scrollY < 100 && this.navbar) {
                    this.navbar.classList.remove('bg-white/95', 'backdrop-blur-md', 'shadow-sm');
                    this.navbar.classList.add('bg-transparent');
                }
            }, 150);
        }, 16); // ~60fps
        
        utils.addEventListener(window, 'scroll', handleScroll, { passive: true });
        this.eventListeners.set('scroll', { element: window, event: 'scroll', handler: handleScroll, options: { passive: true } });
    }

    setupMobileMenu() {
        if (!this.mobileMenu || !this.mobileMenuButton) return;
        
        const toggleMenu = () => {
            const isOpen = this.mobileMenu.classList.contains('translate-x-0');
            
            if (isOpen) {
                this.mobileMenu.classList.remove('translate-x-0');
                this.mobileMenu.classList.add('translate-x-full');
                this.mobileMenuButton.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
                
                // Remove focus trap
                this.removeFocusTrap();
            } else {
                this.mobileMenu.classList.remove('translate-x-full');
                this.mobileMenu.classList.add('translate-x-0');
                this.mobileMenuButton.setAttribute('aria-expanded', 'true');
                document.body.style.overflow = 'hidden';
                
                // Focus trap for accessibility
                this.setupFocusTrap();
            }
        };
        
        utils.addEventListener(this.mobileMenuButton, 'click', toggleMenu);
        this.eventListeners.set('mobileMenuButton', { element: this.mobileMenuButton, event: 'click', handler: toggleMenu });
        
        // Close menu on escape key
        const escapeHandler = (e) => {
            if (e.key === 'Escape' && this.mobileMenu && this.mobileMenu.classList.contains('translate-x-0')) {
                toggleMenu();
            }
        };
        utils.addEventListener(document, 'keydown', escapeHandler);
        this.eventListeners.set('escape', { element: document, event: 'keydown', handler: escapeHandler });
        
        // Close menu when clicking outside
        const outsideClickHandler = (e) => {
            if (this.mobileMenu && this.mobileMenuButton && 
                !this.mobileMenu.contains(e.target) && 
                !this.mobileMenuButton.contains(e.target) && 
                this.mobileMenu.classList.contains('translate-x-0')) {
                toggleMenu();
            }
        };
        utils.addEventListener(document, 'click', outsideClickHandler);
        this.eventListeners.set('outsideClick', { element: document, event: 'click', handler: outsideClickHandler });
        
        // Close menu button
        if (this.mobileMenuClose) {
            utils.addEventListener(this.mobileMenuClose, 'click', toggleMenu);
            this.eventListeners.set('mobileMenuClose', { element: this.mobileMenuClose, event: 'click', handler: toggleMenu });
        }
    }

    setupFocusTrap() {
        const focusableElements = this.mobileMenu.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        if (focusableElements.length === 0) return;
        
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        const handleTabKey = (e) => {
            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    if (document.activeElement === firstElement) {
                        e.preventDefault();
                        lastElement.focus();
                    }
                } else {
                    if (document.activeElement === lastElement) {
                        e.preventDefault();
                        firstElement.focus();
                    }
                }
            }
        };
        
        this.mobileMenu.addEventListener('keydown', handleTabKey);
        this.mobileMenu._focusTrapHandler = handleTabKey;
        
        // Focus first element
        firstElement.focus();
    }

    removeFocusTrap() {
        if (this.mobileMenu._focusTrapHandler) {
            this.mobileMenu.removeEventListener('keydown', this.mobileMenu._focusTrapHandler);
            delete this.mobileMenu._focusTrapHandler;
        }
    }

    setupSmoothScrolling() {
        const links = document.querySelectorAll('a[href^="#"]');
        
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                utils.scrollToElement(targetId);
                
                // Close mobile menu if open
                if (this.mobileMenu && this.mobileMenu.classList.contains('translate-x-0')) {
                    this.mobileMenu.classList.remove('translate-x-0');
                    this.mobileMenu.classList.add('translate-x-full');
                    this.mobileMenuButton.setAttribute('aria-expanded', 'false');
                    document.body.style.overflow = '';
                }
            });
        });
    }

    setupKeyboardNavigation() {
        // Add keyboard navigation for interactive elements
        document.addEventListener('keydown', (e) => {
            // Skip if user is typing in an input
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                return;
            }
            
            // Handle arrow key navigation for cards
            if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
                const cards = document.querySelectorAll('.deal-card, .feature-card');
                const currentIndex = Array.from(cards).findIndex(card => 
                    card === document.activeElement || card.contains(document.activeElement)
                );
                
                if (currentIndex !== -1) {
                    e.preventDefault();
                    const nextIndex = e.key === 'ArrowRight' 
                        ? (currentIndex + 1) % cards.length 
                        : (currentIndex - 1 + cards.length) % cards.length;
                    cards[nextIndex].focus();
                }
            }
        });
    }

    destroy() {
        // Clear timeouts
        if (this.scrollTimeout) {
            clearTimeout(this.scrollTimeout);
            this.scrollTimeout = null;
        }
        
        // Remove focus trap
        this.removeFocusTrap();
        
        // Clear event listeners
        this.eventListeners.forEach(({ element, event, handler, options }) => {
            utils.removeEventListener(element, event, handler, options);
        });
        this.eventListeners.clear();
        
        // Clear references
        this.navbar = null;
        this.mobileMenu = null;
        this.mobileMenuButton = null;
        this.mobileMenuClose = null;
        this.isScrolling = false;
    }
}

// Form handling and validation with enhanced UX
class FormHandler {
    constructor() {
        this.signupForm = document.getElementById('signup-form');
        this.init();
    }

    init() {
        this.setupFormValidation();
        this.setupDynamicInputs();
        this.setupFormSubmission();
        this.setupAccessibility();
    }

    setupFormValidation() {
        const inputs = document.querySelectorAll('input[required], select[required]');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldError(input));
            input.addEventListener('invalid', (e) => {
                e.preventDefault();
                this.validateField(input);
            });
        });
    }

    setupDynamicInputs() {
        // Handle "Other" market input
        const marketSelect = document.querySelector('select[name="markets"]');
        const otherMarketInput = document.getElementById('other-market-input');
        
        if (marketSelect && otherMarketInput) {
            marketSelect.addEventListener('change', (e) => {
                if (e.target.value === 'other') {
                    otherMarketInput.classList.remove('hidden');
                    const textInput = otherMarketInput.querySelector('input');
                    if (textInput) {
                        textInput.required = true;
                        textInput.focus();
                    }
                } else {
                    otherMarketInput.classList.add('hidden');
                    const textInput = otherMarketInput.querySelector('input');
                    if (textInput) {
                        textInput.required = false;
                        textInput.value = '';
                    }
                }
            });
        }

        // Handle "Other" strategy input
        const strategySelect = document.querySelector('select[name="strategy"]');
        const otherStrategyInput = document.getElementById('other-strategy-input');
        
        if (strategySelect && otherStrategyInput) {
            strategySelect.addEventListener('change', (e) => {
                if (e.target.value === 'other') {
                    otherStrategyInput.classList.remove('hidden');
                    const textInput = otherStrategyInput.querySelector('input');
                    if (textInput) {
                        textInput.required = true;
                        textInput.focus();
                    }
                } else {
                    otherStrategyInput.classList.add('hidden');
                    const textInput = otherStrategyInput.querySelector('input');
                    if (textInput) {
                        textInput.required = false;
                        textInput.value = '';
                    }
                }
            });
        }
    }

    setupFormSubmission() {
        if (this.signupForm) {
            this.signupForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleFormSubmission();
            });
        }
    }

    setupAccessibility() {
        // Add proper labels and descriptions
        const inputs = this.signupForm?.querySelectorAll('input, select, textarea');
        inputs?.forEach(input => {
            if (!input.hasAttribute('aria-describedby')) {
                const id = input.id || `field-${Math.random().toString(36).substr(2, 9)}`;
                input.id = id;
                input.setAttribute('aria-describedby', `${id}-error`);
            }
        });
    }

    validateField(field) {
        if (!field) return true;
        
        const value = field.value.trim();
        const type = field.type;
        const name = field.name;
        
        // Clear previous errors
        this.clearFieldError(field);
        
        // Check if required field is empty
        if (field.hasAttribute('required') && !value) {
            this.showFieldError(field, 'This field is required');
            return false;
        }
        
        // Skip validation for empty non-required fields
        if (!value && !field.hasAttribute('required')) {
            return true;
        }
        
        // Type-specific validation
        switch (type) {
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    this.showFieldError(field, 'Please enter a valid email address');
                    return false;
                }
                break;
                
            case 'tel':
                const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
                if (!phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''))) {
                    this.showFieldError(field, 'Please enter a valid phone number');
                    return false;
                }
                break;
                
            case 'url':
                try {
                    new URL(value.startsWith('http') ? value : `https://${value}`);
                } catch {
                    this.showFieldError(field, 'Please enter a valid URL');
                    return false;
                }
                break;
        }
        
        // Custom validation for specific fields
        if (name === 'firstName' || name === 'lastName') {
            if (value.length < 2) {
                this.showFieldError(field, 'Name must be at least 2 characters long');
                return false;
            }
        }
        
        if (name === 'company' && value.length > 0 && value.length < 2) {
            this.showFieldError(field, 'Company name must be at least 2 characters long');
            return false;
        }
        
        return true;
    }

    showFieldError(field, message) {
        if (!field) return;
        
        // Add error styling to the field
        field.classList.add('border-red-500', 'focus:border-red-500', 'focus:ring-red-500');
        field.classList.remove('border-gray-300', 'focus:border-primary', 'focus:ring-primary');
        
        // Find existing error message element by ID or class
        let errorElement = document.getElementById(`error-${field.name || field.id}`);
        if (!errorElement) {
            errorElement = field.parentNode.querySelector('.error-message');
        }
        
        if (!errorElement) {
            // Create new error element
            errorElement = document.createElement('div');
            errorElement.className = 'error-message text-red-600 text-sm mt-1 flex items-center';
            errorElement.id = `error-${field.name || field.id || 'field'}`;
            errorElement.setAttribute('aria-live', 'polite');
            errorElement.setAttribute('role', 'alert');
            
            // Insert after the field
            const container = field.parentNode;
            container.appendChild(errorElement);
        }
        
        // Update error message
        errorElement.innerHTML = `<i class=\"fas fa-exclamation-circle mr-1\"></i>${message}`;
        errorElement.classList.remove('hidden');
        
        // Add ARIA attributes for accessibility
        field.setAttribute('aria-invalid', 'true');
        field.setAttribute('aria-describedby', errorElement.id);
        
        // Focus the field if it's not already focused
        if (document.activeElement !== field) {
            field.focus();
        }
    }

    clearFieldError(field) {
        if (!field) return;
        
        // Remove error styling
        field.classList.remove('border-red-500', 'focus:border-red-500', 'focus:ring-red-500');
        field.classList.add('border-gray-300', 'focus:border-primary', 'focus:ring-primary');
        
        // Remove error message
        const errorElement = field.parentNode.querySelector('.field-error');
        if (errorElement) {
            errorElement.remove();
        }
        
        // Remove ARIA attributes
        field.removeAttribute('aria-invalid');
        field.removeAttribute('aria-describedby');
    }

    async handleFormSubmission() {
        const formData = new FormData(this.signupForm);
        const data = Object.fromEntries(formData);
        
        // Validate all fields
        const inputs = this.signupForm.querySelectorAll('input[required], select[required]');
        let isValid = true;
        
        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });

        if (!isValid) {
            this.showToast('Please fix the errors above', 'error');
            return;
        }

        // Show loading state
        const submitBtn = this.signupForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Processing...';
        submitBtn.disabled = true;

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Show success state
            this.showSuccessState();
            this.showToast('Thank you! We\'ll be in touch soon.', 'success');
            
            // Track conversion
            if (window.gtag) {
                window.gtag('event', 'sign_up', {
                    'event_category': 'engagement',
                    'event_label': 'landing_page_signup'
                });
            }
            
        } catch (error) {
            console.error('Form submission error:', error);
            this.showToast('Something went wrong. Please try again.', 'error');
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }

    showSuccessState() {
        const formContainer = this.signupForm.closest('.bg-white');
        formContainer.innerHTML = `
            <div class="text-center p-8">
                <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i class="fas fa-check text-green-600 text-2xl" aria-hidden="true"></i>
                </div>
                <h3 class="text-2xl font-bold text-gray-900 mb-2">You're All Set!</h3>
                <p class="text-gray-600 mb-4">We'll start finding deals that match your criteria and send them to your inbox.</p>
                <p class="text-sm text-gray-500">Check your email for a welcome message with next steps.</p>
            </div>
        `;
    }

    showToast(message, type = 'info') {
        // Create toast element
        const toast = document.createElement('div');
        toast.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transform transition-all duration-300 translate-x-full`;
        toast.setAttribute('role', 'alert');
        toast.setAttribute('aria-live', 'polite');
        
        const bgColor = type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500';
        toast.classList.add(bgColor, 'text-white');
        
        toast.innerHTML = `
            <div class="flex items-center space-x-2">
                <i class="fas ${type === 'success' ? 'fa-check' : type === 'error' ? 'fa-exclamation-triangle' : 'fa-info-circle'}" aria-hidden="true"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(toast);
        
        // Animate in
        requestAnimationFrame(() => {
            toast.classList.remove('translate-x-full');
        });
        
        // Remove after 5 seconds
        setTimeout(() => {
            toast.classList.add('translate-x-full');
            setTimeout(() => {
                if (document.body.contains(toast)) {
                    document.body.removeChild(toast);
                }
            }, 300);
        }, 5000);
    }
}

// Comprehensive Multi-Step Form Handler
class MultiStepForm {
    constructor() {
        this.currentStep = 1;
        this.totalSteps = 2;
        this.formData = {};
        this.init();
    }

    init() {
        this.setupFormElements();
        this.setupStepNavigation();
        this.setupCustomInputs();
        this.setupValidation();
        this.setupFormSubmission();
    }

    setupFormElements() {
        this.form = document.getElementById('signup-form');
        this.steps = document.querySelectorAll('.step-content');
        this.progressBar = document.getElementById('progress-bar');
        this.currentStepElement = document.getElementById('current-step');
        this.progressPercentage = document.getElementById('progress-percentage');
        this.nextBtn = document.getElementById('next-btn');
        this.prevBtn = document.getElementById('prev-btn');
        this.submitBtn = document.getElementById('submit-btn');

        if (!this.form) {
            if (typeof console !== 'undefined' && console.warn) {
                console.warn('[MultiStepForm] Missing #signup-form element. Skipping initialization.');
            }
            return;
        }
    }

    setupStepNavigation() {
        if (!this.nextBtn || !this.prevBtn) return;

        this.nextBtn.addEventListener('click', () => this.nextStep());
        this.prevBtn.addEventListener('click', () => this.previousStep());
    }

    setupCustomInputs() {
        // Optimize radio button handling
        const radioGroups = new Map();
        document.querySelectorAll('input[type="radio"]').forEach(radio => {
            const name = radio.name;
            if (!radioGroups.has(name)) {
                radioGroups.set(name, []);
            }
            radioGroups.get(name).push(radio);
        });

        // Set up radio button styling and behavior
        radioGroups.forEach((radios, name) => {
            radios.forEach(radio => {
                radio.addEventListener('change', () => {
                    this.updateRadioStyling(radio);
                    // Clear errors when a selection is made
                    if (name === 'experience') {
                        const errorElement = document.getElementById('error-experience');
                        if (errorElement) {
                            errorElement.classList.add('hidden');
                            errorElement.textContent = '';
                        }
                    } else {
                        this.clearFieldError(radio);
                    }
                });
                
                // Initial styling
                if (radio.checked) {
                    this.updateRadioStyling(radio);
                }
            });
        });

        // Optimize checkbox handling
        document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                this.updateCheckboxStyling(checkbox);
                // Clear errors when a selection is made
                this.clearFieldError(checkbox);
            });
            
            // Initial styling
            if (checkbox.checked) {
                this.updateCheckboxStyling(checkbox);
            }
        });

        // Dynamic "Other" market input
        const otherMarketInput = document.getElementById('other-market');
        const otherMarketCheckbox = document.querySelector('input[value="other"]');
        
        if (otherMarketInput && otherMarketCheckbox) {
            otherMarketCheckbox.addEventListener('change', () => {
                otherMarketInput.style.display = otherMarketCheckbox.checked ? 'block' : 'none';
                if (otherMarketCheckbox.checked) {
                    otherMarketInput.focus();
                }
            });
        }
    }

    updateRadioStyling(radio) {
        const name = radio.name;
        const radioGroup = document.querySelectorAll(`input[name="${name}"]`);
        
        // Reset all radios in the group
        radioGroup.forEach(r => {
            const option = r.closest('label')?.querySelector('.radio-option');
            const circle = r.closest('label')?.querySelector('.radio-circle');
            
            if (option) {
                option.classList.remove('border-primary', 'bg-primary/5');
                option.classList.add('border-gray-200');
            }
            
            if (circle) {
                circle.classList.remove('border-primary', 'bg-primary');
                circle.classList.add('border-gray-300');
                circle.innerHTML = '';
            }
        });
        
        // Style the selected radio
        if (radio.checked) {
            const option = radio.closest('label')?.querySelector('.radio-option');
            const circle = radio.closest('label')?.querySelector('.radio-circle');
            
            if (option) {
                option.classList.remove('border-gray-200');
                option.classList.add('border-primary', 'bg-primary/5');
            }
            
            if (circle) {
                circle.classList.remove('border-gray-300');
                circle.classList.add('border-primary', 'bg-primary');
                circle.innerHTML = '<div class="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>';
            }
        }
    }

    updateCheckboxStyling(checkbox) {
        const option = checkbox.closest('label')?.querySelector('.checkbox-option');
        const square = checkbox.closest('label')?.querySelector('.checkbox-square');
        
        if (!option || !square) return;
        
        if (checkbox.checked) {
            option.classList.remove('border-gray-200');
            option.classList.add('border-primary', 'bg-primary/5');
            
            square.classList.remove('border-gray-300');
            square.classList.add('border-primary', 'bg-primary');
            square.innerHTML = '<i class="fas fa-check text-white text-xs"></i>';
        } else {
            option.classList.remove('border-primary', 'bg-primary/5');
            option.classList.add('border-gray-200');
            
            square.classList.remove('border-primary', 'bg-primary');
            square.classList.add('border-gray-300');
            square.innerHTML = '';
        }
    }

    setupValidation() {
        // Real-time validation for text inputs
        document.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"]').forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldError(input));
        });

        // Validation for selects
        document.querySelectorAll('select').forEach(select => {
            select.addEventListener('change', () => this.validateField(select));
        });
    }

    validateField(field) {
        if (!field) return true;
        
        const value = field.value.trim();
        const type = field.type;
        const name = field.name;
        
        // Clear previous errors
        this.clearFieldError(field);
        
        // Check if required field is empty
        if (field.hasAttribute('required') && !value) {
            this.showFieldError(field, 'This field is required');
            return false;
        }
        
        // Skip validation for empty non-required fields
        if (!value && !field.hasAttribute('required')) {
            return true;
        }
        
        // Type-specific validation
        switch (type) {
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    this.showFieldError(field, 'Please enter a valid email address');
                    return false;
                }
                break;
                
            case 'tel':
                const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
                if (!phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''))) {
                    this.showFieldError(field, 'Please enter a valid phone number');
                    return false;
                }
                break;
                
            case 'url':
                try {
                    new URL(value.startsWith('http') ? value : `https://${value}`);
                } catch {
                    this.showFieldError(field, 'Please enter a valid URL');
                    return false;
                }
                break;
        }
        
        // Custom validation for specific fields
        if (name === 'firstName' || name === 'lastName') {
            if (value.length < 2) {
                this.showFieldError(field, 'Name must be at least 2 characters long');
                return false;
            }
        }
        
        if (name === 'company' && value.length > 0 && value.length < 2) {
            this.showFieldError(field, 'Company name must be at least 2 characters long');
            return false;
        }
        
        return true;
    }

    showFieldError(field, message) {
        if (!field) return;
        
        // Add error styling to the field
        field.classList.add('border-red-500', 'focus:border-red-500', 'focus:ring-red-500');
        field.classList.remove('border-gray-300', 'focus:border-primary', 'focus:ring-primary');
        
        // Find existing error message element by ID or class
        let errorElement = document.getElementById(`error-${field.name || field.id}`);
        if (!errorElement) {
            errorElement = field.parentNode.querySelector('.error-message');
        }
        
        if (!errorElement) {
            // Create new error element
            errorElement = document.createElement('div');
            errorElement.className = 'error-message text-red-600 text-sm mt-1 flex items-center';
            errorElement.id = `error-${field.name || field.id || 'field'}`;
            errorElement.setAttribute('aria-live', 'polite');
            errorElement.setAttribute('role', 'alert');
            
            // Insert after the field
            const container = field.parentNode;
            container.appendChild(errorElement);
        }
        
        // Update error message
        errorElement.innerHTML = `<i class=\"fas fa-exclamation-circle mr-1\"></i>${message}`;
        errorElement.classList.remove('hidden');
        
        // Add ARIA attributes for accessibility
        field.setAttribute('aria-invalid', 'true');
        field.setAttribute('aria-describedby', errorElement.id);
        
        // Focus the field if it's not already focused
        if (document.activeElement !== field) {
            field.focus();
        }
    }

    clearFieldError(field) {
        if (!field) return;
        
        // Remove error styling
        field.classList.remove('border-red-500', 'focus:border-red-500', 'focus:ring-red-500');
        field.classList.add('border-gray-300', 'focus:border-primary', 'focus:ring-primary');
        
        // Remove error message
        const errorElement = field.parentNode.querySelector('.field-error');
        if (errorElement) {
            errorElement.remove();
        }
        
        // Remove ARIA attributes
        field.removeAttribute('aria-invalid');
        field.removeAttribute('aria-describedby');
    }

    validateCurrentStep() {
        const currentStepElement = document.getElementById(`step-${this.currentStep}`);
        if (!currentStepElement) return true;

        let isValid = true;

        // Validate required fields
        const requiredFields = currentStepElement.querySelectorAll('[required]');
        requiredFields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });

        // Special validation for radio button groups (experience level)
        if (this.currentStep === 2) {
            const experienceRadios = currentStepElement.querySelectorAll('input[name="experience"]');
            const checkedExperience = Array.from(experienceRadios).filter(r => r.checked);
            if (checkedExperience.length === 0) {
                // Show error for the experience field group
                const errorElement = document.getElementById('error-experience');
                if (errorElement) {
                    errorElement.textContent = 'Please select your investment experience level';
                    errorElement.classList.remove('hidden');
                }
                this.showToast('Please select your investment experience level', 'error');
                isValid = false;
            } else {
                // Clear any existing errors
                const errorElement = document.getElementById('error-experience');
                if (errorElement) {
                    errorElement.classList.add('hidden');
                    errorElement.textContent = '';
                }
            }
        }



        return isValid;
    }

    nextStep() {
        if (!this.validateCurrentStep()) {
            return;
        }

        if (this.currentStep < this.totalSteps) {
            this.currentStep++;
            this.updateStepDisplay();
        }
    }

    previousStep() {
        if (this.currentStep > 1) {
            this.currentStep--;
            this.updateStepDisplay();
        }
    }

    updateStepDisplay() {
        // Hide all steps
        this.steps.forEach(step => step.classList.add('hidden'));

        // Show current step
        const currentStepElement = document.getElementById(`step-${this.currentStep}`);
        if (currentStepElement) {
            currentStepElement.classList.remove('hidden');
        }

        // Update progress
        const progress = (this.currentStep / this.totalSteps) * 100;
        this.progressBar.style.width = `${progress}%`;
        this.currentStepElement.textContent = this.currentStep;
        this.progressPercentage.textContent = Math.round(progress);

        // Update navigation buttons
        this.prevBtn.classList.toggle('hidden', this.currentStep === 1);
        this.nextBtn.classList.toggle('hidden', this.currentStep === this.totalSteps);
        this.submitBtn.classList.toggle('hidden', this.currentStep !== this.totalSteps);

        // Smooth scroll to form
        this.form.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    setupFormSubmission() {
        if (!this.form) return;

        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmission();
        });
    }

    async handleFormSubmission() {
        if (!this.validateCurrentStep()) {
            return;
        }

        // Collect all form data
        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData.entries());

        // Add arrays for checkboxes (if they exist)
        const strategiesCheckboxes = this.form.querySelectorAll('input[name="strategies"]:checked');
        const marketsCheckboxes = this.form.querySelectorAll('input[name="markets"]:checked');
        
        if (strategiesCheckboxes.length > 0) {
            data.strategies = Array.from(strategiesCheckboxes).map(cb => cb.value);
        }
        if (marketsCheckboxes.length > 0) {
            data.markets = Array.from(marketsCheckboxes).map(cb => cb.value);
        }

        // Show loading state
        this.submitBtn.disabled = true;
        this.submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Processing...';

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Show success state
            this.showSuccessState();
            
            // Log the collected data (in production, send to your backend)
            // Form data collected successfully
            
        } catch (error) {
            if (typeof console !== 'undefined' && console.error) {
                console.error('Form submission error:', error);
            }
            this.showToast('Something went wrong. Please try again.', 'error');
        } finally {
            this.submitBtn.disabled = false;
            this.submitBtn.innerHTML = '<i class="fas fa-paper-plane mr-2"></i>Get Started';
        }
    }

    showSuccessState() {
        const formContainer = this.form.closest('.bg-white');
        formContainer.innerHTML = `
            <div class="text-center py-12">
                <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <i class="fas fa-check text-green-600 text-2xl"></i>
                </div>
                <h3 class="text-2xl font-bold text-gray-900 mb-4">Welcome to PropGrid!</h3>
                <p class="text-gray-600 mb-6">Thank you for joining us. We'll start sending you personalized deal alerts based on your preferences.</p>
                <div class="bg-gray-50 rounded-lg p-4 mb-6">
                    <p class="text-sm text-gray-600">Check your email for a welcome message and your first deal alert will arrive within 24 hours.</p>
                </div>
                <a href="/" class="inline-flex items-center text-primary font-medium hover:underline">
                    <i class="fas fa-arrow-left mr-2"></i>Back to Home
                </a>
            </div>
        `;
    }

    showToast(message, type = 'info') {
        // Create toast element
        const toast = document.createElement('div');
        toast.className = `fixed top-4 right-4 z-50 px-6 py-3 rounded-lg text-white font-medium transform translate-x-full transition-transform duration-300 ${
            type === 'error' ? 'bg-red-500' : 'bg-primary'
        }`;
        toast.innerHTML = `
            <div class="flex items-center">
                <i class="fas fa-${type === 'error' ? 'exclamation-triangle' : 'info-circle'} mr-2"></i>
                ${message}
            </div>
        `;

        document.body.appendChild(toast);

        // Animate in
        setTimeout(() => {
            toast.classList.remove('translate-x-full');
        }, 100);

        // Remove after 5 seconds
        setTimeout(() => {
            toast.classList.add('translate-x-full');
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 5000);
    }
}

// FAQ Accordion functionality with accessibility
class FAQAccordion {
    constructor() {
        this.init();
    }

    init() {
        const accordionButtons = document.querySelectorAll('.faq-accordion-btn');
        accordionButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleAccordion(button);
            });
        });
    }

    toggleAccordion(button) {
        const content = button.nextElementSibling;
        const icon = button.querySelector('i');
        const isExpanded = button.getAttribute('aria-expanded') === 'true';
        
        if (isExpanded) {
            // Close
            content.classList.remove('open');
            icon.style.transform = 'rotate(0deg)';
            button.setAttribute('aria-expanded', 'false');
        } else {
            // Close other open items
            const openItems = document.querySelectorAll('.accordion-content.open');
            openItems.forEach(item => {
                item.classList.remove('open');
                const itemIcon = item.previousElementSibling.querySelector('i');
                const itemButton = item.previousElementSibling;
                if (itemIcon) itemIcon.style.transform = 'rotate(0deg)';
                if (itemButton) itemButton.setAttribute('aria-expanded', 'false');
            });
            
            // Open current item
            content.classList.add('open');
            icon.style.transform = 'rotate(180deg)';
            button.setAttribute('aria-expanded', 'true');
        }
    }
}

// Animation controller with performance optimizations
class AnimationController {
    constructor() {
        this.observers = new Map();
        this.animationElements = new Set();
        this.isDestroyed = false;
        
        this.init();
    }

    init() {
        if (this.isDestroyed) return;
        
        this.setupIntersectionObserver();
        this.setupParallaxEffects();
    }

    setupIntersectionObserver() {
        // Create intersection observer for animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                    entry.target.classList.add('animated');
                    
                    // Add animation class based on data attribute
                    const animationType = entry.target.dataset.animation || 'fade-in';
                    entry.target.classList.add(`animate-${animationType}`);
                    
                    // Remove observer after animation
                    if (entry.target.dataset.animateOnce !== 'false') {
                        observer.unobserve(entry.target);
                    }
                }
            });
        }, observerOptions);
        
        this.observers.set('animation', observer);
        
        // Observe elements with animation attributes
        const animatedElements = document.querySelectorAll('[data-animation]');
        animatedElements.forEach(el => {
            observer.observe(el);
            this.animationElements.add(el);
        });
    }

    setupParallaxEffects() {
        // Optimized parallax effect
        const parallaxElements = document.querySelectorAll('[data-parallax]');
        if (parallaxElements.length === 0) return;
        
        const parallaxObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.transform = 'translateZ(0)';
                    entry.target.style.willChange = 'transform';
                } else {
                    entry.target.style.willChange = 'auto';
                }
            });
        }, { threshold: [0, 0.5, 1] });
        
        this.observers.set('parallax', parallaxObserver);
        
        parallaxElements.forEach(el => {
            parallaxObserver.observe(el);
            this.animationElements.add(el);
        });
        
        // Throttled scroll handler for parallax
        const handleParallaxScroll = utils.throttle(() => {
            if (this.isDestroyed) return;
            
            const scrolled = window.pageYOffset;
            parallaxElements.forEach(el => {
                const speed = parseFloat(el.dataset.parallax) || 0.5;
                const yPos = -(scrolled * speed);
                el.style.transform = `translateY(${yPos}px)`;
            });
        }, 16);
        
        window.addEventListener('scroll', handleParallaxScroll, { passive: true });
        
        // Store handler for cleanup
        this._parallaxHandler = handleParallaxScroll;
    }

    addElement(element, animationType = 'fade-in') {
        if (this.isDestroyed || !element) return;
        
        element.dataset.animation = animationType;
        this.animationElements.add(element);
        
        const observer = this.observers.get('animation');
        if (observer) {
            observer.observe(element);
        }
        
        // Safety: ensure element becomes visible after animation
        const animationDuration = this.getAnimationDuration(animationType);
        setTimeout(() => {
            if (element && !this.isDestroyed) {
                element.classList.add('animation-complete');
                element.classList.add('force-visible');
            }
        }, animationDuration + 100);
    }
    
    getAnimationDuration(animationType) {
        const durations = {
            'fade-in': 500,
            'slide-up': 600,
            'slide-down': 600,
            'scale-in': 400
        };
        return durations[animationType] || 500;
    }

    removeElement(element) {
        if (!element) return;
        
        this.animationElements.delete(element);
        
        // Remove from all observers
        this.observers.forEach(observer => {
            observer.unobserve(element);
        });
    }

    destroy() {
        this.isDestroyed = true;
        
        // Disconnect all observers
        this.observers.forEach(observer => {
            observer.disconnect();
        });
        this.observers.clear();
        
        // Remove scroll handler
        if (this._parallaxHandler) {
            window.removeEventListener('scroll', this._parallaxHandler);
            this._parallaxHandler = null;
        }
        
        // Clear element references
        this.animationElements.clear();
    }
}

// Performance monitoring with enhanced metrics
class PerformanceMonitor {
    constructor() {
        this.metrics = new Map();
        this.observers = new Map();
        this.isInitialized = false;
        
        this.init();
    }

    init() {
        if (this.isInitialized) return;
        
        this.startTime = performance.now();
        
        this.trackPageLoad();
        this.trackUserInteractions();
        this.setupErrorTracking();
        this.setupPerformanceObserver();
        this.setupPerformanceAlerts();
        
        this.isInitialized = true;
        
        if (typeof console !== 'undefined' && console.log) {
            console.log('📊 Performance Monitor initialized');
        }
    }
    
    setupPerformanceAlerts() {
        // Alert if page load takes too long
        setTimeout(() => {
            const loadTime = performance.now() - this.startTime;
            if (loadTime > 3000) {
                if (typeof console !== 'undefined' && console.warn) {
                    console.warn(`⚠️ Slow page load detected: ${loadTime.toFixed(0)}ms`);
                }
            }
        }, 3000);
        
        // Monitor memory usage
        if ('memory' in performance) {
            setInterval(() => {
                const memory = performance.memory;
                if (memory.usedJSHeapSize > 50 * 1024 * 1024) { // 50MB
                    if (typeof console !== 'undefined' && console.warn) {
                        console.warn('⚠️ High memory usage detected:', 
                            (memory.usedJSHeapSize / 1024 / 1024).toFixed(1) + 'MB');
                    }
                }
            }, 10000);
        }
    }

    trackPageLoad() {
        // Track Core Web Vitals
        if ('PerformanceObserver' in window) {
            try {
                // Largest Contentful Paint (LCP)
                const lcpObserver = new PerformanceObserver((list) => {
                    const entries = list.getEntries();
                    const lastEntry = entries[entries.length - 1];
                    this.metrics.set('lcp', lastEntry.startTime);
                    this.logMetric('LCP', lastEntry.startTime);
                });
                lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
                this.observers.set('lcp', lcpObserver);

                // First Input Delay (FID)
                const fidObserver = new PerformanceObserver((list) => {
                    const entries = list.getEntries();
                    entries.forEach(entry => {
                        this.metrics.set('fid', entry.processingStart - entry.startTime);
                        this.logMetric('FID', entry.processingStart - entry.startTime);
                    });
                });
                fidObserver.observe({ entryTypes: ['first-input'] });
                this.observers.set('fid', fidObserver);

                // Cumulative Layout Shift (CLS)
                let clsValue = 0;
                const clsObserver = new PerformanceObserver((list) => {
                    const entries = list.getEntries();
                    entries.forEach(entry => {
                        if (!entry.hadRecentInput) {
                            clsValue += entry.value;
                            this.metrics.set('cls', clsValue);
                        }
                    });
                });
                clsObserver.observe({ entryTypes: ['layout-shift'] });
                this.observers.set('cls', clsObserver);
            } catch (e) {
                console.warn('Performance Observer not supported:', e);
            }
        }

        // Track DOM content loaded and load times
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.metrics.set('domContentLoaded', performance.now());
                this.logMetric('DOM Content Loaded', performance.now());
            });
        }

        window.addEventListener('load', () => {
            this.metrics.set('pageLoad', performance.now());
            this.logMetric('Page Load', performance.now());
        });
    }

    trackUserInteractions() {
        // Track user engagement metrics
        let firstInteraction = true;
        let interactionCount = 0;
        
        const trackInteraction = (type) => {
            if (firstInteraction) {
                this.metrics.set('timeToFirstInteraction', performance.now());
                this.logMetric('Time to First Interaction', performance.now());
                firstInteraction = false;
            }
            interactionCount++;
            this.metrics.set('interactionCount', interactionCount);
        };

        // Track clicks, scrolls, and form interactions
        document.addEventListener('click', () => trackInteraction('click'), { passive: true });
        document.addEventListener('scroll', utils.throttle(() => trackInteraction('scroll'), 1000), { passive: true });
        
        // Track form interactions
        document.addEventListener('input', () => trackInteraction('input'), { passive: true });
        document.addEventListener('submit', () => trackInteraction('submit'), { passive: true });
    }

    setupErrorTracking() {
        // Track JavaScript errors
        window.addEventListener('error', (e) => {
            this.logError('JavaScript Error', {
                message: e.message,
                filename: e.filename,
                lineno: e.lineno,
                colno: e.colno
            });
        });

        // Track unhandled promise rejections
        window.addEventListener('unhandledrejection', (e) => {
            this.logError('Unhandled Promise Rejection', {
                reason: e.reason
            });
        });

        // Track resource loading errors
        window.addEventListener('error', (e) => {
            if (e.target && e.target.tagName) {
                this.logError('Resource Loading Error', {
                    tagName: e.target.tagName,
                    src: e.target.src || e.target.href,
                    type: e.type
                });
            }
        }, true);
    }

    setupPerformanceObserver() {
        // Monitor long tasks
        if ('PerformanceObserver' in window) {
            try {
                const longTaskObserver = new PerformanceObserver((list) => {
                    const entries = list.getEntries();
                    entries.forEach(entry => {
                        if (entry.duration > 50) { // Tasks longer than 50ms
                            this.logMetric('Long Task', entry.duration, {
                                name: entry.name,
                                startTime: entry.startTime
                            });
                        }
                    });
                });
                longTaskObserver.observe({ entryTypes: ['longtask'] });
                this.observers.set('longTask', longTaskObserver);
            } catch (e) {
                console.warn('Long Task Observer not supported:', e);
            }
        }
    }

    logMetric(name, value, additionalData = {}) {
        const metric = {
            name,
            value,
            timestamp: Date.now(),
            ...additionalData
        };
        
        // Store metric
        this.metrics.set(name.toLowerCase(), value);
        
        // Log to console in development
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            // Development logging disabled
        }
        
        // Send to analytics in production
        if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
            this.sendToAnalytics(metric);
        }
    }

    logError(type, details) {
        const error = {
            type,
            details,
            timestamp: Date.now(),
            url: window.location.href,
            userAgent: navigator.userAgent
        };
        
        // Log to console in development
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            if (typeof console !== 'undefined' && console.error) {
            console.error(`❌ ${type}:`, details);
        }
        }
        
        // Send to error tracking in production
        if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
            this.sendToErrorTracking(error);
        }
    }

    sendToAnalytics(metric) {
        // Implement your analytics service here
        // Example: Google Analytics, Mixpanel, etc.
        if (window.gtag) {
            window.gtag('event', 'performance_metric', {
                metric_name: metric.name,
                metric_value: metric.value,
                ...metric
            });
        }
    }

    sendToErrorTracking(error) {
        // Implement your error tracking service here
        // Example: Sentry, Bugsnag, etc.
        if (window.Sentry) {
            window.Sentry.captureException(new Error(error.type), {
                extra: error.details
            });
        }
    }

    getMetrics() {
        return Object.fromEntries(this.metrics);
    }

    destroy() {
        // Disconnect all observers
        this.observers.forEach(observer => {
            observer.disconnect();
        });
        this.observers.clear();
        
        // Clear metrics
        this.metrics.clear();
        
        this.isInitialized = false;
    }
}

// Service Worker registration for PWA capabilities
class ServiceWorkerManager {
    static async register() {
        if ('serviceWorker' in navigator) {
            try {
                const registration = await navigator.serviceWorker.register('/sw.js');
                // Service Worker registered successfully
                return registration; // Return registration for potential use in other parts
            } catch (registrationError) {
                // Service Worker registration failed
                return null; // Return null on failure
            }
        }
        return null; // Return null if service worker is not supported
    }
}

// Main application initialization with proper cleanup
class PropGridApp {
    constructor() {
        console.log('[PropGridApp] Initializing...');
        this.components = new Map();
        this.isInitialized = false;
        this.isDestroyed = false;
        try {
            this.init();
        } catch (err) {
            if (typeof console !== 'undefined' && console.error) {
                console.error('[PropGridApp] Initialization error:', err);
            }
            showCriticalError('App failed to initialize: ' + (err && err.message ? err.message : err));
        }
    }

    init() {
        if (this.isInitialized || this.isDestroyed) return;
        
        // Initialize components in order of dependency
        this.initializeComponents();
        
        // Set up global event listeners
        this.setupGlobalListeners();
        
        // Register service worker
        this.registerServiceWorker();
        
        this.isInitialized = true;
        
        // Log initialization
        // PropGrid App initialized successfully
    }

    initializeComponents() {
        // Initialize components with error handling
        const componentInitializers = [
            { name: 'navigation', init: () => new Navigation() },
            { name: 'emailSimulation', init: () => new EmailSimulation() },
            { name: 'multiStepForm', init: () => new MultiStepForm() },
            { name: 'faqAccordion', init: () => new FAQAccordion() },
            { name: 'animationController', init: () => new AnimationController() },
            { name: 'performanceMonitor', init: () => new PerformanceMonitor() }
        ];

        componentInitializers.forEach(({ name, init }) => {
            try {
                const component = init();
                this.components.set(name, component);
                // Component initialized: ${name}
            } catch (error) {
                if (typeof console !== 'undefined' && console.error) {
                    console.error(`❌ Failed to initialize ${name}:`, error);
                }
            }
        });
    }

    setupGlobalListeners() {
        // Handle page visibility changes
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pauseNonCriticalOperations();
            } else {
                this.resumeNonCriticalOperations();
            }
        });

        // Handle beforeunload for cleanup
        window.addEventListener('beforeunload', () => {
            this.destroy();
        });

        // Handle resize events with throttling
        window.addEventListener('resize', utils.throttle(() => {
            this.handleResize();
        }, 250), { passive: true });

        // Handle focus events for accessibility
        document.addEventListener('focusin', (e) => {
            this.handleFocusIn(e);
        });

        document.addEventListener('focusout', (e) => {
            this.handleFocusOut(e);
        });
    }

    pauseNonCriticalOperations() {
        // Pause email simulation when page is not visible
        const emailSimulation = this.components.get('emailSimulation');
        if (emailSimulation && emailSimulation.stopSimulation) {
            emailSimulation.stopSimulation();
        }
    }

    resumeNonCriticalOperations() {
        // Resume email simulation when page becomes visible
        const emailSimulation = this.components.get('emailSimulation');
        if (emailSimulation && emailSimulation.startSimulation) {
            emailSimulation.startSimulation();
        }
    }

    handleResize() {
        // Handle responsive behavior
        const isMobile = window.innerWidth < 768;
        
        // Update mobile menu state
        const navigation = this.components.get('navigation');
        if (navigation && navigation.mobileMenu) {
            if (!isMobile && navigation.mobileMenu.classList.contains('translate-x-0')) {
                navigation.mobileMenu.classList.remove('translate-x-0');
                navigation.mobileMenu.classList.add('translate-x-full');
                navigation.mobileMenuButton?.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            }
        }
    }

    handleFocusIn(e) {
        // Add focus indicators for accessibility
        if (e.target.classList.contains('focus-visible')) {
            e.target.classList.add('ring-2', 'ring-primary', 'ring-offset-2');
        }
    }

    handleFocusOut(e) {
        // Remove focus indicators
        if (e.target.classList.contains('focus-visible')) {
            e.target.classList.remove('ring-2', 'ring-primary', 'ring-offset-2');
        }
    }

    async registerServiceWorker() {
        try {
            if ('serviceWorker' in navigator) {
                const registration = await ServiceWorkerManager.register();
                // Service Worker registered successfully
            }
        } catch (error) {
            if (typeof console !== 'undefined' && console.warn) {
                console.warn('⚠️ Service Worker registration failed:', error);
            }
        }
    }

    getComponent(name) {
        return this.components.get(name);
    }

    destroy() {
        if (this.isDestroyed) return;
        
        // Destroying PropGrid App
        
        // Destroy all components
        this.components.forEach((component, name) => {
            try {
                if (component && typeof component.destroy === 'function') {
                    component.destroy();
                    // Component destroyed: ${name}
                }
            } catch (error) {
                if (typeof console !== 'undefined' && console.error) {
                    console.error(`❌ Error destroying ${name}:`, error);
                }
            }
        });
        
        // Clear component references
        this.components.clear();
        
        // Remove global event listeners
        document.removeEventListener('visibilitychange', this.pauseNonCriticalOperations);
        document.removeEventListener('focusin', this.handleFocusIn);
        document.removeEventListener('focusout', this.handleFocusOut);
        window.removeEventListener('beforeunload', this.destroy);
        window.removeEventListener('resize', this.handleResize);
        
        this.isDestroyed = true;
        this.isInitialized = false;
        
        // PropGrid App destroyed
    }
}

// --- App Initialization ---
// Ensure DOM is ready and prevent multiple initializations
let appInitialized = false;
let initializationAttempts = 0;
const MAX_INIT_ATTEMPTS = 3;

function initializeApp() {
  if (appInitialized) return;
  
  try {
    window.app = new PropGridApp();
    appInitialized = true;
  } catch (err) {
    console.error('App initialization error:', err);
    showCriticalError('App failed to initialize: ' + (err && err.message ? err.message : err));
  }
}

// Initialize based on document ready state
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp, { once: true });
} else {
  // DOM is already ready
  initializeApp();
}

// Fallback initialization for edge cases
window.addEventListener('load', () => {
  if (!appInitialized && !window.app) {
    if (typeof console !== 'undefined' && console.warn) {
      console.warn('⚠️ App not initialized, attempting fallback initialization');
    }
    initializeApp();
  }
}, { once: true });

// Emergency fallback - ensure app is initialized
setTimeout(() => {
  if (!appInitialized && !window.app) {
    if (typeof console !== 'undefined' && console.error) {
      console.error('🚨 Emergency app initialization');
    }
    initializeApp();
  }
}, 2000); 