// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Utilities from "./Utilities";

const {ccclass, property} = cc._decorator;

@ccclass
export default class MatrixBlock{

    public static Matrix: number[][]  = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
    ]

    public static generateBlock(): {i: number, j: number}{
        let newPos = Utilities.randomIndex();
        while(this.Matrix[newPos.i][newPos.j] != 0) newPos = Utilities.randomIndex();
        this.Matrix[newPos.i][newPos.j] = 2;
        return newPos;
    }

    // public static handleEvent(direction: string){
    //     switch(direction){
    //         case 'right':
    //             for(let i = 0; i <= 3; i++){
    //                 for(let j = 0; j <= 3; j++){

    //                 }
    //             }
    //             break;
    //         case 'left':
    //             break; 
    //         case 'up':
    //             break;
    //         case 'down':
    //             break;   
    //     }
    // }
}
