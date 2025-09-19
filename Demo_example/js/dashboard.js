document.addEventListener('DOMContentLoaded', function() {
    // 检查登录状态
    checkLoginStatus();
    
    // 项目类型切换
    const projectTypeItems = document.querySelectorAll('.project-type li');
    projectTypeItems.forEach(item => {
        item.addEventListener('click', function() {
            // 移除所有激活状态
            projectTypeItems.forEach(i => i.classList.remove('active'));
            // 添加当前项的激活状态
            this.classList.add('active');
            
            // 在实际项目中，这里应该根据选择的项目类型加载不同的数据
            const projectType = this.getAttribute('data-type');
            console.log('切换到项目类型:', projectType);
            
            // 模拟数据加载
            showLoading();
            setTimeout(() => {
                hideLoading();
                // 这里可以更新图表和表格数据
            }, 500);
        });
    });
    
    // 过滤器功能
    const filterBtn = document.querySelector('.filter-btn');
    filterBtn.addEventListener('click', function() {
        const timeRange = document.getElementById('timeRange').value;
        const projectStatus = document.getElementById('projectStatus').value;
        const department = document.getElementById('department').value;
        
        console.log('过滤条件:', { timeRange, projectStatus, department });
        
        // 模拟数据过滤
        showLoading();
        setTimeout(() => {
            hideLoading();
            // 这里可以根据过滤条件更新图表和表格数据
        }, 500);
    });
    
    // 重置过滤器
    const resetBtn = document.querySelector('.filter-btn.reset');
    resetBtn.addEventListener('click', function() {
        document.getElementById('timeRange').selectedIndex = 0;
        document.getElementById('projectStatus').selectedIndex = 0;
        document.getElementById('department').selectedIndex = 0;
        
        // 重置后刷新数据
        filterBtn.click();
    });
    
    // 表格操作按钮事件
    setupTableActions();
    
    // 初始化仪表板 - 确保调用此函数
    initializeDashboard();
    
    // 初始化仪表板
    function initializeDashboard() {
        // 显示用户名
        displayUsername();
        
        // 初始化加载数据
        showLoading();
        
        // 模拟异步数据加载
        setTimeout(() => {
            hideLoading();
            
            // 初始化图表
            initializeCharts();
            
            // 添加表格行的数据ID
            const tableRows = document.querySelectorAll('.data-table tbody tr');
            tableRows.forEach((row, index) => {
                row.dataset.id = `project-${index + 1}`;
            });
            
            // 设置表格操作按钮事件
            setupTableActions();
        }, 800);
    }
    
    // 检查登录状态
    function checkLoginStatus() {
        const isLoggedIn = localStorage.getItem('isLoggedIn');
        if (!isLoggedIn || isLoggedIn !== 'true') {
            // 未登录，跳转到登录页面
            window.location.href = 'login.html';
            return;
        }
    }
    
    // 显示用户名
    function displayUsername() {
        const username = localStorage.getItem('username');
        const userNameElement = document.querySelector('.user-name');
        if (username && userNameElement) {
            userNameElement.textContent = username;
        }
    }
    
    // 加载中状态
    function showLoading() {
        // 创建加载遮罩
        const loadingOverlay = document.createElement('div');
        loadingOverlay.className = 'loading-overlay';
        loadingOverlay.innerHTML = '<div class="spinner"></div>';
        document.body.appendChild(loadingOverlay);
        
        // 添加加载中样式
        document.body.classList.add('loading');
    }
    
    function hideLoading() {
        const loadingOverlay = document.querySelector('.loading-overlay');
        if (loadingOverlay) {
            loadingOverlay.remove();
        }
        
        // 移除加载中样式
        document.body.classList.remove('loading');
    }
    
    // 设置表格操作按钮事件
    function setupTableActions() {
        // 查看按钮
        const viewButtons = document.querySelectorAll('.btn-icon .fa-eye');
        viewButtons.forEach(btn => {
            btn.parentElement.addEventListener('click', function() {
                const row = this.closest('tr');
                const projectId = row.dataset.id;
                const projectName = row.querySelector('td:nth-child(2)').textContent;
                
                alert(`查看项目: ${projectName} (ID: ${projectId})`);
                // 在实际项目中，这里应该跳转到项目详情页面
            });
        });
        
        // 编辑按钮
        const editButtons = document.querySelectorAll('.btn-icon .fa-edit');
        editButtons.forEach(btn => {
            btn.parentElement.addEventListener('click', function() {
                const row = this.closest('tr');
                const projectId = row.dataset.id;
                const projectName = row.querySelector('td:nth-child(2)').textContent;
                
                alert(`编辑项目: ${projectName} (ID: ${projectId})`);
                // 在实际项目中，这里应该打开编辑表单
            });
        });
        
        // 删除按钮
        const deleteButtons = document.querySelectorAll('.btn-icon .fa-trash');
        deleteButtons.forEach(btn => {
            btn.parentElement.addEventListener('click', function() {
                const row = this.closest('tr');
                const projectId = row.dataset.id;
                const projectName = row.querySelector('td:nth-child(2)').textContent;
                
                if (confirm(`确定要删除项目 "${projectName}" 吗？`)) {
                    alert(`已删除项目: ${projectName} (ID: ${projectId})`);
                    // 在实际项目中，这里应该发送删除请求到后端
                    row.remove();
                }
            });
        });
    }
    
    // 添加退出登录功能
    const logoutLink = document.querySelector('a[href="login.html"]');
    if (logoutLink) {
        logoutLink.addEventListener('click', function(e) {
            e.preventDefault();
            // 清除登录状态
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('username');
            // 跳转到登录页面
            window.location.href = 'login.html';
        });
    }
});