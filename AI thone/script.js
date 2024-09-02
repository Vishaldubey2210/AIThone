const express = require('express');
const path = require('path');
document.addEventListener('DOMContentLoaded', function() {
    const themeToggleButton = document.getElementById('theme-toggle');
    const body = document.body;
    const cryptoPricesDiv = document.getElementById('crypto-prices');
    const loadingScreen = document.getElementById('loading');
    const seeMoreButton = document.getElementById('see-more');
    const cryptoNewsDiv = document.getElementById('crypto-news');
    const quizSection = document.getElementById('quiz-section');
    const quizQuestion = document.getElementById('quiz-question');
    const quizOptions = document.getElementById('quiz-options');
    const nextQuestionButton = document.getElementById('next-question');
    const quizScore = document.getElementById('quiz-score');
    let allCryptoData = [];
    let displayedCount = 8;

    // Toggle dark mode
    themeToggleButton.addEventListener('click', function() {
        body.classList.toggle('dark-mode');
    });


    
    const app = express();
    const PORT = 3000;
    
    // Serve static files from the 'public' directory
    app.use(express.static(path.join(__dirname, 'public')));
    
    // Handle the root route
    app.get('/', (req, res) => {
        res.sendFile(path.join(__dirname, 'public', 'index.html'));
    });
    
    // Start the server
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
    


    // Fetch cryptocurrency prices
    function fetchCryptoPrices() {
        fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd')
            .then(response => response.json())
            .then(data => {
                allCryptoData = data;
                displayCryptoPrices(displayedCount);
                loadingScreen.style.display = 'none';
            })
            .catch(error => {
                console.error('Error fetching prices:', error);
                cryptoPricesDiv.innerHTML = `<p>Error fetching prices</p>`;
                loadingScreen.style.display = 'none';
            });
    }

    // Display cryptocurrency prices
    function displayCryptoPrices(count) {
        let content = '';
        allCryptoData.slice(0, count).forEach(crypto => {
            content += `
                <div class="crypto-card">
                    <img src="${crypto.image}" alt="${crypto.name} logo">
                    <h3>${crypto.name}</h3>
                    <p>$${crypto.current_price.toFixed(2)}</p>
                </div>
            `;
        });
        cryptoPricesDiv.innerHTML = content;

        if (count >= allCryptoData.length) {
            seeMoreButton.style.display = 'none';
        } else {
            seeMoreButton.style.display = 'block';
        }
    }

    // See more button functionality
    seeMoreButton.addEventListener('click', function() {
        displayedCount += 8;
        displayCryptoPrices(displayedCount);
    });

    // Fetch cryptocurrency news
    function fetchCryptoNews() {
        const apiKey = '1d9880ae8dc94f358a9c50279fa701c0';
        const url = `https://newsapi.org/v2/everything?q=cryptocurrency&sortBy=publishedAt&apiKey=${apiKey}`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data.articles) {
                    displayCryptoNews(data.articles);
                } else {
                    console.error('No articles found');
                    cryptoNewsDiv.innerHTML = `<p>No news available</p>`;
                }
                loadingScreen.style.display = 'none';
            })
            .catch(error => {
                console.error('Error fetching news:', error);
                cryptoNewsDiv.innerHTML = `<p>Error fetching news</p>`;
                loadingScreen.style.display = 'none';
            });
    }

    // Display cryptocurrency news
    function displayCryptoNews(articles) {
        let content = '';
        articles.forEach(article => {
            content += `
                <div class="news-item">
                    <h3><a href="${article.url}" target="_blank">${article.title}</a></h3>
                    <p>${article.description || 'No description available'}</p>
                </div>
            `;
        });
        cryptoNewsDiv.innerHTML = content;
    }

    // Quiz data
    const quizData = [
        {
            question: "What year was Bitcoin created?",
            options: ["2005", "2009", "2012", "2015"],
            correct: "2009"
        },
        {
            question: "Who is known as the creator of Bitcoin?",
            options: ["Vitalik Buterin", "Satoshi Nakamoto", "Charlie Lee", "Elon Musk"],
            correct: "Satoshi Nakamoto"
        },
        {
            question: "What is the maximum supply of Bitcoin?",
            options: ["10 million", "21 million", "100 million", "Unlimited"],
            correct: "21 million"
        },
        // Add more questions as needed
    ];

    let currentQuestionIndex = 0;
    let score = 0;

    // Load quiz
    function loadQuiz() {
        displayQuestion();
        nextQuestionButton.style.display = 'none';
    }

    // Display quiz question
    function displayQuestion() {
        const currentQuestion = quizData[currentQuestionIndex];
        quizQuestion.textContent = currentQuestion.question;
        quizOptions.innerHTML = '';
        currentQuestion.options.forEach(option => {
            const button = document.createElement('button');
            button.textContent = option;
            button.addEventListener('click', () => checkAnswer(button, currentQuestion.correct));
            quizOptions.appendChild(button);
        });
    }

    // Check answer and update score
    function checkAnswer(button, correctAnswer) {
        const buttons = quizOptions.querySelectorAll('button');
        buttons.forEach(btn => btn.disabled = true);
        if (button.textContent === correctAnswer) {
            button.classList.add('correct');
            score++;
        } else {
            button.classList.add('wrong');
            buttons.forEach(btn => {
                if (btn.textContent === correctAnswer) {
                    btn.classList.add('correct');
                }
            });
        }
        quizScore.textContent = `Score: ${score}`;
        nextQuestionButton.style.display = 'block';
    }

    // Load next question
    nextQuestionButton.addEventListener('click', () => {
        currentQuestionIndex++;
        if (currentQuestionIndex < quizData.length) {
            displayQuestion();
            nextQuestionButton.style.display = 'none';
        } else {
            quizQuestion.textContent = 'Quiz finished!';
            quizOptions.innerHTML = '';
            nextQuestionButton.style.display = 'none';
        }
    });

    // Initial function calls
    fetchCryptoPrices();
    fetchCryptoNews();
    loadQuiz();
});
new TradingView.widget({
    "container_id": "bitcoin-graph",
    "autosize": true,
    "symbol": "BINANCE:BTCUSDT",
    "interval": "D",
    "timezone": "Etc/UTC",
    "theme": "light",
    "style": "1",
    "locale": "en",
    "toolbar_bg": "#f1f3f6",
    "enable_publishing": false,
    "allow_symbol_change": true,
    "save_image": false,
    "studies": ["RSI@tv-basicstudies"],
    "show_popup_button": true,
    "popup_width": "1000",
    "popup_height": "650"
  });

