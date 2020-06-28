// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class Bullet extends cc.Component {
  @property({ type: cc.Integer })
  speed: number = 0;
  @property(cc.Prefab)
  boom: cc.Prefab = null;

  update(dt: number) {
    const status = this.node.parent.getComponent("Game").schedulerStatus;
    if (status) return;
    this.node.x += dt * this.speed;
    if (this.node.x > this.node.parent.x) {
      this.node.destroy();
    }
  }

  onCollisionEnter(other: cc.Component, self: cc.Component) {
    if (other.name === "Enemy<BoxCollider>") {
      self.node.destroy();
      this.node.parent.getComponent("Game").destoryEnemy(other.node);
      const randX = other.node.x - other.node.width / 2 - 30;
      const randY = other.node.y;
      const nodes = cc.instantiate(this.boom);
      this.node.parent.addChild(nodes);
      this.node.parent.getComponent("Game").addGameScore();
      nodes.setPosition(cc.v2(randX, randY));
      this.scheduleOnce(() => {
        nodes.destroy();
      }, 2);
    }
  }
}
