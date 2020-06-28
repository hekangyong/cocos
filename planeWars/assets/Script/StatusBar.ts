// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

interface StatusBarType {
  protect: boolean;
  nBoomb: number;
}

const defaultdata: StatusBarType = {
  protect: false,
  nBoomb: 0,
};

@ccclass
export default class StatusBar extends cc.Component {
  @property(cc.SpriteFrame)
  protect: cc.SpriteFrame = null;
  @property(cc.Prefab)
  item: cc.Prefab = null;
  @property(cc.Label)
  oBoombLabel: cc.Label = null;
  @property(cc.Prefab)
  tooltip: cc.Prefab = null;

  private satatusItem: StatusBarType = defaultdata;

  addProtectionCover(node: cc.Node) {
    node.destroy();
    if (!this.satatusItem.protect) {
      this.satatusItem.protect = true;
      let nodes = cc.instantiate(this.item);
      this.node.addChild(nodes);
    }
  }

  addNBoomb(node: cc.Node) {
    node.destroy();
    this.satatusItem.nBoomb += 1;
    this.oBoombLabel.string = `${this.satatusItem.nBoomb}`;
  }

  checknBoombAmount() {
    const amount = this.oBoombLabel.string.replace(/x/, "");
    if (amount === "0") {
      const node = cc.instantiate(this.tooltip);
      this.node.parent.addChild(node);
      node.getComponent("Tooltip").init("没有核弹了~");
      this.scheduleOnce(() => {
        node.destroy();
      }, 2);
      return false;
    } else {
      this.oBoombLabel.string = `x${Number(amount) - 1}`;
      return true;
    }
  }

  changeProtectStatus() {
    if (this.satatusItem.protect) {
      this.satatusItem.protect = false;
      const children = this.node.children;
      const protect = children.filter((v) => v.name === "statusItem");
      protect[0].destroy();
    }
  }
  resetGame() {
    this.satatusItem = defaultdata;
    this.node.children = null;
  }
}
