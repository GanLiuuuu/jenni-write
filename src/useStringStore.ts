// src/stores/useStringStore.js
import { defineStore } from 'pinia';

export const useStringStore = defineStore('stringStore', {
  state: () => ({
    stringOne: '', // 第一个字符串
    stringTwo: '', // 第二个字符串
  }),
  actions: {
    setStringOne(newString) {
      this.stringOne = newString; // 设置第一个字符串
    },
    setStringTwo(newString) {
      this.stringTwo = newString+"\n"+"\n"; // 设置第二个字符串
    },
  },
});
