let favorites = JSON.parse(localStorage.getItem('descgen_favorites') || '[]');
let bulkMode = false;

document.addEventListener('DOMContentLoaded', () => {
    renderFavorites();
});

function generateDescription() {
    const name = document.getElementById('productName').value.trim();
    if (!name) {
        showToast('Please enter a product name');
        document.getElementById('productName').focus();
        return;
    }

    const category = document.getElementById('category').value;
    const audience = document.getElementById('targetAudience').value;
    const features = document.getElementById('keyFeatures').value.trim().split('\n').filter(f => f.trim());
    const tone = document.getElementById('tone').value;
    const platform = document.getElementById('platform').value;
    const price = document.getElementById('price').value.trim();
    const brand = document.getElementById('brand').value.trim();

    const btn = document.getElementById('generateBtn');
    btn.classList.add('loading');
    btn.querySelector('.btn-text').style.display = 'none';
    btn.querySelector('.btn-icon').style.display = 'none';
    btn.querySelector('.btn-loading').style.display = 'inline';

    setTimeout(() => {
        const descriptions = buildDescriptions(name, category, audience, features, tone, platform, price, brand);

        document.getElementById('text-short').textContent = descriptions.short;
        document.getElementById('text-full').textContent = descriptions.full;
        document.getElementById('text-bullets').textContent = descriptions.bullets;
        document.getElementById('text-seo').textContent = descriptions.seo;
        document.getElementById('text-title').textContent = descriptions.titles;
        document.getElementById('text-social').textContent = descriptions.social;

        const seoText = descriptions.seo;
        document.getElementById('seoCharCount').textContent = `${seoText.length}/160 characters`;

        const panel = document.getElementById('outputPanel');
        panel.style.display = 'block';
        panel.classList.add('active');
        switchOutputTab('short', document.querySelector('.output-tab'));

        btn.classList.remove('loading');
        btn.querySelector('.btn-text').style.display = 'inline';
        btn.querySelector('.btn-icon').style.display = 'inline';
        btn.querySelector('.btn-loading').style.display = 'none';

        panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 800 + Math.random() * 700);
}

function buildDescriptions(name, category, audience, features, tone, platform, price, brand) {
    const featureText = features.length > 0 ? features : ['high quality', 'great value', 'reliable'];
    const featureList = featureText.slice(0, 5).join(', ').replace(/, ([^,]*)$/, ' and $1');
    const brandPrefix = brand ? `${brand} ` : '';
    const categoryAdjectives = getCategoryAdjectives(category);
    const toneWords = getToneWords(tone);
    const audienceWord = getAudienceWord(audience);
    const platformNote = getPlatformNote(platform);

    const short = generateShort(name, brandPrefix, featureList, toneWords, categoryAdjectives, price);
    const full = generateFull(name, brandPrefix, featureText, toneWords, categoryAdjectives, audienceWord, price, platform);
    const bullets = generateBullets(name, featureText, categoryAdjectives, toneWords, price);
    const seo = generateSEO(name, brandPrefix, category, featureList, toneWords);
    const titles = generateTitles(name, brand, category, featureText, platform);
    const social = generateSocial(name, brand, featureText, tone, category);

    return { short, full, bullets, seo, titles, social };
}

function generateShort(name, brand, features, tone, adj, price) {
    const templates = [
        `${brand}${name} — ${tone.experience} ${adj.quality} with ${features}. ${price ? `Now available at ${price}.` : 'Shop now.'}`,
        `Discover the ${brand}${name}: ${tone.experience} ${adj.design} featuring ${features}. ${price ? `Priced at ${price}.` : 'Get yours today.'}`,
        `The ${brand}${name} delivers ${tone.experience} ${adj.performance} with ${features}. ${price ? `Yours for just ${price}.` : 'Order now.'}`,
        `${tone.experience} meets ${adj.quality} in the ${brand}${name} — packed with ${features}. ${price ? `Starting at ${price}.` : 'Available now.'}`
    ];
    return templates[Math.floor(Math.random() * templates.length)];
}

function generateFull(name, brand, features, tone, adj, audience, price, platform) {
    const featureSentences = features.slice(0, 5).map((f, i) => {
        const verbs = ['featuring', 'equipped with', 'boasting', 'offering', 'including'];
        return i === 0 ? `Featuring ${f}` : `, ${verbs[i]} ${f}`;
    }).join('');

    const paragraphs = [
        `Introducing the ${brand}${name} — ${tone.experience} ${adj.quality} ${adj.design} designed for ${audience}. Whether you're looking for ${adj.reliability} or ${adj.performance}, this ${name} delivers on all fronts. ${featureSentences}, it stands out in its category.\n\n${price ? `Priced at just ${price}, ` : ''}The ${brand}${name} is the perfect choice for those who demand ${adj.quality} without compromise. ${platform.exclusive} Order today and experience the difference.`,
        `Meet the ${brand}${name}: where ${adj.quality} meets ${adj.design}. Built with ${audience} in mind, this ${name} combines ${adj.performance} with ${adj.reliability}. ${featureSentences}.\n\n${price ? `At ${price}, ` : ''}This is more than just a product — it's an investment in ${adj.quality}. ${platform.exclusive} Don't miss out on the ${name} that everyone is talking about.`,
        `The ${brand}${name} redefines ${adj.quality} with its ${adj.design} and ${adj.performance}. From the moment you experience it, you'll understand why ${audience} trust this ${name} for their needs. ${featureSentences}.\n\n${price ? `Available for just ${price}, ` : ''}The ${brand}${name} offers unmatched value. ${platform.exclusive} Make the smart choice today.`
    ];

    return paragraphs[Math.floor(Math.random() * paragraphs.length)];
}

function generateBullets(name, features, adj, tone, price) {
    const bulletTemplates = features.slice(0, 6).map((f, i) => {
        const prefixes = ['Premium', 'Advanced', 'Innovative', 'Smart', 'Proven', 'Essential'];
        const suffixes = ['for lasting performance', 'for optimal results', 'you can trust', 'at its finest', 'backed by quality', 'for everyday use'];
        return `• ${prefixes[i % prefixes.length]} ${f} ${suffixes[i % suffixes.length]}`;
    });

    const extras = [
        `• ${adj.quality} ${adj.design} built to last`,
        `• ${tone.experience} for ${adj.performance}`,
        price ? `• Great value at ${price}` : '• Exceptional value for money',
        `• Trusted by thousands of satisfied customers`
    ];

    const allBullets = [...bulletTemplates, ...extras].slice(0, 8);
    return allBullets.join('\n');
}

function generateSEO(name, brand, category, features, tone) {
    const catText = category ? ` ${category}` : '';
    const templates = [
        `Shop the ${brand}${name}${catText}. ${tone.experience} ${features}. ${brand ? `${brand} — ` : ''}Free shipping available. Order now!`,
        `Discover ${brand}${name}${catText} — ${features}. ${tone.experience} and built to last. Shop today and save!`,
        `Buy ${brand}${name}${catText} online. ${features}. ${tone.experience} at an affordable price. Fast shipping!`,
        `${brand}${name}${catText}: ${features}. ${tone.experience} design trusted by thousands. Order yours today!`
    ];

    let seo = templates[Math.floor(Math.random() * templates.length)];
    if (seo.length > 160) seo = seo.substring(0, 157) + '...';
    return seo;
}

function generateTitles(name, brand, category, features, platform) {
    const b = brand ? `${brand} ` : '';
    const titles = [
        `${b}${name} - ${features[0] || 'Premium Quality'} | ${platform === 'generic' ? 'Best Seller' : platform.charAt(0).toUpperCase() + platform.slice(1)}`,
        `${b}${name} | ${features.slice(0, 2).join(' & ')} | ${category ? category.charAt(0).toUpperCase() + category.slice(1) : 'Top Rated'}`,
        `New ${b}${name} - ${features[0] || 'Must Have'} - ${priceText()}`,
        `${b}${name} for ${getAudienceWord('general')} - ${features[0] || 'Premium'} - Shop Now`
    ];
    return titles.join('\n\n');
}

function generateSocial(name, brand, features, tone, category) {
    const b = brand ? `${brand} ` : '';
    const emojis = getCategoryEmojis(category);
    const social = {
        instagram: `${emojis} Introducing the ${b}${name}! ${features[0] || 'Amazing quality'} meets ${features[1] || 'innovative design'}.\n\n✨ ${features.slice(0, 3).join(' • ')}\n\n${tone === 'fun' ? 'Tag someone who needs this! 🏷️' : 'Shop the link in bio 👆'}\n\n#${name.replace(/\s+/g, '')} #NewArrival #ShopNow`,
        facebook: `🚀 Just dropped: ${b}${name}\n\nWe're thrilled to announce our latest ${category || 'product'} — the ${b}${name}!\n\nKey highlights:\n${features.slice(0, 4).map(f => `✅ ${f}`).join('\n')}\n\n${tone === 'fun' ? 'Who\'s excited? Drop a 🎉 below!' : 'Available now. Limited stock.'}`,
        twitter: `${emojis} Meet the ${b}${name}!\n\n${features.slice(0, 2).join(' • ')}\n\n${tone === 'fun' ? 'Your new favorite just dropped 🔥' : 'Quality you can trust.'}\n\n#${name.replace(/\s+/g, '')} #Launch`
    };

    return `📱 INSTAGRAM:\n${social.instagram}\n\n📘 FACEBOOK:\n${social.facebook}\n\n🐦 TWITTER:\n${social.twitter}`;
}

function getCategoryAdjectives(cat) {
    const map = {
        electronics: { quality: 'cutting-edge technology', design: 'sleek design', performance: 'top-tier performance', reliability: 'dependable performance' },
        fashion: { quality: 'premium craftsmanship', design: 'stylish design', performance: 'effortless elegance', reliability: 'timeless style' },
        home: { quality: 'superior quality', design: 'elegant design', performance: 'lasting durability', reliability: 'home-worthy elegance' },
        beauty: { quality: 'radiant results', design: 'luxurious formula', performance: 'visible transformation', reliability: 'skincare excellence' },
        sports: { quality: 'peak performance', design: 'athletic design', performance: 'competitive edge', reliability: 'proven durability' },
        toys: { quality: 'endless fun', design: 'creative design', performance: 'engaging play', reliability: 'safe & durable' },
        food: { quality: 'exceptional taste', design: 'artisanal quality', performance: 'rich flavor', reliability: 'premium ingredients' },
        books: { quality: 'compelling narrative', design: 'masterful storytelling', performance: 'page-turning content', reliability: 'thought-provoking' },
        automotive: { quality: 'engineered excellence', design: 'precision engineering', performance: 'road-tested reliability', reliability: 'built to perform' },
        pet: { quality: 'pet-approved quality', design: 'pawfect design', performance: 'tail-wagging fun', reliability: 'vet recommended' },
        health: { quality: 'proven wellness', design: 'science-backed', performance: 'health-boosting', reliability: 'trusted results' },
        jewelry: { quality: 'exquisite craftsmanship', design: 'timeless elegance', performance: 'sparkling brilliance', reliability: 'lasting beauty' }
    };
    return map[cat] || { quality: 'outstanding quality', design: 'thoughtful design', performance: 'reliable performance', reliability: 'dependable choice' };
}

function getToneWords(tone) {
    const map = {
        professional: { experience: 'Professional-grade', urgency: 'Don\'t miss out', emotional: 'Invest in quality' },
        fun: { experience: 'Fun and exciting', urgency: 'Grab yours before they\'re gone', emotional: 'You\'ll love it' },
        luxury: { experience: 'Luxurious and refined', urgency: 'Exclusive limited offer', emotional: 'Indulge in elegance' },
        budget: { experience: 'Amazing value', urgency: 'Save big today', emotional: 'Smart choice for smart shoppers' },
        informative: { experience: 'Well-researched', urgency: 'Learn more', emotional: 'Informed decisions' },
        urgent: { experience: 'Limited time', urgency: 'Act now - selling fast', emotional: 'Don\'t miss this deal' },
        emotional: { experience: 'Heartfelt quality', urgency: 'Life-changing', emotional: 'Transform your life' }
    };
    return map[tone] || map.professional;
}

function getAudienceWord(audience) {
    const map = {
        general: 'everyone',
        professionals: 'discerning professionals',
        'tech-savvy': 'tech enthusiasts',
        'budget-conscious': 'smart shoppers',
        luxury: 'the most discerning tastes',
        'young-adults': 'trendsetting young adults',
        parents: 'modern families',
        seniors: 'those who appreciate quality',
        fitness: 'dedicated fitness enthusiasts',
        'eco-conscious': 'environmentally conscious consumers'
    };
    return map[audience] || 'everyone';
}

function getPlatformNote(platform) {
    const map = {
        amazon: { exclusive: 'Available on Amazon with Prime shipping.' },
        shopify: { exclusive: 'Shop directly from our store.' },
        etsy: { exclusive: 'Handcrafted and shipped with care on Etsy.' },
        ebay: { exclusive: 'Bid now on eBay — limited quantities.' },
        walmart: { exclusive: 'Find it at Walmart stores and online.' },
        instagram: { exclusive: 'Shop via Instagram — link in bio.' },
        facebook: { exclusive: 'Available on Facebook Marketplace.' },
        generic: { exclusive: 'Order directly from our website.' }
    };
    return map[platform] || map.generic;
}

function getCategoryEmojis(cat) {
    const map = {
        electronics: '📱💻🎧',
        fashion: '👗👟✨',
        home: '🏠🛋️🌿',
        beauty: '💄✨🧴',
        sports: '⚽💪🏃',
        toys: '🎮🧸🎨',
        food: '🍔☕🍪',
        books: '📚📖💡',
        automotive: '🚗🔧⛽',
        pet: '🐕🐱🐾',
        health: '💊🧘💚',
        jewelry: '💎💍✨'
    };
    return map[cat] || '✨🛒🛍️';
}

function priceText() {
    const prices = ['$29.99', '$49.99', '$79.99', '$99.99', '$149.99', '$199.99'];
    return prices[Math.floor(Math.random() * prices.length)];
}

function switchOutputTab(tab, el) {
    document.querySelectorAll('.output-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.output-item').forEach(i => i.classList.remove('active'));
    if (el) el.classList.add('active');
    document.getElementById(`output-${tab}`).classList.add('active');
}

function copyToClipboard(elementId) {
    const text = document.getElementById(elementId).textContent;
    if (!text) {
        showToast('Nothing to copy yet');
        return;
    }
    navigator.clipboard.writeText(text).then(() => {
        showToast('Copied to clipboard!');
    }).catch(() => {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showToast('Copied to clipboard!');
    });
}

function copyAllDescriptions() {
    const types = ['short', 'full', 'bullets', 'seo', 'title', 'social'];
    let allText = '';
    types.forEach(type => {
        const el = document.getElementById(`text-${type}`);
        if (el && el.textContent) {
            allText += `${type.toUpperCase()}:\n${el.textContent}\n\n`;
        }
    });
    if (!allText) {
        showToast('Nothing to copy yet');
        return;
    }
    navigator.clipboard.writeText(allText.trim()).then(() => {
        showToast('All descriptions copied!');
    });
}

function saveToFavorites() {
    const name = document.getElementById('productName').value.trim();
    if (!name) {
        showToast('Generate a description first');
        return;
    }

    const fav = {
        id: Date.now(),
        name: name,
        category: document.getElementById('category').value,
        short: document.getElementById('text-short').textContent,
        full: document.getElementById('text-full').textContent,
        date: new Date().toLocaleDateString()
    };

    favorites.unshift(fav);
    localStorage.setItem('descgen_favorites', JSON.stringify(favorites));
    renderFavorites();
    showToast('Saved to favorites!');
}

function renderFavorites() {
    const container = document.getElementById('favoritesList');
    if (favorites.length === 0) {
        container.innerHTML = '<p class="empty-state">No saved descriptions yet. Generate and save your favorites!</p>';
        return;
    }

    container.innerHTML = favorites.map(fav => `
        <div class="favorite-card">
            <div class="favorite-info">
                <h3>${escapeHtml(fav.name)}</h3>
                <p>${escapeHtml(fav.short)}</p>
                <small style="color:var(--text-dim)">${fav.date}</small>
            </div>
            <div class="favorite-actions">
                <button class="btn-sm" onclick="loadFavorite(${fav.id})">📋 Load</button>
                <button class="btn-delete" onclick="deleteFavorite(${fav.id})">🗑️</button>
            </div>
        </div>
    `).join('');
}

function loadFavorite(id) {
    const fav = favorites.find(f => f.id === id);
    if (fav) {
        document.getElementById('productName').value = fav.name;
        if (fav.category) document.getElementById('category').value = fav.category;
        showToast('Loaded! Click Generate to refresh descriptions.');
    }
}

function deleteFavorite(id) {
    favorites = favorites.filter(f => f.id !== id);
    localStorage.setItem('descgen_favorites', JSON.stringify(favorites));
    renderFavorites();
    showToast('Removed from favorites');
}

function clearFavorites() {
    if (favorites.length === 0) return;
    if (confirm('Clear all saved descriptions?')) {
        favorites = [];
        localStorage.setItem('descgen_favorites', JSON.stringify(favorites));
        renderFavorites();
        showToast('All favorites cleared');
    }
}

function loadTemplate(category) {
    const templates = {
        electronics: { name: 'Wireless Bluetooth Headphones', features: 'Active noise cancellation\n40-hour battery life\nBluetooth 5.0\nFoldable design\nBuilt-in microphone', audience: 'tech-savvy', tone: 'professional' },
        fashion: { name: 'Premium Cotton T-Shirt', features: '100% organic cotton\nRelaxed fit\nPre-shrunk fabric\nAvailable in 12 colors\nMachine washable', audience: 'general', tone: 'fun' },
        home: { name: 'Ceramic Plant Pot Set', features: 'Set of 3 sizes\nDrainage holes included\nMatte finish\nIndoor/outdoor use\nEco-friendly materials', audience: 'general', tone: 'luxury' },
        beauty: { name: 'Vitamin C Serum', features: '20% vitamin C concentration\nHyaluronic acid\nCruelty-free\nAnti-aging formula\nSuitable for all skin types', audience: 'general', tone: 'professional' },
        sports: { name: 'Running Shoes Pro', features: 'Lightweight design\nResponsive cushioning\nBreathable mesh\nNon-slip sole\nArch support', audience: 'fitness', tone: 'informative' },
        food: { name: 'Organic Arabica Coffee', features: 'Single-origin beans\nFair trade certified\nMedium roast\nRich smooth flavor\n12oz bag', audience: 'general', tone: 'fun' }
    };

    const tpl = templates[category];
    if (tpl) {
        document.getElementById('productName').value = tpl.name;
        document.getElementById('category').value = category;
        document.getElementById('keyFeatures').value = tpl.features;
        document.getElementById('targetAudience').value = tpl.audience;
        document.getElementById('tone').value = tpl.tone;
        showToast(`${category.charAt(0).toUpperCase() + category.slice(1)} template loaded!`);
        document.getElementById('productName').scrollIntoView({ behavior: 'smooth' });
    }
}

function toggleBulkMode() {
    const modal = document.getElementById('bulkModal');
    modal.classList.toggle('active');
}

function processBulk() {
    const input = document.getElementById('bulkInput').value.trim();
    if (!input) {
        showToast('Please enter products to generate');
        return;
    }

    const lines = input.split('\n').filter(l => l.trim());
    const resultsDiv = document.getElementById('bulkResults');
    const outputDiv = document.getElementById('bulkOutput');

    outputDiv.innerHTML = '';

    lines.forEach((line, i) => {
        const parts = line.split('|').map(p => p.trim());
        const name = parts[0] || `Product ${i + 1}`;
        const category = parts[1] || '';
        const features = parts[2] ? parts[2].split(',').map(f => f.trim()) : [];

        document.getElementById('productName').value = name;
        if (category) document.getElementById('category').value = category.toLowerCase();
        if (features.length > 0) document.getElementById('keyFeatures').value = features.join('\n');

        const descriptions = buildDescriptions(name, category.toLowerCase(), '', features, 'professional', 'generic', '', '');

        outputDiv.innerHTML += `
            <div class="bulk-result-item">
                <h4>${escapeHtml(name)}</h4>
                <pre>${escapeHtml(descriptions.short)}\n\n${escapeHtml(descriptions.full)}\n\n${escapeHtml(descriptions.bullets)}</pre>
            </div>
        `;
    });

    resultsDiv.style.display = 'block';
    showToast(`Generated ${lines.length} descriptions!`);
}

function exportBulk() {
    const items = document.querySelectorAll('.bulk-result-item');
    if (items.length === 0) {
        showToast('Generate descriptions first');
        return;
    }

    let csv = 'Product,Short Description\n';
    items.forEach(item => {
        const name = item.querySelector('h4').textContent;
        const text = item.querySelector('pre').textContent.split('\n\n')[0];
        csv += `"${name}","${text.replace(/"/g, '""')}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'descriptions.csv';
    a.click();
    URL.revokeObjectURL(url);
    showToast('CSV exported!');
}

function showToast(msg) {
    const toast = document.getElementById('toast');
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2500);
}

function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

// Keyboard shortcut
document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        generateDescription();
    }
});
