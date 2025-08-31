// Hamburger menu toggle
document.querySelector('.hamburger').addEventListener('click', () => {
    document.querySelector('.nav-links').classList.toggle('active');
});

// IndexedDB setup for team members
let db;
const dbName = 'SimpleBankDB';
const storeName = 'TeamMembers';

const request = indexedDB.open(dbName, 1);

request.onerror = (event) => {
    console.error('Database error:', event.target.errorCode);
};

request.onupgradeneeded = (event) => {
    db = event.target.result;
    const objectStore = db.createObjectStore(storeName, { keyPath: 'id', autoIncrement: true });
    objectStore.createIndex('name', 'name', { unique: false });
    objectStore.createIndex('role', 'role', { unique: false });

    // Seed initial team members
    objectStore.add({ name: 'John Doe', role: 'CEO', bio: 'John leads Simple Bank with a vision for innovative banking solutions.' });
    objectStore.add({ name: 'Jane Smith', role: 'CFO', bio: 'Jane oversees financial strategies to ensure sustainable growth.' });
    objectStore.add({ name: 'Alex Brown', role: 'CTO', bio: 'Alex drives our technological advancements in digital banking.' });
};

request.onsuccess = (event) => {
    db = event.target.result;
    loadTeamMembers();
};

// Load team members from IndexedDB
function loadTeamMembers() {
    const transaction = db.transaction([storeName], 'readonly');
    const objectStore = transaction.objectStore(storeName);
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

// Add new team member
function addTeamMember() {
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

    const transaction = db.transaction([storeName], 'readwrite');
    const objectStore = transaction.objectStore(storeName);
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
    document.getElementById('registration-form').reset();
    document.getElementById('form-message').textContent = '';
    document.getElementById('form-message').className = 'form-message';
}