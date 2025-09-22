Coze API SDK
npm version npm downloads bundle size License: MIT

Official Node.js and Browser SDK for Coze（or 扣子） API platform.

Quick Start

1. Installation
   npm install @coze/api

   or

   pnpm install @coze/api

2. Basic Usage

import { CozeAPI, COZE_COM_BASE_URL, ChatStatus, RoleType } from '@coze/api';

// Initialize client with your Personal Access Token
const client = new CozeAPI({
token: 'your_pat_token', // Get your PAT from https://www.coze.com/open/oauth/pats
// or
// token: async () => {
// // refresh token if expired
// return 'your_oauth_token';
// },
baseURL: COZE_COM_BASE_URL,
});

// Simple chat example
async function quickChat() {
const v = await client.chat.createAndPoll({
bot_id: 'your_bot_id',
additional_messages: [{
role: RoleType.User,
content: 'Hello!',
content_type: 'text',
}],
});

    if (v.chat.status === ChatStatus.COMPLETED) {
    for (const item of v.messages) {
      console.log('[%s]:[%s]:%s', item.role, item.type, item.content);
    }
    console.log('usage', v.chat.usage);

}
}
