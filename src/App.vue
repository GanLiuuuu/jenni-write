<template>
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <div class="chat-area">
    <div class="history" id="history" style="left: 15px;">
    <div v-for="(msg, index) in messages" :key="index" class="chat-row" style="display: flex; align-items: center; justify-content: space-between; padding: 5px 0; ">
        <div class="chat-message" :style="{'width' :'100%','text-align': msg.role === 'user' ? 'right' : 'left', 'padding-left': msg.role === 'user' ? '10px' : '0px', 'padding-right': msg.role === 'user' ? '0px' : '10px', 'display': 'flex','flex-direction': 'column'}">
            <div class="tip" style="background-color: #f0f0f0; padding: 10px; border-radius: 8px; display: inline-block; max-width: 95%; word-wrap: break-word; overflow-wrap: break-word; color: black;">
                {{ msg.message }}
                <div v-if="msg.role !== 'user'" class="tip-footer" style="text-align: center; width: 100%;height: 32px; margin-top: 10px;">
                <button class="copy-button" @click="copyMessage(msg.message)" style="border: none; border-radius: 5px; cursor: pointer; width: 60px; height: 30px; position: absolute; left: 10px; box-shadow: none;">
                    <i class="material-icons" style="font-size: 16px; margin-right: 5px">content_copy</i>  Copy
                </button>
            </div>
            </div> 
            
        </div>
        
    </div>
</div>

        <div class="input-area">
            <textarea placeholder="Ask Jenni" v-model="text"></textarea>
            <button id="user" @click="sendTextMessage"></button>
    </div>
    </div>
</template>
<script setup lang="tsx">
import { ref, nextTick } from 'vue';
import{setIcon} from 'obsidian';

const text = ref('');
const content = ref('');
const currentMessageId = ref(0); 
const copyMessage = (message: string) => {
    navigator.clipboard.writeText(message).then(() => {
        console.log('Message copied to clipboard');
        new Notice("copied!");
    }).catch((error) => {
        console.error('Failed to copy message: ', error);
        new Notice("Failed to copy message.");
    });
};
const insertMessage = () =>{

}
 nextTick(() => {
    const buttonElement = document.getElementById("user");
    setIcon(buttonElement, 'send', 30);
});
const sendTextMessage = () => {
    if (!text.value) {
        return;
    }
    //TODO: deal with network error situation
    createContent2(text.value, 'user', () => {
        createContent2("", 'bot', () => {
            gpt2(text.value);  
            text.value = "";
        });
    });

     
};


const createContent2 = (message: string, role: string, callback?: () => void) => {
    messages.value.push({ message, role });  // 将新的消息添加到数组中

    // 调用滚动到底部
    const scrollableWindow = document.getElementById('history');
    setTimeout(() => {
        scrollableWindow.scrollTop = scrollableWindow.scrollHeight; // 滚动到最新消息
        if (callback) callback();
    }, 0);
};
import OpenAI from 'openai';
import { Notice } from 'obsidian';
const apiKey = window.myPluginApiKey;
const messages = ref<Array<{ message: string, role: string }>>([]); // 存储聊天记录的数组

if (!apiKey) {
    new Notice("API Key is missing. Please configure it in the plugin settings.");
}
const openai = new OpenAI({
 apiKey: apiKey,
 dangerouslyAllowBrowser: true,

});

async function gpt2(message: string) {
    console.log('send');
    const chatMessages = messages.value.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'assistant', 
        content: msg.message
    }));
    try {
        const chatCompletion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: chatMessages,
            max_tokens: 100,
            stream: true, // 启用流式输出
        });

        let responseContent = '';

        for await (const part of chatCompletion) {
            if (part.choices[0].delta.content) {
                responseContent += part.choices[0].delta.content; // 逐步接收内容
                updateContent(responseContent); // 更新内容
                console.log(responseContent);
            }
        }
    } catch (error) {
        // 检查错误状态码
        if (error.response && error.response.status !== 200) {
            console.error('Error:', error.response.status, error.response.data);
            new Notice(`Error: ${error.response.status} - ${error.response.data.message || 'An error occurred.'}`);
        } else {
            console.error('Unexpected error:', error);
            new Notice('An unexpected error occurred.');
        }
    }
}
const updateContent = (newContent: string) => {
    // 查找并更新最后一条消息
    const lastMessageIndex = messages.value.length - 1;
    if (lastMessageIndex >= 0) {
        messages.value[lastMessageIndex].message = newContent;  // 更新最后一条消息的内容
    }
};
</script>

<style scoped>
.chat-area {
    height: 100%;
    text-align: center;
    justify-content: center;
}
.history{
    position: absolute;
    box-sizing: border-box;
    height: calc(100% - 110px);
    top:0;
    left: 5px;
    right: 5px;
    overflow-y: auto;
    padding-right: 10px;
}
.input-area {
    display: flex;
    align-items: center;
    position: absolute;
    bottom: 30px;
    left: 10px;
    right: 10px;
    border: 0.5px solid gray;
    border-radius: 4px;
}
button {
    position: absolute;
    right: 5px;
    height: 50px;
    border: none;
    width:40px;
    border-radius: 4px;
    color: black;
    cursor: pointer;
}
textarea {
    padding: 10px;
    border-radius: 4px;
    left: 5px;
    margin-right: 5px;
    width: calc(100% - 55px);
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    outline: none;
}
.copy-button {
    border: none; /* 去掉边框 */
    border-radius: 5px; /* 圆角 */
    cursor: pointer; /* 鼠标悬停时显示手型 */
    background-color: transparent; /* 默认背景透明 */
    color: inherit; /* 继承父元素的字体颜色 */
    transition: background-color 0.3s, color 0.3s; /* 添加过渡效果 */
}
.copy-button:hover {
    background-color: #6A4C9C; /* 悬停时的背景颜色 */
    color: white; /* 悬停时的字体颜色 */
}

</style>
