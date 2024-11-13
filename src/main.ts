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



interface AISettings {
    myKey: string;
}

const DEFAULT_SETTINGS: AISettings = {
    myKey: '',
};
export default class JenniPlugin extends Plugin {
    settings: AISettings;
    vueapp: VueApp;
    
    async onload() {
        await this.loadSettings();
        window.myPluginApiKey = this.settings.myKey;  
        this.addSettingTab(new AISettingTab(this.app, this));
        this.registerView(
            VIEW_TYPE,
            (leaf) => new MyView(leaf)
        )
        this.addCommand({
            id: 'search-paper',
            name: 'search paper',
            //@ts-ignore
            callback: () => this.createModal(this.app.workspace.activeLeaf.view.editor),
            // hotkeys: [
            //   {
            //     modifiers: ['Mod','Shift'],
            //     key: 'i',
            //   },
            // ],
          });

        this.addRibbonIcon('message-square', 'Jenni chat', (evt) => {
            this.activateView()
        })
        

         
        
  
    }

    onunload() {
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
        if (!editor) {
            console.warn('Editor is null or undefined. Exiting createModal.');
            return; // 如果 editor 为空，直接返回
        }
        // @ts-ignore
        const container = editor.containerEl.children[1];
        //mount vue app to the container
        const content = container.createEl("div", {
            cls: "search-modal"
        });
        // @ts-ignore
        const cursorCoords = editor.cm.coordsAtPos(editor.posToOffset(editor.getCursor()));
        const fileContent = editor.getValue();
        if (!fileContent.includes("## Reference")) {
            const lineCount = editor.lineCount();
            editor.replaceRange("\n## Reference\n", { line: lineCount, ch: 0 });
        }
        content.setAttribute("style",
            `width: 200px;
            height: 100px;
            padding: 3px;
            display: grid;
            user-select: none;
            position: absolute;        
            top: ${cursorCoords.top -30 }px; 
            left: ${cursorCoords.left}px; 
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
            const cursor = editor.getCursor();
            editor.replaceRange('', { line: cursor.line, ch: cursor.ch-1 }, { line: cursor.line, ch: cursor.ch  });
            editor.replaceRange(
                `[${stringStore.stringOne}](##Reference)`,
                editor.getCursor()
            );
            editor.replaceRange(
                stringStore.stringTwo,
                {line: editor.lineCount()-1, ch: 0}
            );
            this.vueapp.unmount();
            content.remove();
            document.removeEventListener("mousedown", handleClickOutside);       
        });
    const handleClickOutside = (event: MouseEvent) => {
        if (!content.contains(event.target as Node)) {
            console.log('clicked outside of content');
            this.vueapp.unmount();
            content.remove();
            document.removeEventListener("mousedown", handleClickOutside);
        }
    };
    document.addEventListener("mousedown", handleClickOutside);
    }

}

class AISettingTab extends PluginSettingTab {
    plugin: JenniPlugin;

    constructor(app: App, plugin: JenniPlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }
    display(): void {
        const { containerEl } = this;

        containerEl.empty();

        containerEl.createEl('h1', { text: 'API Setting' });
        
        new Setting(containerEl)
            .setName('OpenAI API Key')
            .setDesc('Enter your OpenAI API key here.')
            .addText(text => 
                text
                    .setValue(this.plugin.settings.myKey)
                    .onChange(async (value) => {
                        this.plugin.settings.myKey = value;
                        await this.plugin.saveSettings();
                    })
            );
            const link = containerEl.createEl('a', {
                text: 'You can find your API key at here.',
                href: 'https://platform.openai.com/api-keys'
            });
    
            // 设置链接在新标签页中打开
            link.setAttribute('target', '_blank');
            
    }

}