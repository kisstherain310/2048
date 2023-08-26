	
const { ccclass, property } = cc._decorator;
 
@ccclass
export default class Utilities{
 
  //chuyen vector 3 sang vector 2
  public static vec3ToVec2(v: cc.Vec3) : cc.Vec2{
    return cc.v2(v.x, v.y);
  }
 
  //chuyen vector 2 sang vector 3
  public static vec2ToVec3(v: cc.Vec2) : cc.Vec3{
    return cc.v3(v.x, v.y, 0);
  }

  public static direction(lastPos: cc.Vec3, newPos: cc.Vec3) : string{
    const vectorDir = {x: 0, y: 0};
    vectorDir.x = newPos.x - lastPos.x;
    vectorDir.y = newPos.y - lastPos.y;
    if(Math.abs(vectorDir.y) < Math.abs(vectorDir.x)){
        if(vectorDir.x > 0) return 'right';
        else return 'left';
    } else if(Math.abs(vectorDir.y) > Math.abs(vectorDir.x)){
        if(vectorDir.y > 0) return 'up';
        else return 'down';
    }
  }

  public static random(min: number, max: number) : number{
    return min + Math.floor(Math.random() * (max + 1 - min));
  }

  public static randomIndex(): {i: number, j: number}{
    const x = this.random(0, 3);
    const y = this.random(0, 3);
    return {i: x, j: y};
  }

  public static subVec3(A: cc.Vec3, B: cc.Vec3): cc.Vec3{
    const result: cc.Vec3 = cc.v3(B.x - A.x, B.y - A.y, B.z - A.z);
    return result;
  }

  public static addVec3(A: cc.Vec3, B: cc.Vec3): cc.Vec3{
    const result: cc.Vec3 = cc.v3(B.x + A.x, B.y + A.y, B.z + A.z);
    return result;
  }

  public static convertToCCColor(color: string): cc.Color{
    var r = parseInt(color.substring(0, 2), 16);
    var g = parseInt(color.substring(2, 4), 16);
    var b = parseInt(color.substring(4, 6), 16);
    return new cc.Color(r, g, b);
  }
}