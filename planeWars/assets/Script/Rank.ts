// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

export interface DataType {
  rank: number;
  username: string;
  score: number;
}

@ccclass
export default class Rank extends cc.Component {
  @property(cc.Prefab) item: cc.Prefab = null;
  @property(cc.Node) content: cc.Node = null;

  onLoad() {
    const data: DataType[] = JSON.parse(cc.sys.localStorage.getItem("RANK"));
    for (let i = 0; i < data.length; i++) {
      const dataI = data[i];
      const item = cc.instantiate(this.item);
      this.content.addChild(item);
      item.getComponent("Item").init(dataI.rank, dataI.username, dataI.score);
    }
  }

  goBack() {
    cc.director.loadScene("Start");
  }
}
