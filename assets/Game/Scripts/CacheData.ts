// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

export enum TypeBlock{
    'FF0000' = 2,
    '00FF00' = 4,
    '0000FF' = 8,
    'FFFF00' = 16,
    'FF00FF' = 32,
    '00FFFF' = 64,
    '008800' = 128,
    '008000' = 256,
    '000080' = 512,
    '008080' = 1024,
    'FF8000' = 2048,
    'FF0080' = 4096,
}

@ccclass
export default class CacheData{
    
}
