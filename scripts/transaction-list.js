// API 基础 URL
const API_BASE_URL = 'https://api.example.com';

// 初始化函数
function initializeApp() {
    console.log('Initializing app...');
    initializeMenuEvents();
    initializeTabEvents();
    initializeDatePickers();
    initializeSearchForm();
}

// 初始化菜单事件
function initializeMenuEvents() {
    console.log('Initializing menu events...');
    
    // 使用事件委托处理菜单点击
    document.addEventListener('click', function(event) {
        const menuItem = event.target.closest('.menu-item');
        if (!menuItem) return;
        
        console.log('Menu item clicked:', menuItem.getAttribute('data-page'));
        
        // 阻止默认行为
        event.preventDefault();
        
        // 移除所有菜单项的 active 类
        document.querySelectorAll('.menu-item').forEach(item => {
            item.classList.remove('active');
        });
        
        // 添加 active 类到被点击的菜单项
        menuItem.classList.add('active');
        
        // 如果是交易查询页面，重新加载数据
        if (menuItem.getAttribute('data-page') === 'transaction') {
            console.log('Reloading transaction data...');
            resetQueryParams();
            loadTransactions();
        } else {
            // 导航到其他页面
            window.location.href = menuItem.href;
        }
    });
}

// 初始化标签页事件
function initializeTabEvents() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            button.classList.add('active');
            const tabId = button.getAttribute('data-tab');
            document.getElementById(tabId)?.classList.add('active');
        });
    });
}

// 初始化日期选择器
function initializeDatePickers() {
    // 设置日期选择器的默认值为当前日期
    const today = new Date().toISOString().split('T')[0];
    document.querySelectorAll('input[type="date"]').forEach(picker => {
        picker.value = today;
    });
}

// 初始化搜索表单
function initializeSearchForm() {
    const searchButton = document.querySelector('button.bg-blue-600');
    const resetButton = searchButton?.previousElementSibling;

    if (searchButton) {
        searchButton.addEventListener('click', () => {
            console.log('Search button clicked');
            loadTransactions();
        });
    }

    if (resetButton) {
        resetButton.addEventListener('click', () => {
            console.log('Reset button clicked');
            resetQueryParams();
            loadTransactions();
        });
    }
}

// 重置查询参数
function resetQueryParams() {
    console.log('Resetting query parameters');
    // 重置所有输入框
    document.querySelectorAll('input[type="text"], input[type="date"], select').forEach(input => {
        input.value = '';
    });
}

// 加载交易数据
function loadTransactions() {
    console.log('Loading transactions...');
    // TODO: 实现加载交易数据的逻辑
}

// 当 DOM 加载完成时初始化应用
document.addEventListener('DOMContentLoaded', initializeApp); 