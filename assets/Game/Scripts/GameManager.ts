// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Block from "./Block";
import MatrixBlock from "./MatrixBlock";
import SimplePool, { PoolType } from "./Pool/SimplePool";
import Utilities from "./Utilities";

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

    protected onLoad(): void {
        GameManager.ins = this;
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
    }

    protected onDestroy(): void {
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
    }

    private onKeyDown(event: cc.Event.EventKeyboard): void {
        if (this.gameState == GameState.Spawning) return;
        switch (event.keyCode) {
            case cc.macro.KEY.left:
                this.handleEvent('left');
                break;
            case cc.macro.KEY.right:
                this.handleEvent('right');
                break;
            case cc.macro.KEY.up:
                this.handleEvent('up');
                break;
            case cc.macro.KEY.down:
                this.handleEvent('down');
                break;
        }
    }

    private generateBlock(): void {
        const posBlock = MatrixBlock.generateBlock();
        let block = SimplePool.spawnT<Block>(PoolType.Block, this.Stage_1[posBlock.i * 4 + posBlock.j].getWorldPosition(), 0);
        block.spawnEffect();
        MatrixBlock.Matrix[posBlock.i][posBlock.j] = block;
    }

    protected start(): void {
        this.generateBlock();
        this.generateBlock();
    }

    public handleEvent(direction: string){
        switch(direction){
            case 'right':
                MatrixBlock.moveRight();
                break;
            case 'left':
                MatrixBlock.moveLeft();
                break;
            case 'up':
                MatrixBlock.moveUp();
                break;
            case 'down':
                MatrixBlock.moveDown();
                break;
        }
        
        if(this.isChange){
            this.gameState = GameState.Spawning;
            setTimeout(() => {
                this.generateBlock();
                this.gameState = GameState.None;
            }, 150)
            this.isChange = false;
        }
    }
}
