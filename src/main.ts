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

import { MyView, VIEW_TYPE } from './view'


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
            this.test(this.app.workspace.activeLeaf.view.editor);
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
    //todo: refractor
    async test(editor: Editor) {
        const cMenu = createEl("div");
        //@ts-ignore
        console.log(this.app.workspace.activeLeaf.view.editor.containerEl.children[1]);
        // @ts-ignore
        const container = this.app.workspace.activeLeaf.view.editor.containerEl.children[1];
        //mount vue app to the container
        let content = container.createEl("div", {
            cls: "search-modal"
        });
        // @ts-ignore
        const cursorCoords = editor.cm.coordsAtPos(editor.posToOffset(editor.getCursor()));

        content.setAttribute("style",
            `width: 100px;
    height: 50px;
    padding: 3px;
    display: grid;
    user-select: none;
    border-radius: 6px;
    position: absolute;        top: ${cursorCoords.top}px; /* 使用光标的顶部坐标 */
        left: ${cursorCoords.left-276}px; /* 使用光标的左侧坐标 */
    transition: 200ms ease;
    min-width: fit-content;
    justify-content: space-around;
    z-index: 15;
    box-shadow: 0px 3px 32px rgb(31 38 135 / 15%);
    border: 1px solid var(--background-modifier-border);`
          )
        this.vueapp = createApp(M);
        this.vueapp.mount(content);
         // @ts-ignore
        
        // @ts-ignore
        // const cursorCoords = editor.cm.coordsAtPos(editor.posToOffset(editor.getCursor()));

        
    //     if (cMenu) {
    //       cMenu.setAttribute(
    //         "style",
    //         `width: 100px;
    // height: 50px;
    // padding: 3px;
    // display: grid;
    // user-select: none;
    // border-radius: 6px;
    // position: absolute;        top: ${cursorCoords.top}px; /* 使用光标的顶部坐标 */
    //     left: ${cursorCoords.left-276}px; /* 使用光标的左侧坐标 */
    // transition: 200ms ease;
    // min-width: fit-content;
    // justify-content: space-around;
    // z-index: 15;
    // box-shadow: 0px 3px 32px rgb(31 38 135 / 15%);
    // border: 1px solid var(--background-modifier-border);`
    //       );
    //     }
    //     cMenu.setAttribute("id", "searchModal");
    //     document.body
    //         .querySelector(".mod-vertical.mod-root")
    //         .insertAdjacentElement("afterbegin", cMenu)
        // const vueInstance = new Vue({
        //     render: h => h(MyComponent)
        // }).$mount(cMenu); // 将 Vue 组件挂载到 cMenu

    }

}


