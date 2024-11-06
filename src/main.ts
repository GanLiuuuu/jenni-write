import {
    App,
    Modal,
    Notice,
    Plugin,
    Menu,
    PluginSettingTab,
    Setting,
    Editor
} from 'obsidian';
import { createApp, App as VueApp } from 'vue';
import M from './Modal.vue';
import { createPinia } from 'pinia';

import { MyView, VIEW_TYPE } from './view'
import { useEventStore } from './eventStore'; // 导入 Pinia Store
import { useStringStore } from './useStringStore';



interface MyPluginSettings {
    mySetting: string;
}

const DEFAULT_SETTINGS: MyPluginSettings = {
    mySetting: 'default'
}

export default class MyPlugin extends Plugin {
    settings: MyPluginSettings;
    vueapp: VueApp;
    async onload() {
        await this.loadSettings();

        this.registerView(
            VIEW_TYPE,
            (leaf) => new MyView(leaf)
        )

        this.addRibbonIcon('dice', 'Open my view', (evt) => {
            this.activateView()
        })
        this.addRibbonIcon('dice', 'test', (evt) => {
             // @ts-ignore
            this.createModal(this.app.workspace.activeLeaf.view.editor);
        })
        
  
    }

    onunload() {
        this.app.workspace.detachLeavesOfType(VIEW_TYPE)
    }

    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }
    async activateView() {
        
        if (this.app.workspace.getLeavesOfType(VIEW_TYPE).length === 0) {
            await this.app.workspace.getRightLeaf(false).setViewState({
                type: VIEW_TYPE,
                active: true,
            })
        }
        this.app.workspace.revealLeaf(
            this.app.workspace.getLeavesOfType(VIEW_TYPE)[0]
        )
        
    
    }
    async createModal(editor: Editor) {
        // @ts-ignore
        const container = this.app.workspace.activeLeaf.view.editor.containerEl.children[1];
        //mount vue app to the container
        const content = container.createEl("div", {
            cls: "search-modal"
        });
        // @ts-ignore
        const cursorCoords = editor.cm.coordsAtPos(editor.posToOffset(editor.getCursor()));
        const fileContent = editor.getValue();

        // 检查是否存在 '## Reference' 部分
        if (!fileContent.includes("## Reference")) {
            // 如果没有，自动在文件末尾添加 '## Reference'
            const cursor = editor.getCursor();
            const lineCount = editor.lineCount();

            // 在文件最后插入 '## Reference' 部分
            editor.replaceRange("\n## Reference\n", { line: lineCount, ch: 0 });
        }

        content.setAttribute("style",
            `width: 200px;
            height: 100px;
            padding: 3px;
            display: grid;
            user-select: none;
            position: absolute;        
            top: ${cursorCoords.top}px; 
            left: ${cursorCoords.left-276}px; 
            transition: 200ms ease;
            min-width: fit-content;
            justify-content: space-around;
            z-index: 15;
            `
        )
        this.vueapp = createApp(M);
        this.vueapp.use(createPinia());
        const eventStore = useEventStore();
        const stringStore = useStringStore();
        this.vueapp.mount(content);
        eventStore.$subscribe(() => {
            console.log('Receiver has received the signal!'); 
            editor.replaceRange(
                `[${stringStore.stringOne}](##Reference)`,
                editor.getCursor()
            );
            editor.replaceRange(
                stringStore.stringTwo,
                {line: editor.lineCount()-1, ch: 0}
              );       
        });
    const handleClickOutside = (event: MouseEvent) => {
        if (!content.contains(event.target as Node)) {
            console.log('clicked outside of content');
            this.vueapp.unmount();
            content.remove();
            document.removeEventListener("mousedown", handleClickOutside);
        }
    };
    

    // 监听文档的点击事件
    document.addEventListener("mousedown", handleClickOutside);

    }

}


