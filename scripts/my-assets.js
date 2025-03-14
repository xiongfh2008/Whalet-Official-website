// 用户中心下拉菜单功能
document.addEventListener('DOMContentLoaded', function() {
    // 初始化所有功能
    initTotalAssets();
    initAssetComposition();
    initCurrencyList();
    initRecentTransactions();
    initCurrencyFilter();

    // 初始化提示工具
    const tooltipConfig = {
        placement: 'top',
        arrow: true,
        theme: 'light',
        maxWidth: 300,
        animation: 'scale',
        duration: 200
    };

    tippy('#unavailableTooltip', tooltipConfig);
    tippy('#accountCountTooltip', tooltipConfig);
    tippy('#totalAssetsTooltip', {
        ...tooltipConfig,
        theme: 'light',
        placement: 'right'
    });

    // 用户中心下拉菜单功能
    const userCenterBtn = document.getElementById('userCenterBtn');
    const userCenterDropdown = document.getElementById('userCenterDropdown');
    let isDropdownVisible = false;

    // 点击按钮时切换下拉菜单的显示状态
    userCenterBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        isDropdownVisible = !isDropdownVisible;
        if (isDropdownVisible) {
            userCenterDropdown.classList.remove('hidden');
            // 添加动画类
            userCenterDropdown.classList.add('opacity-100', 'translate-y-0');
            userCenterDropdown.classList.remove('opacity-0', '-translate-y-2');
        } else {
            hideDropdown();
        }
    });

    // 点击页面其他地方时关闭下拉菜单
    document.addEventListener('click', (e) => {
        if (!userCenterDropdown.contains(e.target) && e.target !== userCenterBtn) {
            hideDropdown();
        }
    });

    // 隐藏下拉菜单的函数
    function hideDropdown() {
        isDropdownVisible = false;
        // 添加动画类
        userCenterDropdown.classList.add('opacity-0', '-translate-y-2');
        userCenterDropdown.classList.remove('opacity-100', 'translate-y-0');
        // 等待动画完成后隐藏
        setTimeout(() => {
            userCenterDropdown.classList.add('hidden');
        }, 200);
    }
});

// 模拟数据 - 实际应用中应从API获取
const mockData = {
    totalAssets: 1234567.89,
    assetComposition: {
        platform: 450000,
        trade: 650000,
        acquiring: 134567.89
    },
    currencies: [
        {
            code: 'CNH',
            name: '跨境人民币',
            flag: 'cn',
            available: 987654.32,
            unavailable: 35280.00,
            exchangeLimit: 1000000.00,
            accountCount: 3,
            isMain: true
        },
        {
            code: 'USD',
            name: '美元',
            flag: 'us',
            available: 76543.21,
            unavailable: 2345.68,
            exchangeLimit: 150000.00,
            accountCount: 2,
            isMain: true
        },
        {
            code: 'EUR',
            name: '欧元',
            flag: 'eu',
            available: 25432.10,
            unavailable: 1000.00,
            exchangeLimit: 120000.00,
            accountCount: 1,
            isMain: true
        },
        {
            code: 'GBP',
            name: '英镑',
            flag: 'gb',
            available: 12345.67,
            unavailable: 234.57,
            exchangeLimit: 100000.00,
            accountCount: 1,
            isMain: true
        },
        {
            code: 'JPY',
            name: '日元',
            flag: 'jp',
            available: 8765432,
            unavailable: 123456,
            exchangeLimit: 10000000,
            accountCount: 1,
            isMain: false
        },
        {
            code: 'HKD',
            name: '港币',
            flag: 'hk',
            available: 543210.00,
            unavailable: 12345.00,
            exchangeLimit: 800000.00,
            accountCount: 1,
            isMain: false
        },
        {
            code: 'SGD',
            name: '新加坡元',
            flag: 'sg',
            available: 34567.89,
            unavailable: 987.65,
            exchangeLimit: 500000.00,
            accountCount: 1,
            isMain: false
        }
    ],
    recentTransactions: [
        {
            type: 'income',
            title: '收款',
            description: '来自 Amazon 平台',
            amount: '+$12,345.67',
            time: '2024-03-21 10:30',
            icon: 'arrow-down',
            iconBg: 'blue'
        },
        {
            type: 'exchange',
            title: '兑换',
            description: 'USD 转换为 CNY',
            amount: '$5,000 → ¥32,500',
            time: '2024-03-20 14:25',
            icon: 'exchange-alt',
            iconBg: 'purple'
        },
        {
            type: 'payment',
            title: '付款',
            description: '供应商付款',
            amount: '-¥8,643.21',
            time: '2024-03-20 09:15',
            icon: 'arrow-up',
            iconBg: 'red'
        },
        {
            type: 'income',
            title: '收款',
            description: '来自 Shopify 店铺',
            amount: '+€4,321.00',
            time: '2024-03-19 16:45',
            icon: 'arrow-down',
            iconBg: 'green'
        },
        {
            type: 'withdrawal',
            title: '提现',
            description: '至中国银行账户',
            amount: '-¥50,000.00',
            time: '2024-03-18 11:20',
            icon: 'wallet',
            iconBg: 'yellow'
        }
    ]
};

// 格式化货币
function formatCurrency(amount, currency, options = {}) {
    const formatter = new Intl.NumberFormat('zh-CN', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
    
    // 如果是总资产预览部分（USD），只返回数字部分
    if (currency === 'USD' && options.isTotal) {
        return formatter.format(amount).replace('US$', '$');
    }
    
    // 如果是资产组成部分（USD），显示金额后跟USD
    if (currency === 'USD' && options.isComposition) {
        return formatter.format(amount).replace('US$', '') + ' USD';
    }
    
    return formatter.format(amount);
}

// 初始化总资产
function initTotalAssets() {
    document.getElementById('totalAssetsUSD').textContent = formatCurrency(mockData.totalAssets, 'USD', { isTotal: true });
}

// 初始化资产组成饼图
function initAssetComposition() {
    const ctx = document.getElementById('assetComposition').getContext('2d');
    const total = Object.values(mockData.assetComposition).reduce((a, b) => a + b, 0);
    
    // 更新百分比和金额显示
    document.getElementById('platformPercentage').textContent = 
        ((mockData.assetComposition.platform / total) * 100).toFixed(1) + '%';
    document.getElementById('tradePercentage').textContent = 
        ((mockData.assetComposition.trade / total) * 100).toFixed(1) + '%';
    document.getElementById('acquiringPercentage').textContent = 
        ((mockData.assetComposition.acquiring / total) * 100).toFixed(1) + '%';
    
    document.getElementById('platformAssets').textContent = 
        formatCurrency(mockData.assetComposition.platform, 'USD', { isComposition: true });
    document.getElementById('tradeAssets').textContent = 
        formatCurrency(mockData.assetComposition.trade, 'USD', { isComposition: true });
    document.getElementById('acquiringAssets').textContent = 
        formatCurrency(mockData.assetComposition.acquiring, 'USD', { isComposition: true });

    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['平台收款', '外贸收款', '收单'],
            datasets: [{
                data: [
                    mockData.assetComposition.platform,
                    mockData.assetComposition.trade,
                    mockData.assetComposition.acquiring
                ],
                backgroundColor: ['#3b82f6', '#22c55e', '#eab308'],
                borderWidth: 0,
                borderRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            cutout: '70%',
            layout: {
                padding: 0
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    enabled: true,
                    callbacks: {
                        label: function(context) {
                            const value = context.raw;
                            const percentage = ((value / total) * 100).toFixed(1);
                            return `${context.label}: ${formatCurrency(value, 'USD', { isComposition: true })} (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
}

// 生成币种列表行HTML
function generateCurrencyRow(currency) {
    return `
        <tr class="currency-row border-b border-gray-100">
            <td class="px-5 py-4">
                <div class="flex items-center">
                    <img src="https://cdn.jsdelivr.net/gh/lipis/flag-icons/flags/4x3/${currency.flag}.svg" 
                         class="currency-flag mr-3" 
                         alt="${currency.code}">
                    <div>
                        <div class="font-medium text-gray-900">${currency.name}</div>
                        <div class="text-sm text-gray-500">${currency.code}</div>
                    </div>
                </div>
            </td>
            <td class="px-5 py-4 text-right">
                <div class="font-medium text-gray-900">${formatCurrency(currency.available, currency.code)}</div>
            </td>
            <td class="px-5 py-4 text-right">
                <div class="flex items-center justify-end">
                    <span class="font-medium text-gray-900">${formatCurrency(currency.unavailable, currency.code)}</span>
                    <i class="fas fa-lock text-red-500 text-xs ml-1"></i>
                </div>
            </td>
            <td class="px-5 py-4 text-right">
                <div class="font-medium text-gray-900">${formatCurrency(currency.exchangeLimit, currency.code)}</div>
            </td>
            <td class="px-5 py-4 text-center">
                <div class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 text-blue-600 font-medium">
                    ${currency.accountCount}
                </div>
            </td>
        </tr>
    `;
}

// 初始化币种列表
function initCurrencyList() {
    const mainCurrencies = mockData.currencies.filter(c => c.isMain);
    const otherCurrencies = mockData.currencies.filter(c => !c.isMain);
    
    const mainCurrencyList = document.getElementById('mainCurrencyList');
    const moreCurrencyList = document.getElementById('moreCurrencyList');
    
    mainCurrencyList.innerHTML = mainCurrencies.map(generateCurrencyRow).join('');
    moreCurrencyList.innerHTML = otherCurrencies.map(generateCurrencyRow).join('');
    
    // 如果没有更多币种，隐藏切换按钮
    const toggleButton = document.getElementById('toggleCurrencies');
    if (otherCurrencies.length === 0) {
        toggleButton.parentElement.style.display = 'none';
    } else {
        toggleButton.addEventListener('click', toggleCurrencyList);
    }
}

// 切换币种列表显示/隐藏
function toggleCurrencyList() {
    const moreCurrencyList = document.getElementById('moreCurrencyList');
    const toggleButton = document.getElementById('toggleCurrencies');
    const showMore = toggleButton.querySelector('.show-more');
    const showLess = toggleButton.querySelector('.show-less');
    const icon = toggleButton.querySelector('.currency-toggle');
    
    if (moreCurrencyList.classList.contains('hidden')) {
        moreCurrencyList.classList.remove('hidden');
        showMore.classList.add('hidden');
        showLess.classList.remove('hidden');
        icon.classList.add('rotate');
    } else {
        moreCurrencyList.classList.add('hidden');
        showMore.classList.remove('hidden');
        showLess.classList.add('hidden');
        icon.classList.remove('rotate');
    }
}

// 初始化近期交易
function initRecentTransactions() {
    const container = document.getElementById('recentTransactions');
    container.innerHTML = mockData.recentTransactions.map(transaction => `
        <div class="flex items-center py-3 border-b border-gray-100 last:border-0">
            <div class="w-10 h-10 rounded-full bg-${transaction.iconBg}-100 flex items-center justify-center text-${transaction.iconBg}-600 mr-3">
                <i class="fas fa-${transaction.icon}"></i>
            </div>
            <div class="flex-1">
                <h4 class="text-sm font-medium text-gray-800">${transaction.title}</h4>
                <p class="text-xs text-gray-500">${transaction.description}</p>
            </div>
            <div class="text-right">
                <p class="text-sm font-medium ${transaction.type === 'payment' || transaction.type === 'withdrawal' ? 'text-red-600' : transaction.type === 'exchange' ? 'text-blue-600' : 'text-green-600'}">${transaction.amount}</p>
                <p class="text-xs text-gray-500">${transaction.time}</p>
            </div>
        </div>
    `).join('');
}

// 更新币种列表显示
function updateCurrencyList(filter) {
    const mainCurrencyList = document.getElementById('mainCurrencyList');
    const moreCurrencyList = document.getElementById('moreCurrencyList');
    const toggleButton = document.getElementById('toggleCurrencies');
    
    if (filter === 'all') {
        // 显示全部币种，恢复原始逻辑
        const mainCurrencies = mockData.currencies.filter(c => c.isMain);
        const otherCurrencies = mockData.currencies.filter(c => !c.isMain);
        
        mainCurrencyList.innerHTML = mainCurrencies.map(generateCurrencyRow).join('');
        moreCurrencyList.innerHTML = otherCurrencies.map(generateCurrencyRow).join('');
        
        // 如果有其他币种，显示切换按钮
        toggleButton.parentElement.style.display = otherCurrencies.length > 0 ? 'block' : 'none';
        // 重置展开/收起状态
        moreCurrencyList.classList.add('hidden');
        const showMore = toggleButton.querySelector('.show-more');
        const showLess = toggleButton.querySelector('.show-less');
        const icon = toggleButton.querySelector('.currency-toggle');
        showMore.classList.remove('hidden');
        showLess.classList.add('hidden');
        icon.classList.remove('rotate');
    } else {
        // 显示特定币种
        const selectedCurrency = mockData.currencies.find(c => c.code === filter);
        if (selectedCurrency) {
            mainCurrencyList.innerHTML = generateCurrencyRow(selectedCurrency);
            moreCurrencyList.innerHTML = '';
            toggleButton.parentElement.style.display = 'none';
        }
    }
}

// 初始化币种筛选功能
function initCurrencyFilter() {
    const filterBtn = document.getElementById('currencyFilterBtn');
    const filterDropdown = document.getElementById('currencyFilterDropdown');
    const selectedFilter = document.getElementById('selectedFilter');
    const chevronIcon = filterBtn.querySelector('.fa-chevron-down');
    const searchInput = document.getElementById('currencySearch');
    const currencyList = document.getElementById('currencyList');
    let isFilterDropdownVisible = false;

    // 搜索功能
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const currencyButtons = currencyList.querySelectorAll('button');
        
        currencyButtons.forEach(button => {
            const currencyCode = button.dataset.filter;
            const currency = mockData.currencies.find(c => c.code === currencyCode);
            if (!currency) return;
            
            const searchString = `${currency.code} ${currency.name}`.toLowerCase();
            const isMatch = searchString.includes(searchTerm);
            button.style.display = isMatch ? 'block' : 'none';
        });
    });

    // 防止搜索框点击事件关闭下拉菜单
    searchInput.addEventListener('click', (e) => {
        e.stopPropagation();
    });

    // 清空搜索框当下拉菜单关闭时
    function clearSearch() {
        searchInput.value = '';
        const currencyButtons = currencyList.querySelectorAll('button');
        currencyButtons.forEach(button => {
            button.style.display = 'block';
        });
    }

    // 点击按钮时切换下拉菜单
    filterBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        isFilterDropdownVisible = !isFilterDropdownVisible;
        if (isFilterDropdownVisible) {
            filterDropdown.classList.remove('hidden');
            chevronIcon.style.transform = 'rotate(180deg)';
            searchInput.focus(); // 自动聚焦到搜索框
        } else {
            hideFilterDropdown();
        }
    });

    // 点击页面其他地方时关闭下拉菜单
    document.addEventListener('click', () => {
        if (isFilterDropdownVisible) {
            hideFilterDropdown();
        }
    });

    // 阻止下拉菜单内部点击事件冒泡
    filterDropdown.addEventListener('click', (e) => {
        e.stopPropagation();
    });

    // 点击筛选选项
    filterDropdown.addEventListener('click', (e) => {
        const button = e.target.closest('button');
        if (!button) return;

        const filter = button.dataset.filter;
        if (filter === 'all') {
            selectedFilter.innerHTML = '<span>全部币种</span>';
        } else {
            const currency = mockData.currencies.find(c => c.code === filter);
            if (currency) {
                selectedFilter.innerHTML = `
                    <div class="flex items-center">
                        <img src="https://cdn.jsdelivr.net/gh/lipis/flag-icons/flags/4x3/${currency.flag}.svg" 
                             class="w-4 h-4 rounded-full mr-2" 
                             alt="${currency.code}">
                        <span class="font-medium">${currency.code}</span>
                        <span class="text-gray-500 ml-1">${currency.name}</span>
                    </div>
                `;
            }
        }
        
        hideFilterDropdown();
        updateCurrencyList(filter);
    });

    // 隐藏下拉菜单
    function hideFilterDropdown() {
        isFilterDropdownVisible = false;
        filterDropdown.classList.add('hidden');
        chevronIcon.style.transform = 'rotate(0deg)';
        clearSearch(); // 清空搜索框
    }
} 