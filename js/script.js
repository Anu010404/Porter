document.addEventListener('DOMContentLoaded', () => {
    
    const userNameElements = document.querySelectorAll('.user-name');
    if (currentUser && userNameElements) {
        userNameElements.forEach(el => el.textContent = currentUser.name);
    }

    // Booking cost calculation
    const bookingForm = document.getElementById('bookingForm');
    if (bookingForm) {
        const weightInput = document.getElementById('weight');
        const trolleyCheckbox = document.getElementById('trolley');
        const totalCostSpan = document.getElementById('totalCost');

        function calculateCost() {
            const weight = parseFloat(weightInput.value) || 0;
            let cost = weight * 50;
            if (trolleyCheckbox.checked) cost += 50;
            totalCostSpan.style.transition = 'all 0.3s';
            totalCostSpan.style.opacity = '0';
            setTimeout(() => {
                totalCostSpan.textContent = cost;
                totalCostSpan.style.opacity = '1';
            }, 300);
        }

        weightInput.addEventListener('input', calculateCost);
        trolleyCheckbox.addEventListener('change', calculateCost);
    }

    // Login form submission
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const role = document.getElementById('role').value;
            const errorMessage = document.getElementById('errorMessage');

            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const user = users.find(u => u.email === email);
            if (!user) {
                errorMessage.textContent = 'Email not registered.';
                return;
            }
            if (user.password !== password) {
                document.getElementById('password').classList.add('is-invalid');
                errorMessage.textContent = 'Incorrect password.';
                return;
            }

            localStorage.setItem('currentUser', JSON.stringify({ email: user.email, name: user.name, phone: user.phone }));
            window.location.href = `${role}/dashboard.html`;
        });
    }

    // Registration form submission
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            const errorMessage = document.getElementById('errorMessage');

            const users = JSON.parse(localStorage.getItem('users') || '[]');
            if (users.some(user => user.email === email)) {
                errorMessage.textContent = 'Email already exists.';
                return;
            }
            if (users.some(user => user.phone === phone)) {
                errorMessage.textContent = 'Phone number already exists.';
                return;
            }
            if (password !== confirmPassword) {
                document.getElementById('confirmPassword').classList.add('is-invalid');
                return;
            }

            alert('Verification codes sent to email and phone.');
            users.push({ email, phone, password, name: document.getElementById('name').value });
            localStorage.setItem('users', JSON.stringify(users));
            localStorage.setItem('currentUser', JSON.stringify({ email, name: document.getElementById('name').value, phone }));
            window.location.href = 'customer/dashboard.html';
        });
    }
});
