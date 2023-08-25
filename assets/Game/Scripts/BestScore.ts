// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Score from "./Score";

const {ccclass, property} = cc._decorator;

@ccclass
export default class BestScore extends cc.Component {
    private static ins : BestScore;
    public static get Ins() : BestScore
    {
        return BestScore.ins;
    }

    public bestSCore: number = 0;

    protected onLoad(): void {
        BestScore.ins = this;
    }
    @property(cc.Label)
    bestScore: cc.Label = null;

    public changeBestScore(){
        if(this.bestSCore < Score.Ins.score) this.bestSCore = Score.Ins.score;
        this.bestScore.string = `${this.bestSCore}`;
        console.log(this.bestSCore);
    }
}
