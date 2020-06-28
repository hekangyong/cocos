// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class NBoomb extends cc.Component {
  @property({ type: cc.Integer })
  speed: number = 0;
  
  update(dt: number) {
    const status = this.node.parent.getComponent("Game").schedulerStatus;
    if (status) return;
    const parentWidth = this.node.parent.width / 2;
    this.node.x -= dt * this.speed;
    if (-parentWidth * 2 >= this.node.x) {
      this.node.destroy();
    }
  }
}
