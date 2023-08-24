// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Board from "./Board";
import GameManager from "./GameManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Undo extends cc.Component {
    protected onLoad(): void {
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchBegan, this);
    }

    protected onDestroy(): void {
        this.node.off(cc.Node.EventType.TOUCH_START, this.onTouchBegan, this);
    }

    private onTouchBegan() : void{
        Board.Matrix = GameManager.Ins.previousBoard;
        console.log('cu roi' ,GameManager.Ins.previousBoard);
    }
}
