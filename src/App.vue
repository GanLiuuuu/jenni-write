<template>
    <div class="chat-area">
        <div class="history" id="history">
    <div v-for="(msg, index) in messages" :key="index" class="chat-row" style="display: flex; align-items: center; justify-content: space-between; padding: 5px 0;">
        <div class="chat-message" :style="{'text-align': msg.role === 'user' ? 'right' : 'left', 'padding-left': msg.role === 'user' ? '10px' : '0px', 'padding-right': msg.role === 'user' ? '0px' : '10px'}">
            <div class="tip" style="background-color: #f0f0f0; padding: 10px; border-radius: 8px; display: inline-block; max-width: 70%; word-wrap: break-word; overflow-wrap: break-word; color: black;">
                {{ msg.message }}
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
//TODO: better UI(clip board)
import { ref, nextTick } from 'vue';
import{setIcon} from 'obsidian';

const text = ref('');
const content = ref('');
const currentMessageId = ref(0); // 用于跟踪当前消息的 ID

nextTick(() => {
    const buttonElement = document.getElementById("user");
    setIcon(buttonElement, 'send', 30);
});
const sendTextMessage = () => {
    if (!text.value) {
        return;
    }
    //TODO: deal with network error situation
    createContent1(text.value, 'user', () => {
        createContent2("", 'bot', () => {
            gpt2(text.value);  
            text.value = "";
        });
    });

     
};


const createContent = (massage: string) => {
    let html = "";
        html = `
            <div class="chat-row" style="display: flex; align-items: center; justify-content: space-between; padding: 5px 0;">
                <div class="chat-message" style="flex: 1; text-align: right; padding-right: 10px; max-width: 90%; ">
                    <div class="tip left" style="background-color: #f0f0f0; padding: 10px; border-radius: 8px; display: inline-block; max-width: 70%; word-wrap:break-word; overflow-wrap: break-word; color: black;">
                        ${massage}
                    </div> 
                </div>
                <div class="chat-avatar" style="width: 30px; height: 30px; ">
                    <img src="https://eu.ui-avatars.com/api/?name=John+Noe&size=250" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;">
                </div>
            </div>`;
        content.value += html;

    const scrollableWindow = document.getElementById('history');
    setTimeout(()=>{
        scrollableWindow.scrollTop = scrollableWindow.scrollHeight;
    },0)
};
const createContent1 = (message: string, role: string, callback?: (message1:string) => void) => {
    messages.value.push({ message, role });  // 将新的消息添加到数组中

    // 调用滚动到底部
    const scrollableWindow = document.getElementById('history');
    setTimeout(() => {
        scrollableWindow.scrollTop = scrollableWindow.scrollHeight; // 滚动到最新消息
        if (callback) callback(message);
    }, 0);
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

const createContent_left = (massage: string) => {
    let html1 = "";
        html1 = `
        <div class="chat-row" style="display: flex; align-items: center; justify-content: space-between; padding: 5px 0;">
            <div class="chat-avatar" style="width: 30px; height: 30px; ">
                <img src="https://eu.ui-avatars.com/api/?name=John+Noe&size=250" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;">
            </div>
            <div class="chat-message" style="flex: 1; text-align: left; padding-left: 10px; max-width: 90%; ">
                <div class="tip left" style="background-color: #f0f0f0; padding: 10px; border-radius: 8px; display: inline-block; max-width: 70%; word-wrap:break-word; overflow-wrap: break-word; color: black;">
                    ${massage}
                </div>
            </div>
            
        </div>`;
        
    content.value += html1;
    const scrollableWindow = document.getElementById('history');
    setTimeout(()=>{
        scrollableWindow.scrollTop = scrollableWindow.scrollHeight;
    },0)
    
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
 baseURL:
 dangerouslyAllowBrowser: true,

});
async function gpt(message: string) {
    console.log('send');
    const chatCompletion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: message }],
    max_tokens: 100,
    stream: true
  });
//   const response = chatCompletion.choices[0].message;
//   createContent_left(response.content);
//   console.log(response);
let responseContent = '';
    for await (const part of chatCompletion) {
        responseContent += part.choices[0].delta.content; // 逐步接收内容
        createContent_left(responseContent); // 更新内容
    }
}
async function gpt1(message: string) {
    console.log('send');
    
    const chatCompletion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: message }],
        max_tokens: 100,
        stream: true, // 启用流式输出
    });

    let responseContent = '';
    for await (const part of chatCompletion) {
        responseContent += part.choices[0].delta.content; // 逐步接收内容
        updateContent(responseContent); // 更新内容
        console.log(responseContent);
    }

}
async function gpt2(message: string) {
    console.log('send');
    
    const chatCompletion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: message }],
        max_tokens: 100,
        stream: true, // 启用流式输出
    });

    let responseContent = '';
    for await (const part of chatCompletion) {
        if(part.choices[0].delta.content){
            responseContent += part.choices[0].delta.content; // 逐步接收内容
        updateContent(responseContent); // 更新内容
        console.log(responseContent);
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
    color: white;
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

button:hover {
}
</style>
