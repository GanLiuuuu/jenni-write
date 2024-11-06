// stores/eventStore.ts
import { defineStore } from 'pinia';

export const useEventStore = defineStore('event', {
  state: () => ({
    signalReceived: false, // 存储是否接收到信号
  }),
  actions: {
    sendSignal() {
      console.log('Sender is sending the signal...');
      this.signalReceived = true; // 更新状态，表示信号已接收
    },
    resetSignal() {
      this.signalReceived = false; // 重置信号状态
    },
  },
});