<template>
    <form @submit.prevent="handleSubmit">
      <div class="typeahead__container">
        <div class="typeahead__field">
          <div class="typeahead__query">
            <input
              ref="inputRef"
              class="js-typeahead"
              name="q"
              autocomplete="off"
              v-model="query"
              @input="onInputChange"
            />
          </div>
          <div class="typeahead__button">
            <button type="submit">
              <span class="typeahead__search-icon"></span>
            </button>
          </div>
        </div>
        <ul v-if="suggestions.length > 0" class="suggestions-list">
          <li v-for="item in suggestions" :key="item.id" @click="selectItem(item)">
            {{ item.title }}
          </li>
        </ul>
      </div>
    </form>
  </template>
  
  <script setup lang="tsx">
  import { ref } from 'vue';
  import axios from 'axios';
  
  const inputRef = ref<HTMLInputElement | null>(null);
  const query = ref<string>('');
  const suggestions = ref<any[]>([]);
    let debounceTimer: ReturnType<typeof setTimeout>; // TypeScript 声明

  function onInputChange() {
    clearTimeout(debounceTimer); // 清除之前的定时器

    debounceTimer = setTimeout(() => {
        // 在输入停止一秒后调用请求函数
        searchPapers();
    }, 1000); // 设置延迟为 1000 毫秒（1 秒）
}
const searchPapers = async () => {
  const url = `https://api.semanticscholar.org/graph/v1/paper/search`;

  try {
    // 添加请求延迟
    await delay(1000); // 1秒延迟

    const response = await axios.get(url, {
      params: {
        query:query.value,
        limit: 10
        //limit,
        //fields: 'title,url,abstract,authors',
      },
    });

    const { total, data } = response.data;
    console.log(`Total papers found: ${total}`);

    data.forEach(paper => {
      console.log(`Title: ${paper.title}`);
      console.log(`URL: ${paper.url}`);
      console.log(`Abstract: ${paper.abstract}`);
      console.log('Authors:');
      console.log('---');
    });

  } catch (error) {
    if (error.response && error.response.status === 429) {
      console.error('Too many requests, please wait.');
      // 可以在这里添加重试逻辑
    } else {
      console.error('Error fetching papers:', error);
    }
  }
};
function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
  const fetchSuggestions = async () => {
    if (query.value.length < 3) {
      suggestions.value = [];
      return;
    }
  
    try {
      const response = await axios.get('https://api.semanticscholar.org/graph/v1/paper/search', {
        params: { query: query.value },
      });
      const { total, data } = response.data;
    console.log(`Total papers found: ${total}`);
    //   suggestions.value = response.data.matches;
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }
  };
  
  const selectItem = (item: any) => {
    query.value = item.title; // 选中后填充输入框
    suggestions.value = []; // 清空建议列表
  };
  
  const handleSubmit = () => {
    console.log('Submitted query:', query.value);
  };
  </script>
  
  <style>
  .suggestions-list {
    border: 1px solid #ccc;
    list-style-type: none;
    padding: 0;
    margin: 0;
  }
  
  .suggestions-list li {
    padding: 8px;
    cursor: pointer;
  }
  
  .suggestions-list li:hover {
    background-color: #f0f0f0;
  }
  </style>


  