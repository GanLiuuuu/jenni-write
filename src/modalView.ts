import { ItemView, WorkspaceLeaf } from 'obsidian';
import { createApp, App as VueApp } from 'vue';
import App from './Modal.vue';

export const MODAL_VIEW_TYPE: string = 'modal-view';

export class ModalView extends ItemView {
    vueapp: VueApp;
    constructor(leaf: WorkspaceLeaf) {
        super(leaf);
    }
    getViewType(): string {
        return MODAL_VIEW_TYPE;
    }
    getDisplayText(): string {
        return "Vue Stater";
    }
    getIcon(): string {
        return "dice";
    }
    async onOpen() {
        const container = this.containerEl.children[1];
        container.empty();
        let content = container.createEl("div", {
            cls: "my-plugin-view"
        });
        this.vueapp = createApp(App);
        this.vueapp.mount(content);
    }
    async onClose() {
        this.vueapp.unmount();
    }

}