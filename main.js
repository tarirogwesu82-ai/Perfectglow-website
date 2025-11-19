// ============================
// Global Cart Class
// ============================
class Cart {
    constructor() {
        this.cart = JSON.parse(localStorage.getItem('cart')) || [];
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateCartCount();
    }

    setupEventListeners() {
        // --- CORE FUNCTIONALITY ---
        // Hamburger Menu Toggle
        const menuToggle = document.getElementById("menu-toggle");
        const navLinks = document.getElementById("nav-links");
        if(menuToggle && navLinks) {
            menuToggle.addEventListener("click", () => {
                navLinks.classList.toggle("active");
            });
        }

        // Search Functionality
        const searchForms = document.querySelectorAll(".nav-search");
        searchForms.forEach(form => {
            form.addEventListener("submit", e => {
                e.preventDefault();
                const input = form.querySelector("input");
                // The search input is lowercased and trimmed before going to the URL
                const query = input.value.toLowerCase().trim(); 
                if(query) {
                    window.location.href = `products.html?search=${encodeURIComponent(query)}`;
                }
            });
        });

        // Add to Cart Buttons
        document.addEventListener('click', (e) => {
            if(e.target.classList.contains('add-to-cart')) {
                this.addToCart(e.target);
            }
        });

        // Product Search Filter (Called only on products.html)
        if(window.location.pathname.includes('products.html')) this.filterProducts();

        // Cart Page (Called only on cart.html)
        if(window.location.pathname.includes('cart.html')) this.loadCartPage();
        
        // --- PART 3 ENHANCEMENTS ---
        
        // 1. Accordion Logic (Called on all pages, primarily used on about.html)
        this.handleAccordion(); // ⭐ THIS IS THE CRITICAL CALL ⭐

        // 2. Form Functionality and Validation (Client-Side Validation & AJAX Simulation)
        const contactForm = document.getElementById("contactForm");
        if(contactForm) {
            contactForm.addEventListener('submit', this.handleContactFormSubmit.bind(this));
        }

        const enquiryForm = document.getElementById("enquiryForm");
        if(enquiryForm) {
            enquiryForm.addEventListener('submit', this.handleEnquiryFormSubmit.bind(this));
        }
    }
    
    // ===================================
    // 2.1 INTERACTIVE ELEMENTS: ACCORDION FUNCTION
    // ===================================
    handleAccordion() {
        // Targets all buttons with the class 'accordion-header'
        document.querySelectorAll('.accordion-header').forEach(header => {
            header.addEventListener('click', () => {
                const content = header.nextElementSibling; // The content is the next sibling element
                const isOpen = content.classList.contains('open');

                // 1. Close all others and remove 'active' state from headers
                document.querySelectorAll('.accordion-content.open').forEach(item => {
                    item.classList.remove('open');
                    item.previousElementSibling.classList.remove('active');
                });

                // 2. Toggle current one (open if it was closed)
                if (!isOpen) {
                    content.classList.add('open');
                    header.classList.add('active');
                }
            });
        });
    }

    // ===================================
    // 4.1 FORM VALIDATION & SUBMISSION
    // ===================================

    handleContactFormSubmit(e) {
        e.preventDefault();
        const form = e.target;
        const errorMessage = document.getElementById('contactError');
        errorMessage.style.display = 'none'; 
        
        const messageInput = form.querySelector('#message');
        const message = messageInput.value;
        
        if (message.length < 20) {
            errorMessage.textContent = 'Full Message must be at least 20 characters long.';
            errorMessage.style.display = 'block';
            messageInput.focus();
            return;
        }

        const name = form.querySelector('#name').value;
        const email = form.querySelector('#email').value;
        const type = form.querySelector('#messageType').value.replace(/_/g, ' ');

        alert('Sending message... (Simulated AJAX)');

        const recipient = 'info@perfectglow.co.za'; 
        const subject = `New Contact Message: ${type}`;
        const emailBody = `Sender: ${name}\nEmail: ${email}\nMessage Type: ${type}\n\nMessage:\n${message}`;
        
        // Use mailto: to open the user's email client
        window.location.href = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`;
        
        setTimeout(() => {
            form.style.display = 'none';
            form.parentNode.insertAdjacentHTML('afterbegin', '<p style="color: #28470F; font-weight: bold;">✅ Your message has been prepared for sending and your email client should open shortly!</p>');
            form.reset();
        }, 100); 
    }

    handleEnquiryFormSubmit(e) {
        e.preventDefault();
        const form = e.target;
        const errorMessage = document.getElementById('enquiryError');
        const responseBox = document.getElementById('enquiryResponse');

        errorMessage.style.display = 'none';
        responseBox.style.display = 'none'; 

        const messageInput = form.querySelector('#enquiryMessage');
        const topicInput = form.querySelector('#enquiryTopic');
        const nameInput = form.querySelector('#name');

        if (messageInput.value.length < 50) {
            errorMessage.textContent = 'Enquiry message must be at least 50 characters long.';
            errorMessage.style.display = 'block';
            messageInput.focus();
            return;
        }

        const name = nameInput.value;
        const topic = topicInput.value;

        document.getElementById('responseName').textContent = name;
        document.getElementById('responseTopic').textContent = topic.replace(/_/g, ' ');

        let responseText = `We are reviewing your enquiry regarding **${topic.replace(/_/g, ' ')}**. `;

        if (topic === 'Custom_Product_Order') {
            responseText += "A custom order specialist will contact you within 24 hours to discuss the details, **cost estimate**, and **availability** of materials.";
        } else if (topic === 'Bulk_Wholesale_Pricing') {
            responseText += "Our wholesale price list will be emailed to you immediately. Please check your inbox for **cost** and order **availability** details.";
        } else {
            responseText += "Thank you for your interest! A manager will reach out to you with more information soon regarding **availability** or requirements.";
        }

        document.getElementById('responseMessage').innerHTML = responseText;
        
        form.style.display = 'none'; 
        responseBox.style.display = 'block'; 

        setTimeout(() => {
            form.reset();
        }, 500);
    }
    
    // ===================================
    // EXISTING CART/SEARCH/UTILITY METHODS
    // ===================================
    addToCart(button) {
        const product = {
            id: button.dataset.id || Math.random().toString(36).substr(2,9), 
            name: button.dataset.name,
            price: parseFloat(button.dataset.price),
            image: button.dataset.image,
            quantity: 1
        };

        const existing = this.cart.find(item => item.id === product.id);
        if(existing) existing.quantity += 1;
        else this.cart.push(product);

        this.saveCart();
        this.updateCartCount();
        this.showNotification(`${product.name} added to cart!`);
    }

    removeFromCart(productId) {
        this.cart = this.cart.filter(item => item.id !== productId);
        this.saveCart();
        this.updateCartCount();
        if(window.location.pathname.includes('cart.html')) this.loadCartPage();
    }

    updateQuantity(productId, quantity) {
        const item = this.cart.find(item => item.id === productId);
        if(item) {
            if(quantity <= 0) this.removeFromCart(productId);
            else {
                item.quantity = quantity;
                this.saveCart();
                if(window.location.pathname.includes('cart.html')) this.loadCartPage();
            }
        }
    }

    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.cart));
    }

    updateCartCount() {
        const cartCountElems = document.querySelectorAll('.cart-count');
        const total = this.cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCountElems.forEach(el => el.textContent = total);
    }

    getTotalPrice() {
        return this.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    }

    filterProducts() {
        const params = new URLSearchParams(window.location.search);
        const query = params.get('search') ? params.get('search').toLowerCase().trim() : null; 

        if(query) {
            const products = document.querySelectorAll('.product-card');
            products.forEach(card => {
                const nameH2 = card.querySelector('h2').textContent.toLowerCase();
                const desc = card.querySelector('p:last-of-type').textContent.toLowerCase();
                
                const button = card.querySelector('.add-to-cart');
                const dataName = button && button.dataset.name ? button.dataset.name.toLowerCase() : '';

                const queryFound = nameH2.includes(query) || 
                                   desc.includes(query) || 
                                   dataName.includes(query);
                
                if (!queryFound) {
                    card.style.display = 'none';
                } else {
                    card.style.display = 'block'; 
                }
            });
        }
    }

    loadCartPage() {
        const container = document.querySelector('.cart-container');
        if(!container) return;

        if(this.cart.length === 0) {
            container.innerHTML = `
                <div class="empty-cart">
                    <h1>Your Cart</h1>
                    <p>Your cart is empty</p>
                    <a href="products.html" class="btn">Continue Shopping</a>
                </div>
            `;
            return;
        }

        let html = `<h1>Your Cart</h1><div class="cart-items">`;
        this.cart.forEach(item => {
            html += `
                <div class="cart-item" data-id="${item.id}">
                    <img src="${item.image}" alt="${item.name}">
                    <div class="item-details">
                        <h3>${item.name}</h3>
                        <p class="price">R ${item.price.toFixed(2)}</p>
                    </div>
                    <div class="item-actions">
                        <input type="number" value="${item.quantity}" min="1"
                               onchange="cart.updateQuantity('${item.id}', parseInt(this.value))">
                        <button class="remove-btn" onclick="cart.removeFromCart('${item.id}')">Remove</button>
                    </div>
                </div>
            `;
        });
        html += `</div>
                 <div class="cart-summary">
                    <h2>Total: R ${this.getTotalPrice().toFixed(2)}</h2>
                    <button class="checkout-btn" onclick="cart.checkout()">Proceed to Checkout</button>
                 </div>`;
        container.innerHTML = html;
    }

    checkout() {
        if(this.cart.length === 0) {
            alert("Your cart is empty!");
            return;
        }

        const totalPrice = this.getTotalPrice().toFixed(2);

        this.cart = [];
        this.saveCart();
        this.updateCartCount();

        const container = document.querySelector('.cart-container');
        if(container) {
            container.innerHTML = `
                <div class="thank-you-message">
                    <h1>Thank You for Shopping!</h1>
                    <p>Your order has been processed.</p>
                    <h2>Total: R ${totalPrice}</h2>

                    <h3>Enter Your Bank Details to Complete Payment</h3>
                    <form id="bank-form">
                        <input type="text" id="acc-name" placeholder="Account Holder Name" required>
                        <input type="text" id="acc-number" placeholder="Account Number" required>
                        <input type="text" id="bank-name" placeholder="Bank Name" required>
                        <input type="text" id="branch-code" placeholder="Branch Code" required>
                        <button type="submit">Submit Payment</button>
                    </form>
                </div>
            `;

            const bankForm = document.getElementById("bank-form");
            bankForm.addEventListener("submit", function(e) {
                e.preventDefault();
                alert("Payment details submitted successfully! Your order will be processed shortly.");
                bankForm.reset();
            });
        }
    }

    showNotification(message) {
        const notif = document.createElement('div');
        notif.style.cssText = `
            position: fixed; top: 100px; right: 20px;
            background: #28470F; color: white; padding: 15px 20px;
            border-radius: 6px; box-shadow: 0 4px 12px rgba(0,0,0,0.2); z-index:1001;
            transition: transform 0.3s ease;
        `;
        notif.textContent = message;
        document.body.appendChild(notif);
        setTimeout(() => { notif.style.transform = "translateX(100%)"; setTimeout(()=>notif.remove(),300)}, 3000);
    }
}

// Initialize Cart
document.addEventListener('DOMContentLoaded', () => {
    window.cart = new Cart();
});