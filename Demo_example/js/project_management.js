// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 检查登录状态
    checkLoginStatus();
    
    // 显示用户名
    displayUsername();
    
    // 初始化项目类型切换
    initProjectTypeSwitch();
    
    // 初始化过滤器
    initFilters();
    
    // 初始化新增项目按钮
    initAddProjectButton();
    
    // 初始化模态框
    initModal();
    
    // 加载项目数据（默认加载项目进度概况表）
    loadProjectData();
    
    // 初始化批量操作按钮
    initBatchOperations();
    
    // 初始化分页控件
    initPagination();
});

// 检查登录状态
function checkLoginStatus() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
        window.location.href = 'login.html';
    }
}

// 显示用户名
function displayUsername() {
    const username = localStorage.getItem('username');
    if (username) {
        document.querySelector('.user-name').textContent = username;
    }
}

// 初始化项目类型切换
function initProjectTypeSwitch() {
    const projectTypeItems = document.querySelectorAll('.project-type li');
    
    projectTypeItems.forEach(item => {
        item.addEventListener('click', function() {
            projectTypeItems.forEach(i => i.classList.remove('active'));
            this.classList.add('active');
            
            const projectType = this.getAttribute('data-type');
            console.log('切换到项目类型:', projectType);
            
            // 显示加载中
            showLoading();
            
            // 根据项目类型切换表格标题和列
            if (projectType === 'progress') {
                document.querySelector('.table-header h3').textContent = '项目进度概况表';
                // 加载项目进度概况表数据
                setTimeout(() => {
                    loadProjectData();
                    hideLoading();
                }, 500);
            } else if (projectType === 'preparation') {
                document.querySelector('.table-header h3').textContent = '院内制剂表';
                // 加载院内制剂表数据
                setTimeout(() => {
                    loadPreparationData();
                    hideLoading();
                }, 500);
            }
        });
    });
}

// 初始化过滤器
function initFilters() {
    const filterBtn = document.querySelector('.filter-btn');
    const resetBtn = document.querySelector('.filter-btn.reset');
    
    filterBtn.addEventListener('click', function() {
        const timeRange = document.getElementById('timeRange').value;
        const projectStatus = document.getElementById('projectStatus').value;
        const department = document.getElementById('department').value;
        const searchInput = document.getElementById('searchInput').value;
        
        console.log('过滤条件:', { timeRange, projectStatus, department, searchInput });
        
        showLoading();
        
        // 模拟过滤后的数据加载
        setTimeout(() => {
            loadProjectData({ timeRange, projectStatus, department, searchInput });
            hideLoading();
        }, 500);
    });
    
    resetBtn.addEventListener('click', function() {
        document.getElementById('timeRange').value = 'current';
        document.getElementById('projectStatus').value = 'all';
        document.getElementById('department').value = 'all';
        document.getElementById('searchInput').value = '';
        
        showLoading();
        
        // 重置后加载所有数据
        setTimeout(() => {
            loadProjectData();
            hideLoading();
        }, 500);
    });
}

// 初始化新增项目按钮
function initAddProjectButton() {
    const addProjectBtn = document.getElementById('addProjectBtn');
    addProjectBtn.addEventListener('click', function() {
        // 根据当前选中的项目类型，打开相应的模态框
        const projectType = document.querySelector('.project-type-item.active').getAttribute('data-type');
        
        if (projectType === 'progress') {
            // 打开新增项目模态框
            openModal('新增项目');
        } else if (projectType === 'preparation') {
            // 打开新增院内制剂模态框
            openModal('新增院内制剂');
        }
    });
}

// 初始化模态框
function initModal() {
    const modal = document.getElementById('projectModal');
    const closeBtn = modal.querySelector('.close-btn');
    const cancelBtn = document.getElementById('cancelBtn');
    const saveBtn = document.getElementById('saveBtn');
    const projectForm = document.getElementById('projectForm');
    const fileInput = document.getElementById('attachments');
    
    // 关闭按钮事件
    closeBtn.addEventListener('click', closeModal);
    
    // 取消按钮事件
    cancelBtn.addEventListener('click', closeModal);
    
    // 保存按钮事件
    saveBtn.addEventListener('click', function() {
        // 表单验证
        if (projectForm.checkValidity()) {
            saveProject();
        } else {
            // 触发浏览器的表单验证
            const submitEvent = new Event('submit', {
                bubbles: true,
                cancelable: true
            });
            projectForm.dispatchEvent(submitEvent);
        }
    });
    
    // 阻止表单默认提交行为
    projectForm.addEventListener('submit', function(event) {
        event.preventDefault();
    });
    
    // 文件上传预览
    fileInput.addEventListener('change', function() {
        const fileList = document.getElementById('fileList');
        if (this.files.length > 0) {
            let fileNames = '';
            for (let i = 0; i < this.files.length; i++) {
                fileNames += this.files[i].name + (i < this.files.length - 1 ? ', ' : '');
            }
            fileList.textContent = fileNames;
        } else {
            fileList.textContent = '未选择任何文件';
        }
    });
}

// 加载项目数据
function loadProjectData(filters = {}) {
    showLoading();
    
    // 模拟从后端获取数据
    setTimeout(() => {
        // 模拟项目数据（参考图一中的信息）
        const projects = [
            {
                id: 1,
                name: '国家级别 某个人民医院 某个项目名称',
                hospital: '北京某医院',
                manager: '王医生',
                phone: '13800000001',
                startDate: '2024/10/1',
                endDate: '2025/7/2',
                status: 'inProgress',
                budget: 40
            },
            {
                id: 2,
                name: '药物研发 临床试验项目',
                hospital: '上海某医院',
                manager: '李研究员',
                phone: '13800000002',
                startDate: '2024/9/15',
                endDate: '2025/6/30',
                status: 'inProgress',
                budget: 37
            },
            {
                id: 3,
                name: '医疗设备 研发创新项目',
                hospital: '广州某医院',
                manager: '张工程师',
                phone: '13800000003',
                startDate: '2024/8/1',
                endDate: '2025/5/15',
                status: 'completed',
                budget: 35
            },
            {
                id: 4,
                name: '医学影像技术研究项目',
                hospital: '深圳某医院',
                manager: '刘博士',
                phone: '13800000004',
                startDate: '2024/11/10',
                endDate: '2025/8/20',
                status: 'pending',
                budget: 33
            },
            {
                id: 5,
                name: '远程医疗系统开发项目',
                hospital: '武汉某医院',
                manager: '陈工程师',
                phone: '13800000005',
                startDate: '2024/12/5',
                endDate: '2025/9/10',
                status: 'inProgress',
                budget: 34
            },
            {
                id: 6,
                name: '人工智能辅助诊断系统',
                hospital: '成都某医院',
                manager: '赵研究员',
                phone: '13800000006',
                startDate: '2024/10/20',
                endDate: '2025/7/15',
                status: 'inProgress',
                budget: 34
            },
            {
                id: 7,
                name: '中医药现代化研究项目',
                hospital: '南京某医院',
                manager: '钱教授',
                phone: '13800000007',
                startDate: '2024/9/1',
                endDate: '2025/6/1',
                status: 'completed',
                budget: 31
            },
            {
                id: 8,
                name: '慢性病防治研究项目',
                hospital: '杭州某医院',
                manager: '孙主任',
                phone: '13800000008',
                startDate: '2024/11/15',
                endDate: '2025/8/15',
                status: 'pending',
                budget: 33
            },
            {
                id: 9,
                name: '儿科疾病诊疗新方法研究',
                hospital: '天津某医院',
                manager: '周医生',
                phone: '13800000009',
                startDate: '2024/12/10',
                endDate: '2025/9/20',
                status: 'inProgress',
                budget: 32
            },
            {
                id: 10,
                name: '康复医学新技术应用研究',
                hospital: '重庆某医院',
                manager: '吴教授',
                phone: '13800000010',
                startDate: '2024/10/5',
                endDate: '2025/7/10',
                status: 'inProgress',
                budget: 32
            }
        ];
        
        // 应用过滤条件（如果有）
        let filteredProjects = [...projects];
        
        if (filters.projectStatus && filters.projectStatus !== 'all') {
            filteredProjects = filteredProjects.filter(project => project.status === filters.projectStatus);
        }
        
        if (filters.department && filters.department !== 'all') {
            filteredProjects = filteredProjects.filter(project => {
                if (filters.department === 'dept1' && project.hospital.includes('北京')) return true;
                if (filters.department === 'dept2' && project.hospital.includes('上海')) return true;
                if (filters.department === 'dept3' && project.hospital.includes('广州')) return true;
                return false;
            });
        }
        
        if (filters.searchInput) {
            const searchTerm = filters.searchInput.toLowerCase();
            filteredProjects = filteredProjects.filter(project => 
                project.name.toLowerCase().includes(searchTerm) || 
                project.manager.toLowerCase().includes(searchTerm)
            );
        }
        
        // 渲染表格
        renderProjectTable(filteredProjects);
        
        hideLoading();
    }, 500);
}

// 渲染项目表格
function renderProjectTable(projects) {
    const tbody = document.querySelector('.data-table tbody');
    tbody.innerHTML = '';
    
    if (projects.length === 0) {
        tbody.innerHTML = '<tr><td colspan="11" style="text-align: center; padding: 20px;">暂无数据</td></tr>';
        return;
    }
    
    projects.forEach(project => {
        const tr = document.createElement('tr');
        
        // 状态文本和样式类
        let statusText = '';
        let statusClass = '';
        
        switch (project.status) {
            case 'pending':
                statusText = '待启动';
                statusClass = 'pending';
                break;
            case 'inProgress':
                statusText = '进行中';
                statusClass = 'in-progress';
                break;
            case 'completed':
                statusText = '已完成';
                statusClass = 'completed';
                break;
            case 'suspended':
                statusText = '已暂停';
                statusClass = 'suspended';
                break;
        }
        
        tr.innerHTML = `
            <td><input type="checkbox" data-id="${project.id}"></td>
            <td>${project.id}</td>
            <td>${project.name}</td>
            <td>${project.hospital}</td>
            <td>${project.manager}</td>
            <td>${project.phone}</td>
            <td>${project.startDate}</td>
            <td>${project.endDate || '-'}</td>
            <td><span class="status ${statusClass}">${statusText}</span></td>
            <td>${project.budget} 万元</td>
            <td>
                <div class="action-icons">
                    <button class="view-btn" data-id="${project.id}" title="查看"><i class="fa fa-eye"></i></button>
                    <button class="edit-btn" data-id="${project.id}" title="编辑"><i class="fa fa-pencil"></i></button>
                    <button class="delete-btn" data-id="${project.id}" title="删除"><i class="fa fa-trash"></i></button>
                </div>
            </td>
        `;
        
        tbody.appendChild(tr);
    });
    
    // 添加表格行操作事件
    setupTableRowActions();
}

// 设置表格行操作事件
function setupTableRowActions() {
    // 查看按钮
    const viewButtons = document.querySelectorAll('.view-btn');
    viewButtons.forEach(button => {
        button.addEventListener('click', function() {
            const projectId = this.getAttribute('data-id');
            viewProject(projectId);
        });
    });
    
    // 编辑按钮
    const editButtons = document.querySelectorAll('.edit-btn');
    editButtons.forEach(button => {
        button.addEventListener('click', function() {
            const projectId = this.getAttribute('data-id');
            editProject(projectId);
        });
    });
    
    // 删除按钮
    const deleteButtons = document.querySelectorAll('.delete-btn');
    deleteButtons.forEach(button => {
        button.addEventListener('click', function() {
            const projectId = this.getAttribute('data-id');
            deleteProject(projectId);
        });
    });
}

// 查看项目详情
function viewProject(projectId) {
    console.log('查看项目:', projectId);
    
    // 模拟获取项目详情
    const project = getProjectById(projectId);
    
    if (project) {
        // 设置模态框标题
        document.getElementById('modalTitle').textContent = '查看项目详情';
        
        // 填充表单数据
        document.getElementById('projectId').value = project.id;
        document.getElementById('projectName').value = project.name;
        document.getElementById('hospital').value = project.hospital;
        document.getElementById('manager').value = project.manager;
        document.getElementById('phone').value = project.phone;
        document.getElementById('startDate').value = formatDateForInput(project.startDate);
        document.getElementById('endDate').value = project.endDate ? formatDateForInput(project.endDate) : '';
        document.getElementById('status').value = project.status;
        document.getElementById('budget').value = project.budget;
        document.getElementById('description').value = project.description || '';
        
        // 设置表单为只读
        setFormReadOnly(true);
        
        // 隐藏保存按钮，只显示取消按钮，并将取消按钮文本改为"关闭"
        document.getElementById('saveBtn').style.display = 'none';
        document.getElementById('cancelBtn').textContent = '关闭';
        
        // 显示模态框
        openModal();
    } else {
        alert('未找到项目信息');
    }
}

// 编辑项目
function editProject(projectId) {
    console.log('编辑项目:', projectId);
    
    // 模拟获取项目详情
    const project = getProjectById(projectId);
    
    if (project) {
        // 设置模态框标题
        document.getElementById('modalTitle').textContent = '编辑项目';
        
        // 填充表单数据
        document.getElementById('projectId').value = project.id;
        document.getElementById('projectName').value = project.name;
        document.getElementById('hospital').value = project.hospital;
        document.getElementById('manager').value = project.manager;
        document.getElementById('phone').value = project.phone;
        document.getElementById('startDate').value = formatDateForInput(project.startDate);
        document.getElementById('endDate').value = project.endDate ? formatDateForInput(project.endDate) : '';
        document.getElementById('status').value = project.status;
        document.getElementById('budget').value = project.budget;
        document.getElementById('description').value = project.description || '';
        
        // 设置表单为可编辑
        setFormReadOnly(false);
        
        // 显示保存和取消按钮
        document.getElementById('saveBtn').style.display = 'block';
        document.getElementById('cancelBtn').textContent = '取消';
        
        // 显示模态框
        openModal();
    } else {
        alert('未找到项目信息');
    }
}

// 删除项目
function deleteProject(projectId) {
    console.log('删除项目:', projectId);
    
    if (confirm('确定要删除该项目吗？')) {
        showLoading();
        
        // 模拟删除操作
        setTimeout(() => {
            // 关闭模态框
            closeModal();
            
            // 重新加载数据
            loadProjectData();
            
            hideLoading();
            
            // 显示成功提示
            alert('删除成功');
        }, 500);
    }
}

// 根据ID获取项目信息（模拟）
function getProjectById(id) {
    // 模拟项目详情数据
    const projects = [
        {
            id: 1,
            name: '国家级别 某个人民医院 某个项目名称',
            hospital: '北京某医院',
            manager: '王医生',
            phone: '13800000001',
            startDate: '2024/10/1',
            endDate: '2025/7/2',
            status: 'inProgress',
            budget: 40,
            description: '这是一个国家级别的医疗研究项目，旨在提高医疗服务质量和效率。项目涉及多个医疗机构的协作，预计将在2025年7月完成。'
        },
        {
            id: 2,
            name: '药物研发 临床试验项目',
            hospital: '上海某医院',
            manager: '李研究员',
            phone: '13800000002',
            startDate: '2024/9/15',
            endDate: '2025/6/30',
            status: 'inProgress',
            budget: 37,
            description: '该项目专注于新型药物的研发和临床试验，目前处于第二阶段的临床试验中。项目由多位资深研究员共同参与，预计将为多种疾病提供新的治疗方案。'
        },
        {
            id: 3,
            name: '医疗设备 研发创新项目',
            hospital: '广州某医院',
            manager: '张工程师',
            phone: '13800000003',
            startDate: '2024/8/1',
            endDate: '2025/5/15',
            status: 'completed',
            budget: 35,
            description: '该项目已成功研发出新一代医疗影像设备，大幅提高了诊断的准确性和效率。项目成果已申请多项专利，并准备进入产业化阶段。'
        }
    ];
    
    return projects.find(project => project.id === parseInt(id));
}

// 显示加载中遮罩
function showLoading() {
    document.querySelector('.loading-overlay').style.display = 'flex';
}

// 隐藏加载中遮罩
function hideLoading() {
    document.querySelector('.loading-overlay').style.display = 'none';
}

// 加载院内制剂表数据
function loadPreparationData() {
    showLoading();
    
    // 模拟从后端获取数据
    setTimeout(() => {
        // 模拟院内制剂表数据（参考图二中的信息）
        const preparations = [
            {
                id: 1,
                name: '转移转化与投资部一号',
                hospital: '上海市某医院',
                department: '消化科研组',
                ingredients: '成分1, 成分2, 成分3等',
                indication: '适用于多种消化系统疾病',
                period: '30年',
                approvalNumber: '国药准字Z20190001'
            },
            {
                id: 2,
                name: '转移转化与投资部二号',
                hospital: '上海市某医院',
                department: '心内科研组',
                ingredients: '成分A, 成分B, 成分C等',
                indication: '适用于心血管系统疾病',
                period: '30年',
                approvalNumber: '国药准字Z20190002'
            },
            {
                id: 3,
                name: '转移转化与投资部三号',
                hospital: '复旦医院',
                department: '神经内科',
                ingredients: '成分X, 成分Y, 成分Z等',
                indication: '适用于神经系统疾病',
                period: '20年',
                approvalNumber: '国药准字Z20190003'
            },
            {
                id: 4,
                name: '转移转化与投资部四号',
                hospital: '复旦医院',
                department: '骨科研究所',
                ingredients: '成分甲, 成分乙, 成分丙等',
                indication: '适用于骨科疾病',
                period: '20年',
                approvalNumber: '国药准字Z20190004'
            },
            {
                id: 5,
                name: '转移转化与投资部五号',
                hospital: '复旦医院',
                department: '皮肤科研究所',
                ingredients: '成分1, 成分2, 成分3等',
                indication: '适用于皮肤疾病',
                period: '15年',
                approvalNumber: '国药准字Z20190005'
            }
        ];
        
        // 渲染院内制剂表
        renderPreparationTable(preparations);
        
        hideLoading();
    }, 500);
}

// 渲染院内制剂表
function renderPreparationTable(preparations) {
    // 修改表格列标题
    const thead = document.querySelector('.data-table thead tr');
    thead.innerHTML = `
        <th width="40"><input type="checkbox" id="selectAll"></th>
        <th width="60">序号</th>
        <th width="180">制剂名称</th>
        <th width="120">所在医院</th>
        <th width="120">研究部门</th>
        <th width="150">主要成分</th>
        <th width="150">适应症</th>
        <th width="100">有效期限</th>
        <th width="150">批准文号</th>
        <th width="120">操作</th>
    `;
    
    const tbody = document.querySelector('.data-table tbody');
    tbody.innerHTML = '';
    
    if (preparations.length === 0) {
        tbody.innerHTML = '<tr><td colspan="10" style="text-align: center; padding: 20px;">暂无数据</td></tr>';
        return;
    }
    
    preparations.forEach(prep => {
        const tr = document.createElement('tr');
        
        tr.innerHTML = `
            <td><input type="checkbox" data-id="${prep.id}"></td>
            <td>${prep.id}</td>
            <td>${prep.name}</td>
            <td>${prep.hospital}</td>
            <td>${prep.department}</td>
            <td>${prep.ingredients}</td>
            <td>${prep.indication}</td>
            <td>${prep.period}</td>
            <td>${prep.approvalNumber}</td>
            <td>
                <div class="action-icons">
                    <button class="view-btn" data-id="${prep.id}" title="查看"><i class="fa fa-eye"></i></button>
                    <button class="edit-btn" data-id="${prep.id}" title="编辑"><i class="fa fa-pencil"></i></button>
                    <button class="delete-btn" data-id="${prep.id}" title="删除"><i class="fa fa-trash"></i></button>
                </div>
            </td>
        `;
        
        tbody.appendChild(tr);
    });
    
    // 重新绑定全选事件
    document.getElementById('selectAll').addEventListener('change', function() {
        const checkboxes = document.querySelectorAll('tbody input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.checked = this.checked;
        });
    });
    
    // 添加表格行操作事件
    setupTableRowActions();
}

// 初始化分页控件
function initPagination() {
    const pageLinks = document.querySelectorAll('.pagination .page-link');
    const pageSizeSelect = document.getElementById('pageSize');
    
    // 页码点击事件
    pageLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // 移除所有页码的active类
            pageLinks.forEach(item => {
                item.parentElement.classList.remove('active');
            });
            
            // 为当前点击的页码添加active类
            this.parentElement.classList.add('active');
            
            // 模拟页面切换
            showLoading();
            setTimeout(() => {
                hideLoading();
            }, 300);
        });
    });
    
    // 每页显示数量变化事件
    pageSizeSelect.addEventListener('change', function() {
        // 模拟页面重新加载
        showLoading();
        setTimeout(() => {
            hideLoading();
        }, 300);
    });
}

// 导出选中项目
function exportSelectedProjects() {
    const selectedCheckboxes = document.querySelectorAll('tbody input[type="checkbox"]:checked');
    const selectedIds = Array.from(selectedCheckboxes).map(checkbox => checkbox.getAttribute('data-id'));
    
    if (selectedIds.length === 0) {
        alert('请先选择要导出的项目');
        return;
    }
    
    console.log('导出选中的项目:', selectedIds);
    
    // 模拟导出操作
    showLoading();
    setTimeout(() => {
        hideLoading();
        alert(`已成功导出 ${selectedIds.length} 个项目`);
    }, 800);
}

// 批量删除选中项目
function deleteSelectedProjects() {
    const selectedCheckboxes = document.querySelectorAll('tbody input[type="checkbox"]:checked');
    const selectedIds = Array.from(selectedCheckboxes).map(checkbox => checkbox.getAttribute('data-id'));
    
    if (selectedIds.length === 0) {
        alert('请先选择要删除的项目');
        return;
    }
    
    if (confirm(`确定要删除选中的 ${selectedIds.length} 个项目吗？`)) {
        console.log('删除选中的项目:', selectedIds);
        
        // 模拟删除操作
        showLoading();
        setTimeout(() => {
            // 重新加载数据
            const projectType = document.querySelector('.project-type-item.active').getAttribute('data-type');
            if (projectType === 'progress') {
                loadProjectData();
            } else if (projectType === 'preparation') {
                loadPreparationData();
            }
            
            hideLoading();
            alert(`已成功删除 ${selectedIds.length} 个项目`);
        }, 800);
    }
}

// 初始化批量操作按钮
function initBatchOperations() {
    // 导出按钮
    const exportBtn = document.getElementById('exportBtn');
    exportBtn.addEventListener('click', exportSelectedProjects);
    
    // 批量删除按钮
    const batchDeleteBtn = document.getElementById('batchDeleteBtn');
    batchDeleteBtn.addEventListener('click', deleteSelectedProjects);
    
    // 打印按钮
    const printBtn = document.getElementById('printBtn');
    printBtn.addEventListener('click', function() {
        window.print();
    });
}

// 打开模态框
function openModal(title) {
    const modal = document.getElementById('projectModal');
    
    if (title) {
        document.getElementById('modalTitle').textContent = title;
        
        // 如果是新增项目，清空表单
        if (title === '新增项目') {
            document.getElementById('projectForm').reset();
            document.getElementById('projectId').value = '';
            document.getElementById('fileList').textContent = '未选择任何文件';
            
            // 设置表单为可编辑
            setFormReadOnly(false);
            
            // 显示保存和取消按钮
            document.getElementById('saveBtn').style.display = 'block';
            document.getElementById('cancelBtn').textContent = '取消';
        }
    }
    
    // 显示模态框
    modal.style.display = 'flex';
}

// 关闭模态框
function closeModal() {
    const modal = document.getElementById('projectModal');
    modal.style.display = 'none';
}

// 设置表单是否只读
function setFormReadOnly(readOnly) {
    const formElements = document.querySelectorAll('#projectForm input, #projectForm select, #projectForm textarea');
    
    formElements.forEach(element => {
        element.readOnly = readOnly;
        
        // select元素需要使用disabled属性
        if (element.tagName === 'SELECT') {
            element.disabled = readOnly;
        }
    });
    
    // 特殊处理文件上传
    const fileUpload = document.querySelector('.file-upload');
    if (readOnly) {
        fileUpload.style.pointerEvents = 'none';
        fileUpload.style.opacity = '0.7';
    } else {
        fileUpload.style.pointerEvents = 'auto';
        fileUpload.style.opacity = '1';
    }
}

// 保存项目
function saveProject() {
    showLoading();
    
    // 获取表单数据
    const projectId = document.getElementById('projectId').value;
    const projectName = document.getElementById('projectName').value;
    const hospital = document.getElementById('hospital').value;
    const manager = document.getElementById('manager').value;
    const phone = document.getElementById('phone').value;
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    const status = document.getElementById('status').value;
    const budget = document.getElementById('budget').value;
    const description = document.getElementById('description').value;
    
    // 构建项目数据对象
    const projectData = {
        id: projectId ? parseInt(projectId) : null,
        name: projectName,
        hospital: hospital,
        manager: manager,
        phone: phone,
        startDate: formatDateForDisplay(startDate),
        endDate: endDate ? formatDateForDisplay(endDate) : '',
        status: status,
        budget: parseFloat(budget),
        description: description
    };
    
    console.log('保存项目数据:', projectData);
    
    // 模拟保存操作
    setTimeout(() => {
        // 关闭模态框
        closeModal();
        
        // 重新加载数据
        loadProjectData();
        
        hideLoading();
        
        // 显示成功提示
        alert(projectId ? '项目更新成功' : '项目添加成功');
    }, 800);
}

// 日期格式化：转换为输入框格式 (YYYY-MM-DD)
function formatDateForInput(dateStr) {
    // 处理不同的日期格式
    if (!dateStr) return '';
    
    let date;
    if (dateStr.includes('/')) {
        // 处理 YYYY/MM/DD 或 MM/DD/YYYY 格式
        const parts = dateStr.split('/');
        if (parts[0].length === 4) {
            // YYYY/MM/DD
            date = new Date(parts[0], parts[1] - 1, parts[2]);
        } else {
            // MM/DD/YYYY
            date = new Date(parts[2], parts[0] - 1, parts[1]);
        }
    } else {
        // 尝试直接解析
        date = new Date(dateStr);
    }
    
    // 检查日期是否有效
    if (isNaN(date.getTime())) return '';
    
    // 格式化为 YYYY-MM-DD
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
}

// 日期格式化：转换为显示格式 (YYYY/MM/DD)
function formatDateForDisplay(dateStr) {
    if (!dateStr) return '';
    
    const date = new Date(dateStr);
    
    // 检查日期是否有效
    if (isNaN(date.getTime())) return '';
    
    // 格式化为 YYYY/MM/DD
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    return `${year}/${month}/${day}`;
}
