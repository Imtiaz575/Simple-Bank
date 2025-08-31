// Hamburger menu toggle
document.querySelector('.hamburger').addEventListener('click', () => {
    document.querySelector('.nav-links').classList.toggle('active');
});

// IndexedDB setup for messages and team members
let db;
const dbName = 'SimpleBankDB';
const messageStoreName = 'Messages';
const teamStoreName = 'TeamMembers';

const request = indexedDB.open(dbName, 2); // Updated version for new store

request.onerror = (event) => {
    console.error('Database error:', event.target.errorCode);
};

request.onupgradeneeded = (event) => {
    db = event.target.result;
    
    // Create Messages store
    if (!db.objectStoreNames.contains(messageStoreName)) {
        const messageStore = db.createObjectStore(messageStoreName, { keyPath: 'id', autoIncrement: true });
        messageStore.createIndex('email', 'email', { unique: false });
        messageStore.createIndex('subject', 'subject', { unique: false });
    }

    // Create TeamMembers store (from previous)
    if (!db.objectStoreNames.contains(teamStoreName)) {
        const teamStore = db.createObjectStore(teamStoreName, { keyPath: 'id', autoIncrement: true });
        teamStore.createIndex('name', 'name', { unique: false });
        teamStore.createIndex('role', 'role', { unique: false });

        // Seed initial team members
        teamStore.add({ name: 'John Doe', role: 'CEO', bio: 'John leads Simple Bank with a vision for innovative banking solutions.' });
        teamStore.add({ name: 'Jane Smith', role: 'CFO', bio: 'Jane oversees financial strategies to ensure sustainable growth.' });
        teamStore.add({ name: 'Alex Brown', role: 'CTO', bio: 'Alex drives our technological advancements in digital banking.' });
    }
};

request.onsuccess = (event) => {
    db = event.target.result;
    loadTeamMembers(); // Load team members for about page
};

// Contact form handling
function sendMessage() {
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const subject = document.getElementById('subject').value.trim();
    const message = document.getElementById('message').value.trim();
    const formMessage = document.getElementById('form-message');

    // Validation
    if (!name || !email || !subject || !message) {
        formMessage.textContent = 'Please fill out all fields.';
        formMessage.className = 'form-message error';
        return;
    }

    if (!/^[a-zA-Z\s]+$/.test(name)) {
        formMessage.textContent = 'Name must contain only letters and spaces.';
        formMessage.className = 'form-message error';
        return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        formMessage.textContent = 'Please enter a valid email address.';
        formMessage.className = 'form-message error';
        return;
    }

    // Store message in IndexedDB
    const transaction = db.transaction([messageStoreName], 'readwrite');
    const objectStore = transaction.objectStore(messageStoreName);
    const request = objectStore.add({ name, email, subject, message, timestamp: new Date().toISOString() });

    request.onsuccess = () => {
        formMessage.textContent = 'Message sent successfully! We will get back to you soon.';
        formMessage.className = 'form-message success';
        document.getElementById('contact-form').reset();
    };

    request.onerror = (event) => {
        formMessage.textContent = 'Error sending message.';
        formMessage.className = 'form-message error';
        console.error('Error:', event.target.errorCode);
    };
}

// Team members handling (from previous)
function loadTeamMembers() {
    if (!document.getElementById('team-members')) return; // Only run on about page

    const transaction = db.transaction([teamStoreName], 'readonly');
    const objectStore = transaction.objectStore(teamStoreName);
    const request = objectStore.getAll();

    request.onsuccess = (event) => {
        const members = event.target.result;
        const teamGrid = document.getElementById('team-members');
        teamGrid.innerHTML = '';

        members.forEach(member => {
            const card = document.createElement('div');
            card.className = 'team-card';
            card.innerHTML = `
                <h3>${member.name}</h3>
                <p><strong>${member.role}</strong></p>
                <p>${member.bio}</p>
            `;
            teamGrid.appendChild(card);
        });
    };

    request.onerror = (event) => {
        console.error('Error loading team members:', event.target.errorCode);
    };
}

function addTeamMember() {
    if (!document.getElementById('team-name')) return; // Only run on about page

    const name = document.getElementById('team-name').value.trim();
    const role = document.getElementById('team-role').value.trim();
    const bio = document.getElementById('team-bio').value.trim();
    const formMessage = document.getElementById('team-form-message');

    if (!name || !role || !bio) {
        formMessage.textContent = 'Please fill out all fields.';
        formMessage.className = 'form-message error';
        return;
    }

    if (!/^[a-zA-Z\s]+$/.test(name)) {
        formMessage.textContent = 'Name must contain only letters and spaces.';
        formMessage.className = 'form-message error';
        return;
    }

    const transaction = db.transaction([teamStoreName], 'readwrite');
    const objectStore = transaction.objectStore(teamStoreName);
    const request = objectStore.add({ name, role, bio });

    request.onsuccess = () => {
        formMessage.textContent = 'Team member added successfully!';
        formMessage.className = 'form-message success';
        document.getElementById('team-form').reset();
        loadTeamMembers();
    };

    request.onerror = (event) => {
        formMessage.textContent = 'Error adding team member.';
        formMessage.className = 'form-message error';
        console.error('Error:', event.target.errorCode);
    };
}

// Registration form handling (from previous)
const users = {
    'user1': { password: 'pass1', balance: 1000, history: [] },
    'user2': { password: 'pass2', balance: 500, history: [] }
};

function register() {
    if (!document.getElementById('registration-form')) return; // Only run on registration page

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
    if (!document.getElementById('registration-form')) return; // Only run on registration page

    document.getElementById('registration-form').reset();
    document.getElementById('form-message').textContent = '';
    document.getElementById('form-message').className = 'form-message';
}