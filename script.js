// --- YENİ: Gözəllik Yoxlanışı Məntiqi ---
function startBeautyCheck() {
    const btn = document.getElementById('beautyBtn');
    const container = document.getElementById('beautyContainer');
    const loadingText = document.getElementById('beautyLoadingText');
    const resultDiv = document.getElementById('beautyResult');

    // Düyməni deaktiv edirik ki, ard-arda basmasın
    btn.disabled = true;
    container.classList.add('show');
    resultDiv.style.display = 'none';
    loadingText.style.display = 'block';

    // Yüklənmə yazıları
    const steps = [
        "Asifin dediyi qız budur? 🤔",
        "Analiz edilir... ⏳",
        "Üz cizgilərinə baxılır... 🧐",
        "Göz rəngi təyin olunur... 👁️",
        "Gülüşün şirinliyi ölçülür... 😊",
        "Nəticələr hesablanır... 📊"
    ];

    let currentStep = 0;
    loadingText.innerText = steps[0];

    // Hər 1.2 saniyədən bir yazını dəyişirik (Ümumi ~7.2 saniyə)
    const interval = setInterval(() => {
        currentStep++;
        if (currentStep < steps.length) {
            loadingText.innerText = steps[currentStep];
        } else {
            clearInterval(interval);
            loadingText.style.display = 'none';
            resultDiv.style.display = 'block';
            btn.disabled = false;
            
            // Konfeti və ürək animasiyası
            confetti({
                particleCount: 150,
                spread: 80,
                origin: { y: 0.6 },
                colors: ['#ff6b8b', '#7a283b', '#ffffff'],
                shapes: ['circle', 'square']
            });
        }
    }, 1200); 
}

// --- YENİ: Motivasiya Məntiqi ---
const motivations = [
    "Sən o qədər gözəlsən ki, günəş belə səni görəndə utanır. ☀️",
    "Gülüşün ən qaranlıq günümü belə aydınlatmağa bəs edir. ✨",
    "Sən mənim həyatıma gələn ən gözəl möcüzəsən, heç vaxt kədərlənmə. 💖",
    "Gözlərinə baxanda bütün dərdlərimi unuduram, sən çox güclüsən! 💪",
    "Sənin bir gülüşün dünyadakı bütün kədərləri yox edə bilər. 😊",
    "Sən sadəcə xarici görünüşünlə deyil, qəlbinlə də mükəmməlsən. 🌸",
    "Hər şey çətin gələndə xatırla ki, səni hər halınla sevən bir Asif var. ❤️",
    "Sənin varlığın mənim ən böyük motivasiyamdır, sən də özünlə fəxr et! 🌟",
    "Dünyanın ən şirin, ən ağıllı və ən gözəl qızı hal-hazırda bu yazını oxuyur. 📖",
    "Sən bacararsan! Çünki sən mənim tanıdığım ən güclü qızsan. 🦋",
    "Kədərlənmək sənə heç yaraşmır, o gözəl üzün həmişə gülsün. 🥰",
    "Səninlə hər çətinliyin öhdəsindən gələrik, təki sən pis olma. 🤝",
    "Sən mənim hər şeyimsən, sənin xoşbəxtliyin mənim xoşbəxtliyimdir. 🌍",
    "Aynaya bax və Asifin nə qədər şanslı olduğunu gör! 🪞",
    "Heç vaxt unutma: Sən çox dəyərlisən və çox sevilirsən. 💌"
];

function showMotivation() {
    const container = document.getElementById('motivationContainer');
    const textEl = document.getElementById('motivationText');
    
    // Təsadüfi söz seçimi
    const randomQuote = motivations[Math.floor(Math.random() * motivations.length)];
    
    // Animasiya effekti üçün yazını əvvəlcə gizlədib sonra göstəririk
    textEl.style.opacity = 0;
    
    setTimeout(() => {
        textEl.innerText = randomQuote;
        textEl.style.transition = "opacity 0.5s ease";
        textEl.style.opacity = 1;
    }, 200);
    
    container.classList.add('show');
}