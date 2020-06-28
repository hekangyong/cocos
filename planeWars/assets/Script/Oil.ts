// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class Oil extends cc.Component {
  @property oilSpeed: number = 0;

  update(dt) {
    const status = this.node.parent.getComponent("Game").schedulerStatus;
    if (status) return;
    this.node.y -= dt * this.oilSpeed;
  }
}
