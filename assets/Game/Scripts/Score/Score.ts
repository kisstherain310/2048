// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class Score extends cc.Component {

    private static ins : Score;
    public static get Ins() : Score
    {
        return Score.ins;
    }

    public score: number = 0;
    public oldScore: number = 0;

    protected onLoad(): void {
        Score.ins = this;
    }
    
    @property(cc.Label)
    curScore: cc.Label = null;

    public setOldScore(){
        this.oldScore = this.score;
    }

    public changeScore(){
        this.curScore.string = `${this.score}`;
    }

    public onUndo(){
        this.score = this.oldScore;
        this.changeScore();
    }

    public resetScore(){
        this.score = 0;
        this.curScore.string = '0';
    }
}
