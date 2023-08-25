import GameManager from "../Manager/GameManager";
import Score from "../Score/Score";
import Utilities from "../Utilities";
import Block from "./Block";


const { ccclass, property } = cc._decorator;

@ccclass
export default class Board {
    private static timeSpawn: number = 150;
    private static blockNumber: number = 0;
    public static Matrix: Block[][] = [
        [null, null, null, null],
        [null, null, null, null],
        [null, null, null, null],
        [null, null, null, null],
    ]

    public static generateBlock(): { i: number, j: number } {
        let newPos = Utilities.randomIndex();
        while (this.Matrix[newPos.i][newPos.j] != null) newPos = Utilities.randomIndex();
        this.blockNumber++;
        return newPos;
    }

    public static checkEndGame(): boolean{
        if(this.blockNumber == 16){
            for(let i = 0; i < 4; i++){
                for(let j = 0; j < 4; j++){
                    if(j <= 2 && this.Matrix[i][j].currentValue == this.Matrix[i][j + 1].currentValue) return false;
                    if(i <= 2 && this.Matrix[i][j].currentValue == this.Matrix[i + 1][j].currentValue) return false;
                }
            }
            return true;
        }
        return false;
    }

    public static resetGame(){
        this.blockNumber = 0;
        for(let i = 0; i < 4; i++){
            for(let j = 0; j < 4; j++){
                if(this.Matrix[i][j]){
                    this.Matrix[i][j].onDeath();
                    this.Matrix[i][j] = null;
                }
            }
        }
        Score.Ins.resetScore();
    }

    private static updateHorizol(i: number, j: number, index: number, direction: number) {
        const curPos = i * 4 + j, lastPos = i * 4 + index + direction;
        const pathLength: cc.Vec3 = Utilities.subVec3(GameManager.Ins.Stage_1[curPos].getWorldPosition(), GameManager.Ins.Stage_1[lastPos].getWorldPosition());
        this.Matrix[i][j].moveTo(pathLength, true);
        this.Matrix[i][index + direction].changeValue();

        setTimeout(() => this.Matrix[i][index + direction].changeProp(), this.timeSpawn);
        this.blockNumber--;
        this.Matrix[i][j] = null;
    }

    private static updateVertical(i: number, j: number, index: number, direction: number) {
        const curPos = i * 4 + j, lastPos = (index + direction) * 4 + j;
        const pathLength: cc.Vec3 = Utilities.subVec3(GameManager.Ins.Stage_1[curPos].getWorldPosition(), GameManager.Ins.Stage_1[lastPos].getWorldPosition());
        this.Matrix[i][j].moveTo(pathLength, true);
        this.Matrix[index + direction][j].changeValue();

        setTimeout(() => this.Matrix[index + direction][j].changeProp(), this.timeSpawn);
        this.blockNumber--;
        this.Matrix[i][j] = null;
    }

    private static moveHorizol(i: number, j: number, index: number) {
        const curPos = i * 4 + j, lastPos = i * 4 + index;
        const pathLength: cc.Vec3 = Utilities.subVec3(GameManager.Ins.Stage_1[curPos].getWorldPosition(), GameManager.Ins.Stage_1[lastPos].getWorldPosition());
        this.Matrix[i][j].moveTo(pathLength, false);

        this.Matrix[i][index] = this.Matrix[i][j];
        this.Matrix[i][j] = null;
    }

    private static moveVertical(i: number, j: number, index: number) {
        const curPos = i * 4 + j, lastPos = index * 4 + j;
        const pathLength: cc.Vec3 = Utilities.subVec3(GameManager.Ins.Stage_1[curPos].getWorldPosition(), GameManager.Ins.Stage_1[lastPos].getWorldPosition());
        this.Matrix[i][j].moveTo(pathLength, false);

        this.Matrix[index][j] = this.Matrix[i][j];
        this.Matrix[i][j] = null;
    }

    public static moveRight() {
        for (let i = 0; i < 4; i++) {
            for (let j = 2; j >= 0; j--) {
                if (this.Matrix[i][j]) {
                    let index = 3;
                    while (this.Matrix[i][index] != null && index > j) index--;

                    if (index < 3 && this.Matrix[i][index + 1].currentValue == this.Matrix[i][j].currentValue) {
                        GameManager.Ins.isChange = true;
                        this.updateHorizol(i, j, index, 1);
                    } else if (index != j) {
                        GameManager.Ins.isChange = true;
                        this.moveHorizol(i, j, index);
                    }
                }
            }
        }
    }

    public static moveLeft() {
        for (let i = 0; i < 4; i++) {
            for (let j = 1; j <= 3; j++) {
                if (this.Matrix[i][j]) {
                    let index = 0;
                    while (this.Matrix[i][index] != null && index < j) index++;

                    if (index > 0 && this.Matrix[i][index - 1].currentValue == this.Matrix[i][j].currentValue) {
                        GameManager.Ins.isChange = true;
                        this.updateHorizol(i, j, index, -1);
                    } else if (index != j) {
                        GameManager.Ins.isChange = true;
                        this.moveHorizol(i, j, index);
                    }
                }
            }
        }
    }

    public static moveUp() {
        for (let j = 0; j < 4; j++) {
            for (let i = 1; i <= 3; i++) {
                if (this.Matrix[i][j]) {
                    let index = 0;
                    while (this.Matrix[index][j] && index < i) index++;

                    if (index > 0 && this.Matrix[index - 1][j].currentValue == this.Matrix[i][j].currentValue) {
                        GameManager.Ins.isChange = true;
                        this.updateVertical(i, j, index, -1);
                    } else if (index != i) {
                        GameManager.Ins.isChange = true;
                        this.moveVertical(i, j, index);
                    }
                }
            }
        }
    }

    public static moveDown() {
        for (let j = 0; j < 4; j++) {
            for (let i = 2; i >= 0; i--) {
                if (this.Matrix[i][j]) {
                    let index = 3;
                    while (this.Matrix[index][j] && index > i) index--;

                    if (index < 3 && this.Matrix[index + 1][j].currentValue == this.Matrix[i][j].currentValue) {
                        GameManager.Ins.isChange = true;
                        this.updateVertical(i, j, index, 1);
                    } else if (index != i) {
                        GameManager.Ins.isChange = true;
                        this.moveVertical(i, j, index)
                    }
                }
            }
        }
    }
}
