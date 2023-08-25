// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Board from "../Board";
import GameManager, { GameState } from "../Manager/GameManager";
import UIManager from "../Manager/UIManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ResetGame extends cc.Component {
    protected onLoad(): void {
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchBegan, this);
    }

    protected onDestroy(): void {
        this.node.off(cc.Node.EventType.TOUCH_END, this.onTouchBegan, this);
    }

    private onTouchBegan(){
        UIManager.Ins.onClose(1);
        GameManager.Ins.gameState = GameState.None;
        Board.resetGame();
        GameManager.Ins.onInit();
    }
}
