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
    @property(cc.Prefab)
    prefab: cc.Prefab = null;

    @property(cc.Node)
    Stage_1: cc.Node[] = [];

    private gameState: GameState = GameState.None;

    protected onLoad(): void {
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
        this.generateBlock();
    }

    public handleEvent(direction: string){
        switch(direction){
            case 'right':
                for(let i = 0; i < 4; i++){
                    for(let j = 2; j >= 0; j--){
                        if(MatrixBlock.Matrix[i][j]){
                            let index = 3;
                            while(MatrixBlock.Matrix[i][index] != null && index > j) index--;
                            
                            if(index < 3 && MatrixBlock.Matrix[i][index + 1].currentValue == MatrixBlock.Matrix[i][j].currentValue){
                                const curPos = i * 4 + j, lastPos = i * 4 + index + 1;
                                const pathLength: cc.Vec3 = Utilities.subVec3(this.Stage_1[curPos].getWorldPosition(), this.Stage_1[lastPos].getWorldPosition());
                                MatrixBlock.Matrix[i][j].moveTo(pathLength, true);

                                setTimeout(() => MatrixBlock.Matrix[i][index + 1].changeProp('34eb40'), 500);
                                MatrixBlock.Matrix[i][j] = null;
                            } else if(index != j) {
                                const curPos = i * 4 + j, lastPos = i * 4 + index;
                                const pathLength: cc.Vec3 = Utilities.subVec3(this.Stage_1[curPos].getWorldPosition(), this.Stage_1[lastPos].getWorldPosition());
                                MatrixBlock.Matrix[i][j].moveTo(pathLength, false);

                                MatrixBlock.Matrix[i][index] = MatrixBlock.Matrix[i][j];
                                MatrixBlock.Matrix[i][j] = null;
                            }
                        }
                    }
                }
                break;
            case 'left':
                for(let i = 0; i < 4; i++){
                    for(let j = 1; j <= 3; j++){
                        if(MatrixBlock.Matrix[i][j]){
                            let index = 0;
                            while(MatrixBlock.Matrix[i][index] != null && index < j) index++;
                            
                            if(index > 0 && MatrixBlock.Matrix[i][index - 1].currentValue == MatrixBlock.Matrix[i][j].currentValue){
                                const curPos = i * 4 + j, lastPos = i * 4 + index - 1;
                                const pathLength: cc.Vec3 = Utilities.subVec3(this.Stage_1[curPos].getWorldPosition(), this.Stage_1[lastPos].getWorldPosition());
                                MatrixBlock.Matrix[i][j].moveTo(pathLength, true);

                                setTimeout(() => MatrixBlock.Matrix[i][index - 1].changeProp('34eb40'), 500);
                                MatrixBlock.Matrix[i][j] = null;
                            } else if(index != j) {
                                const curPos = i * 4 + j, lastPos = i * 4 + index;
                                const pathLength: cc.Vec3 = Utilities.subVec3(this.Stage_1[curPos].getWorldPosition(), this.Stage_1[lastPos].getWorldPosition());
                                MatrixBlock.Matrix[i][j].moveTo(pathLength, false);

                                MatrixBlock.Matrix[i][index] = MatrixBlock.Matrix[i][j];
                                MatrixBlock.Matrix[i][j] = null;
                            }
                        }
                    }
                }
                break;
            case 'up':
                for(let j = 0; j < 4; j++){
                    for(let i = 1; i <= 3; i++){
                        if(MatrixBlock.Matrix[i][j]){
                            let index = 0;
                            while(MatrixBlock.Matrix[index][j] && index < i) index++;
                            
                            if(index > 0 && MatrixBlock.Matrix[index - 1][j].currentValue == MatrixBlock.Matrix[i][j].currentValue){
                                const curPos = i * 4 + j, lastPos = (index - 1) * 4 + j;
                                const pathLength: cc.Vec3 = Utilities.subVec3(this.Stage_1[curPos].getWorldPosition(), this.Stage_1[lastPos].getWorldPosition());
                                MatrixBlock.Matrix[i][j].moveTo(pathLength, true);

                                setTimeout(() => {
                                    MatrixBlock.Matrix[index - 1][j].changeProp('34eb40')
                                }, 500);
                                MatrixBlock.Matrix[i][j] = null;
                            } else if(index != i) {
                                const curPos = i * 4 + j, lastPos = index * 4 + j;
                                const pathLength: cc.Vec3 = Utilities.subVec3(this.Stage_1[curPos].getWorldPosition(), this.Stage_1[lastPos].getWorldPosition());
                                MatrixBlock.Matrix[i][j].moveTo(pathLength, false);

                                MatrixBlock.Matrix[index][j] = MatrixBlock.Matrix[i][j];
                                MatrixBlock.Matrix[i][j] = null;
                            }
                        }
                    }
                }
                break;
            case 'down':
                for(let j = 0; j < 4; j++){
                    for(let i = 2; i >= 0; i--){
                        if(MatrixBlock.Matrix[i][j]){
                            let index = 3;
                            while(MatrixBlock.Matrix[index][j] && index > i) index--;
                            
                            if(index < 3 && MatrixBlock.Matrix[index + 1][j].currentValue == MatrixBlock.Matrix[i][j].currentValue){
                                const curPos = i * 4 + j, lastPos = (index + 1) * 4 + j;
                                const pathLength: cc.Vec3 = Utilities.subVec3(this.Stage_1[curPos].getWorldPosition(), this.Stage_1[lastPos].getWorldPosition());
                                MatrixBlock.Matrix[i][j].moveTo(pathLength, true);

                                setTimeout(() => {
                                    MatrixBlock.Matrix[index + 1][j].changeProp('34eb40')
                                }, 500);
                                MatrixBlock.Matrix[i][j] = null;
                            } else if(index != i) {
                                const curPos = i * 4 + j, lastPos = index * 4 + j;
                                const pathLength: cc.Vec3 = Utilities.subVec3(this.Stage_1[curPos].getWorldPosition(), this.Stage_1[lastPos].getWorldPosition());
                                MatrixBlock.Matrix[i][j].moveTo(pathLength, false);

                                MatrixBlock.Matrix[index][j] = MatrixBlock.Matrix[i][j];
                                MatrixBlock.Matrix[i][j] = null;
                            }
                        }
                    }
                }
                break;
        }
        
        this.gameState = GameState.Spawning;
        setTimeout(() => {
            this.generateBlock();
            this.gameState = GameState.None;
        }, 500)
    }
}
