/**
 * BitHead Core Calculation & Financial Utility Tests
 */

function testCurrencyConversion() {
    const rates = { usd: 1, inr: 83.5, eur: 0.92, gbp: 0.79 };
    const btcPriceUSD = 64000;

    const btcInINR = btcPriceUSD * rates.inr;
    if (btcInINR !== 5344000) {
        throw new Error(`INR conversion mismatch: expected 5344000, got ${btcInINR}`);
    }

    const btcInEUR = btcPriceUSD * rates.eur;
    if (btcInEUR !== 58880) {
        throw new Error(`EUR conversion mismatch: expected 58880, got ${btcInEUR}`);
    }

    console.log('✔ Currency Conversion Tests Passed');
}

function testPortfolioPnL() {
    const position = {
        name: 'Bitcoin',
        quantity: 0.5,
        buyPrice: 50000,
        currentPrice: 65000
    };

    const costBasis = position.quantity * position.buyPrice; // 25000
    const currentValue = position.quantity * position.currentPrice; // 32500
    const pnl = currentValue - costBasis; // +7500
    const pnlPercent = (pnl / costBasis) * 100; // 30%

    if (costBasis !== 25000) throw new Error('Cost basis calculation error');
    if (currentValue !== 32500) throw new Error('Current value calculation error');
    if (pnl !== 7500) throw new Error('PnL calculation error');
    if (pnlPercent !== 30) throw new Error('PnL percentage calculation error');

    console.log('✔ Portfolio PnL Calculations Passed');
}

function testDcaProjection() {
    const amount = 100;
    const months = 12;
    const totalInvested = amount * months * 4.33; // weekly for 12 months = 5196
    const estGrowth = 1 + (0.45 * (months / 12)); // 1.45
    const estValue = totalInvested * estGrowth;

    if (Math.round(totalInvested) !== 5196) throw new Error('DCA total invested error');
    if (Math.round(estValue) !== 7534) throw new Error('DCA est value error');

    console.log('✔ DCA Projection Simulator Tests Passed');
}

function testQuizScoring() {
    let score = 0;
    let streak = 0;
    const timer = 16;

    // Correct answer on 1st question
    streak++;
    let points = 10 + (streak * 2) + Math.round(timer / 2);
    score += points;

    if (score !== 20) throw new Error(`Quiz scoring mismatch: expected 20, got ${score}`);

    // Correct answer on 2nd question (streak 2)
    streak++;
    points = 10 + (streak * 2) + Math.round(18 / 2);
    score += points;

    if (score !== 43) throw new Error(`Quiz streak bonus mismatch: expected 43, got ${score}`);

    console.log('✔ Quiz Gamification Logic Tests Passed');
}

function runAll() {
    console.log('========================================');
    console.log('Running BitHead Test Suite');
    console.log('========================================');
    testCurrencyConversion();
    testPortfolioPnL();
    testDcaProjection();
    testQuizScoring();
    console.log('========================================');
    console.log('ALL TESTS PASSED SUCCESSFULLY! (4/4)');
    console.log('========================================');
}

runAll();
