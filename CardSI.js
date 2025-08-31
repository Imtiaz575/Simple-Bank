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
const userStoreName = 'Users';
const creditCardStoreName = 'CreditCards';
const cardInquiryStoreName = 'CardInquiries';

const request = indexedDB.open(dbName, 5); // Updated version for new stores

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

    // Create TeamMembers store
    if (!db.objectStoreNames.contains(teamStoreName)) {
        const teamStore = db.createObjectStore(teamStoreName, { keyPath: 'id', autoIncrement: true });
        teamStore.createIndex('name', 'name', { unique: false });
        teamStore.createIndex('role', 'role', { unique: false });

        teamStore.add({ name: 'John Doe', role: 'CEO', bio: 'John leads Simple Bank with a vision for innovative banking solutions.' });
        teamStore.add({ name: 'Jane Smith', role: 'CFO', bio: 'Jane oversees financial strategies to ensure sustainable growth.' });
        teamStore.add({ name: 'Alex Brown', role: 'CTO', bio: 'Alex drives our technological advancements in digital banking.' });
    }

    // Create SavingsAccounts store
    if (!db.objectStoreNames.contains(savingsStoreName)) {
        const savingsStore = db.createObjectStore(savingsStoreName, { keyPath: 'id', autoIncrement: true });
        savingsStore.createIndex('type', 'type', { unique: false });

        savingsStore.add({ type: 'Basic Savings', interestRate: '2.5%', description: 'A simple savings account with no minimum balance and easy access.' });
        savingsStore.add({ type: 'High-Yield Savings', interestRate: '4.0%', description: 'Earn higher interest with a minimum balance requirement.' });
        savingsStore.add({ type: 'Youth Savings', interestRate: '3.0%', description: 'Designed for young savers with educational tools and parental controls.' });
    }

    // Create SavingsInquiries store
    if (!db.objectStoreNames.contains(inquiryStoreName)) {
        const inquiryStore = db.createObjectStore(inquiryStoreName, { keyPath: 'id', autoIncrement: true });
        inquiryStore.createIndex('email', 'email', { unique: false });
    }

    // Create Users store
    if (!db.objectStoreNames.contains(userStoreName)) {
        const userStore = db.createObjectStore(userStoreName, { keyPath: 'email' });
        userStore.createIndex('name', 'name', { unique: false });

        userStore.add({
            email: 'user1@example.com',
            password: 'pass1',
            name: 'User One',
            mobile: '1234567890',
            dob: '1990-01-01',
            gender: 'male',
            state: 'Karnataka',
            country: 'India',
            address: '123 Main St, Bangalore',
            balance: 1000,
            history: [
                { type: 'Deposit', amount: 1000, date: '2025-08-01T10:00:00Z' },
                { type: 'Withdrawal', amount: 200, date: '2025-08-15T14:00:00Z' }
            ]
        });
        userStore.add({
            email: 'user2@example.com',
            password: 'pass2',
            name: 'User Two',
            mobile: '0987654321',
            dob: '1985-05-05',
            gender: 'female',
            state: 'Maharashtra',
            country: 'India',
            address: '456 Park Ave, Mumbai',
            balance: 500,
            history: [
                { type: 'Deposit', amount: 700, date: '2025-08-10T09:00:00Z' }
            ]
        });
    }

    // Create CreditCards store
    if (!db.objectStoreNames.contains(creditCardStoreName)) {
        const creditCardStore = db.createObjectStore(creditCardStoreName, { keyPath: 'id', autoIncrement: true });
        creditCardStore.createIndex('type', 'type', { unique: false });

        creditCardStore.add({ type: 'Rewards Card', rewards: '2% cashback on all purchases', description: 'Earn rewards on every purchase with no annual fee.' });
        creditCardStore.add({ type: 'Travel Card', rewards: '5x points on travel', description: 'Ideal for frequent travelers with exclusive travel benefits.' });
        creditCardStore.add({ type: 'Cashback Card', rewards: '3% cashback on dining and groceries', description: 'Maximize savings on everyday spending.' });
    }

    // Create CardInquiries store
    if (!db.objectStoreNames.contains(cardInquiryStoreName)) {
        const cardInquiryStore = db.createObjectStore(cardInquiryStoreName, { keyPath: 'id', autoIncrement: true });
        cardInquiryStore.createIndex('email', 'email', { unique: false });
        cardInquiryStore.createIndex('cardType', 'cardType', { unique: false });
    }
};

request.onsuccess = (event) => {
    db = event.target.result;
    loadTeamMembers();
    loadSavingsAccounts();
    loadCreditCards();
};

// Load credit card types
function loadCreditCards() {
    if (!document.getElementById('card-types')) return;

    const transaction = db.transaction([creditCardStoreName], 'readonly');
    const objectStore = transaction.objectStore(creditCardStoreName);
    const request = objectStore.getAll();

    request.onsuccess = (event) => {
        const cards = event.target.result;
        const cardGrid = document.getElementById('card-types');
        cardGrid.innerHTML = '';

        cards.forEach(card => {
            const cardItem = document.createElement('div');
            cardItem.className = 'card-item';
            cardItem.innerHTML = `
                <h3>${card.type}</h3>
                <p>Rewards: ${card.rewards}</p>
                <p>${card.description}</p>
            `;
            cardGrid.appendChild(cardItem);
        });
    };

    request.onerror = (event) => {
        console.error('Error loading credit cards:', event.target.errorCode);
    };
}

// Submit credit card inquiry
function submitCardInquiry() {
    if (!document.getElementById('card-inquiry-form')) return;

    const name = document.getElementById('inquiry-name').value.trim();
    const email = document.getElementById('inquiry-email').value.trim();
    const cardType = document.getElementById('card-type').value;
    const message = document.getElementById('inquiry-message').value.trim();
    const formMessage = document.getElementById('inquiry-form-message');

    if (!name || !email || !cardType || !message) {
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

    const transaction = db.transaction([cardInquiryStoreName], 'readwrite');
    const objectStore = transaction.objectStore(cardInquiryStoreName);
    const request = objectStore.add({ name, email, cardType, message, timestamp: new Date().toISOString() });

    request.onsuccess = () => {
        formMessage.textContent = 'Inquiry submitted successfully! We will contact you soon.';
        formMessage.className = 'form-message success';
        document.getElementById('card-inquiry-form').reset();
    };

    request.onerror = (event) => {
        formMessage.textContent = 'Error submitting inquiry.';
        formMessage.className = 'form-message error';
        console.error('Error:', event.target.errorCode);
    };
}

// View account details
function viewAccount() {
    if (!document.getElementById('demo-form')) return;

    const email = document.getElementById('demo-email').value.trim();
    const formMessage = document.getElementById('demo-form-message');
    const accountDetails = document.getElementById('account-details');
    const accountName = document.getElementById('account-name');
    const accountBalance = document.getElementById('account-balance');
    const transactionHistory = document.getElementById('transaction-history');

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        formMessage.textContent = 'Please enter a valid email address.';
        formMessage.className = 'form-message error';
        accountDetails.style.display = 'none';
        return;
    }

    const transaction = db.transaction([userStoreName], 'readonly');
    const objectStore = transaction.objectStore(userStoreName);
    const request = objectStore.get(email);

    request.onsuccess = (event) => {
        const user = event.target.result;
        if (!user) {
            formMessage.textContent = 'No account found for this email.';
            formMessage.className = 'form-message error';
            accountDetails.style.display = 'none';
            return;
        }

        formMessage.textContent = 'Account details loaded successfully!';
        formMessage.className = 'form-message success';
        accountDetails.style.display = 'block';
        accountName.textContent = user.name;
        accountBalance.textContent = user.balance.toFixed(2);
        transactionHistory.innerHTML = '';

        user.history.forEach(tx => {
            const li = document.createElement('li');
            li.textContent = `${tx.type}: $${tx.amount.toFixed(2)} on ${new Date(tx.date).toLocaleString()}`;
            transactionHistory.appendChild(li);
        });
    };

    request.onerror = (event) => {
        formMessage.textContent = 'Error loading account details.';
        formMessage.className = 'form-message error';
        accountDetails.style.display = 'none';
        console.error('Error:', event.target.errorCode);
    };
}

// Savings accounts handling
function loadSavingsAccounts() {
    if (!document.getElementById('account-types')) return;

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

// Savings inquiry handling
function submitInquiry() {
    if (!document.getElementById('inquiry-form')) return;

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

// Contact form handling
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

// Team members handling
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

// Registration form handling
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

    const transaction = db.transaction([userStoreName], 'readwrite');
    const objectStore = transaction.objectStore(userStoreName);
    const checkRequest = objectStore.get(email);

    checkRequest.onsuccess = (event) => {
        if (event.target.result) {
            formMessage.textContent = 'Email is already registered.';
            formMessage.className = 'form-message error';
            return;
        }

        const addRequest = objectStore.add({
            email,
            password,
            name,
            mobile,
            dob,
            gender,
            state,
            country,
            address,
            balance: 0,
            history: []
        });

        addRequest.onsuccess = () => {
            formMessage.textContent = 'Registration successful! You can now log in.';
            formMessage.className = 'form-message success';
            document.getElementById('registration-form').reset();
        };

        addRequest.onerror = (event) => {
            formMessage.textContent = 'Error registering user.';
            formMessage.className = 'form-message error';
            console.error('Error:', event.target.errorCode);
        };
    };

    checkRequest.onerror = (event) => {
        formMessage.textContent = 'Error checking email.';
        formMessage.className = 'form-message error';
        console.error('Error:', event.target.errorCode);
    };
}

function resetForm() {
    if (!document.getElementById('registration-form')) return;

    document.getElementById('registration-form').reset();
    document.getElementById('form-message').textContent = '';
    document.getElementById('form-message').className = 'form-message';
}