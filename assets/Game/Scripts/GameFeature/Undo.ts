// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Block from "../Board/Block";
import Board from "../Board/Board";
import GameManager from "../Manager/GameManager";
import SimplePool, { PoolType } from "../Pool/SimplePool";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Undo extends cc.Component {
    protected onLoad(): void {
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchBegan, this);
    }

    protected onDestroy(): void {
        this.node.off(cc.Node.EventType.TOUCH_START, this.onTouchBegan, this);
    }

    private clearBoard(){
        for(let i = 0; i < 4; i++){
            for(let j = 0; j < 4; j++){
                if(Board.Matrix[i][j]){
                    Board.Matrix[i][j].onDeath();
                    Board.Matrix[i][j] = null;
                }
            }
        }
    }

    private OldBoard(){
        for(let i = 0; i < 4; i++){
            for(let j = 0; j < 4; j++){
                if(Board.OldIndex[i * 4 + j]){
                    Board.Matrix[i][j] = SimplePool.spawnT<Block>(PoolType.Block, GameManager.Ins.Stage_1[i * 4 + j].getWorldPosition(), 0);
                    Board.Matrix[i][j].changeBlock(Board.OldIndex[i * 4 + j]);
                }
            }
        }
    }

    private onTouchBegan() : void{
        this.clearBoard();
        this.OldBoard();
    }
}
