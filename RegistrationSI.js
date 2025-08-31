document.querySelector('.hamburger').addEventListener('click', () => {
    document.querySelector('.nav-links').classList.toggle('active');
});

// Mock user database (for demo purposes; in production, use a secure server)
const users = {
    'user1': { password: 'pass1', balance: 1000, history: [] },
    'user2': { password: 'pass2', balance: 500, history: [] }
};

function register() {
    const name = document.getElementById('name').value.trim();
    const password = document.getElementById('password').value;
    const email = document.getElementById('email').value.trim();
    const mobile = document.getElementById('mobile').value.trim();
    const dob = document.getElementById('dob').value;
    const gender = document.querySelector('input[name="gender"]:checked')?.value;
    const state = document.getElementById('state').value;
    const country = document.getElementById('country').value;
    const address = document.getElementById('address').value.trim();
    const formMessage = document.getElementById('form-message');

    // Validation
    if (!name || !password || !email || !mobile || !dob || !gender || !state || !country || !address) {
        formMessage.textContent = 'Please fill out all fields.';
        formMessage.className = 'form-message error';
        return;
    }

    if (password.length < 6) {
        formMessage.textContent = 'Password must be at least 6 characters long.';
        formMessage.className = 'form-message error';
        return;
    }

    if (!/^[a-zA-Z\s]+$/.test(name)) {
        formMessage.textContent = 'Name must contain only letters and spaces.';
        formMessage.className = 'form-message error';
        return;
    }

    if (!/^\d{10}$/.test(mobile)) {
        formMessage.textContent = 'Mobile number must be 10 digits.';
        formMessage.className = 'form-message error';
        return;
    }

    if (users[email]) {
        formMessage.textContent = 'Email is already registered.';
        formMessage.className = 'form-message error';
        return;
    }

    // Simulate registration (in production, send to server)
    users[email] = {
        password: password,
        balance: 0,
        history: [],
        name: name,
        mobile: mobile,
        dob: dob,
        gender: gender,
        state: state,
        country: country,
        address: address
    };

    formMessage.textContent = 'Registration successful! You can now log in.';
    formMessage.className = 'form-message success';
    document.getElementById('registration-form').reset();
}

function resetForm() {
    document.getElementById('registration-form').reset();
    document.getElementById('form-message').textContent = '';
    document.getElementById('form-message').className = 'form-message';
}