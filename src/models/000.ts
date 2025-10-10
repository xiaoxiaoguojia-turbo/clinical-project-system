// 统一项目接口定义
export interface IUnifiedProject {
  _id?: string;

  // 通用必填字段
  department: string;                       // 归属部门
  name: string;                             // 项目名称
  projectType: string;                      // 项目分类型
  source: string;                           // 医院来源
  importance: string;                       // 重要程度
  status: string;                           // 项目进展状态
  leader: string;                           // 负责人

  // 通用选填字段
  indication?: string;                      // 适应症/科室
  transformRequirement?: string;            // 转化需求（许可、转让、公司化运营、其他）
  xxx?: string;                             // 转化推进状态（签约已完成、未完成）
  hospitalDoctor?: string;                  // 院端医生
  patent?: string;                          // 专利信息
  clinicalData?: string;                    // 临床数据
  marketSize?: string;                      // 市场规模
  competitorStatus?: string;                // 竞品状态
  conclusion?: string;                      // 项目结论

  // 院内制剂特有字段

  // 院内制剂必填字段
  composition?: string;                     // 组方
  function?: string;                        // 功能

  // 院内制剂选填字段
  specification?: string;                   // 制剂规格
  duration?: string;                        // 使用年限
  recordNumber?: string;                    // 备案号

  // 其他类型特有字段

  // 其他类型必填字段
  startDate?: Date;                         // 开始日期

  // 系统字段
  attachments: string[];                    // 附件管理数组
  createTime: Date;                         // 创建时间
  updateTime: Date;                         // 更新时间
  createdBy: string;                        // 创建人

  // AI报告
  aiReport?: {
    reportUrl?: string;
    status: string;
    firstGeneratedAt?: Date;
    lastGeneratedAt?: Date;
  };
}
