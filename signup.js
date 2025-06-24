document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.getElementById('signup-form');
    const fullnameInput = document.getElementById('fullname');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirm-password');
    const termsCheckbox = document.getElementById('terms');
    const signupBtn = document.querySelector('.login-btn');
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

    // Add password strength indicator
    const passwordStrength = document.createElement('div');
    passwordStrength.className = 'password-strength';
    const strengthBar = document.createElement('div');
    strengthBar.className = 'password-strength-bar';
    passwordStrength.appendChild(strengthBar);
    passwordInput.parentNode.appendChild(passwordStrength);

    // Password strength checker
    const checkPasswordStrength = (password) => {
        let strength = 0;
        
        if (password.length >= 8) strength++;
        if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++;
        if (password.match(/\d/) && password.match(/[^a-zA-Z\d]/)) strength++;

        strengthBar.className = 'password-strength-bar';
        if (strength === 1) strengthBar.classList.add('weak');
        else if (strength === 2) strengthBar.classList.add('medium');
        else if (strength === 3) strengthBar.classList.add('strong');
    };

    // Form validation
    const validateFullname = (name) => {
        return name.length >= 2;
    };

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validatePassword = (password) => {
        return password.length >= 8 &&
               password.match(/[a-z]/) &&
               password.match(/[A-Z]/) &&
               password.match(/\d/) &&
               password.match(/[^a-zA-Z\d]/);
    };

    // Real-time validation
    fullnameInput.addEventListener('input', () => {
        const errorDiv = fullnameInput.parentNode.querySelector('.error-message');
        if (!validateFullname(fullnameInput.value)) {
            fullnameInput.parentNode.classList.add('error');
            errorDiv.textContent = 'Name must be at least 2 characters long';
            errorDiv.style.display = 'block';
        } else {
            fullnameInput.parentNode.classList.remove('error');
            errorDiv.style.display = 'none';
        }
    });

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
        checkPasswordStrength(passwordInput.value);
        
        if (!validatePassword(passwordInput.value)) {
            passwordInput.parentNode.classList.add('error');
            errorDiv.textContent = 'Password must be at least 8 characters long and contain uppercase, lowercase, numbers, and special characters';
            errorDiv.style.display = 'block';
        } else {
            passwordInput.parentNode.classList.remove('error');
            errorDiv.style.display = 'none';
        }

        // Check confirm password if it has a value
        if (confirmPasswordInput.value) {
            validateConfirmPassword();
        }
    });

    const validateConfirmPassword = () => {
        const errorDiv = confirmPasswordInput.parentNode.querySelector('.error-message');
        if (passwordInput.value !== confirmPasswordInput.value) {
            confirmPasswordInput.parentNode.classList.add('error');
            errorDiv.textContent = 'Passwords do not match';
            errorDiv.style.display = 'block';
            return false;
        }
        confirmPasswordInput.parentNode.classList.remove('error');
        errorDiv.style.display = 'none';
        return true;
    };

    confirmPasswordInput.addEventListener('input', validateConfirmPassword);

    // Form submission
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const fullname = fullnameInput.value.trim();
        const email = emailInput.value.trim();
        const password = passwordInput.value;

        // Validate all inputs
        if (!validateFullname(fullname)) {
            showToast('Please enter a valid name', 'error');
            return;
        }

        if (!validateEmail(email)) {
            showToast('Please enter a valid email address', 'error');
            return;
        }

        if (!validatePassword(password)) {
            showToast('Password does not meet requirements', 'error');
            return;
        }

        if (!validateConfirmPassword()) {
            showToast('Passwords do not match', 'error');
            return;
        }

        if (!termsCheckbox.checked) {
            showToast('Please agree to the Terms & Conditions', 'error');
            return;
        }

        // Show loading state
        signupBtn.classList.add('loading');

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));

            showToast('Account created successfully! Redirecting to login...', 'success');
            
            // Redirect to login page
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1500);

        } catch (error) {
            showToast('Signup failed. Please try again.', 'error');
        } finally {
            signupBtn.classList.remove('loading');
        }
    });

    // Social signup handlers
    document.querySelector('.social-btn.google').addEventListener('click', () => {
        showToast('Google signup coming soon!', 'error');
    });

    document.querySelector('.social-btn.github').addEventListener('click', () => {
        showToast('GitHub signup coming soon!', 'error');
    });
}); 