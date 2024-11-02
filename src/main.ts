import {
    App,
    Modal,
    Notice,
    Plugin,
    Menu,
    PluginSettingTab,
    Setting
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
        this.registerEvent(this.app.workspace.on('click', (event: MouseEvent) => {
            if (event.button === 2) { // 右键点击
                this.onImageContextMenu(event);
            }
        }));
        this.addRibbonIcon('dice', 'Print leaf types', () => {
            this.app.workspace.iterateAllLeaves((leaf) => {
              console.log(leaf.getViewState().type);
            });
           
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
        const view = this.app.workspace.getActiveViewOfType(MarkdownView);
        console(view);
        // Make sure the user is editing a Markdown file.
        if (view) {
            

            console.log(view);
        }
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


