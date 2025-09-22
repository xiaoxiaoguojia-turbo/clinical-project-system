# 使用说明

Header 的 token 为：
sat_wdiLBGPfC1CJJ6k9vuNRabHI4XQg5zO4aPr1XI7q489pVuVKUV1BjJmWSfdNjgII

workflow_id 为：
7547613197532938275

parameters 为：
如图一所示，是一个 json 格式的字符串，包括 bumen、laiyuan、yaofang、zufang、function、guige、nianxian、yongliang、beianhao、zhuanli 共 10 个输入参数

is_async 为：
false（默认），而且 true 目前无法设置

返回参数中的 data 为：
（一个示例为：）
{
"output": "https://jd4omasmev.feishu.cn/docx/RlmWdBSi2ourIsx3yIicHCUJnVf"
}

# parameters 与数据库对应关系（重点）

InternalPreparationProject：
bumen 对应 department，
laiyuan 对应 source ,
yaofang 对应 name ,
zufang 对应 composition ,
function 对应 function ,
guige 对应 specification ,
nianxian 对应 duration ,
yongliang 对应 dosage ,
beianhao 对应 recordNumber ,
zhuanli 对应 patent，
在调用时，注意要和数据库中的字段、前端界面输入或展示的字段保持一致，这三者都要对应一致。

# 参考例子

我的调用为：

```curl
curl -X POST 'https://api.coze.cn/v1/workflow/run' \
-H "Authorization: Bearer sat_wdiLBGPfC1CJJ6k9vuNRabHI4XQg5zO4aPr1XI7q489pVuVKUV1BjJmWSfdNjgII" \
-H "Content-Type: application/json" \
-d '{
  "workflow_id": "7547613197532938275",
  "parameters": {
    "bumen": "转移转化与投资一部",
    "function": "补肾健脾，清热利湿。用于慢性乙型病毒性肝炎（肝着）脾肾亏虚证兼肝经湿热未尽证患者，症见脘闷腹胀、腰酸膝软、口干口苦、肝区不适、便溏粘秽等。",
    "guige": "开水冲服。一次1袋（15g），一日3次。",
    "laiyuan": "曙光医院",
    "yaofang": "巴芪灵猫颗粒",
    "yongliang": "15g/袋，15袋/包",
    "zufang": "巴戟肉、黄芪、淫羊藿、猫爪草、生地黄、蜜麸炒白术、灵芝、苦参、丹参、蜜麸炒青皮"
  },
  "is_async": false
}'
```

```JavaScript
// Our official coze sdk for JavaScript [coze-js](https://github.com/coze-dev/coze-js)
import { CozeAPI } from '@coze/api';

const apiClient = new CozeAPI({
  token: 'sat_wdiLBGPfC1CJJ6k9vuNRabHI4XQg5zO4aPr1XI7q489pVuVKUV1BjJmWSfdNjgII',
  baseURL: 'https://api.coze.cn'
});
const res = await apiClient.workflows.runs.create({
  workflow_id: '7547613197532938275',
  parameters: {
  "bumen": "转移转化与投资一部",
  "function": "补肾健脾，清热利湿。用于慢性乙型病毒性肝炎（肝着）脾肾亏虚证兼肝经湿热未尽证患者，症见脘闷腹胀、腰酸膝软、口干口苦、肝区不适、便溏粘秽等。",
  "guige": "开水冲服。一次1袋（15g），一日3次。",
  "laiyuan": "曙光医院",
  "yaofang": "巴芪灵猫颗粒",
  "yongliang": "15g/袋，15袋/包",
  "zufang": "巴戟肉、黄芪、淫羊藿、猫爪草、生地黄、蜜麸炒白术、灵芝、苦参、丹参、蜜麸炒青皮"
  },
  is_async: false
});
```

上面例子的返回结果为：

```
{"debug_url":"https://www.coze.cn/work_flow?execute_id=7552982979586474019&space_id=7521968679891501082&workflow_id=7547613197532938275&execute_mode=2","usage":{"output_count":8086,"input_count":15550,"token_count":23636},"detail":{"logid":"2025092302313095AF72394E54345C1D52"},"code":0,"msg":"","data":"{\"output\":\"https://jd4omasmev.feishu.cn/docx/RlmWdBSi2ourIsx3yIicHCUJnVf\"}"}
```
