<template>
    <form @submit.prevent>
      <div class="typeahead__container">
        <input
          ref="inputRef"
          class="js-typeahead"
          name="q"
          autocomplete="off"
          v-model="query"
          @input="onInputChange"
        />
        <ul v-if="suggestions.length > 0" class="suggestions-list">
          <li v-for="item in suggestions" :key="item.id" class="suggestion-item">
            <div class="suggestion-title">{{ item.title }}</div>
            <div class="suggestion-author">{{ item.authorNames.join(', ') }}</div>
            <div class="suggestion-abstract">
              <div class="abstract-line"></div>
              <span>{{ truncateAbstract(item.abstract) }}</span>
            </div>
            <div class="suggestion-buttons">
              <button class="suggestion-button" @click="onCiteClicked(item)">Cite</button>
              <button class="suggestion-button" @click="onViewClicked(item)" >View</button>
            </div>
          </li>
      </ul>
    </div>
  </form>
</template>
  
  <script setup lang="tsx">
  //TODO: 处理一下人名过多过长的问题
  import { onMounted, ref } from 'vue';
  import axios from 'axios';
  const inputRef = ref<HTMLInputElement | null>(null);
  const query = ref<string>('');
  const suggestions = ref<any[]>([]);
  let debounceTimer: ReturnType<typeof setTimeout>;
  import { useEventStore } from './eventStore'; // 导入 Pinia Store
  import { useStringStore } from './useStringStore';

  const eventStore = useEventStore();
  const stringStore = useStringStore();
  onMounted(() => {
    inputRef.value?.focus();
  });
  function onInputChange() {
    // 清除上一个定时器
    clearTimeout(debounceTimer);

    if (query.value.length < 2) {
        suggestions.value = [];
        return;
    }

    debounceTimer = setTimeout(() => {
      searchPapers();
    }, 300); // 延迟300ms
  }

  function truncateAbstract(abstract: any) {
        if(!abstract) return '';
        return abstract.length > 200 ? abstract.substring(0, 200) + '...' : abstract;
    }
  const searchPapers = async () => {
  //FIXME: it keeps refreshing 
    const url = `https://api.semanticscholar.org/graph/v1/paper/search`;
    
    try {
      const response = await axios.get(url, {
        headers: {
          "x-api-key": ,
        },
        params: {
          query: query.value,
          limit: 25,
          fields:
          "title,year,authors,abstract,venue,url,journal,externalIds,citationStyles",
        },
      });
  
      const { data } = response.data;
      data.forEach(element => {
        console.log(element)
      });
      suggestions.value = data.map(paper => ({
        authorNames: paper.authors.map((author) => author.name),
        id: paper.paperId,
        title: paper.title,
        url: paper.url,
        abstract: paper.abstract,
        citation: paper.citationStyles.bibtex
      }));
    } catch (error) {
      if (error.response && error.response.status === 429) {
        console.error('Too many requests, please wait.');
      } else {
        console.error('Error fetching papers:', error);
      }
    }
  };
  function onCiteClicked(item:any){
    eventStore.sendSignal();
    stringStore.setStringOne(generateInTextCitation(item.citation));
    stringStore.setStringTwo(formatAPA(item.citation));
    
  };
  function onViewClicked(item: any){
    console.log(item.url);
    window.open(item.url, '_blank');
  };
  function parseBibTeX(bibtexStr: string): { [key: string]: string } {
  const fields: { [key: string]: string } = {};
  
  // 提取 BibTeX 的各个字段
  const regex = /([a-zA-Z]+)\s*=\s*{([^}]+)}/g;
  let match: RegExpExecArray | null;
  
  while ((match = regex.exec(bibtexStr)) !== null) {
    const key = match[1].trim();
    const value = match[2].trim();
    fields[key] = value;
  }
  
  return fields;
}

// 转换为APA格式的函数
function formatAPA(bibtexStr: string): string {
  const bibtexFields = parseBibTeX(bibtexStr);
  
  // 获取 BibTeX 字段
  const authors = bibtexFields.author || "";
  const title = bibtexFields.title || "";
  const year = bibtexFields.year || "";
  const journal = bibtexFields.journal || bibtexFields.booktitle || "";
  const volume = bibtexFields.volume || "";
  const issue = bibtexFields.issue || "";
  const pages = bibtexFields.pages || "";
  const doi = bibtexFields.doi || "";
  const url = bibtexFields.url || "";
  
  // 处理作者
  const authorList = authors.split("and").map((author: string) => {
    const parts = author.trim().split(" ");
    const lastName = parts[parts.length - 1];
    const firstInitial = parts.slice(0, parts.length - 1).map((part) => part.charAt(0).toUpperCase() + ".").join(" ");
    return `${lastName}, ${firstInitial}`;
  }).join(", ");
  
  // APA 引用格式构建
  let apaReference = `${authorList} (${year}). ${title}.`;

  // 如果是期刊文章
  if (journal) {
    apaReference += ` ${journal},`;
  }

  // 如果有卷号和期号
  if (volume) {
    apaReference += ` ${volume}`;
  }

  if (issue) {
    apaReference += `(${issue})`;
  }

  // 如果有页码
  if (pages) {
    apaReference += `, ${pages}`;
  }

  // 结束时加上DOI或URL，如果有的话
  if (doi) {
    apaReference += ` https://doi.org/${doi}`;
  } else if (url) {
    apaReference += ` Retrieved from ${url}`;
  }

  return apaReference;
}
function generateInTextCitation(bibtexStr: string): string {
  const bibtexFields = parseBibTeX(bibtexStr);
  
  // 提取作者和年份
  const authors = bibtexFields.author || "";
  const year = bibtexFields.year || "";

  // 处理作者格式：提取第一个作者的姓氏
  const firstAuthor = authors.split("and")[0].trim(); // 取第一个作者
  const lastName = firstAuthor.split(" ").pop(); // 取姓氏（假设姓在最后）
  
  // 返回文中引用格式： (LastName, Year)
  return `(${lastName}, ${year})`;
}
  
</script>
  
<style>
.suggestions-list {
    max-height: 250px;
    max-width: 600px;
    overflow-y: auto ;
    background-color: #f8f8f8;
    border: 1px solid #ccc;
    list-style-type: none;
    padding: 0;
    margin: 0;
  }
  
  .suggestions-list li{
  padding: 12px; /* 增加内边距 */
  min-height: 50px;
  cursor: pointer;
  line-height: 1.5; /* 增加行高，提高可读性 */
  }
  
  
  .suggestions-list li:hover{
    background-color: #f0f0f0;
  }
  
  .suggestion-item {
  display: block; /* 或者可以用 flex 布局：display: flex; flex-direction: column; */
  padding: 12px;
  cursor: pointer;
  line-height: 1.5;
  border-bottom: 1px solid #eee;
  background-color: #ffffff;;
}

.suggestion-title {
  font-weight: bold;
  margin-bottom: 5px; /* 与作者间的间距 */
}

.suggestion-author {
  color: gray;
  font-size: 0.9em;
  margin-bottom: 5px; /* 与摘要间的间距 */
}

.suggestion-abstract {
  display: flex;
  align-items: center;
}

.abstract-line {
  width: 4px;
  height: 20px;
  background-color: #ccc;
  margin-right: 8px;
}

.suggestion-abstract span {
  font-size: 0.85em;
}
.suggestion-buttons {
    display: flex;
    justify-content: flex-start;
    margin-top: 10px;
    margin-bottom: 10px;
  }
  
  .suggestion-button {
    margin-left: 5px;
    padding: 6px 12px;
    background-color: #ccc;
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
.js-typeahead {
    width: 100%; /* 使输入框占满容器宽度 */
    padding: 10px; /* 增加内边距 */
    border: 1px solid #ccc; /* 边框 */
    border-radius: 4px; /* 圆角 */
    font-size: 1em; /* 字体大小 */
    color: #333; /* 字体颜色 */
    background-color: #fff; /* 背景颜色 */
    transition: border-color 0.3s; /* 添加过渡效果 */
}

.js-typeahead:focus {
    border-color: #007bff; /* 聚焦时的边框颜色 */
    outline: none; /* 去掉默认的聚焦轮廓 */
    box-shadow: 0 0 5px rgba(0, 123, 255, 0.5); /* 聚焦时的阴影效果 */
}
  </style>
  