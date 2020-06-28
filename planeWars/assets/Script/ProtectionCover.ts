// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class ProtectionCover extends cc.Component {
  @property coverSpeed: number = 0;

  update(dt: number) {
    const status = this.node.parent.getComponent("Game").schedulerStatus;
    if (status) return;
    this.node.x -= dt * this.coverSpeed;
  }
}
