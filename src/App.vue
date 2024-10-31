<template>
    <div class="chat-area">
        <div style="overflow: auto; height: 500px;" v-html="content"></div>
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
    createContent();
    // 在这里添加WebSocket发送消息的逻辑
    text.value = ""; // 清空输入框
};

const createContent = () => {
    let html = "";
     
        html = `
            <div class="chat-row" style="display: flex; align-items: center; padding: 5px 0">
                <div class="chat-message" style="flex: 1; text-align: right; padding-right: 10px;">
                    <div class="tip left" style="background-color: #f0f0f0; padding: 10px; border-radius: 8px; display: inline-block; max-width: 70%;">
                        
                    </div>
                </div>
                <div class="chat-avatar" style="width: 40px; height: 40px;">
                    <img src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;">
                </div>
            </div>`;
    
    content.value += html;
};
</script>

<style scoped>
.chat-area {
    padding: 40px;
    text-align: center;
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
