// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import MatrixBlock from "./MatrixBlock";
import Utilities from "./Utilities";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GameManager extends cc.Component {
    @property(cc.Prefab)
    prefab: cc.Prefab = null;

    @property(cc.Node)
    Stage_1: cc.Node[] = [];

    private list: cc.Node[] = [];

    protected onLoad(): void {
        // this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchBegan, this);
        // this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMoved, this);
        for (let i = 0; i <= 15; i++) this.list.push(null);
    }

    protected onDestroy(): void {
        // this.node.off(cc.Node.EventType.TOUCH_START, this.onTouchBegan, this);
        // this.node.off(cc.Node.EventType.TOUCH_MOVE, this.onTouchMoved, this);
    }

    private generateBlock(): void {
        const newBlock = cc.instantiate(this.prefab);
        this.node.addChild(newBlock);

        const posBlock = MatrixBlock.generateBlock();
        newBlock.setWorldPosition(this.Stage_1[posBlock.i * 4 + posBlock.j].getWorldPosition());
        // newBlock.getComponent('Block').spawnEffect();
        this.list[posBlock.i * 4 + posBlock.j] = newBlock;
    }

    protected start(): void {
        this.generateBlock();
        this.generateBlock();
    }

    private Debug(){
        for(let i = 0; i <= 3; i++) console.log(MatrixBlock.Matrix[i][0], MatrixBlock.Matrix[i][1], MatrixBlock.Matrix[i][2], MatrixBlock.Matrix[i][3]);
        console.log('het');
    }   
    // chưa update Matrix
    public handleEvent(direction: string) {
        switch (direction) {
            case 'right':
                for (let i = 0; i <= 3; i++) {
                    let rightLimit = 3;
                    for (let j = 3; j >= 0; j--) {
                        if (MatrixBlock.Matrix[i][j] > 0) {
                            const index = i * 4 + rightLimit;

                            const target = this.Stage_1[index].getWorldPosition();
                            const pathLength: cc.Vec3 = Utilities.subVec3(this.list[i * 4 + j].getWorldPosition(), target);
                            this.list[i * 4 + j].getComponent('Block').moveTo(pathLength);

                            const temp = MatrixBlock.Matrix[i][j];
                            MatrixBlock.Matrix[i][j] = 0;
                            MatrixBlock.Matrix[i][rightLimit] = temp;

                            const tmp = this.list[i * 4 + j];
                            this.list[i * 4 + j] = null;
                            this.list[i * 4 + rightLimit] = tmp;
                            rightLimit--;
                        }
                    }
                }
                break;
            case 'left':
                for (let i = 0; i <= 3; i++) {
                    let leftLimit = 0;
                    for (let j = 0; j <= 3; j++) {
                        if (MatrixBlock.Matrix[i][j] > 0) {
                            const index = i * 4 + leftLimit;

                            const target = this.Stage_1[index].getWorldPosition();
                            const pathLength: cc.Vec3 = Utilities.subVec3(this.list[i * 4 + j].getWorldPosition(), target);
                            this.list[i * 4 + j].getComponent('Block').moveTo(pathLength);

                            const temp = MatrixBlock.Matrix[i][j];
                            MatrixBlock.Matrix[i][j] = 0;
                            MatrixBlock.Matrix[i][leftLimit] = temp;

                            const tmp = this.list[i * 4 + j];
                            this.list[i * 4 + j] = null;
                            this.list[i * 4 + leftLimit] = tmp;
                            leftLimit++;
                        }
                    }
                }
                break;
            case 'up':
                for (let j = 0; j <= 3; j++) {
                    let topLimit = 0;
                    for (let i = 0; i <= 3; i++) {
                        if (MatrixBlock.Matrix[i][j] > 0) {
                            const index = topLimit * 4 + j;

                            const target = this.Stage_1[index].getWorldPosition();
                            const pathLength: cc.Vec3 = Utilities.subVec3(this.list[i * 4 + j].getWorldPosition(), target);
                            this.list[i * 4 + j].getComponent('Block').moveTo(pathLength);

                            const temp = MatrixBlock.Matrix[i][j];
                            MatrixBlock.Matrix[i][j] = 0;
                            MatrixBlock.Matrix[topLimit][j] = temp;

                            const tmp = this.list[i * 4 + j];
                            this.list[i * 4 + j] = null;
                            this.list[topLimit * 4 + j] = tmp;
                            topLimit++;
                        }
                    }
                }
                break;
            case 'down':
                for (let j = 0; j <= 3; j++) {
                    let bottomLimit = 3;
                    for (let i = 3; i >= 0; i--) {
                        if (MatrixBlock.Matrix[i][j] > 0) {
                            const index = bottomLimit * 4 + j;

                            const target = this.Stage_1[index].getWorldPosition();
                            const pathLength: cc.Vec3 = Utilities.subVec3(this.list[i * 4 + j].getWorldPosition(), target);
                            this.list[i * 4 + j].getComponent('Block').moveTo(pathLength);

                            const temp = MatrixBlock.Matrix[i][j];
                            MatrixBlock.Matrix[i][j] = 0;
                            MatrixBlock.Matrix[bottomLimit][j] = temp;

                            const tmp = this.list[i * 4 + j];
                            this.list[i * 4 + j] = null;
                            this.list[bottomLimit * 4 + j] = tmp;
                            bottomLimit--;
                        }
                    }
                }
                break;
        }

        setTimeout(()=> {
            this.generateBlock();
        }, 500)
    }
}
