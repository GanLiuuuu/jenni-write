import { defineStore } from 'pinia';

export const insertStringStore = defineStore('insertStringStore', {
  state: () => ({
    stringOne: '', 
  }),
  actions: {
    setStringOne(newString) {
      this.stringOne = newString; // 设置第一个字符串
    },
    
  },
});