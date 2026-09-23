// --- Yox Butonunun Qaçma Məntiqi ---
const noBtn = document.getElementById('noBtn');
const moveButton = () => {
    const x = Math.floor(Math.random() * 160) - 80;
    const y = Math.floor(Math.random() * 160) - 80;
    noBtn.style.transform = `translate(${x}px, ${y}px)`;
};
noBtn.addEventListener('mouseover', moveButton);
noBtn.addEventListener('touchstart', (e) => { e.preventDefault(); moveButton(); });

// --- Hə Butonuna Basıldıqda ---
function sayYes() {
    const questionScreen = document.getElementById('question-screen');
    const miniModal = document.getElementById('mini-modal');
    const mainScreen = document.getElementById('main-screen');

    questionScreen.style.opacity = '0';
    setTimeout(() => {
        questionScreen.style.display = 'none';
        miniModal.style.transform = 'translate(-50%, -50%) scale(1)';
        
        setTimeout(() => {
            miniModal.style.transform = 'translate(-50%, -50%) scale(0)';
            setTimeout(() => {
                mainScreen.style.display = 'flex';
                document.body.style.overflow = 'auto'; 
                setTimeout(() => { mainScreen.style.opacity = '1'; }, 50);
            }, 400); 
        }, 2500);
    }, 500);
}

// --- Səbəbləri Aç/Bağla ---
function toggleReasons() {
    const content = document.getElementById('reasonsContent');
    const btn = document.getElementById('reasonsBtn');
    if (content.classList.contains('open')) {
        content.classList.remove('open');
        btn.innerText = 'Bax';
    } else {
        content.classList.add('open');
        btn.innerText = 'Bağla';
        setTimeout(() => { content.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }, 300);
    }
}

// --- Təsdiq Paneli Məntiqi (Basılı tutma) ---
const panel = document.getElementById('fingerprintPanel');
const marriageSuccess = document.getElementById('marriageSuccess');
let holdTimer;
let isSuccess = false;

panel.addEventListener('contextmenu', (e) => e.preventDefault());

const startHold = (e) => {
    if (isSuccess) return;
    if (e.cancelable) e.preventDefault();
    
    panel.classList.add('holding');
    
    holdTimer = setTimeout(() => {
        successHold();
    }, 2000);
};

const endHold = () => {
    if (isSuccess) return;
    panel.classList.remove('holding');
    clearTimeout(holdTimer);
};

const successHold = () => {
    isSuccess = true;
    panel.classList.remove('holding');
    panel.classList.add('success');
    
    setTimeout(() => {
        marriageSuccess.classList.add('show');
        setTimeout(() => {
            marriageSuccess.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }, 300);
    }, 600);
};

panel.addEventListener('mousedown', startHold);
panel.addEventListener('mouseup', endHold);
panel.addEventListener('mouseleave', endHold);

panel.addEventListener('touchstart', startHold, {passive: false});
panel.addEventListener('touchend', endHold);
panel.addEventListener('touchcancel', endHold);

// --- Taymer Məntiqi ---
const startDate = new Date(2026, 6, 7, 0, 0, 0); // 07.07.2026 (Aylar 0-dan başlayır, 6 = İyul)
function updateTimer() {
    const now = new Date();
    if (now < startDate) return; 

    let years = now.getFullYear() - startDate.getFullYear();
    let months = now.getMonth() - startDate.getMonth();
    let days = now.getDate() - startDate.getDate();

    if (days < 0) {
        months--;
        const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
        days += prevMonth.getDate();
    }
    if (months < 0) { years--; months += 12; }

    let hours = now.getHours() - startDate.getHours();
    if (hours < 0) { days--; hours += 24; }
    let minutes = now.getMinutes() - startDate.getMinutes();
    if (minutes < 0) { hours--; minutes += 60; }
    let seconds = now.getSeconds() - startDate.getSeconds();
    if (seconds < 0) { minutes--; seconds += 60; }

    const format = (num) => num < 10 ? `0${num}` : num;
    document.getElementById('years').innerText = format(years);
    document.getElementById('months').innerText = format(months);
    document.getElementById('days').innerText = format(days);
    document.getElementById('hours').innerText = format(hours);
    document.getElementById('minutes').innerText = format(minutes);
    document.getElementById('seconds').innerText = format(seconds);
}
setInterval(updateTimer, 1000);
updateTimer(); 

// --- Mesajlaşma Məntiqi (Backend üçün hazırlıq) ---
function sendMessage() {
    const textarea = document.getElementById('aytacMessage');
    const messageText = textarea.value.trim();
    const chatMessages = document.getElementById('chatMessages');

    if (messageText === "") return;

    // Aytacın mesajını ekrana əlavə edirik
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message-bubble', 'message-aytac');
    messageDiv.innerText = messageText;
    chatMessages.appendChild(messageDiv);

    // Textarea-nı təmizləyirik
    textarea.value = "";
    
    // Siyahını ən aşağı sürüşdürürük
    chatMessages.scrollTop = chatMessages.scrollHeight;

    // GƏLƏCƏK BACKEND ÜÇÜN:
    // Burada fetch() və ya axios ilə mesajı sənin serverinə göndərəcəyik.
    // Məsələn:
    // fetch('senin-api-url.com/send', { method: 'POST', body: JSON.stringify({ message: messageText }) })
}

// Test üçün: Asifdən mesaj gəldiyini simulyasiya edən funksiya
// Gələcəkdə bu funksiya backend-dən məlumat gələndə avtomatik işə düşəcək
function receiveMessageFromAsif(text) {
    const chatMessages = document.getElementById('chatMessages');
    const alertBox = document.getElementById('newMessageAlert');

    // Mesajı ekrana əlavə edirik
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message-bubble', 'message-asif');
    messageDiv.innerText = text;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    // Bildirişi göstəririk
    alertBox.style.display = 'block';

    // 5 saniyə sonra bildirişi gizlədirik
    setTimeout(() => {
        alertBox.style.display = 'none';
    }, 5000);
}

// Test etmək istəsən, console-a girib receiveMessageFromAsif("Canım, mesajını aldım!") yaza bilərsən.