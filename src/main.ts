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

import { MyView, VIEW_TYPE } from './view'


interface MyPluginSettings {
    mySetting: string;
}

const DEFAULT_SETTINGS: MyPluginSettings = {
    mySetting: 'default'
}

export default class MyPlugin extends Plugin {
    settings: MyPluginSettings;

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
    onImageContextMenu(event: MouseEvent): void {

        const menu = new Menu();

        
        menu.addItem((item) =>
            item
              .setTitle('Copy')
              .setIcon('documents')
              .onClick(() => {
                new Notice('Copied');
              })
          );
    
          menu.addItem((item) =>
            item
              .setTitle('Paste')
              .setIcon('paste')
              .onClick(() => {
                new Notice('Pasted');
              })
          );

        // 在鼠标位置显示菜单
        menu.showAtPosition({ x: event.pageX, y: event.pageY });
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
    async test(editor: Editor) {
        let cMenu = createEl("div");
         // @ts-ignore
        
        // @ts-ignore
        const cursorCoords = editor.cm.coordsAtPos(editor.posToOffset(editor.getCursor()));
        
        if (cMenu) {
          cMenu.setAttribute(
            "style",
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
          );
        }
        cMenu.setAttribute("id", "searchModal");
        document.body
            .querySelector(".mod-vertical.mod-root")
            .insertAdjacentElement("afterbegin", cMenu)

    }
    // async changeEditor(){
    //     let v = this.app.workspace.getActiveViewOfType(MarkdownView);
    //     if (!v) {
    //     // View can be null some times. Can't do anything in this case.
    //     } else {
    //     let view_mode = v.getMode(); // "preview" or "source" (can also be "live" but I don't know when that happens)
    //     switch (view_mode) {
    //             case "preview":
    //                 // The leaf is in preview mode, which makes things difficult.
    //                 // I don't know how to get the selection when the editor is in preview mode :(
    //             break;
    //             case "source":
    //                 // Ensure that view.editor exists!
    //                 if ("editor" in v) {
    //                     // Good, it exists.
    //                     // @ts-ignore We already know that view.editor exists.
    //                     let selection = view.editor.getSelection(); // THIS IS THE SELECTED TEXT, use it as you wish.
    //                 }
    //                 // If we get here, then 'view' does not have a property named 'editor'.
    //             break;
    //             default:
    //                 // If we get here, then we did not recognise 'view_mode'.
    //                 break;
    //         }
    //     }
    // }
}


