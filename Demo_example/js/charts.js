// 初始化所有图表
function initializeCharts() {
    // 项目阶段分布图表
    initializeProjectStageChart();
    
    // 项目完成率趋势图表
    initializeCompletionTrendChart();
    
    // 各部门项目数量图表
    initializeDepartmentProjectsChart();
    
    // 院内制剂使用年限分布图表
    initializePreparationUsageChart();
}

// 项目阶段分布图表
function initializeProjectStageChart() {
    const ctx = document.getElementById('projectStageChart').getContext('2d');
    
    // 模拟数据
    const data = {
        labels: ['项目一', '项目二', '项目三'],
        datasets: [{
            label: '项目数量',
            data: [15, 20, 7],
            backgroundColor: [
                'rgba(25, 118, 210, 0.7)',
                'rgba(76, 175, 80, 0.7)',
                'rgba(255, 152, 0, 0.7)'
            ],
            borderColor: [
                'rgba(25, 118, 210, 1)',
                'rgba(76, 175, 80, 1)',
                'rgba(255, 152, 0, 1)'
            ],
            borderWidth: 1
        }]
    };
    
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    font: {
                        family: '"Microsoft YaHei", sans-serif',
                        size: 12
                    }
                }
            },
            title: {
                display: false
            }
        }
    };
    
    new Chart(ctx, {
        type: 'pie',
        data: data,
        options: options
    });
}

// 项目完成率趋势图表
function initializeCompletionTrendChart() {
    const ctx = document.getElementById('completionTrendChart').getContext('2d');
    
    // 模拟数据
    const data = {
        labels: ['1月', '2月', '3月', '4月', '5月', '6月'],
        datasets: [{
            label: '项目完成率',
            data: [30, 35, 40, 50, 60, 65],
            fill: false,
            borderColor: 'rgba(25, 118, 210, 1)',
            tension: 0.4,
            pointBackgroundColor: 'rgba(25, 118, 210, 1)'
        }]
    };
    
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    font: {
                        family: '"Microsoft YaHei", sans-serif',
                        size: 12
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                max: 100,
                ticks: {
                    callback: function(value) {
                        return value + '%';
                    }
                }
            }
        }
    };
    
    new Chart(ctx, {
        type: 'line',
        data: data,
        options: options
    });
}

// 各部门项目数量图表
function initializeDepartmentProjectsChart() {
    const ctx = document.getElementById('departmentProjectsChart').getContext('2d');
    
    // 模拟数据
    const data = {
        labels: ['北京某医院', '复旦大学附属医院', '上海交通大学医学院', '中山大学附属医院', '浙江大学医学院'],
        datasets: [{
            label: '项目数量',
            data: [12, 9, 8, 7, 6],
            backgroundColor: 'rgba(25, 118, 210, 0.7)',
            borderColor: 'rgba(25, 118, 210, 1)',
            borderWidth: 1
        }]
    };
    
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    font: {
                        family: '"Microsoft YaHei", sans-serif',
                        size: 12
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true
            }
        }
    };
    
    new Chart(ctx, {
        type: 'bar',
        data: data,
        options: options
    });
}

// 院内制剂使用年限分布图表
function initializePreparationUsageChart() {
    const ctx = document.getElementById('preparationUsageChart').getContext('2d');
    
    // 模拟数据
    const data = {
        labels: ['5年以下', '5-10年', '10-15年', '15-20年', '20年以上'],
        datasets: [{
            label: '制剂数量',
            data: [5, 12, 8, 7, 4],
            backgroundColor: [
                'rgba(25, 118, 210, 0.7)',
                'rgba(76, 175, 80, 0.7)',
                'rgba(255, 152, 0, 0.7)',
                'rgba(121, 85, 72, 0.7)',
                'rgba(156, 39, 176, 0.7)'
            ],
            borderColor: [
                'rgba(25, 118, 210, 1)',
                'rgba(76, 175, 80, 1)',
                'rgba(255, 152, 0, 1)',
                'rgba(121, 85, 72, 1)',
                'rgba(156, 39, 176, 1)'
            ],
            borderWidth: 1
        }]
    };
    
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    font: {
                        family: '"Microsoft YaHei", sans-serif',
                        size: 12
                    }
                }
            }
        }
    };
    
    new Chart(ctx, {
        type: 'doughnut',
        data: data,
        options: options
    });
}