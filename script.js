/**
 * BitHead - Next-Generation Cryptocurrency Intelligence Dashboard
 * Pure Client-Side JavaScript Architecture
 */

document.addEventListener('DOMContentLoaded', () => {
    // ================= State Management =================
    const AppState = {
        currency: localStorage.getItem('bithead_currency') || 'usd',
        currencySymbols: { usd: '$', inr: '₹', eur: '€', gbp: '£', jpy: '¥', btc: '₿' },
        currencyRates: { usd: 1, inr: 83.5, eur: 0.92, gbp: 0.79, jpy: 154.2, btc: 0.0000155 },
        cryptos: [],
        filteredCryptos: [],
        displayedCount: 20,
        activeCategory: 'all',
        activeView: 'table',
        sortField: 'rank',
        sortDirection: 'asc',
        watchlist: JSON.parse(localStorage.getItem('bithead_watchlist') || '["bitcoin", "ethereum", "solana"]'),
        portfolio: JSON.parse(localStorage.getItem('bithead_portfolio') || '[]'),
        theme: localStorage.getItem('bithead_theme') || 'dark',
        tvWidget: null,
        tvSymbol: 'BINANCE:BTCUSDT',
        tvInterval: 'D',
        portfolioChart: null,
        detailChart: null,
        quiz: {
            currentIdx: 0,
            score: 0,
            streak: 0,
            timer: 20,
            timerInterval: null,
            questions: []
        }
    };

    // ================= Curated High-Quality Fallback Database =================
    const FallbackCryptos = [
        { id: 'bitcoin', symbol: 'btc', name: 'Bitcoin', current_price: 64520.00, price_change_percentage_24h: 3.42, price_change_percentage_7d_in_currency: 8.21, price_change_percentage_1h_in_currency: 0.45, market_cap: 1270500000000, total_volume: 38200000000, high_24h: 65100.00, low_24h: 62400.00, circulating_supply: 19700000, ath: 73750.07, category: 'layer1', image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png' },
        { id: 'ethereum', symbol: 'eth', name: 'Ethereum', current_price: 3480.50, price_change_percentage_24h: 4.15, price_change_percentage_7d_in_currency: 6.80, price_change_percentage_1h_in_currency: -0.12, market_cap: 418000000000, total_volume: 21400000000, high_24h: 3550.00, low_24h: 3340.00, circulating_supply: 120100000, ath: 4891.70, category: 'layer1', image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png' },
        { id: 'binancecoin', symbol: 'bnb', name: 'BNB', current_price: 590.20, price_change_percentage_24h: 1.85, price_change_percentage_7d_in_currency: 3.40, price_change_percentage_1h_in_currency: 0.18, market_cap: 87500000000, total_volume: 1200000000, high_24h: 598.00, low_24h: 580.00, circulating_supply: 147500000, ath: 720.67, category: 'layer1', image: 'https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png' },
        { id: 'solana', symbol: 'sol', name: 'Solana', current_price: 154.80, price_change_percentage_24h: 7.64, price_change_percentage_7d_in_currency: 14.25, price_change_percentage_1h_in_currency: 1.05, market_cap: 72400000000, total_volume: 4800000000, high_24h: 158.00, low_24h: 142.50, circulating_supply: 467000000, ath: 260.06, category: 'layer1', image: 'https://assets.coingecko.com/coins/images/4128/large/solana.png' },
        { id: 'ripple', symbol: 'xrp', name: 'XRP', current_price: 0.584, price_change_percentage_24h: -0.92, price_change_percentage_7d_in_currency: 2.10, price_change_percentage_1h_in_currency: -0.05, market_cap: 32800000000, total_volume: 1400000000, high_24h: 0.602, low_24h: 0.578, circulating_supply: 56200000000, ath: 3.84, category: 'layer1', image: 'https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png' },
        { id: 'cardano', symbol: 'ada', name: 'Cardano', current_price: 0.365, price_change_percentage_24h: 2.15, price_change_percentage_7d_in_currency: -1.20, price_change_percentage_1h_in_currency: 0.22, market_cap: 13100000000, total_volume: 380000000, high_24h: 0.375, low_24h: 0.354, circulating_supply: 35600000000, ath: 3.10, category: 'layer1', image: 'https://assets.coingecko.com/coins/images/975/large/cardano.png' },
        { id: 'dogecoin', symbol: 'doge', name: 'Dogecoin', current_price: 0.112, price_change_percentage_24h: 5.40, price_change_percentage_7d_in_currency: 9.80, price_change_percentage_1h_in_currency: 0.85, market_cap: 16400000000, total_volume: 980000000, high_24h: 0.118, low_24h: 0.104, circulating_supply: 146000000000, ath: 0.737, category: 'meme', image: 'https://assets.coingecko.com/coins/images/5/large/dogecoin.png' },
        { id: 'avalanche-2', symbol: 'avax', name: 'Avalanche', current_price: 26.40, price_change_percentage_24h: 4.80, price_change_percentage_7d_in_currency: 11.20, price_change_percentage_1h_in_currency: 0.30, market_cap: 10800000000, total_volume: 420000000, high_24h: 27.10, low_24h: 24.80, circulating_supply: 405000000, ath: 146.22, category: 'layer1', image: 'https://assets.coingecko.com/coins/images/12559/large/Avalanche_Circle_RedWhite_Trans.png' },
        { id: 'shiba-inu', symbol: 'shib', name: 'Shiba Inu', current_price: 0.0000142, price_change_percentage_24h: 3.10, price_change_percentage_7d_in_currency: 5.40, price_change_percentage_1h_in_currency: 0.10, market_cap: 8350000000, total_volume: 310000000, high_24h: 0.0000148, low_24h: 0.0000137, circulating_supply: 589000000000000, ath: 0.00008845, category: 'meme', image: 'https://assets.coingecko.com/coins/images/11939/large/shiba.png' },
        { id: 'chainlink', symbol: 'link', name: 'Chainlink', current_price: 11.85, price_change_percentage_24h: 6.20, price_change_percentage_7d_in_currency: 8.90, price_change_percentage_1h_in_currency: 0.60, market_cap: 7100000000, total_volume: 290000000, high_24h: 12.20, low_24h: 11.10, circulating_supply: 608000000, ath: 52.88, category: 'defi', image: 'https://assets.coingecko.com/coins/images/877/large/chainlink-new-logo.png' },
        { id: 'near', symbol: 'near', name: 'NEAR Protocol', current_price: 4.85, price_change_percentage_24h: 8.95, price_change_percentage_7d_in_currency: 16.40, price_change_percentage_1h_in_currency: 1.20, market_cap: 5800000000, total_volume: 480000000, high_24h: 5.05, low_24h: 4.40, circulating_supply: 1190000000, ath: 20.42, category: 'ai', image: 'https://assets.coingecko.com/coins/images/10365/large/near.png' },
        { id: 'pepe', symbol: 'pepe', name: 'Pepe', current_price: 0.0000081, price_change_percentage_24h: 12.45, price_change_percentage_7d_in_currency: 28.60, price_change_percentage_1h_in_currency: 1.80, market_cap: 3400000000, total_volume: 920000000, high_24h: 0.0000085, low_24h: 0.0000071, circulating_supply: 420690000000000, ath: 0.00001718, category: 'meme', image: 'https://assets.coingecko.com/coins/images/29850/large/pepe-token.png' },
        { id: 'uniswap', symbol: 'uni', name: 'Uniswap', current_price: 7.20, price_change_percentage_24h: 3.80, price_change_percentage_7d_in_currency: 4.50, price_change_percentage_1h_in_currency: 0.15, market_cap: 4300000000, total_volume: 180000000, high_24h: 7.45, low_24h: 6.90, circulating_supply: 600000000, ath: 44.97, category: 'defi', image: 'https://assets.coingecko.com/coins/images/12504/large/uniswap-uni.png' },
        { id: 'render-token', symbol: 'rndr', name: 'Render', current_price: 6.45, price_change_percentage_24h: 9.20, price_change_percentage_7d_in_currency: 18.10, price_change_percentage_1h_in_currency: 1.40, market_cap: 2500000000, total_volume: 240000000, high_24h: 6.70, low_24h: 5.85, circulating_supply: 388000000, ath: 13.60, category: 'ai', image: 'https://assets.coingecko.com/coins/images/11636/large/rndr.png' },
        { id: 'bittensor', symbol: 'tao', name: 'Bittensor', current_price: 340.00, price_change_percentage_24h: 14.80, price_change_percentage_7d_in_currency: 32.50, price_change_percentage_1h_in_currency: 2.10, market_cap: 2480000000, total_volume: 190000000, high_24h: 355.00, low_24h: 295.00, circulating_supply: 7300000, ath: 774.86, category: 'ai', image: 'https://assets.coingecko.com/coins/images/30349/large/Bittensor_Token.png' },
        { id: 'polygon-ecosystem-token', symbol: 'pol', name: 'Polygon', current_price: 0.41, price_change_percentage_24h: 1.20, price_change_percentage_7d_in_currency: -2.10, price_change_percentage_1h_in_currency: 0.05, market_cap: 3200000000, total_volume: 130000000, high_24h: 0.425, low_24h: 0.398, circulating_supply: 7800000000, ath: 2.92, category: 'layer1', image: 'https://assets.coingecko.com/coins/images/4713/large/polygon.png' },
        { id: 'fetch-ai', symbol: 'fet', name: 'Artificial Superintelligence Alliance', current_price: 1.38, price_change_percentage_24h: 7.90, price_change_percentage_7d_in_currency: 15.20, price_change_percentage_1h_in_currency: 0.90, market_cap: 3450000000, total_volume: 310000000, high_24h: 1.45, low_24h: 1.27, circulating_supply: 2500000000, ath: 3.47, category: 'ai', image: 'https://assets.coingecko.com/coins/images/5681/large/Fetch.jpg' },
        { id: 'aave', symbol: 'aave', name: 'Aave', current_price: 142.50, price_change_percentage_24h: 6.40, price_change_percentage_7d_in_currency: 19.80, price_change_percentage_1h_in_currency: 0.70, market_cap: 2120000000, total_volume: 240000000, high_24h: 148.00, low_24h: 133.00, circulating_supply: 14900000, ath: 666.86, category: 'defi', image: 'https://assets.coingecko.com/coins/images/12645/large/AAVE.png' },
        { id: 'arbitrum', symbol: 'arb', name: 'Arbitrum', current_price: 0.54, price_change_percentage_24h: 2.80, price_change_percentage_7d_in_currency: 4.10, price_change_percentage_1h_in_currency: -0.10, market_cap: 1900000000, total_volume: 150000000, high_24h: 0.56, low_24h: 0.52, circulating_supply: 3500000000, ath: 2.40, category: 'layer1', image: 'https://assets.coingecko.com/coins/images/16547/large/photo_2023-03-29_21.47.00.jpeg' },
        { id: 'sui', symbol: 'sui', name: 'Sui', current_price: 1.05, price_change_percentage_24h: 11.20, price_change_percentage_7d_in_currency: 22.40, price_change_percentage_1h_in_currency: 1.30, market_cap: 2800000000, total_volume: 380000000, high_24h: 1.10, low_24h: 0.93, circulating_supply: 2670000000, ath: 2.18, category: 'layer1', image: 'https://assets.coingecko.com/coins/images/26375/large/sui-ocean-square.png' }
    ];

    // ================= Quiz Questions Database =================
    const QuizDatabase = [
        {
            category: "Bitcoin History",
            question: "In what year was the Bitcoin Genesis block mined by Satoshi Nakamoto?",
            options: ["2007", "2008", "2009", "2010"],
            correct: "2009",
            explanation: "The Bitcoin Genesis block (Block 0) was mined on January 3, 2009, embedding the headline from The Times about bank bailouts."
        },
        {
            category: "Consensus Mechanisms",
            question: "Which consensus mechanism does the Ethereum network currently utilize after 'The Merge'?",
            options: ["Proof of Work (PoW)", "Proof of Stake (PoS)", "Proof of History (PoH)", "Delegated Byzantine Fault Tolerance"],
            correct: "Proof of Stake (PoS)",
            explanation: "Ethereum transitioned from Proof of Work to Proof of Stake during 'The Merge' in September 2022, cutting energy consumption by 99.9%."
        },
        {
            category: "Tokenomics",
            question: "What is the absolute maximum finite supply of Bitcoin that will ever exist?",
            options: ["18.5 Million", "21 Million", "100 Million", "Infinite / Dynamic"],
            correct: "21 Million",
            explanation: "Bitcoin's supply is mathematically capped at 21,000,000 coins in its protocol, enforced by halving events every 210,000 blocks."
        },
        {
            category: "Smart Contracts",
            question: "What is the primary programming language used to develop smart contracts on the Ethereum Virtual Machine (EVM)?",
            options: ["Solidity", "Rust", "Python", "TypeScript"],
            correct: "Solidity",
            explanation: "Solidity is an object-oriented, high-level language specifically engineered for implementing smart contracts on EVM chains."
        },
        {
            category: "DeFi",
            question: "What does 'AMM' stand for in decentralized finance protocols like Uniswap?",
            options: ["Automated Money Movement", "Automated Market Maker", "Advanced Mining Mechanism", "Algorithmic Minting Module"],
            correct: "Automated Market Maker",
            explanation: "Automated Market Makers (AMMs) use mathematical liquidity pools (x*y=k) instead of traditional order books to price and trade assets."
        },
        {
            category: "Security & Custody",
            question: "What is the most critical component that grants full ownership and control over your on-chain crypto wallet?",
            options: ["Public Address", "Seed / Private Key", "Wallet App Password", "2FA Phone Number"],
            correct: "Seed / Private Key",
            explanation: "'Not your keys, not your crypto.' Private keys/seed phrases are the cryptographic proof required to sign transactions."
        },
        {
            category: "Layer-1 Blockchains",
            question: "Which high-throughput blockchain utilizes 'Proof of History' (PoH) to achieve sub-second block finality?",
            options: ["Cardano", "Solana", "Polkadot", "Monero"],
            correct: "Solana",
            explanation: "Solana combines Proof of Stake with Proof of History (a cryptographic clock) to process thousands of transactions per second."
        },
        {
            category: "DeFi Concepts",
            question: "What is 'Impermanent Loss' typically associated with in crypto?",
            options: ["Staking in validators", "Providing liquidity to an AMM pool", "Sending tokens to wrong chain", "Hardware wallet failure"],
            correct: "Providing liquidity to an AMM pool",
            explanation: "Impermanent loss occurs when the price ratio of pooled tokens shifts compared to simply holding them in a wallet."
        }
    ];

    // ================= Curated Crypto News Feed =================
    const FallbackNews = [
        {
            title: "Global Institutional Crypto Inflows Hit Record $2.2B Led by Bitcoin & Solana ETFs",
            source: "CoinDesk",
            time: "25 mins ago",
            sentiment: "BULLISH",
            sentimentClass: "bg-success-subtle",
            snippet: "Asset managers report massive weekly capital allocations into spot digital asset products amid growing macroeconomic adoption.",
            url: "https://www.coindesk.com",
            image: "https://images.unsplash.com/photo-1621416894569-0f39ed31d247?auto=format&fit=crop&w=600&q=80"
        },
        {
            title: "Ethereum Layer 2 TVL Crosses $45 Billion as Blob Transactions Slash Fees by 90%",
            source: "Decrypt",
            time: "1 hour ago",
            sentiment: "BULLISH",
            sentimentClass: "bg-success-subtle",
            snippet: "Arbitrum, Base, and Optimism see exponential smart contract activity following the Dencun upgrade and zero-knowledge rollup scaling.",
            url: "https://decrypt.co",
            image: "https://images.unsplash.com/photo-1622979135225-d2ba269bc1df?auto=format&fit=crop&w=600&q=80"
        },
        {
            title: "Decentralized AI Tokens Surge 25% Following Breakthrough On-Chain Agent Compute Standards",
            source: "CoinTelegraph",
            time: "3 hours ago",
            sentiment: "BULLISH",
            sentimentClass: "bg-success-subtle",
            snippet: "Bittensor, Near, and Fetch.ai lead market recovery as autonomous AI agents begin executing autonomous DeFi arbitrage.",
            url: "https://cointelegraph.com",
            image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80"
        },
        {
            title: "Federal Reserve Holds Interest Rates Steady, Markets React with Liquidity Expansion",
            source: "Bloomberg Crypto",
            time: "5 hours ago",
            sentiment: "NEUTRAL",
            sentimentClass: "bg-primary-subtle",
            snippet: "Crypto market volatility compresses as major financial markets price in upcoming rate cuts and balance sheet maneuvers.",
            url: "https://bloomberg.com/crypto",
            image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=600&q=80"
        }
    ];

    // ================= DOM Element References =================
    const DOM = {
        themeToggle: document.getElementById('theme-toggle'),
        themeIcon: document.getElementById('theme-icon'),
        currencySelect: document.getElementById('currency-select'),
        navTabs: document.querySelectorAll('.nav-tab'),
        tabPanes: document.querySelectorAll('.tab-pane'),
        categoryPills: document.getElementById('category-pills'),
        searchInput: document.getElementById('crypto-search-input'),
        clearSearch: document.getElementById('clear-search'),
        searchDropdown: document.getElementById('search-dropdown'),
        tableBody: document.getElementById('crypto-table-body'),
        cardsGrid: document.getElementById('crypto-cards-grid'),
        tableLoader: document.getElementById('table-loader'),
        seeMoreBtn: document.getElementById('see-more'),
        showingText: document.getElementById('showing-text'),
        refreshPricesBtn: document.getElementById('refresh-prices-btn'),
        viewTableBtn: document.getElementById('view-table-btn'),
        viewGridBtn: document.getElementById('view-grid-btn'),
        watchlistCount: document.getElementById('watchlist-count'),
        // Hero
        heroGainerName: document.getElementById('hero-gainer-name'),
        heroGainerPrice: document.getElementById('hero-gainer-price'),
        heroGainerChange: document.getElementById('hero-gainer-change'),
        heroGainerImg: document.getElementById('hero-gainer-img'),
        // TradingView
        tvSymbolSelect: document.getElementById('tv-symbol-select'),
        tvIntervalBtns: document.querySelectorAll('#tv-intervals .interval-btn'),
        tvFullscreenBtn: document.getElementById('tv-fullscreen-btn'),
        // Portfolio
        portBalance: document.getElementById('port-total-balance'),
        portPnl: document.getElementById('port-total-pnl'),
        portRoi: document.getElementById('port-total-roi'),
        portTableBody: document.getElementById('portfolio-table-body'),
        emptyPortState: document.getElementById('empty-portfolio-state'),
        openAddAssetBtn: document.getElementById('open-add-asset-modal'),
        demoPortfolioBtn: document.getElementById('demo-portfolio-btn'),
        exportPortfolioBtn: document.getElementById('export-portfolio-btn'),
        addAssetModal: document.getElementById('add-asset-modal'),
        closeAssetModal: document.getElementById('close-asset-modal'),
        modalCancelBtn: document.getElementById('modal-cancel-btn'),
        addAssetForm: document.getElementById('add-asset-form'),
        // Detail Modal
        coinDetailModal: document.getElementById('coin-detail-modal'),
        closeCoinDetail: document.getElementById('close-coin-detail'),
        detailTradeBtn: document.getElementById('detail-trade-btn'),
        detailStarBtn: document.getElementById('detail-star-btn'),
        // AI
        aiChatForm: document.getElementById('ai-chat-form'),
        aiUserInput: document.getElementById('ai-user-input'),
        aiMessages: document.getElementById('ai-messages-container'),
        aiChips: document.querySelectorAll('.ai-chip'),
        openAiBtn: document.getElementById('open-ai-btn'),
        // Converter & DCA
        convFromAmount: document.getElementById('conv-from-amount'),
        convToAmount: document.getElementById('conv-to-amount'),
        convFromCoin: document.getElementById('conv-from-coin'),
        convToCoin: document.getElementById('conv-to-coin'),
        swapConvBtn: document.getElementById('swap-conv-btn'),
        convRateDisplay: document.getElementById('conv-rate-display'),
        calcDcaBtn: document.getElementById('calc-dca-btn'),
        dcaAmount: document.getElementById('dca-amount'),
        dcaFreq: document.getElementById('dca-freq'),
        dcaMonths: document.getElementById('dca-months'),
        dcaTotalInv: document.getElementById('dca-total-inv'),
        dcaEstVal: document.getElementById('dca-est-val'),
        dcaEstPnl: document.getElementById('dca-est-pnl'),
        // News
        newsGrid: document.getElementById('crypto-news-grid'),
        newsLoader: document.getElementById('news-loader'),
        newsFilters: document.querySelectorAll('.filter-pill'),
        refreshNewsBtn: document.getElementById('refresh-news-btn'),
        // Quiz
        quizQuestionTitle: document.getElementById('quiz-question-title'),
        quizQuestionIndex: document.getElementById('quiz-question-index'),
        quizCategoryBadge: document.getElementById('quiz-category-badge'),
        quizOptionsGrid: document.getElementById('quiz-options-grid'),
        quizExplanation: document.getElementById('quiz-explanation'),
        quizTimer: document.getElementById('quiz-timer'),
        quizScoreNum: document.getElementById('quiz-score-num'),
        quizStreak: document.getElementById('quiz-streak'),
        quizProgressBar: document.getElementById('quiz-progress-bar'),
        quizNextBtn: document.getElementById('quiz-next-btn'),
        quizRestartBtn: document.getElementById('quiz-restart-btn'),
        quizResultOverlay: document.getElementById('quiz-result-overlay'),
        quizPlayAgainBtn: document.getElementById('quiz-play-again-btn'),
        finalScoreVal: document.getElementById('final-score-val'),
        toastContainer: document.getElementById('toast-container')
    };

    // ================= Initialization =================
    function init() {
        applyTheme(AppState.theme);
        DOM.currencySelect.value = AppState.currency;
        updateWatchlistBadge();
        fetchMarketData();
        initTradingView();
        initPortfolioDonut();
        renderPortfolio();
        initConverter();
        renderNews(FallbackNews);
        initQuiz();
        setupEventListeners();
        setupKeyboardShortcuts();
    }

    // ================= Toast Notification System =================
    function showToast(message, icon = 'fa-circle-info') {
        if (!DOM.toastContainer) return;
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = `<i class="fa-solid ${icon} text-primary"></i> <span>${message}</span>`;
        DOM.toastContainer.appendChild(toast);
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(100%)';
            toast.style.transition = 'all 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 3200);
    }

    // ================= Theme & Currency =================
    function applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        AppState.theme = theme;
        localStorage.setItem('bithead_theme', theme);
        if (DOM.themeIcon) {
            DOM.themeIcon.className = theme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
        }
        if (AppState.tvWidget) {
            initTradingView();
        }
    }

    function formatCurrency(amountUSD) {
        const rate = AppState.currencyRates[AppState.currency] || 1;
        const symbol = AppState.currencySymbols[AppState.currency] || '$';
        const converted = amountUSD * rate;

        if (AppState.currency === 'btc') {
            return `${symbol} ${converted.toFixed(6)}`;
        }
        if (converted >= 1e12) {
            return `${symbol}${(converted / 1e12).toFixed(2)}T`;
        }
        if (converted >= 1e9) {
            return `${symbol}${(converted / 1e9).toFixed(2)}B`;
        }
        if (converted >= 1e6) {
            return `${symbol}${(converted / 1e6).toFixed(2)}M`;
        }
        if (converted < 0.0001) {
            return `${symbol}${converted.toFixed(8)}`;
        }
        if (converted < 1) {
            return `${symbol}${converted.toFixed(4)}`;
        }
        return `${symbol}${converted.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }

    // ================= Data Fetching =================
    async function fetchMarketData() {
        DOM.tableLoader.style.display = 'flex';
        try {
            const res = await fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=true&price_change_percentage=1h,24h,7d`, { cache: 'no-cache' });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = await res.json();
            if (Array.isArray(data) && data.length > 0) {
                AppState.cryptos = data.map(item => ({
                    ...item,
                    category: determineCategory(item.id, item.symbol)
                }));
            } else {
                throw new Error('Empty payload');
            }
        } catch (err) {
            console.warn('Using enriched fallback dataset due to API restriction:', err);
            AppState.cryptos = JSON.parse(JSON.stringify(FallbackCryptos));
        } finally {
            DOM.tableLoader.style.display = 'none';
            applyFiltersAndSort();
            renderHeroMetrics();
            renderConverterOptions();
        }
    }

    function determineCategory(id, symbol) {
        const defi = ['chainlink', 'uniswap', 'aave', 'maker', 'compound-governance-token'];
        const meme = ['dogecoin', 'shiba-inu', 'pepe', 'bonk', 'floki'];
        const ai = ['near', 'render-token', 'bittensor', 'fetch-ai', 'ocean-protocol'];
        const idLower = (id || '').toLowerCase();
        if (defi.includes(idLower)) return 'defi';
        if (meme.includes(idLower)) return 'meme';
        if (ai.includes(idLower)) return 'ai';
        return 'layer1';
    }

    // ================= Hero Metrics =================
    function renderHeroMetrics() {
        if (!AppState.cryptos.length) return;
        const sortedGainers = [...AppState.cryptos].sort((a, b) => (b.price_change_percentage_24h || 0) - (a.price_change_percentage_24h || 0));
        const topGainer = sortedGainers[0];
        if (topGainer) {
            DOM.heroGainerName.textContent = topGainer.name;
            DOM.heroGainerPrice.textContent = formatCurrency(topGainer.current_price);
            DOM.heroGainerChange.textContent = `+${(topGainer.price_change_percentage_24h || 0).toFixed(2)}%`;
            DOM.heroGainerImg.src = topGainer.image;
        }
    }

    // ================= Filters & Sorting =================
    function applyFiltersAndSort() {
        let list = [...AppState.cryptos];

        // Filter Category
        if (AppState.activeCategory === 'top10') {
            list = list.slice(0, 10);
        } else if (AppState.activeCategory === 'gainers') {
            list = list.filter(c => (c.price_change_percentage_24h || 0) > 0).sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h);
        } else if (AppState.activeCategory === 'watchlist') {
            list = list.filter(c => AppState.watchlist.includes(c.id));
        } else if (AppState.activeCategory !== 'all') {
            list = list.filter(c => c.category === AppState.activeCategory);
        }

        // Search Query
        const query = (DOM.searchInput.value || '').trim().toLowerCase();
        if (query) {
            list = list.filter(c => c.name.toLowerCase().includes(query) || c.symbol.toLowerCase().includes(query));
        }

        // Sort Field
        list.sort((a, b) => {
            let valA = a[AppState.sortField];
            let valB = b[AppState.sortField];
            if (AppState.sortField === 'rank') {
                valA = a.market_cap_rank || AppState.cryptos.indexOf(a) + 1;
                valB = b.market_cap_rank || AppState.cryptos.indexOf(b) + 1;
            } else if (AppState.sortField === 'price') {
                valA = a.current_price;
                valB = b.current_price;
            } else if (AppState.sortField === 'change24h') {
                valA = a.price_change_percentage_24h || 0;
                valB = b.price_change_percentage_24h || 0;
            } else if (AppState.sortField === 'mcap') {
                valA = a.market_cap || 0;
                valB = b.market_cap || 0;
            }
            return AppState.sortDirection === 'asc' ? valA - valB : valB - valA;
        });

        AppState.filteredCryptos = list;
        renderMarketView();
    }

    // ================= Render Market View =================
    function renderMarketView() {
        const displayed = AppState.filteredCryptos.slice(0, AppState.displayedCount);
        DOM.showingText.textContent = `Showing ${displayed.length} of ${AppState.filteredCryptos.length} assets`;
        DOM.seeMoreBtn.style.display = displayed.length >= AppState.filteredCryptos.length ? 'none' : 'inline-flex';

        if (AppState.activeView === 'table') {
            DOM.tableBody.innerHTML = '';
            displayed.forEach((coin, idx) => {
                const tr = document.createElement('tr');
                const isStarred = AppState.watchlist.includes(coin.id);
                const change24h = coin.price_change_percentage_24h || 0;
                const change1h = coin.price_change_percentage_1h_in_currency || (change24h * 0.1);
                const change7d = coin.price_change_percentage_7d_in_currency || (change24h * 1.8);
                const isPos24 = change24h >= 0;
                const isPos1 = change1h >= 0;
                const isPos7 = change7d >= 0;

                tr.innerHTML = `
                    <td class="col-fav">
                        <button class="star-btn ${isStarred ? 'starred' : ''}" data-id="${coin.id}" title="Toggle Watchlist">
                            <i class="fa-${isStarred ? 'solid' : 'regular'} fa-star"></i>
                        </button>
                    </td>
                    <td class="col-rank">#${coin.market_cap_rank || idx + 1}</td>
                    <td class="col-name">
                        <div class="coin-cell" data-id="${coin.id}">
                            <img src="${coin.image}" alt="${coin.name}" loading="lazy">
                            <div class="coin-name-group">
                                <strong>${coin.name}</strong>
                                <span>${coin.symbol.toUpperCase()}</span>
                            </div>
                        </div>
                    </td>
                    <td class="col-price"><strong>${formatCurrency(coin.current_price)}</strong></td>
                    <td class="col-1h ${isPos1 ? 'text-success' : 'text-danger'}">${isPos1 ? '+' : ''}${change1h.toFixed(2)}%</td>
                    <td class="col-24h ${isPos24 ? 'text-success' : 'text-danger'}"><strong>${isPos24 ? '+' : ''}${change24h.toFixed(2)}%</strong></td>
                    <td class="col-7d ${isPos7 ? 'text-success' : 'text-danger'}">${isPos7 ? '+' : ''}${change7d.toFixed(2)}%</td>
                    <td class="col-volume">${formatCurrency(coin.total_volume)}</td>
                    <td class="col-mcap">${formatCurrency(coin.market_cap)}</td>
                    <td class="col-chart">
                        <canvas class="sparkline-canvas" id="spark-${coin.id}" width="110" height="34"></canvas>
                    </td>
                    <td class="col-action">
                        <button class="btn btn-outline btn-sm view-detail-btn" data-id="${coin.id}">
                            <i class="fa-solid fa-chart-simple"></i>
                        </button>
                    </td>
                `;
                DOM.tableBody.appendChild(tr);

                // Draw Sparkline
                setTimeout(() => drawMiniSparkline(`spark-${coin.id}`, change24h >= 0), 10);
            });
        } else {
            DOM.cardsGrid.innerHTML = '';
            displayed.forEach(coin => {
                const card = document.createElement('div');
                card.className = 'crypto-grid-card glass-card';
                const isStarred = AppState.watchlist.includes(coin.id);
                const change24h = coin.price_change_percentage_24h || 0;
                card.innerHTML = `
                    <div class="grid-card-header">
                        <div class="coin-cell" data-id="${coin.id}">
                            <img src="${coin.image}" alt="${coin.name}">
                            <div class="coin-name-group">
                                <strong>${coin.name}</strong>
                                <span>${coin.symbol.toUpperCase()}</span>
                            </div>
                        </div>
                        <button class="star-btn ${isStarred ? 'starred' : ''}" data-id="${coin.id}">
                            <i class="fa-${isStarred ? 'solid' : 'regular'} fa-star"></i>
                        </button>
                    </div>
                    <div class="grid-card-price">${formatCurrency(coin.current_price)}</div>
                    <div class="metric-header">
                        <span class="badge-pill ${change24h >= 0 ? 'bg-success-subtle' : 'bg-danger-subtle'}">
                            ${change24h >= 0 ? '+' : ''}${change24h.toFixed(2)}% 24h
                        </span>
                        <span class="text-dim" style="font-size: 11px;">Cap: ${formatCurrency(coin.market_cap)}</span>
                    </div>
                `;
                DOM.cardsGrid.appendChild(card);
            });
        }
    }

    function drawMiniSparkline(canvasId, isPositive) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;
        ctx.clearRect(0, 0, width, height);

        // Generate synthetic mock 7d curve based on price momentum
        const points = 12;
        const data = [];
        let base = 50;
        for (let i = 0; i < points; i++) {
            base += (Math.random() - (isPositive ? 0.4 : 0.6)) * 14;
            data.push(base);
        }

        const min = Math.min(...data);
        const max = Math.max(...data);
        const range = max - min || 1;

        ctx.beginPath();
        data.forEach((val, i) => {
            const x = (i / (points - 1)) * (width - 6) + 3;
            const y = height - 4 - ((val - min) / range) * (height - 8);
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        });

        ctx.strokeStyle = isPositive ? '#10b981' : '#ef4444';
        ctx.lineWidth = 2;
        ctx.lineJoin = 'round';
        ctx.stroke();
    }

    // ================= Watchlist Toggle =================
    function toggleWatchlist(coinId) {
        const index = AppState.watchlist.indexOf(coinId);
        if (index > -1) {
            AppState.watchlist.splice(index, 1);
            showToast(`Removed from Watchlist`, 'fa-star');
        } else {
            AppState.watchlist.push(coinId);
            showToast(`Added to Watchlist ★`, 'fa-star');
        }
        localStorage.setItem('bithead_watchlist', JSON.stringify(AppState.watchlist));
        updateWatchlistBadge();
        applyFiltersAndSort();
    }

    function updateWatchlistBadge() {
        if (DOM.watchlistCount) {
            DOM.watchlistCount.textContent = AppState.watchlist.length;
        }
    }

    // ================= TradingView Integration =================
    function initTradingView() {
        const container = document.getElementById('bitcoin-graph');
        if (!container || typeof TradingView === 'undefined') return;

        container.innerHTML = '';
        AppState.tvWidget = new TradingView.widget({
            container_id: "bitcoin-graph",
            autosize: true,
            symbol: AppState.tvSymbol,
            interval: AppState.tvInterval,
            timezone: "Etc/UTC",
            theme: AppState.theme === 'dark' ? 'dark' : 'light',
            style: "1",
            locale: "en",
            toolbar_bg: AppState.theme === 'dark' ? '#111827' : '#f8fafc',
            enable_publishing: false,
            allow_symbol_change: true,
            save_image: false,
            studies: ["RSI@tv-basicstudies", "MASimple@tv-basicstudies"],
            show_popup_button: true,
            popup_width: "1000",
            popup_height: "650"
        });
    }

    // ================= Coin Detail Modal =================
    function openCoinDetail(coinId) {
        const coin = AppState.cryptos.find(c => c.id === coinId);
        if (!coin) return;

        document.getElementById('detail-coin-name').textContent = coin.name;
        document.getElementById('detail-coin-symbol').textContent = coin.symbol.toUpperCase();
        document.getElementById('detail-coin-img').src = coin.image;
        document.getElementById('detail-coin-price').textContent = formatCurrency(coin.current_price);
        document.getElementById('detail-coin-rank').textContent = `#${coin.market_cap_rank || 1}`;

        const change24h = coin.price_change_percentage_24h || 0;
        const changeElem = document.getElementById('detail-coin-change');
        changeElem.textContent = `${change24h >= 0 ? '+' : ''}${change24h.toFixed(2)}%`;
        changeElem.className = `badge-pill ${change24h >= 0 ? 'bg-success-subtle' : 'bg-danger-subtle'}`;

        document.getElementById('detail-high24').textContent = formatCurrency(coin.high_24h || coin.current_price * 1.05);
        document.getElementById('detail-low24').textContent = formatCurrency(coin.low_24h || coin.current_price * 0.95);
        document.getElementById('detail-mcap').textContent = formatCurrency(coin.market_cap);
        document.getElementById('detail-vol').textContent = formatCurrency(coin.total_volume);
        document.getElementById('detail-supply').textContent = `${(coin.circulating_supply || 0).toLocaleString()} ${coin.symbol.toUpperCase()}`;
        document.getElementById('detail-ath').textContent = formatCurrency(coin.ath || coin.current_price * 1.8);

        const isStarred = AppState.watchlist.includes(coin.id);
        DOM.detailStarBtn.innerHTML = `<i class="fa-${isStarred ? 'solid' : 'regular'} fa-star"></i> ${isStarred ? 'In Watchlist' : 'Add to Watchlist'}`;
        DOM.detailStarBtn.onclick = () => {
            toggleWatchlist(coin.id);
            const nowStarred = AppState.watchlist.includes(coin.id);
            DOM.detailStarBtn.innerHTML = `<i class="fa-${nowStarred ? 'solid' : 'regular'} fa-star"></i> ${nowStarred ? 'In Watchlist' : 'Add to Watchlist'}`;
        };

        DOM.detailTradeBtn.onclick = () => {
            DOM.coinDetailModal.style.display = 'none';
            switchTab('analytics-view');
            const sym = `BINANCE:${coin.symbol.toUpperCase()}USDT`;
            AppState.tvSymbol = sym;
            DOM.tvSymbolSelect.value = sym;
            initTradingView();
        };

        DOM.coinDetailModal.style.display = 'flex';
    }

    // ================= Portfolio Management =================
    function initPortfolioDonut() {
        const canvas = document.getElementById('portfolio-donut-chart');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        AppState.portfolioChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['No Holdings'],
                datasets: [{
                    data: [1],
                    backgroundColor: ['rgba(255,255,255,0.1)'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                cutout: '70%'
            }
        });
    }

    function renderPortfolio() {
        if (!AppState.portfolio.length) {
            DOM.portTableBody.innerHTML = '';
            DOM.emptyPortState.style.display = 'block';
            DOM.portBalance.textContent = formatCurrency(0);
            DOM.portPnl.textContent = formatCurrency(0);
            DOM.portRoi.textContent = '+0.00% Overall ROI';
            return;
        }

        DOM.emptyPortState.style.display = 'none';
        DOM.portTableBody.innerHTML = '';

        let totalValUSD = 0;
        let totalCostUSD = 0;
        const chartLabels = [];
        const chartData = [];
        const chartColors = ['#6366f1', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#3b82f6'];

        AppState.portfolio.forEach((pos, idx) => {
            const coin = AppState.cryptos.find(c => c.id === pos.id) || { current_price: pos.buyPrice, name: pos.name, symbol: pos.symbol, image: '' };
            const curPrice = coin.current_price;
            const curValue = pos.quantity * curPrice;
            const costBasis = pos.quantity * pos.buyPrice;
            const pnl = curValue - costBasis;
            const pnlPercent = costBasis > 0 ? (pnl / costBasis) * 100 : 0;

            totalValUSD += curValue;
            totalCostUSD += costBasis;

            chartLabels.push(pos.name);
            chartData.push(curValue);

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>
                    <div class="coin-cell">
                        <img src="${coin.image}" alt="${pos.name}" style="width:24px;height:24px;">
                        <strong>${pos.name} (${pos.symbol.toUpperCase()})</strong>
                    </div>
                </td>
                <td>${pos.quantity} ${pos.symbol.toUpperCase()}</td>
                <td>${formatCurrency(pos.buyPrice)}</td>
                <td>${formatCurrency(curPrice)}</td>
                <td><strong>${formatCurrency(curValue)}</strong></td>
                <td class="${pnl >= 0 ? 'text-success' : 'text-danger'}">
                    <strong>${pnl >= 0 ? '+' : ''}${formatCurrency(pnl)}</strong> (${pnlPercent.toFixed(2)}%)
                </td>
                <td>
                    <button class="btn btn-outline btn-sm delete-pos-btn" data-index="${idx}" title="Delete Holding">
                        <i class="fa-solid fa-trash text-danger"></i>
                    </button>
                </td>
            `;
            DOM.portTableBody.appendChild(tr);
        });

        const totalPnl = totalValUSD - totalCostUSD;
        const totalRoi = totalCostUSD > 0 ? (totalPnl / totalCostUSD) * 100 : 0;

        DOM.portBalance.textContent = formatCurrency(totalValUSD);
        DOM.portPnl.textContent = `${totalPnl >= 0 ? '+' : ''}${formatCurrency(totalPnl)}`;
        DOM.portPnl.className = `stat-value ${totalPnl >= 0 ? 'text-success' : 'text-danger'}`;
        DOM.portRoi.textContent = `${totalRoi >= 0 ? '+' : ''}${totalRoi.toFixed(2)}% Overall ROI`;
        DOM.portRoi.className = `stat-sub ${totalRoi >= 0 ? 'text-success' : 'text-danger'}`;

        // Update Chart
        if (AppState.portfolioChart) {
            AppState.portfolioChart.data.labels = chartLabels;
            AppState.portfolioChart.data.datasets[0].data = chartData;
            AppState.portfolioChart.data.datasets[0].backgroundColor = chartColors.slice(0, chartLabels.length);
            AppState.portfolioChart.update();
        }
    }

    function addPortfolioTransaction(id, name, symbol, qty, buyPrice) {
        AppState.portfolio.push({ id, name, symbol, quantity: qty, buyPrice, date: new Date().toISOString() });
        localStorage.setItem('bithead_portfolio', JSON.stringify(AppState.portfolio));
        renderPortfolio();
        showToast(`Added ${qty} ${symbol.toUpperCase()} to portfolio!`, 'fa-wallet');
    }

    function deletePortfolioTransaction(index) {
        AppState.portfolio.splice(index, 1);
        localStorage.setItem('bithead_portfolio', JSON.stringify(AppState.portfolio));
        renderPortfolio();
        showToast('Holding removed', 'fa-trash');
    }

    // ================= BitHead AI Assistant =================
    const AIKnowledge = {
        sentiment: "The aggregate market sentiment is Bullish (Score: 78/100). Institutional accumulation in Bitcoin ETFs and rising active addresses on Ethereum/Solana indicate a constructive upward continuation.",
        dca: "Dollar-Cost Averaging (DCA) is a disciplined investment methodology where you invest a fixed fiat sum at recurring intervals (e.g. $100 every Monday) regardless of asset price. This dampens emotional trading and lowers your average entry cost during dips.",
        layer1: "The leading Layer-1 platforms in 2026 are: 1) Bitcoin (digital store of value & L2 settlements), 2) Ethereum (premier global settlement layer with highest TVL), 3) Solana (high-throughput low-latency execution layer leading consumer crypto).",
        pow_pos: "Proof of Work (PoW) uses physical electricity and computational hash rate to secure blocks (like Bitcoin). Proof of Stake (PoS) uses bonded cryptocurrency validators and cryptographic voting (like Ethereum), saving 99.9% energy.",
        ethereum_outlook: "Ethereum is displaying strong structural support above its 200-day EMA. Scaling via EIP-4844 blobs has boosted Layer-2 transactions while maintaining deflationary burn dynamics during peak blockspace demand."
    };

    function handleAiChat(prompt) {
        if (!prompt) return;
        appendAiMessage(prompt, 'user');
        DOM.aiUserInput.value = '';

        // Dynamic intelligence generation
        setTimeout(() => {
            const lower = prompt.toLowerCase();
            let reply = "";

            if (lower.includes('sentiment') || lower.includes('trend')) {
                reply = AIKnowledge.sentiment;
            } else if (lower.includes('dca') || lower.includes('dollar cost')) {
                reply = AIKnowledge.dca;
            } else if (lower.includes('layer-1') || lower.includes('layer 1') || lower.includes('solana')) {
                reply = AIKnowledge.layer1;
            } else if (lower.includes('pow') || lower.includes('pos') || lower.includes('proof')) {
                reply = AIKnowledge.pow_pos;
            } else if (lower.includes('ethereum') || lower.includes('eth')) {
                reply = AIKnowledge.ethereum_outlook;
            } else {
                reply = `Based on multi-exchange order flows and on-chain intelligence for "${prompt}":\n\n1. Liquidity depth remains healthy across major DEX and CEX pools.\n2. Volatility indicators suggest upcoming expansion.\n3. Recommendation: Practice proactive risk management with a minimum 2:1 Reward-to-Risk ratio and avoid over-leveraging.`;
            }

            appendAiMessage(reply, 'bot');
        }, 400);
    }

    function appendAiMessage(text, type) {
        const msg = document.createElement('div');
        msg.className = `ai-message ${type}-msg`;
        msg.innerHTML = `
            <div class="msg-avatar"><i class="fa-solid ${type === 'bot' ? 'fa-robot' : 'fa-user'}"></i></div>
            <div class="msg-content"><p>${text.replace(/\n/g, '<br>')}</p></div>
        `;
        DOM.aiMessages.appendChild(msg);
        DOM.aiMessages.scrollTop = DOM.aiMessages.scrollHeight;
    }

    // ================= Converter & DCA =================
    function initConverter() {
        renderConverterOptions();
        updateConversion();

        DOM.convFromAmount.addEventListener('input', updateConversion);
        DOM.convFromCoin.addEventListener('change', updateConversion);
        DOM.convToCoin.addEventListener('change', updateConversion);

        DOM.swapConvBtn.addEventListener('click', () => {
            const temp = DOM.convFromCoin.value;
            DOM.convFromCoin.value = DOM.convToCoin.value;
            DOM.convToCoin.value = temp;
            updateConversion();
        });

        DOM.calcDcaBtn.addEventListener('click', calculateDca);
    }

    function renderConverterOptions() {
        if (!AppState.cryptos.length) return;
        const optionsHTML = AppState.cryptos.slice(0, 30).map(c => `<option value="${c.id}">${c.name} (${c.symbol.toUpperCase()})</option>`).join('') + `
            <option value="usd">USD ($)</option>
            <option value="inr">INR (₹)</option>
            <option value="eur">EUR (€)</option>
        `;
        DOM.convFromCoin.innerHTML = optionsHTML;
        DOM.convToCoin.innerHTML = optionsHTML;
        DOM.convFromCoin.value = 'bitcoin';
        DOM.convToCoin.value = 'usd';
    }

    function getPriceInUSD(val) {
        if (val === 'usd') return 1;
        if (val === 'inr') return 1 / 83.5;
        if (val === 'eur') return 1 / 0.92;
        const coin = AppState.cryptos.find(c => c.id === val);
        return coin ? coin.current_price : 1;
    }

    function updateConversion() {
        const amount = parseFloat(DOM.convFromAmount.value) || 0;
        const fromPrice = getPriceInUSD(DOM.convFromCoin.value);
        const toPrice = getPriceInUSD(DOM.convToCoin.value);

        if (toPrice <= 0) return;
        const result = (amount * fromPrice) / toPrice;
        DOM.convToAmount.value = result < 0.0001 ? result.toFixed(8) : result.toLocaleString(undefined, { maximumFractionDigits: 4 });

        const fromLabel = DOM.convFromCoin.options[DOM.convFromCoin.selectedIndex]?.text || '';
        const toLabel = DOM.convToCoin.options[DOM.convToCoin.selectedIndex]?.text || '';
        DOM.convRateDisplay.textContent = `1 ${fromLabel.split(' ')[0]} ≈ ${(fromPrice / toPrice).toLocaleString()} ${toLabel.split(' ')[0]}`;
    }

    function calculateDca() {
        const amt = parseFloat(DOM.dcaAmount.value) || 100;
        const freq = DOM.dcaFreq.value;
        const months = parseInt(DOM.dcaMonths.value) || 12;

        let periods = months;
        if (freq === 'daily') periods = months * 30;
        if (freq === 'weekly') periods = months * 4.33;

        const totalInvested = amt * periods;
        // Simulated annual crypto growth rate average ~45%
        const estGrowthFactor = 1 + (0.45 * (months / 12));
        const estValue = totalInvested * estGrowthFactor;
        const pnl = estValue - totalInvested;
        const pnlPercent = (pnl / totalInvested) * 100;

        DOM.dcaTotalInv.textContent = `$${Math.round(totalInvested).toLocaleString()}`;
        DOM.dcaEstVal.textContent = `$${Math.round(estValue).toLocaleString()}`;
        DOM.dcaEstPnl.textContent = `+$${Math.round(pnl).toLocaleString()} (+${pnlPercent.toFixed(1)}%)`;
        showToast('DCA Calculation Updated', 'fa-calculator');
    }

    // ================= Live News =================
    function renderNews(newsList) {
        DOM.newsGrid.innerHTML = '';
        DOM.newsLoader.style.display = 'none';

        newsList.forEach(item => {
            const card = document.createElement('div');
            card.className = 'news-card';
            card.innerHTML = `
                <div class="news-img-wrap">
                    <img src="${item.image}" alt="News" class="news-img" loading="lazy">
                    <span class="news-sentiment-badge ${item.sentimentClass}">${item.sentiment}</span>
                </div>
                <div class="news-body">
                    <div>
                        <div class="news-source-meta">
                            <span><i class="fa-solid fa-newspaper"></i> ${item.source}</span>
                            <span><i class="fa-regular fa-clock"></i> ${item.time}</span>
                        </div>
                        <h3 class="news-headline"><a href="${item.url}" target="_blank" rel="noopener">${item.title}</a></h3>
                        <p class="news-snippet">${item.snippet}</p>
                    </div>
                    <div class="news-footer">
                        <a href="${item.url}" target="_blank" rel="noopener" class="read-more-link">
                            Read Full Story <i class="fa-solid fa-arrow-up-right-from-square"></i>
                        </a>
                    </div>
                </div>
            `;
            DOM.newsGrid.appendChild(card);
        });
    }

    // ================= Gamified Quiz 2.0 =================
    function initQuiz() {
        AppState.quiz.questions = [...QuizDatabase].sort(() => Math.random() - 0.5);
        AppState.quiz.currentIdx = 0;
        AppState.quiz.score = 0;
        AppState.quiz.streak = 0;
        DOM.quizResultOverlay.style.display = 'none';
        displayQuizQuestion();
    }

    function displayQuizQuestion() {
        clearInterval(AppState.quiz.timerInterval);
        const q = AppState.quiz.questions[AppState.quiz.currentIdx];
        if (!q) {
            finishQuiz();
            return;
        }

        DOM.quizQuestionIndex.textContent = `Question ${AppState.quiz.currentIdx + 1} of ${AppState.quiz.questions.length}`;
        DOM.quizQuestionTitle.textContent = q.question;
        DOM.quizCategoryBadge.textContent = q.category;
        DOM.quizScoreNum.textContent = AppState.quiz.score;
        DOM.quizStreak.innerHTML = `<i class="fa-solid fa-fire text-accent"></i> Streak: ${AppState.quiz.streak}`;
        DOM.quizProgressBar.style.width = `${((AppState.quiz.currentIdx + 1) / AppState.quiz.questions.length) * 100}%`;

        DOM.quizExplanation.style.display = 'none';
        DOM.quizNextBtn.style.display = 'none';
        DOM.quizOptionsGrid.innerHTML = '';

        q.options.forEach((opt, idx) => {
            const btn = document.createElement('button');
            btn.className = 'quiz-opt-btn';
            btn.innerHTML = `<span class="badge-pill">${String.fromCharCode(65 + idx)}</span> <span>${opt}</span>`;
            btn.onclick = () => selectQuizAnswer(btn, opt, q.correct, q.explanation);
            DOM.quizOptionsGrid.appendChild(btn);
        });

        // 20s Countdown Timer
        AppState.quiz.timer = 20;
        DOM.quizTimer.textContent = AppState.quiz.timer;
        AppState.quiz.timerInterval = setInterval(() => {
            AppState.quiz.timer--;
            DOM.quizTimer.textContent = AppState.quiz.timer;
            if (AppState.quiz.timer <= 0) {
                clearInterval(AppState.quiz.timerInterval);
                timeOutQuizAnswer(q.correct, q.explanation);
            }
        }, 1000);
    }

    function selectQuizAnswer(selectedBtn, chosenOpt, correctOpt, explanation) {
        clearInterval(AppState.quiz.timerInterval);
        const buttons = DOM.quizOptionsGrid.querySelectorAll('.quiz-opt-btn');
        buttons.forEach(b => b.disabled = true);

        if (chosenOpt === correctOpt) {
            selectedBtn.classList.add('correct');
            AppState.quiz.streak++;
            const pointsEarned = 10 + (AppState.quiz.streak * 2) + Math.round(AppState.quiz.timer / 2);
            AppState.quiz.score += pointsEarned;
            showToast(`Correct! +${pointsEarned} pts`, 'fa-circle-check');
        } else {
            selectedBtn.classList.add('wrong');
            AppState.quiz.streak = 0;
            buttons.forEach(b => {
                if (b.innerText.includes(correctOpt)) b.classList.add('correct');
            });
            showToast('Incorrect answer', 'fa-circle-xmark');
        }

        DOM.quizScoreNum.textContent = AppState.quiz.score;
        DOM.quizStreak.innerHTML = `<i class="fa-solid fa-fire text-accent"></i> Streak: ${AppState.quiz.streak}`;
        DOM.quizExplanation.innerHTML = `<strong>Explanation:</strong> ${explanation}`;
        DOM.quizExplanation.style.display = 'block';
        DOM.quizNextBtn.style.display = 'inline-flex';
    }

    function timeOutQuizAnswer(correctOpt, explanation) {
        const buttons = DOM.quizOptionsGrid.querySelectorAll('.quiz-opt-btn');
        buttons.forEach(b => {
            b.disabled = true;
            if (b.innerText.includes(correctOpt)) b.classList.add('correct');
        });
        AppState.quiz.streak = 0;
        DOM.quizExplanation.innerHTML = `<strong>Time Expired:</strong> ${explanation}`;
        DOM.quizExplanation.style.display = 'block';
        DOM.quizNextBtn.style.display = 'inline-flex';
    }

    function finishQuiz() {
        clearInterval(AppState.quiz.timerInterval);
        DOM.quizResultOverlay.style.display = 'block';
        DOM.finalScoreVal.textContent = AppState.quiz.score;
        document.getElementById('final-max-score').textContent = AppState.quiz.questions.length * 20;

        if (typeof confetti === 'function') {
            confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
        }
    }

    // ================= Tab Switching & Navigation =================
    function switchTab(targetId) {
        DOM.navTabs.forEach(tab => {
            tab.classList.toggle('active', tab.dataset.tab === targetId);
        });
        DOM.tabPanes.forEach(pane => {
            pane.classList.toggle('active', pane.id === targetId);
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // ================= Event Listeners =================
    function setupEventListeners() {
        // Theme Toggle
        DOM.themeToggle.addEventListener('click', () => {
            applyTheme(AppState.theme === 'dark' ? 'light' : 'dark');
        });

        // Currency Selector
        DOM.currencySelect.addEventListener('change', (e) => {
            AppState.currency = e.target.value;
            localStorage.setItem('bithead_currency', AppState.currency);
            renderMarketView();
            renderHeroMetrics();
            renderPortfolio();
            showToast(`Currency changed to ${AppState.currency.toUpperCase()}`, 'fa-money-bill-wave');
        });

        // Tabs
        DOM.navTabs.forEach(tab => {
            tab.addEventListener('click', () => switchTab(tab.dataset.tab));
        });

        document.querySelectorAll('.footer-nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                switchTab(link.dataset.tab);
            });
        });

        // Search Input
        DOM.searchInput.addEventListener('input', (e) => {
            const q = e.target.value;
            DOM.clearSearch.style.display = q ? 'block' : 'none';
            applyFiltersAndSort();
        });

        DOM.clearSearch.addEventListener('click', () => {
            DOM.searchInput.value = '';
            DOM.clearSearch.style.display = 'none';
            applyFiltersAndSort();
        });

        // Category Pills
        DOM.categoryPills.addEventListener('click', (e) => {
            if (e.target.classList.contains('category-pill')) {
                document.querySelectorAll('.category-pill').forEach(p => p.classList.remove('active'));
                e.target.classList.add('active');
                AppState.activeCategory = e.target.dataset.category;
                AppState.displayedCount = 20;
                applyFiltersAndSort();
            }
        });

        // See More
        DOM.seeMoreBtn.addEventListener('click', () => {
            AppState.displayedCount += 20;
            renderMarketView();
        });

        // Refresh Prices
        DOM.refreshPricesBtn.addEventListener('click', () => {
            fetchMarketData();
            showToast('Market prices refreshed!', 'fa-rotate');
        });

        // View Toggles
        DOM.viewTableBtn.addEventListener('click', () => {
            AppState.activeView = 'table';
            DOM.viewTableBtn.classList.add('active');
            DOM.viewGridBtn.classList.remove('active');
            document.querySelector('.table-responsive').style.display = 'block';
            DOM.cardsGrid.style.display = 'none';
            renderMarketView();
        });

        DOM.viewGridBtn.addEventListener('click', () => {
            AppState.activeView = 'grid';
            DOM.viewGridBtn.classList.add('active');
            DOM.viewTableBtn.classList.remove('active');
            document.querySelector('.table-responsive').style.display = 'none';
            DOM.cardsGrid.style.display = 'grid';
            renderMarketView();
        });

        // Table Sorting Header Clicks
        document.querySelectorAll('.crypto-table th[data-sort]').forEach(th => {
            th.addEventListener('click', () => {
                const field = th.dataset.sort;
                if (AppState.sortField === field) {
                    AppState.sortDirection = AppState.sortDirection === 'asc' ? 'desc' : 'asc';
                } else {
                    AppState.sortField = field;
                    AppState.sortDirection = 'desc';
                }
                applyFiltersAndSort();
            });
        });

        // Delegated clicks for coin details & stars
        document.addEventListener('click', (e) => {
            const starBtn = e.target.closest('.star-btn');
            if (starBtn) {
                toggleWatchlist(starBtn.dataset.id);
                return;
            }

            const coinCell = e.target.closest('.coin-cell');
            if (coinCell) {
                openCoinDetail(coinCell.dataset.id);
                return;
            }

            const detailBtn = e.target.closest('.view-detail-btn');
            if (detailBtn) {
                openCoinDetail(detailBtn.dataset.id);
                return;
            }

            const deletePosBtn = e.target.closest('.delete-pos-btn');
            if (deletePosBtn) {
                deletePortfolioTransaction(parseInt(deletePosBtn.dataset.index));
                return;
            }
        });

        // TradingView Symbol Select
        DOM.tvSymbolSelect.addEventListener('change', (e) => {
            AppState.tvSymbol = e.target.value;
            initTradingView();
        });

        // TradingView Intervals
        DOM.tvIntervalBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                DOM.tvIntervalBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                AppState.tvInterval = btn.dataset.interval;
                initTradingView();
            });
        });

        // TradingView Fullscreen
        DOM.tvFullscreenBtn.addEventListener('click', () => {
            const wrapper = document.getElementById('tradingview-widget-wrapper');
            if (!document.fullscreenElement) {
                wrapper.requestFullscreen().catch(err => console.error(err));
            } else {
                document.exitFullscreen();
            }
        });

        // Modals
        DOM.openAddAssetBtn.addEventListener('click', () => {
            DOM.addAssetModal.style.display = 'flex';
        });
        DOM.closeAssetModal.addEventListener('click', () => {
            DOM.addAssetModal.style.display = 'none';
        });
        DOM.modalCancelBtn.addEventListener('click', () => {
            DOM.addAssetModal.style.display = 'none';
        });
        DOM.closeCoinDetail.addEventListener('click', () => {
            DOM.coinDetailModal.style.display = 'none';
        });

        DOM.addAssetForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const select = document.getElementById('modal-coin-select');
            const selectedOpt = select.options[select.selectedIndex];
            const id = select.value;
            const name = selectedOpt.dataset.name;
            const symbol = selectedOpt.dataset.symbol;
            const qty = parseFloat(document.getElementById('modal-coin-qty').value);
            const buyPrice = parseFloat(document.getElementById('modal-coin-buy-price').value);

            if (qty > 0 && buyPrice >= 0) {
                addPortfolioTransaction(id, name, symbol, qty, buyPrice);
                DOM.addAssetModal.style.display = 'none';
                DOM.addAssetForm.reset();
            }
        });

        // Demo Portfolio
        DOM.demoPortfolioBtn.addEventListener('click', () => {
            AppState.portfolio = [
                { id: 'bitcoin', name: 'Bitcoin', symbol: 'btc', quantity: 0.35, buyPrice: 58000 },
                { id: 'ethereum', name: 'Ethereum', symbol: 'eth', quantity: 3.5, buyPrice: 2950 },
                { id: 'solana', name: 'Solana', symbol: 'sol', quantity: 28, buyPrice: 132 },
                { id: 'near', name: 'NEAR Protocol', symbol: 'near', quantity: 450, buyPrice: 4.10 }
            ];
            localStorage.setItem('bithead_portfolio', JSON.stringify(AppState.portfolio));
            renderPortfolio();
            showToast('Sample demo portfolio loaded!', 'fa-wand-sparkles');
        });

        // Export Portfolio
        DOM.exportPortfolioBtn.addEventListener('click', () => {
            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(AppState.portfolio, null, 2));
            const dlAnchor = document.createElement('a');
            dlAnchor.setAttribute("href", dataStr);
            dlAnchor.setAttribute("download", "bithead_portfolio.json");
            dlAnchor.click();
            showToast('Portfolio exported to JSON', 'fa-file-arrow-down');
        });

        // AI Chat
        DOM.aiChatForm.addEventListener('submit', (e) => {
            e.preventDefault();
            handleAiChat(DOM.aiUserInput.value.trim());
        });

        DOM.aiChips.forEach(chip => {
            chip.addEventListener('click', () => {
                handleAiChat(chip.dataset.prompt);
            });
        });

        DOM.openAiBtn.addEventListener('click', () => {
            switchTab('ai-view');
        });

        // News Refresh & Filters
        DOM.refreshNewsBtn.addEventListener('click', () => {
            DOM.newsLoader.style.display = 'flex';
            setTimeout(() => {
                renderNews(FallbackNews);
                showToast('News feed updated', 'fa-newspaper');
            }, 500);
        });

        DOM.newsFilters.forEach(pill => {
            pill.addEventListener('click', () => {
                DOM.newsFilters.forEach(p => p.classList.remove('active'));
                pill.classList.add('active');
                const filter = pill.dataset.newsFilter;
                if (filter === 'all') {
                    renderNews(FallbackNews);
                } else {
                    const filtered = FallbackNews.filter(n => n.title.toLowerCase().includes(filter) || n.snippet.toLowerCase().includes(filter));
                    renderNews(filtered.length ? filtered : FallbackNews);
                }
            });
        });

        // Quiz Next & Restart
        DOM.quizNextBtn.addEventListener('click', () => {
            AppState.quiz.currentIdx++;
            displayQuizQuestion();
        });

        DOM.quizRestartBtn.addEventListener('click', initQuiz);
        DOM.quizPlayAgainBtn.addEventListener('click', initQuiz);
    }

    // ================= Keyboard Shortcuts =================
    function setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT' || e.target.tagName === 'TEXTAREA') return;

            if (e.key === '/') {
                e.preventDefault();
                DOM.searchInput.focus();
            } else if (e.key.toLowerCase() === 't') {
                applyTheme(AppState.theme === 'dark' ? 'light' : 'dark');
            } else if (e.key >= '1' && e.key <= '7') {
                const tabs = ['market-view', 'analytics-view', 'portfolio-view', 'ai-view', 'converter-view', 'news-view', 'quiz-view'];
                const target = tabs[parseInt(e.key) - 1];
                if (target) switchTab(target);
            }
        });
    }

    // Run app!
    init();
});
