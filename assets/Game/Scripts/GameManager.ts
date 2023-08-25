// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Block from "./Block";
import Board from "./Board";
import { Game } from "./GameConstant";
import SimplePool, { PoolType } from "./Pool/SimplePool";

const { ccclass, property } = cc._decorator;

enum GameState {
    None = 0,
    Spawning = 1,
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

    private gameState: GameState = GameState.None;
    public isChange: boolean = false;
    public previousBoard: Block[][];

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
    }

    protected start(): void {
        this.generateBlock();
        this.generateBlock();
    }

    private onKeyDown(event: cc.Event.EventKeyboard): void {
        if (this.gameState == GameState.Spawning) return;
        this.previousBoard = Board.Matrix;
        
        switch (event.keyCode) {
            case cc.macro.KEY.left:
                Board.moveLeft();
                break;
            case cc.macro.KEY.right:
                Board.moveRight();
                break;
            case cc.macro.KEY.up:
                Board.moveUp();
                break;
            case cc.macro.KEY.down:
                Board.moveDown();
                break;
        }

        if(this.isChange){
            this.gameState = GameState.Spawning;
            setTimeout(() => {
                this.generateBlock();
                this.gameState = GameState.None;
            }, Game.timeMove * 1000);
            this.isChange = false;
        }
    }
}
