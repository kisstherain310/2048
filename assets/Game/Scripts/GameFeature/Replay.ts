// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import BestScore from "../BestScore";
import Board from "../Board";
import { TypeBlock } from "../GameConstant";
import GameManager, { GameState } from "../Manager/GameManager";
import UIManager from "../Manager/UIManager";
import Utilities from "../Utilities";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ReplayButton extends cc.Component {
    private static ins : ReplayButton;
    public static get Ins() : ReplayButton
    {
        return ReplayButton.ins;
    }

    private originalColor: string = 'BBADA0';
    private newColor: string = TypeBlock[2048];

    protected onLoad(): void {
        ReplayButton.ins = this;
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchBegan, this);
    }

    protected onDestroy(): void {
        this.node.off(cc.Node.EventType.TOUCH_END, this.onTouchBegan, this);
    }

    public changeColor(){
        this.node.color = Utilities.convertToCCColor(this.newColor);
    }

    private backOldColor(){
        this.node.color = Utilities.convertToCCColor(this.originalColor);
    }

    private onTouchBegan() : void{
        if(Board.checkEndGame()){
            UIManager.Ins.onClose(0);
            BestScore.Ins.changeBestScore();
            Board.resetGame();
            GameManager.Ins.onInit();
            this.backOldColor();
        } else {
            UIManager.Ins.onOpen(1);
            GameManager.Ins.gameState = GameState.End;
        }
    }
}
