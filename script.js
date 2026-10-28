/* ===== أ) الكتابة التلقائية ===== */
const words = ["Communication and Electronics Engineer", "Junior Front-end Developer"]; // الجمل، غيّرها براحتك
const typingEl = document.getElementById("typing"); // نجيب العنصر من HTML عن طريق الـ id
let wordIndex = 0; // رقم الجملة الحالية (0 = أول وحدة)
let charIndex = 0; // كم حرف مكتوب حالياً
let deleting = false; // هل نحن بحالة مسح؟

function type() { // دالة بتكتب أو بتمسح حرف واحد كل مرة
    const word = words[wordIndex]; // الجملة الحالية
    charIndex += deleting ? -1 : 1; // إذا بنمسح ننقص حرف، وإلا نزيد حرف
    typingEl.textContent = word.slice(0, charIndex); // نعرض أول charIndex حرف من الجملة

    let delay = deleting ? 40 : 90; // المسح أسرع من الكتابة (بالميلي ثانية)
    if (!deleting && charIndex === word.length) { // إذا خلصت الجملة
        deleting = true; // نبدأ المسح
        delay = 1200; // لكن نوقف 1.2 ثانية ليقرأها الزائر
    } else if (deleting && charIndex === 0) { // إذا انمسحت كلها
        deleting = false; // نرجع للكتابة
        wordIndex = (wordIndex + 1) % words.length; // الجملة التالية، و% بيرجعنا للأولى بعد الأخيرة
    }
    setTimeout(type, delay); // نعيد استدعاء الدالة بعد delay
}
type(); // نشغل الدالة أول مرة

/* ===== ب) الضوء اللي بيتبع الماوس ===== */
const glow = document.getElementById("glow"); // نجيب الدائرة
document.addEventListener("mousemove", function(e) { // كل ما تحرك الماوس
    glow.style.transform = "translate(" + e.clientX + "px, " + e.clientY + "px)"; // ننقلها لمكان الماوس (e = معلومات الحدث)
});

/* ===== ج) الظهور عند السكرول ===== */
const observer = new IntersectionObserver(function(entries) { // مراقب بيخبرنا لما عنصر يدخل الشاشة
    entries.forEach(function(entry) { // نمر على كل العناصر اللي تغير وضعها
        if (entry.isIntersecting) { // إذا صار ظاهر بالشاشة
            entry.target.classList.add("show"); // نضيف كلاس show فيشتغل تأثير CSS
        }
    });
}, { threshold: 0.15 }); // يعتبره ظاهر لما 15% منه يبين
document.querySelectorAll(".reveal").forEach(function(el) { // نجيب كل العناصر اللي عليها reveal
    observer.observe(el); // ونخلي المراقب يراقبها (حتى الكروت الجديدة بتشتغل تلقائياً)
});

/* ===== د) ميلان الكرت مع الماوس ===== */
document.querySelectorAll(".card").forEach(function(card) { // لكل كرت
    card.addEventListener("mousemove", function(e) { // لما الماوس يتحرك فوقه
        const box = card.getBoundingClientRect(); // مكان الكرت وحجمه
        const x = (e.clientX - box.left) / box.width - 0.5; // موقع الماوس أفقياً من -0.5 (يسار) إلى 0.5 (يمين)
        const y = (e.clientY - box.top) / box.height - 0.5; // موقعه عمودياً بنفس الطريقة
        card.style.transform = "perspective(600px) rotateY(" + (x * 12) + "deg) rotateX(" + (-y * 12) + "deg)"; // نميله حتى 6 درجات
    });
    card.addEventListener("mouseleave", function() { // لما الماوس يطلع
        card.style.transform = ""; // نرجعه مستقيم
    });
});


/* ===== هـ) القائمة على الموبايل ===== */
const burger = document.getElementById("burger");
const menu = document.getElementById("menu");
burger.addEventListener("click", function() {
    const open = menu.classList.toggle("open"); // toggle = يضيف الكلاس أو يشيله
    burger.setAttribute("aria-expanded", open); // لتحدّث شكل الزر (X) وللقارئات الصوتية
});
menu.querySelectorAll("a").forEach(function(link) { // لما تضغط على أي رابط
    link.addEventListener("click", function() {
        menu.classList.remove("open"); // نسكّر القائمة
        burger.setAttribute("aria-expanded", "false");
    });
});

/* ===== و) تمييز الزر الخاص بالقسم الحالي ===== */
const sections = document.querySelectorAll("section[id]"); // كل الأقسام اللي عندها id
const links = document.querySelectorAll(".menu a");
const spy = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
        if (entry.isIntersecting) { // القسم صار بنص الشاشة تقريباً
            links.forEach(function(a) {
                a.classList.toggle("active", a.getAttribute("href") === "#" + entry.target.id); // active للرابط المطابق فقط
            });
        }
    });
}, { rootMargin: "-45% 0px -50% 0px" }); // نعتبر القسم "حالي" لما يمر من منتصف الشاشة
sections.forEach(function(sec) { spy.observe(sec); });

/* ===== ز) شريط التقدم ===== */
const progress = document.getElementById("progress");
window.addEventListener("scroll", function() {
    const max = document.documentElement.scrollHeight - window.innerHeight; // أقصى مسافة ممكن ننزلها
    progress.style.width = (window.scrollY / max * 100) + "%"; // النسبة المئوية للنزول
});

/* ===== ح) جزيئات النيون بالهيرو ===== */
const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d"); // ctx = قلم الرسم
const colors = ["#ff2bd6", "#9d4dff", "#2b6bff"];
const mouse = { x: null, y: null }; // مكان الماوس فوق الهيرو
let particles = [];

function resize() { // نخلي حجم اللوحة = حجم الهيرو
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    particles = [];
    const count = Math.min(80, Math.floor(canvas.width / 16)); // عدد الجزيئات حسب عرض الشاشة
    for (let i = 0; i < count; i++) {
        particles.push({
            x: Math.random() * canvas.width, // مكان عشوائي
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.6, // سرعة واتجاه عشوائيين
            vy: (Math.random() - 0.5) * 0.6,
            r: Math.random() * 2 + 1, // نصف القطر
            color: colors[Math.floor(Math.random() * colors.length)]
        });
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // نمسح الرسمة القديمة
    particles.forEach(function(p, i) {
        p.x += p.vx;
        p.y += p.vy; // نحرك الجزيء
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1; // يرتد عن الحواف
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); // دائرة صغيرة
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 12; // توهج
        ctx.fill();
        ctx.shadowBlur = 0; // نوقف التوهج للخطوط (أخف على الجهاز)

        for (let k = i + 1; k < particles.length; k++) { // نقارن مع باقي الجزيئات
            const q = particles[k];
            const d = Math.hypot(p.x - q.x, p.y - q.y); // المسافة بينهم
            if (d < 120) { // إذا قريبين نرسم خط
                ctx.strokeStyle = "rgba(157,77,255," + (1 - d / 120) * 0.5 + ")"; // كل ما قربوا صار الخط أوضح
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(q.x, q.y);
                ctx.stroke();
            }
        }
        if (mouse.x !== null) { // وصل الجزيئات القريبة من الماوس
            const dm = Math.hypot(p.x - mouse.x, p.y - mouse.y);
            if (dm < 160) {
                ctx.strokeStyle = "rgba(255,43,214," + (1 - dm / 160) * 0.7 + ")";
                ctx.beginPath();
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(mouse.x, mouse.y);
                ctx.stroke();
            }
        }
    });
    requestAnimationFrame(animate); // نعيد الرسم بالإطار التالي (حوالي 60 مرة بالثانية)
}

const hero = document.getElementById("top");
hero.addEventListener("mousemove", function(e) {
    const box = canvas.getBoundingClientRect();
    mouse.x = e.clientX - box.left;
    mouse.y = e.clientY - box.top; // مكان الماوس نسبةً للوحة
});
hero.addEventListener("mouseleave", function() {
    mouse.x = null;
    mouse.y = null;
});
window.addEventListener("resize", resize); // إذا تغير حجم الشاشة نعيد التوزيع

if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) { // ما نشغل الحركة لمن يفضّلها مطفية
    resize();
    animate();
}