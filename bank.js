// Simple Bank Application Script

// Mock user data (in a real app, this would be on a server)
const users = {
    'imtiazahammed575@gmail.com': {
        password: 'Imtiaz@123',
        balance: 981000,
        history: ["Deposited: $5000", "Withdrew: $200"]
    },
    'MySneha12@gmail.com': {
        password: 'Sneha@15',
        balance: 675500,
        history: []
    }
};

let currentUser = null;

function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const error = document.getElementById('login-error');

    if (users[username] && users[username].password === password) {
        currentUser = username;
        document.getElementById('login-section').style.display = 'none';
        document.getElementById('dashboard').style.display = 'block';
        document.getElementById('welcome-message').textContent = `Welcome, ${username}!`;
        updateBalance();
        updateHistory();
        error.textContent = '';
    } else {
        error.textContent = 'Invalid username or password.';
    }
}

function deposit() {
    const amount = parseFloat(document.getElementById('amount').value);
    const error = document.getElementById('transaction-error');

    if (isNaN(amount) || amount <= 0) {
        error.textContent = 'Please enter a valid positive amount.';
        return;
    }

    users[currentUser].balance += amount;
    users[currentUser].history.push(`Deposited: $${amount.toFixed(2)}`);
    updateBalance();
    updateHistory();
    error.textContent = '';
    document.getElementById('amount').value = '';
}

function withdraw() {
    const amount = parseFloat(document.getElementById('amount').value);
    const error = document.getElementById('transaction-error');

    if (isNaN(amount) || amount <= 0) {
        error.textContent = 'Please enter a valid positive amount.';
        return;
    }

    if (amount > users[currentUser].balance) {
        error.textContent = 'Insufficient funds.';
        return;
    }

    users[currentUser].balance -= amount;
    users[currentUser].history.push(`Withdrew: $${amount.toFixed(2)}`);
    updateBalance();
    updateHistory();
    error.textContent = '';
    document.getElementById('amount').value = '';
}

function updateBalance() {
    document.getElementById('balance').textContent = users[currentUser].balance.toFixed(2);
}

function updateHistory() {
    const historyList = document.getElementById('history');
    historyList.innerHTML = '';
    users[currentUser].history.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        historyList.appendChild(li);
    });
}

function logout() {
    currentUser = null;
    document.getElementById('dashboard').style.display = 'none';
    document.getElementById('login-section').style.display = 'block';
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
}