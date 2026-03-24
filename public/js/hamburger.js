 
        // Get Elements
        const menuBtn = document.getElementById('menuBtn');
        const navSidebar = document.getElementById('navSidebar');
        const cartBtn = document.getElementById('cartBtn');
        const cartSidebar = document.getElementById('cartSidebar');
        const cartCloseBtn = document.getElementById('cartCloseBtn');
        const overlay = document.getElementById('overlay');
        const navLinks = document.querySelectorAll('.royal__nav__link');
        const heartBtn = document.getElementById('heartBtn');
        const dotsa = document.querySelectorAll('.royal__dot');

        // Toggle Menu
        menuBtn.addEventListener('click', function() {
            this.classList.toggle('active');
            navSidebar.classList.toggle('active');
            cartSidebar.classList.remove('active');
            overlay.classList.toggle('active');
        });

        // Open Cart
        cartBtn.addEventListener('click', function() {
            cartSidebar.classList.add('active');
            navSidebar.classList.remove('active');
            menuBtn.classList.remove('active');
            overlay.classList.add('active');
        });

        // Close Cart
        cartCloseBtn.addEventListener('click', function() {
            cartSidebar.classList.remove('active');
            overlay.classList.remove('active');
        });

        // Close on overlay click
        overlay.addEventListener('click', function() {
            menuBtn.classList.remove('active');
            navSidebar.classList.remove('active');
            cartSidebar.classList.remove('active');
            overlay.classList.remove('active');
        });

        // Navigation Links
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                navLinks.forEach(l => l.classList.remove('active'));
                this.classList.add('active');
                menuBtn.classList.remove('active');
                navSidebar.classList.remove('active');
                overlay.classList.remove('active');
            });
        });

        // Heart Icon
        let heartActive = false;
        heartBtn.addEventListener('click', function() {
            heartActive = !heartActive;
            this.style.transform = heartActive ? 'scale(1.2)' : 'scale(1)';
            this.querySelector('svg').style.fill = heartActive ? '#e53e3e' : 'none';
            this.querySelector('svg').style.stroke = heartActive ? '#e53e3e' : '#4a5568';
        });

        // Quantity Update
        const quantities = [1, 2];
        const price = 298;

        function updateQty(index, change) {
            quantities[index] += change;
            if (quantities[index] < 1) quantities[index] = 1;
            document.getElementById('qty' + index).textContent = quantities[index];
            updateSubtotal();
        }

        function removeItem(index) {
            quantities[index] = 0;
            document.querySelectorAll('.royal__cart__item')[index].style.display = 'none';
            updateSubtotal();
        }

        function updateSubtotal() {
            const total = quantities.reduce((sum, qty) => sum + (qty * price), 0);
            document.getElementById('subtotalAmount').textContent = 'RS ' + total;
            document.querySelector('.royal__checkout__btn').innerHTML = `
                <span class="royal__checkout__icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0c4a6e" stroke-width="3">
                        <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                </span>
                Slide to Checkout Now | Rs ${total}
            `;
        }

        // Carousel Dots
        dotsa.forEach((dot, index) => {
            dot.addEventListener('click', function() {
                dotsa.forEach(d => d.classList.remove('active'));
                this.classList.add('active');
            });
        });

        // Auto carousel
        let currentSlidea = 0;
        setInterval(() => {
            dotsa.forEach(d => d.classList.remove('active'));
            currentSlidea = (currentSlidea + 1) % dotsa.length;
            dotsa[currentSlidea].classList.add('active');
        }, 3000);
 