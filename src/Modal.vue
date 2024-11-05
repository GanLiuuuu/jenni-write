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
            <strong class="suggestion-title">{{ item.title }}</strong>
            <strong class="suggestion-title">{{ item.abstract }}</strong>
          </li>
        </ul>
      </div>
    </form>
  </template>
  
  <script setup lang="tsx">
  import { ref } from 'vue';
  import axios from 'axios';
  import { da } from 'element-plus/es/locale';

  
  const inputRef = ref<HTMLInputElement | null>(null);
  const query = ref<string>('');
  const suggestions = ref<any[]>([]);
  let debounceTimer: ReturnType<typeof setTimeout>;
  
  function onInputChange() {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      searchPapers();
    }, 1000);
  }
  
  const searchPapers = async () => {
    const url = `https://api.semanticscholar.org/graph/v1/paper/search`;
  
    try {
      await delay(1000);
      const response = await axios.get(url, {
        params: {
          query: query.value,
          limit: 10,
          fields:
          "title,year,abstract,venue,url,journal,externalIds",
        },
      });
  
      const { data } = response.data;
      data.forEach(element => {
        console.log(element)
      });
      data.forEach(paper => {
        console.log(paper.title);
        console.log(paper.abstract);
        console.log('---');
        });
          // 提取并处理论文数据
    // const papers = response.data.data.map((paper: Paper) => {
    //   // 提取每篇论文的作者名字
    //   const authorNames = paper.authors.map((author) => author.name);

    //   return {
    //     ...paper,
    //     authors: authorNames, // 替换原有的authors字段为仅包含名字的数组
    //   };
    // });
    // console.log(papers);

      suggestions.value = data.map(paper => ({
        id: paper.paperId,
        title: paper.title,
        url: paper.url,
        abstract: paper.abstract,
      }));

    } catch (error) {
      if (error.response && error.response.status === 429) {
        console.error('Too many requests, please wait.');
      } else {
        console.error('Error fetching papers:', error);
      }
    }
  };
  
  function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
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
  padding: 12px; /* 增加内边距 */
  min-height: 50px;
  cursor: pointer;
  line-height: 1.5; /* 增加行高，提高可读性 */
}
  
  
  .suggestions-list li:hover {
    background-color: #f0f0f0;
  }
  
  .suggestion-title {
    font-weight: bold;
    font-size: 1.1em; /* 增加标题字体大小 */
  }
  
  .suggestion-abstract {
    font-size: 0.9em; /* 增加摘要字体大小 */
    color: #c71b1b; /* 更改摘要颜色以提高可读性 */
    margin-top: 4px; /* 增加标题和摘要之间的间距 */
  }
  </style>
  