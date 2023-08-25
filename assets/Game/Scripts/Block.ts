// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { TypeBlock } from "./GameConstant";
import PoolMember from "./Pool/PoolMember";
import SimplePool from "./Pool/SimplePool";
import Utilities from "./Utilities";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Block extends PoolMember {
    @property(cc.Label)
    value: cc.Label = null;

    private timeSpawn: number = 0.1;
    private timeMove: number = 0.15;
    
    public currentValue: number = 2;

    public changeProp(){
        this.value.string = `${this.currentValue}`;
        this.node.children[0].color = Utilities.convertToCCColor(TypeBlock[this.currentValue]);
        this.powerUp();
    }
    public changeValue(){
        this.currentValue *= 2;
    }

    private resetBlock(){
        this.currentValue = 2;
        this.value.string = `2`;
        this.node.children[0].color = Utilities.convertToCCColor(TypeBlock[2]);
    }

    public onDeath(){
        this.resetBlock();
        SimplePool.despawn(this);
    }
 
    public moveTo(pathLength: cc.Vec3, isDead: boolean){
        const newPos = Utilities.addVec3(this.node.position, pathLength);
        cc.tween(this.node)
        .to(this.timeMove, {position: newPos}, {easing: 'linear'})
        .call(() => {
            if(isDead) this.onDeath();
        })
        .start();
    }
    public powerUp(){
        cc.tween(this.node)
        .to(this.timeSpawn / 2, {scale: 1.1})
        .to(this.timeSpawn / 2, {scale: 1})
        .start();
    }
    public spawnEffect(){
        this.node.scale = 0.3;
        cc.tween(this.node)
        .to(this.timeSpawn, {scale: 1}, {easing: 'linear'})
        .start();
    }
}
