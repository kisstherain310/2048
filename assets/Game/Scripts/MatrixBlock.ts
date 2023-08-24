// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Block from "./Block";
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
}
