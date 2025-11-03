// Course filtering functionality
const searchInput = document.getElementById('search');
const filterSelect = document.getElementById('filter');
const courseCards = document.querySelectorAll('.course-card');

function filterCourses() {
    const searchTerm = searchInput.value.toLowerCase();
    const filterValue = filterSelect.value;
    
    document.querySelectorAll('.course-link').forEach(courseLink => {
        const course = courseLink.querySelector('.course-card');
        const title = course.querySelector('h3').textContent.toLowerCase();
        const description = course.querySelector('.course-description') ? 
                           course.querySelector('.course-description').textContent.toLowerCase() : '';
        const category = course.dataset.category || 'all';
        
        const matchesSearch = title.includes(searchTerm) || description.includes(searchTerm);
        const matchesFilter = filterValue === 'all' || category === filterValue;
        
        courseLink.style.display = matchesSearch && matchesFilter ? 'block' : 'none';
    });
}

searchInput.addEventListener('input', filterCourses);
filterSelect.addEventListener('change', filterCourses);

// Progress bar for scroll position
window.onscroll = function() {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    document.getElementById("myBar").style.width = scrolled + "%";
};

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Dynamic date update in footer
const footer = document.querySelector('footer');
const currentYear = new Date().getFullYear();
footer.innerHTML = '&copy; ' + currentYear + ' Billiard Training Academy. All rights reserved.';

// Fade-in animations on scroll using Intersection Observer
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
        }
    });
}, observerOptions);

// Observe course cards, why-us items, testimonials, and faq items
document.querySelectorAll('.course-card, .why-item, .testimonial, .faq-item').forEach(el => {
    observer.observe(el);
});

// Hamburger menu toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// Header background on scroll
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    if (window.scrollY > 100) {
        header.style.backgroundColor = 'rgba(0, 123, 255, 0.95)';
    } else {
        header.style.backgroundColor = 'rgba(51, 51, 51, 0.9)';
    }
});

// Additional search and filter functionality
const aiMode = document.getElementById('aiMode');
const micBtn = document.getElementById('micBtn');
const cameraBtn = document.getElementById('cameraBtn');
const imageInput = document.getElementById('imageInput');
const coursesGrid = document.querySelector('.courses-grid');

function filterCourses() {
    const searchTerm = searchInput.value.toLowerCase();
    const filterValue = filterSelect.value;
    const isAIMode = aiMode.checked;

    if (isAIMode) {
        // Hide all cards and show AI response
        courseCards.forEach(card => card.style.display = 'none');
        // Show AI response in a new div
        let aiResponseDiv = document.getElementById('aiResponse');
        if (!aiResponseDiv) {
            aiResponseDiv = document.createElement('div');
            aiResponseDiv.id = 'aiResponse';
            aiResponseDiv.classList.add('ai-response');
            coursesGrid.appendChild(aiResponseDiv);
        }
        aiResponseDiv.innerHTML = getAIResponse(searchTerm);
        aiResponseDiv.style.display = 'block';
    } else {
        // Normal filter
        courseCards.forEach(card => {
            const title = card.querySelector('h3').textContent.toLowerCase();
            const matchesSearch = title.includes(searchTerm);
            const matchesFilter = filterValue === 'all' || title.includes(filterValue);

            if (matchesSearch && matchesFilter) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
        // Hide AI response
        const aiResponseDiv = document.getElementById('aiResponse');
        if (aiResponseDiv) aiResponseDiv.style.display = 'none';
    }
}

searchInput.addEventListener('input', filterCourses);
filterSelect.addEventListener('change', filterCourses);
aiMode.addEventListener('change', filterCourses);

// Voice Search
micBtn.addEventListener('click', () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        recognition.lang = 'en-US';
        recognition.start();
        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            searchInput.value = transcript;
            filterCourses();
        };
        recognition.onerror = (event) => {
            alert('Voice recognition error: ' + event.error);
        };
    } else {
        alert('Speech recognition not supported in this browser.');
    }
});

// Image Upload
cameraBtn.addEventListener('click', () => {
    imageInput.click();
});

imageInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        // Mock image analysis
        alert('Image uploaded: ' + file.name + '. Analyzing... This appears to be a health-related image. For more details, ask in AI mode!');
        // In real, send to API, but here mock.
    }
});

function getAIResponse(query) {
    if (query.includes('health')) {
        return 'Health is crucial for well-being. We offer courses on nursing, wellness, and more. For personalized advice, consult a professional.';
    } else if (query.includes('ai')) {
        return 'AI is transforming education! We have a course on leveraging AI for assignments.';
    } else if (query.includes('weather')) {
        return 'I\'m an AI for education, but the weather is nice today!';
    } else {
        return 'As an AI, I can answer questions on health, education, and more. What would you like to know?';
    }
}

// Toggle chatbot
const chatToggle = document.getElementById("chatToggle");
const chatbot = document.getElementById("chatbot");
const sendBtn = document.getElementById("sendBtn");
const userInput = document.getElementById("userInput");
const chatBody = document.getElementById("chatBody");

chatToggle.addEventListener("click", () => {
  chatbot.style.display = chatbot.style.display === "flex" ? "none" : "flex";
});

sendBtn.addEventListener("click", sendMessage);
userInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendMessage();
});

function sendMessage() {
  const text = userInput.value.trim();
  if (text === "") return;

  // Display user message
  const userMsg = document.createElement("div");
  userMsg.classList.add("user-message");
  userMsg.textContent = text;
  chatBody.appendChild(userMsg);

  // Bot reply
  const reply = getBotReply(text);
  const botMsg = document.createElement("div");
  botMsg.classList.add("bot-message");
  botMsg.textContent = reply;
  chatBody.appendChild(botMsg);

  // Scroll to bottom
  chatBody.scrollTop = chatBody.scrollHeight;
  userInput.value = "";
}

function getBotReply(input) {
  input = input.toLowerCase();

  // Course-related questions
  if (input.includes("course") || input.includes("learn") || input.includes("study")) {
    return "We offer 40+ professional health courses! 🏥\n\n📚 Categories:\n• Health (Nursing, First Aid, Nutrition)\n• Management (HR, Project Management)\n• Counselling (Mental Health, Child Counselling)\n• Other (Communication, AI, Sociology)\n\n💡 Popular courses:\n• Certificate in Home Health Nursing\n• Certified Mental Health Coach\n• Certificate in First Aid\n• Certificate in Health Administration\n\nClick any course to enroll on Udemy!";
  }

  // Payment and pricing questions
  if (input.includes("pay") || input.includes("installment") || input.includes("price") || input.includes("cost") || input.includes("k350")) {
    return "💰 Payment Options:\n\n✅ Monthly installments: K350/month\n✅ Lifetime access to all courses\n✅ Self-paced learning\n✅ No hidden fees\n\n💬 Contact us on WhatsApp: +260977836676 for payment arrangements!";
  }

  // Contact information
  if (input.includes("contact") || input.includes("whatsapp") || input.includes("phone") || input.includes("reach")) {
    return "📞 Contact Information:\n\n💬 WhatsApp: +260977836676\n📧 Email: info@billiardacademy.com\n📍 Location: Lusaka, Zambia\n\nWe're here to help with enrollment, payments, and course support!";
  }

  // Certificate questions
  if (input.includes("certificate") || input.includes("certification") || input.includes("diploma")) {
    return "🎓 Certificates:\n\n✅ All courses include recognized certificates\n✅ Professional certification upon completion\n✅ Lifetime access to course materials\n✅ Can be added to your resume/CV\n\nOur certificates are valuable for career advancement in healthcare!";
  }

  // Course duration and timing
  if (input.includes("time") || input.includes("duration") || input.includes("how long") || input.includes("schedule")) {
    return "⏰ Learning Schedule:\n\n✅ Self-paced learning\n✅ Learn at your own speed\n✅ Lifetime access to materials\n✅ Study from anywhere\n✅ No deadlines or pressure\n\nPerfect for working professionals!";
  }

  // Specific course categories
  if (input.includes("nursing") || input.includes("health care")) {
    return "🏥 Health & Nursing Courses:\n\n• Certificate in Home Health Nursing\n• Certificate in Pain Management Nursing\n• Certificate in Basic Life Support\n• Certificate in First Aid\n• Certificate in Infection Prevention\n• Certificate in Public Health\n\nAll courses include practical skills and professional certification!";
  }

  if (input.includes("mental health") || input.includes("counselling") || input.includes("psychology")) {
    return "🧠 Mental Health & Counselling:\n\n• Certified Mental Health Coach\n• Certificate in Psychosocial Counselling\n• Certificate in Child Counselling\n• Certificate in Guidance and Counselling\n• Certificate in Mental Health\n• Certificate in Psychology\n\nEssential skills for mental health professionals!";
  }

  if (input.includes("management") || input.includes("admin") || input.includes("leadership")) {
    return "💼 Management & Administration:\n\n• Certificate in Health Administration\n• Certificate in Project Management\n• Certificate in Human Resources\n• Certificate in Risk Management\n• Certificate in Medical Records Management\n• Certificate in Quality Assurance\n\nDevelop leadership skills for healthcare settings!";
  }

  // Academy information
  if (input.includes("academy") || input.includes("about") || input.includes("who") || input.includes("what")) {
    return "🏫 About Billiard Training Academy:\n\n✅ Registered academy\n✅ 10,000+ students enrolled\n✅ Affordable health education\n✅ Professional instructors\n✅ Lifetime course access\n✅ Flexible payment options\n\nWe make quality healthcare education accessible to everyone!";
  }

  // Enrollment process
  if (input.includes("enroll") || input.includes("join") || input.includes("start") || input.includes("register")) {
    return "📝 How to Enroll:\n\n1️⃣ Browse our 40+ courses\n2️⃣ Click on any course link\n3️⃣ Follow Udemy enrollment process\n4️⃣ Start learning immediately!\n\n💬 Need help? WhatsApp us: +260977836676";
  }

  // Benefits and features
  if (input.includes("benefit") || input.includes("why") || input.includes("advantage") || input.includes("feature")) {
    return "🌟 Why Choose Us:\n\n✅ Learn at your own pace\n✅ Lifetime access to materials\n✅ Affordable pricing (K350/month)\n✅ Professional certificates\n✅ Registered academy\n✅ Flexible payments\n✅ 40+ health courses\n✅ Expert instructors\n\nJoin 10,000+ successful students!";
  }

  // Technical support
  if (input.includes("help") || input.includes("support") || input.includes("problem") || input.includes("issue")) {
    return "🆘 Need Help?\n\n💬 WhatsApp: +260977836676\n📧 Email: info@billiardacademy.com\n\nWe're here to help with:\n• Course enrollment\n• Payment questions\n• Technical support\n• Certificate inquiries\n• General guidance";
  }

  // AI and technology courses
  if (input.includes("ai") || input.includes("chatgpt") || input.includes("technology") || input.includes("digital")) {
    return "🤖 AI & Technology Courses:\n\n• Leveraging AI: How to use ChatGPT for assignments\n• Mastering Communication Skills\n• Certificate in Sociology\n• Certificate in Psychology\n\nStay updated with modern technology and digital skills!";
  }

  // Nutrition and wellness
  if (input.includes("nutrition") || input.includes("food") || input.includes("wellness") || input.includes("diet")) {
    return "🥗 Nutrition & Wellness:\n\n• Certificate in Food and Nutrition\n• Certificate in Food Safety and Hygiene\n• Certified Health and Wellness Coach\n• Certificate in Health Promotion\n\nLearn essential nutrition and wellness skills!";
  }

  // Specific course recommendations
  if (input.includes("recommend") || input.includes("suggest") || input.includes("best")) {
    return "💡 Course Recommendations:\n\n🏥 For Healthcare Workers:\n• Certificate in Home Health Nursing\n• Certificate in Basic Life Support\n• Certificate in First Aid\n\n🧠 For Mental Health:\n• Certified Mental Health Coach\n• Certificate in Psychosocial Counselling\n\n💼 For Management:\n• Certificate in Health Administration\n• Certificate in Project Management\n\n💬 WhatsApp us for personalized recommendations: +260977836676";
  }

  // Career advancement
  if (input.includes("career") || input.includes("job") || input.includes("employment") || input.includes("work")) {
    return "🚀 Career Advancement:\n\n✅ Professional certificates for resume\n✅ Skills for healthcare jobs\n✅ Management and leadership training\n✅ Mental health specialization\n✅ Project management skills\n\nOur courses help you advance in healthcare careers! 💼";
  }

  // Student success stories
  if (input.includes("success") || input.includes("story") || input.includes("student") || input.includes("graduate")) {
    return "🌟 Student Success Stories:\n\n✅ \"I got a job at XYZ Clinic after completing the Health and Wellness course\" - Mary N.\n✅ \"The courses are self-paced and affordable. Highly recommend!\" - John D.\n✅ \"Lifetime access is a game-changer. I can revisit anytime.\" - Sarah K.\n\nJoin 10,000+ successful students! 🎓";
  }

  // Course features
  if (input.includes("feature") || input.includes("include") || input.includes("content") || input.includes("material")) {
    return "📚 Course Features:\n\n✅ Lifetime access to materials\n✅ Self-paced learning\n✅ Professional certificates\n✅ Video lessons\n✅ Practical exercises\n✅ Expert instructors\n✅ Mobile-friendly\n✅ Downloadable resources\n\nLearn anywhere, anytime! 📱";
  }

  // Pricing details
  if (input.includes("expensive") || input.includes("cheap") || input.includes("affordable") || input.includes("budget")) {
    return "💰 Affordable Education:\n\n✅ Monthly installments: K350\n✅ No hidden fees\n✅ Lifetime access\n✅ Professional certificates\n✅ 40+ courses available\n\nWe believe education should be accessible to everyone! 🌍";
  }

  // Default response
  return "👋 Hi! I'm SAMMY, your health education assistant! 🤖\n\nI can help you with:\n• Course information (40+ health courses)\n• Payment options (K350/month installments)\n• Enrollment process\n• Certificate details\n• Contact information\n• Academy benefits\n\nWhat would you like to know? 😊";
}
