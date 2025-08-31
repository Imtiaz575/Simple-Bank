document.querySelector('.hamburger').addEventListener('click', () => {
    document.querySelector('.nav-links').classList.toggle('active');
});

const serviceDetails = {
    deposit: {
        title: 'Deposit Accounts',
        content: 'Our deposit accounts offer secure savings and checking options with competitive interest rates. Choose from regular savings, high-yield accounts, or checking accounts with no monthly fees. Access your funds anytime with our online banking platform.'
    },
    loans: {
        title: 'Loans',
        content: 'We provide a variety of loans including personal, home, and auto loans. Enjoy low interest rates, flexible repayment terms, and a simple application process. Our loan officers are here to guide you every step of the way.'
    },
    cards: {
        title: 'Credit & Debit Cards',
        content: 'Our credit cards come with attractive rewards programs, low APRs, and no annual fees. Our debit cards offer convenient access to your funds with enhanced security features for online and in-store purchases.'
    },
    digital: {
        title: 'Digital Banking',
        content: 'Bank from anywhere with our secure mobile and online banking services. Check balances, transfer funds, pay bills, and manage your accounts with ease using our user-friendly app and website.'
    },
    investment: {
        title: 'Investment Services',
        content: 'Grow your wealth with our personalized investment options. From mutual funds to retirement planning, our expert advisors will help you build a portfolio tailored to your financial goals.'
    },
    remittances: {
        title: 'Remittances & Fund Transfers',
        content: 'Send money locally or internationally with our fast and secure transfer services. Enjoy low fees, competitive exchange rates, and real-time tracking for all your remittance needs.'
    },
    safekeeping: {
        title: 'Safekeeping',
        content: 'Protect your valuables with our safe deposit boxes and custody services. Store important documents, jewelry, and other items in our highly secure facilities with 24/7 monitoring.'
    }
};

function showDetails(service) {
    const details = document.getElementById('service-details');
    const title = document.getElementById('details-title');
    const content = document.getElementById('details-content');

    title.textContent = serviceDetails[service].title;
    content.textContent = serviceDetails[service].content;
    details.classList.add('active');
}

function closeDetails() {
    document.getElementById('service-details').classList.remove('active');
}