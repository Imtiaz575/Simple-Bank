// Hamburger menu toggle
document.querySelector('.hamburger').addEventListener('click', () => {
    document.querySelector('.nav-links').classList.toggle('active');
});

// IndexedDB setup
let db;
const dbName = 'SimpleBankDB';
const messageStoreName = 'Messages';
const teamStoreName = 'TeamMembers';
const savingsStoreName = 'SavingsAccounts';
const inquiryStoreName = 'SavingsInquiries';

const request = indexedDB.open(dbName, 3); // Updated version for new stores

request.onerror = (event) => {
    console.error('Database error:', event.target.errorCode);
};

request.onupgradeneeded = (event) => {
    db = event.target.result;
    
    // Create Messages store (from previous)
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

    // Create SavingsAccounts store
    if (!db.objectStoreNames.contains(savingsStoreName)) {
        const savingsStore = db.createObjectStore(savingsStoreName, { keyPath: 'id', autoIncrement: true });
        savingsStore.createIndex('type', 'type', { unique: false });

        // Seed initial savings account types
        savingsStore.add({ type: 'Basic Savings', interestRate: '2.5%', description: 'A simple savings account with no minimum balance and easy access.' });
        savingsStore.add({ type: 'High-Yield Savings', interestRate: '4.0%', description: 'Earn higher interest with a minimum balance requirement.' });
        savingsStore.add({ type: 'Youth Savings', interestRate: '3.0%', description: 'Designed for young savers with educational tools and parental controls.' });
    }

    // Create SavingsInquiries store
    if (!db.objectStoreNames.contains(inquiryStoreName)) {
        const inquiryStore = db.createObjectStore(inquiryStoreName, { keyPath: 'id', autoIncrement: true });
        inquiryStore.createIndex('email', 'email', { unique: false });
    }
};

request.onsuccess = (event) => {
    db = event.target.result;
    loadTeamMembers(); // For about page
    loadSavingsAccounts(); // For savings page
};

// Load savings account types from IndexedDB
function loadSavingsAccounts() {
    if (!document.getElementById('account-types')) return; // Only run on savings page

    const transaction = db.transaction([savingsStoreName], 'readonly');
    const objectStore = transaction.objectStore(savingsStoreName);
    const request = objectStore.getAll();

    request.onsuccess = (event) => {
        const accounts = event.target.result;
        const accountGrid = document.getElementById('account-types');
        accountGrid.innerHTML = '';

        accounts.forEach(account => {
            const card = document.createElement('div');
            card.className = 'account-card';
            card.innerHTML = `
                <h3>${account.type}</h3>
                <p>Interest Rate: ${account.interestRate}</p>
                <p>${account.description}</p>
            `;
            accountGrid.appendChild(card);
        });
    };

    request.onerror = (event) => {
        console.error('Error loading savings accounts:', event.target.errorCode);
    };
}

// Submit savings inquiry
function submitInquiry() {
    if (!document.getElementById('inquiry-form')) return; // Only run on savings page

    const name = document.getElementById('inquiry-name').value.trim();
    const email = document.getElementById('inquiry-email').value.trim();
    const message = document.getElementById('inquiry-message').value.trim();
    const formMessage = document.getElementById('inquiry-form-message');

    if (!name || !email || !message) {
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

    const transaction = db.transaction([inquiryStoreName], 'readwrite');
    const objectStore = transaction.objectStore(inquiryStoreName);
    const request = objectStore.add({ name, email, message, timestamp: new Date().toISOString() });

    request.onsuccess = () => {
        formMessage.textContent = 'Inquiry submitted successfully! We will contact you soon.';
        formMessage.className = 'form-message success';
        document.getElementById('inquiry-form').reset();
    };

    request.onerror = (event) => {
        formMessage.textContent = 'Error submitting inquiry.';
        formMessage.className = 'form-message error';
        console.error('Error:', event.target.errorCode);
    };
}

// Contact form handling (from previous)
function sendMessage() {
    if (!document.getElementById('contact-form')) return;

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const subject = document.getElementById('subject').value.trim();
    const message = document.getElementById('message').value.trim();
    const formMessage = document.getElementById('form-message');

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
    if (!document.getElementById('team-members')) return;

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
    if (!document.getElementById('team-form')) return;

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
    if (!document.getElementById('registration-form')) return;

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
    if (!document.getElementById('registration-form')) return;

    document.getElementById('registration-form').reset();
    document.getElementById('form-message').textContent = '';
    document.getElementById('form-message').className = 'form-message';
}