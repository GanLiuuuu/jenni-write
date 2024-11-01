<template>
    <div class="chat-area">
        <div class="history" v-html="content" id="history"></div>
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
nextTick(() => {
    const buttonElement = document.getElementById("user");
    setIcon(buttonElement, 'send', 30);
});
const sendTextMessage = () => {
    if (!text.value) {
        return;
    }
    createContent(text.value);
    // 在这里添加WebSocket发送消息的逻辑
    text.value = ""; // 清空输入框
};

const createContent = (massage) => {
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
    background-color: #4ade80; /* 修改按钮背景色 */
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
    background-color: #22c55e; /* 修改按钮悬停颜色 */
}
</style>
