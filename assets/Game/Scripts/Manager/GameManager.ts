// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Block from "../Board/Block";
import Board from "../Board/Board";
import { Game } from "../GameConstant";
import ReplayButton from "../GameFeature/Replay";
import SimplePool, { PoolType } from "../Pool/SimplePool";
import Score from "../Score/Score";
import UIManager from "./UIManager";

/*
fix di chuyển sai
undo 
 */

const { ccclass, property } = cc._decorator;

export enum GameState {
    None = 0,
    Spawning = 1,
    End = 3,
}

@ccclass
export default class GameManager extends cc.Component {

    // singleton
    private static ins : GameManager;
    public static get Ins() : GameManager
    {
        return GameManager.ins;
    }
    //------------------------------------

    @property(cc.Prefab)
    prefab: cc.Prefab = null;

    @property(cc.Node)
    Stage_1: cc.Node[] = [];

    public gameState: GameState = GameState.None;
    public isChange: boolean = false;

    protected onLoad(): void {
        GameManager.ins = this;
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
    }

    protected onDestroy(): void {
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
    }

    private generateBlock(): void {
        const posBlock = Board.generateBlock();
        let block = SimplePool.spawnT<Block>(PoolType.Block, this.Stage_1[posBlock.i * 4 + posBlock.j].getWorldPosition(), 0);
        block.spawnEffect();
        Board.Matrix[posBlock.i][posBlock.j] = block;
        if(Board.checkEndGame()){
            UIManager.Ins.onOpen(0);
            ReplayButton.Ins.changeColor();
            setTimeout(() => this.gameState = GameState.End, Game.timeDelay/20);
        }
    }

    protected start(): void {
        this.onInit();
    }

    public onInit(){
        this.gameState = GameState.None;
        this.generateBlock();
        this.generateBlock();
    }

    private onKeyDown(event: cc.Event.EventKeyboard): void {
        if (this.gameState == GameState.Spawning) return;
        if (this.gameState == GameState.End) return;
        
        switch (event.keyCode) {
            case cc.macro.KEY.a:
                Board.moveLeft();
                break;
            case cc.macro.KEY.d:
                Board.moveRight();
                break;
            case cc.macro.KEY.w:
                Board.moveUp();
                break;
            case cc.macro.KEY.s:
                Board.moveDown();
                break;
        }

        if(this.isChange){
            this.gameState = GameState.Spawning;
            setTimeout(() => {
                this.generateBlock();
                this.gameState = GameState.None;
                Score.Ins.changeScore();
            }, Game.timeDelay * 1000);
            this.isChange = false;
        }
    }
}
