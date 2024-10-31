<template>
    <div class="container">
        <div class="intro">
            <h1>基础介绍</h1>
            <p >这是一个类似于 Copilot 的界面，您可以在下面输入内容并发送。</p>
        </div>
        <div class="input-area">
            <textarea placeholder="输入消息..." ></textarea>
            <button id ="user" ></button>
        </div>
        
        
    </div>
</template>

<script setup lang="tsx">

import { onMounted, ref, nextTick } from 'vue';
console.log('sucess!')

import { setIcon } from 'obsidian';
nextTick(() => {
    const buttonElement = document.getElementById("user");
    
    setIcon(buttonElement, 'send',30);
});



     

</script>

<style scoped>
.container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
}

.intro {
    text-align: center;
    margin-bottom: 20px;
}
.input-area {
    display: flex;
    align-items: center;
}
.textarea {
    height: 100%;
    position: absolute;
    top: 0px;
    padding: 0px;
    box-sizing: content-box;
    
}

button {
    height: 100%;
    border: none;
    border-radius: 4px;
    margin-left: 10px;
    background-color: #007bff;
    color: white;
    cursor: pointer;
}

button:hover {
    background-color: #0056b3;
}
</style>