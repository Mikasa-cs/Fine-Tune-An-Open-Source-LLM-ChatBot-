document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const rememberCheckbox = document.getElementById('remember');
    const loginBtn = document.querySelector('.login-btn');
    const toast = document.getElementById('toast');

    // Toggle password visibility
    document.querySelectorAll('.toggle-password').forEach(toggle => {
        toggle.addEventListener('click', function() {
            const input = this.previousElementSibling;
            const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
            input.setAttribute('type', type);
            this.classList.toggle('fa-eye');
            this.classList.toggle('fa-eye-slash');
        });
    });

    // Show toast message
    const showToast = (message, type = 'success') => {
        toast.textContent = message;
        toast.className = `toast ${type}`;
        toast.style.display = 'block';
        
        setTimeout(() => {
            toast.style.display = 'none';
        }, 3000);
    };

    // Form validation
    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validatePassword = (password) => {
        return password.length >= 6;
    };

    // Real-time validation
    emailInput.addEventListener('input', () => {
        const errorDiv = emailInput.parentNode.querySelector('.error-message');
        if (!validateEmail(emailInput.value)) {
            emailInput.parentNode.classList.add('error');
            errorDiv.textContent = 'Please enter a valid email address';
            errorDiv.style.display = 'block';
        } else {
            emailInput.parentNode.classList.remove('error');
            errorDiv.style.display = 'none';
        }
    });

    passwordInput.addEventListener('input', () => {
        const errorDiv = passwordInput.parentNode.querySelector('.error-message');
        if (!validatePassword(passwordInput.value)) {
            passwordInput.parentNode.classList.add('error');
            errorDiv.textContent = 'Password must be at least 6 characters long';
            errorDiv.style.display = 'block';
        } else {
            passwordInput.parentNode.classList.remove('error');
            errorDiv.style.display = 'none';
        }
    });

    // Form submission
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = emailInput.value.trim();
        const password = passwordInput.value;

        // Validate inputs
        if (!validateEmail(email)) {
            showToast('Please enter a valid email address', 'error');
            return;
        }

        if (!validatePassword(password)) {
            showToast('Password must be at least 6 characters long', 'error');
            return;
        }

        // Show loading state
        loginBtn.classList.add('loading');

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Save email if remember me is checked
            if (rememberCheckbox.checked) {
                localStorage.setItem('rememberedEmail', email);
            } else {
                localStorage.removeItem('rememberedEmail');
            }

            showToast('Login successful! Redirecting...', 'success');
            
            // Redirect to main page
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);

        } catch (error) {
            showToast('Login failed. Please try again.', 'error');
        } finally {
            loginBtn.classList.remove('loading');
        }
    });

    // Social login handlers
    document.querySelector('.social-btn.google').addEventListener('click', () => {
        showToast('Google login coming soon!', 'error');
    });

    document.querySelector('.social-btn.github').addEventListener('click', () => {
        showToast('GitHub login coming soon!', 'error');
    });

    // Check for saved email
    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail) {
        emailInput.value = savedEmail;
        rememberCheckbox.checked = true;
    }
}); 