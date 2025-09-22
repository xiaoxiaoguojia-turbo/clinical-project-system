import { CozeAPI, COZE_CN_BASE_URL } from '@coze/api';
import { Logger } from '@robotic/logs';
import { isNotEmpty } from '@robotic/shared';
import assert from 'assert';

const logger = Logger('CozeClient');
export class CozeClient {
  private static instance: CozeClient;
  private cozeApiClient: CozeAPI;
  private token: string;
  private topicWorkflowId: string;

  private constructor() {
    this.token = process.env.COZE_WORKFLOW_SAT_TOKEN!;
    this.topicWorkflowId = process.env.COZE_TOPIC_WORKFLOW_ID!;
    logger.log(`COZE_WORKFLOW_SAT_TOKEN: ${this.token}`);
    logger.log(`COZE_TOPIC_WORKFLOW_ID: ${this.topicWorkflowId}`);
    assert(isNotEmpty(this.token), 'COZE_WORKFLOW_SAT_TOKEN is not defined');
    assert(
      isNotEmpty(this.topicWorkflowId),
      'COZE_TOPIC_WORKFLOW_ID is not defined',
    );

    this.cozeApiClient = new CozeAPI({
      baseURL: COZE_CN_BASE_URL,
      token: this.token,
    });
  }

  public static getInstance(): CozeClient {
    if (!CozeClient.instance) {
      CozeClient.instance = new CozeClient();
    }
    return CozeClient.instance;
  }

  public getClient(): CozeAPI {
    return this.cozeApiClient;
  }

  public async runTopicWorkflow(
    profile: Record<string, string>,
    chatHistory: Array<any>,
  ): Promise<any> {
    const parameters = {
      USER_PROFILE: profile,
      CHAT_HISTORY: chatHistory,
    };
    return await fetch(`${COZE_CN_BASE_URL}/v1/workflow/run`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.token}`,
      },
      body: JSON.stringify({
        workflow_id: this.topicWorkflowId,
        parameters,
      }),
    })
      .then(async (response) => {
        if (!response.ok) {
          logger.error(
            `HTTP error! status: ${response.status}, statusText: ${response.statusText}`,
          );
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
      })
      .then((data) => {
        logger.log(
          `Workflow executed successfully witth data: ${JSON.stringify(data)}`,
        );
        logger.log(
          `Workflow executed successfully witth data,data: ${data.data}`,
        );
        if (data.code === 0) {
          return JSON.parse(data.data).data;
        }
        throw new Error(`Workflow execution failed: ${data.message}`);
      })
      .then((data) => {
        logger.log(`Workflow executed successfully: ${data}`);
        return JSON.parse(data);
      });
  }
}
