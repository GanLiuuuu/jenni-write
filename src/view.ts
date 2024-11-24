import { ItemView, WorkspaceLeaf } from 'obsidian';
import { createApp, App as VueApp } from 'vue';

import App from './App.vue';

export const VIEW_TYPE: string = 'jenni-chat-view';

export class MyView extends ItemView {
    vueapp: VueApp;
    constructor(leaf: WorkspaceLeaf) {
        super(leaf);
    }
    getViewType(): string {
        return VIEW_TYPE;
    }
    getDisplayText(): string {
        return "Jenni Chat";
    }
    getIcon(): string {
        return "message-square";
    }
    async onOpen() {
        const container = this.containerEl.children[1];

        container.empty();
        let content = container.createEl("div", {
            cls: "jenni-chat-view"
        });
        this.vueapp = createApp(App);
        this.vueapp.mount(content);
    }
    async onClose() {
        this.vueapp.unmount();
    }

}