#!/bin/bash
# ============================================
# 临床创新项目管理系统 - Linux 快速启动脚本
# Ubuntu 24.04 + x86架构
# ============================================

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 显示菜单
show_menu() {
    echo -e "${BLUE}==========================================${NC}"
    echo -e "${BLUE}临床创新项目管理系统 Docker 管理工具${NC}"
    echo -e "${BLUE}==========================================${NC}"
    echo ""
    echo "请选择操作："
    echo "[1] 首次部署（构建并启动）"
    echo "[2] 启动服务"
    echo "[3] 停止服务"
    echo "[4] 重启服务"
    echo "[5] 查看日志"
    echo "[6] 查看状态"
    echo "[7] 数据备份"
    echo "[8] 清理所有数据（危险！）"
    echo "[0] 退出"
    echo ""
}

# 首次部署
first_deploy() {
    echo -e "${YELLOW}[步骤1/5] 检查环境变量配置...${NC}"
    if [ ! -f .env.production ]; then
        echo -e "${RED}警告：.env.production 文件不存在！${NC}"
        echo "正在从模板创建..."
        cp .env.production.example .env.production
        echo ""
        echo -e "${YELLOW}请先编辑 .env.production 文件，配置数据库密码和JWT密钥！${NC}"
        echo "使用命令: vim .env.production"
        echo ""
        read -p "配置完成后按回车继续..."
    fi

    echo ""
    echo -e "${YELLOW}[步骤2/5] 检查Docker安装...${NC}"
    if ! command -v docker &> /dev/null; then
        echo -e "${RED}Docker未安装！请先安装Docker。${NC}"
        exit 1
    fi
    echo -e "${GREEN}✓ Docker已安装${NC}"

    echo ""
    echo -e "${YELLOW}[步骤3/5] 构建Docker镜像...${NC}"
    docker compose build

    echo ""
    echo -e "${YELLOW}[步骤4/5] 启动服务...${NC}"
    docker compose up -d

    echo ""
    echo -e "${YELLOW}[步骤5/5] 等待服务就绪...${NC}"
    sleep 10

    echo ""
    echo -e "${GREEN}==========================================${NC}"
    echo -e "${GREEN}部署完成！${NC}"
    echo -e "${GREEN}==========================================${NC}"
    echo -e "访问地址: ${BLUE}http://localhost:3000${NC}"
    echo -e "健康检查: ${BLUE}http://localhost:3000/api/health${NC}"
    echo -e "${GREEN}==========================================${NC}"
    echo ""
}

# 启动服务
start_service() {
    echo -e "${YELLOW}正在启动服务...${NC}"
    docker compose up -d
    echo -e "${GREEN}服务启动完成！${NC}"
    echo -e "访问地址: ${BLUE}http://localhost:3000${NC}"
}

# 停止服务
stop_service() {
    echo -e "${YELLOW}正在停止服务...${NC}"
    docker compose down
    echo -e "${GREEN}服务已停止！${NC}"
}

# 重启服务
restart_service() {
    echo -e "${YELLOW}正在重启服务...${NC}"
    docker compose restart
    echo -e "${GREEN}服务重启完成！${NC}"
}

# 查看日志
view_logs() {
    echo -e "${YELLOW}查看日志（按 Ctrl+C 退出）...${NC}"
    echo ""
    docker compose logs -f
}

# 查看状态
view_status() {
    echo -e "${BLUE}==========================================${NC}"
    echo -e "${BLUE}服务状态${NC}"
    echo -e "${BLUE}==========================================${NC}"
    docker compose ps
    echo ""
    echo -e "${BLUE}==========================================${NC}"
    echo -e "${BLUE}容器资源使用${NC}"
    echo -e "${BLUE}==========================================${NC}"
    docker stats --no-stream
    echo ""
}

# 数据备份
backup_data() {
    BACKUP_DIR="./backups/$(date +%Y%m%d_%H%M%S)"
    mkdir -p "$BACKUP_DIR"
    
    echo -e "${YELLOW}正在备份数据...${NC}"
    
    # 备份MongoDB
    echo "备份MongoDB数据库..."
    docker exec clinical-mongodb mongodump \
        -u admin \
        -p "$(grep MONGO_ROOT_PASSWORD .env.production | cut -d'=' -f2)" \
        --authenticationDatabase admin \
        --out /data/backup
    
    docker cp clinical-mongodb:/data/backup "$BACKUP_DIR/mongodb"
    
    # 备份上传文件
    echo "备份上传文件..."
    docker run --rm \
        -v clinical_uploads_data:/data \
        -v "$(pwd)/$BACKUP_DIR":/backup \
        alpine tar czf /backup/uploads.tar.gz /data
    
    echo -e "${GREEN}备份完成！${NC}"
    echo -e "备份位置: ${BLUE}$BACKUP_DIR${NC}"
}

# 清理数据
clean_all() {
    echo -e "${RED}==========================================${NC}"
    echo -e "${RED}警告：此操作将删除所有数据！${NC}"
    echo -e "${RED}==========================================${NC}"
    echo "包括："
    echo "- Docker容器"
    echo "- Docker镜像"
    echo "- 数据库数据"
    echo "- 上传的文件"
    echo ""
    read -p "确认删除？(yes/no): " confirm
    
    if [ "$confirm" != "yes" ]; then
        echo -e "${YELLOW}操作已取消${NC}"
        return
    fi
    
    echo -e "${YELLOW}正在清理...${NC}"
    docker compose down -v
    docker system prune -a -f
    echo -e "${GREEN}清理完成！${NC}"
}

# 主循环
main() {
    while true; do
        show_menu
        read -p "请输入选项 (0-8): " choice
        echo ""
        
        case $choice in
            1)
                first_deploy
                ;;
            2)
                start_service
                ;;
            3)
                stop_service
                ;;
            4)
                restart_service
                ;;
            5)
                view_logs
                ;;
            6)
                view_status
                ;;
            7)
                backup_data
                ;;
            8)
                clean_all
                ;;
            0)
                echo -e "${GREEN}再见！${NC}"
                exit 0
                ;;
            *)
                echo -e "${RED}无效选项，请重新选择${NC}"
                ;;
        esac
        
        echo ""
        read -p "按回车继续..."
        clear
    done
}

# 执行主程序
main
