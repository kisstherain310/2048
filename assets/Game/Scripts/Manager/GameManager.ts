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
import Utilities from "../Utilities";
import UIManager from "./UIManager";

const { ccclass, property } = cc._decorator;

export enum GameState {
    Playing = 0,
    Spawning = 1,
    End = 2,
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

    private timeMoved: number = 0;
    private isMoved: boolean = false;
    private curDes: cc.Vec3 = null;
    private lastDes: cc.Vec3 = null;
    private screen: cc.Vec2 = new cc.Vec2(cc.view.getVisibleSize().width, cc.view.getVisibleSize().height);

    public gameState: GameState = GameState.Playing;
    public isChange: boolean = false;

    protected onLoad(): void {
        GameManager.ins = this;
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);

        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchBegan, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMoved, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
    }

    protected onDestroy(): void {
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);

        this.node.off(cc.Node.EventType.TOUCH_START, this.onTouchBegan, this);
        this.node.off(cc.Node.EventType.TOUCH_MOVE, this.onTouchMoved, this);
        this.node.off(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
    }

    onTouchBegan(event: cc.Event.EventTouch){
        this.isMoved = false;
        this.curDes = Utilities.vec2ToVec3(this.getMousePoint(event));
    }

    onTouchMoved(event: cc.Event.EventTouch){
        if(this.isMoved) return;
        this.timeMoved += 1;
        if(this.timeMoved >= 5){
            this.onTouchEnd(event);
            this.timeMoved = 0;
            this.isMoved = true;
        }
    }


    onTouchEnd(event: cc.Event.EventTouch){
        if(this.isMoved) return;
        this.lastDes = Utilities.vec2ToVec3(this.getMousePoint(event));
        this.onTouch(Utilities.direction(this.curDes, this.lastDes));
        this.isMoved = true;
    }

    private getMousePoint(event: cc.Event.EventTouch): cc.Vec2{
        return event.getLocation().sub(cc.v2(this.screen.x * 0.5, this.screen.y * 0.5));
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
        this.gameState = GameState.Playing;
        this.generateBlock();
        this.generateBlock();
    }

    private delaySpawning(){
        if(this.isChange){
            this.gameState = GameState.Spawning;
            setTimeout(() => {
                this.generateBlock();
                this.gameState = GameState.Playing;
                Score.Ins.changeScore();
            }, Game.timeDelay * 1000);
            this.isChange = false;
        }
    }

    private onKeyDown(event: cc.Event.EventKeyboard): void {
        if (this.gameState == GameState.Spawning) return;
        if (this.gameState == GameState.End) return;

        let direction: string = null;
        
        switch (event.keyCode) {
            case cc.macro.KEY.a:
            case cc.macro.KEY.left:
                direction = 'left';
                break;
            case cc.macro.KEY.d:
            case cc.macro.KEY.right:
                direction = 'right'
                break;
            case cc.macro.KEY.w:
            case cc.macro.KEY.up:
                direction = 'up';
                break;
            case cc.macro.KEY.s:
            case cc.macro.KEY.down:
                direction = 'down'
                break;
        }

        Board.handleEvent(direction);
        this.delaySpawning();
    }

    private onTouch(direction: string): void {
        if (this.gameState == GameState.Spawning) return;
        if (this.gameState == GameState.End) return;

        Board.handleEvent(direction);
        this.delaySpawning();
    }
}
