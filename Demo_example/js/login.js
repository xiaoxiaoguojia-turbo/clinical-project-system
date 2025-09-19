document.addEventListener('DOMContentLoaded', function() {
    // 获取登录表单元素
    const loginForm = document.getElementById('loginForm');
    
    // 添加表单提交事件监听器
    loginForm.addEventListener('submit', function(event) {
        event.preventDefault(); // 阻止表单默认提交行为
        
        // 获取用户输入
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        // 默认账号和密码
        const defaultUsername = 'admin_hhzn';
        const defaultPassword = '123456';
        
        // 创建或获取错误提示元素
        let errorMessage = document.getElementById('error-message');
        if (!errorMessage) {
            errorMessage = document.createElement('div');
            errorMessage.id = 'error-message';
            errorMessage.style.color = '#ff3d00';
            errorMessage.style.fontSize = '14px';
            errorMessage.style.marginTop = '10px';
            errorMessage.style.textAlign = 'center';
            loginForm.insertBefore(errorMessage, document.querySelector('.login-btn'));
        }
        
        // 验证用户名和密码
        if (!username || !password) {
            errorMessage.textContent = '用户名或密码不能为空！';
            shakeForm();
            return;
        }
        
        // 验证默认账号密码
        if (username === defaultUsername && password === defaultPassword) {
            // 显示加载状态
            const loginBtn = document.querySelector('.login-btn');
            const originalText = loginBtn.textContent;
            loginBtn.disabled = true;
            loginBtn.innerHTML = '<i class="fa fa-spinner fa-spin"></i> 登录中...';
            
            // 模拟登录过程
            setTimeout(function() {
                // 登录成功，保存登录状态到 localStorage
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('username', username);
                
                // 跳转到系统首页
                window.location.href = 'dashboard.html';
            }, 1500);
        } else {
            // 登录失败
            errorMessage.textContent = '用户名或密码错误！';
            shakeForm();
        }
    });
    
    // 表单抖动效果
    function shakeForm() {
        const formContainer = document.querySelector('.login-form-container');
        formContainer.classList.add('shake');
        setTimeout(() => {
            formContainer.classList.remove('shake');
        }, 500);
    }
    
    // 添加输入框焦点效果
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.style.borderColor = '#1976d2';
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.style.borderColor = '';
        });
    });
    
    // 添加页面加载动画效果
    window.addEventListener('load', function() {
        document.querySelector('.login-container').style.opacity = '0';
        setTimeout(function() {
            document.querySelector('.login-container').style.opacity = '1';
            document.querySelector('.login-container').style.transition = 'opacity 0.5s ease';
        }, 100);
        
        // 检查是否已登录
        if (localStorage.getItem('isLoggedIn') === 'true') {
            window.location.href = 'dashboard.html';
        }
    });
});