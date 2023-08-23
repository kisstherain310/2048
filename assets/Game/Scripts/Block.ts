// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import PoolMember from "./Pool/PoolMember";
import Utilities from "./Utilities";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Block extends PoolMember {
    private color: string = '#000000';
    private value: number = 2;
    private timeSpawn: number = 1;
    private timeMove: number = 0.5;
 
    public moveTo(pathLength: cc.Vec3){
        const newPos = Utilities.addVec3(this.node.position, pathLength);
        cc.tween(this.node)
        .to(this.timeMove, {position: newPos}, {easing: 'linear'})
        .start();
    }
    public powerUp(){
        cc.tween(this.node)
        .to(this.timeSpawn / 2, {scale: 1.2})
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
