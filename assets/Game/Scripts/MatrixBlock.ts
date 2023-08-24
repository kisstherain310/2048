import Block from "./Block";
import GameManager from "./GameManager";
import Utilities from "./Utilities";

const {ccclass, property} = cc._decorator;

@ccclass
export default class MatrixBlock{

    public static Matrix: Block[][]  = [
        [null, null, null, null],
        [null, null, null, null],
        [null, null, null, null],
        [null, null, null, null],
    ]

    public static generateBlock(): {i: number, j: number}{
        let newPos = Utilities.randomIndex();
        while(this.Matrix[newPos.i][newPos.j] != null) newPos = Utilities.randomIndex();
        return newPos;
    }

    private static updateHorizol(i: number, j: number, index: number, direction: number){
        const curPos = i * 4 + j, lastPos = i * 4 + index + direction;
        const pathLength: cc.Vec3 = Utilities.subVec3(GameManager.Ins.Stage_1[curPos].getWorldPosition(), GameManager.Ins.Stage_1[lastPos].getWorldPosition());
        this.Matrix[i][j].moveTo(pathLength, true);
        this.Matrix[i][index + direction].changeValue();

        setTimeout(() => this.Matrix[i][index + direction].changeProp(), 500);
        this.Matrix[i][j] = null;
    }

    private static updateVertical(i: number, j: number, index: number, direction: number){
        const curPos = i * 4 + j, lastPos = (index + direction) * 4 + j;
        const pathLength: cc.Vec3 = Utilities.subVec3(GameManager.Ins.Stage_1[curPos].getWorldPosition(), GameManager.Ins.Stage_1[lastPos].getWorldPosition());
        this.Matrix[i][j].moveTo(pathLength, true);
        this.Matrix[index + direction][j].changeValue();

        setTimeout(() => this.Matrix[index + direction][j].changeProp(), 500);
        this.Matrix[i][j] = null;
    }

    private static moveHorizol(i: number, j: number, index: number){
        const curPos = i * 4 + j, lastPos = i * 4 + index;
        const pathLength: cc.Vec3 = Utilities.subVec3(GameManager.Ins.Stage_1[curPos].getWorldPosition(), GameManager.Ins.Stage_1[lastPos].getWorldPosition());
        this.Matrix[i][j].moveTo(pathLength, false);

        this.Matrix[i][index] = this.Matrix[i][j];
        this.Matrix[i][j] = null;
    }

    private static moveVertical(i: number, j: number, index: number){
        const curPos = i * 4 + j, lastPos = index * 4 + j;
        const pathLength: cc.Vec3 = Utilities.subVec3(GameManager.Ins.Stage_1[curPos].getWorldPosition(), GameManager.Ins.Stage_1[lastPos].getWorldPosition());
        this.Matrix[i][j].moveTo(pathLength, false);

        this.Matrix[index][j] = this.Matrix[i][j];
        this.Matrix[i][j] = null;
    }

    public static moveRight(){
        for(let i = 0; i < 4; i++){
            for(let j = 2; j >= 0; j--){
                if(this.Matrix[i][j]){
                    let index = 3;
                    while(this.Matrix[i][index] != null && index > j) index--;
                    
                    if(index < 3 && this.Matrix[i][index + 1].currentValue == this.Matrix[i][j].currentValue){
                        this.updateHorizol(i, j, index, 1);
                    } else if(index != j) {
                        this.moveHorizol(i, j, index);
                    }
                }
            }
        }
    }

    public static moveLeft(){
        for(let i = 0; i < 4; i++){
            for(let j = 1; j <= 3; j++){
                if(this.Matrix[i][j]){
                    let index = 0;
                    while(this.Matrix[i][index] != null && index < j) index++;
                    
                    if(index > 0 && this.Matrix[i][index - 1].currentValue == this.Matrix[i][j].currentValue){
                        this.updateHorizol(i, j, index, -1);
                    } else if(index != j) {
                        this.moveHorizol(i, j, index);
                    }
                }
            }
        }
    }

    public static moveUp(){
        for(let j = 0; j < 4; j++){
            for(let i = 1; i <= 3; i++){
                if(this.Matrix[i][j]){
                    let index = 0;
                    while(this.Matrix[index][j] && index < i) index++;
                    
                    if(index > 0 && this.Matrix[index - 1][j].currentValue == this.Matrix[i][j].currentValue){
                        this.updateVertical(i, j, index, -1);
                    } else if(index != i) {
                        this.moveVertical(i, j, index);
                    }
                }
            }
        }
    }

    public static moveDown(){
        for(let j = 0; j < 4; j++){
            for(let i = 2; i >= 0; i--){
                if(this.Matrix[i][j]){
                    let index = 3;
                    while(this.Matrix[index][j] && index > i) index--;
                    
                    if(index < 3 && this.Matrix[index + 1][j].currentValue == this.Matrix[i][j].currentValue){
                        this.updateVertical(i, j, index, 1);
                    } else if(index != i) {
                        this.moveVertical(i, j, index)
                    }
                }
            }
        }
    }
}
