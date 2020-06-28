// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class Item extends cc.Component {
  @property(cc.Label) username: cc.Label = null;
  @property(cc.Label) score: cc.Label = null;
  @property(cc.Label) rank: cc.Label = null;

  init(rankL: number, usernameL: string, scoreL: number) {
    this.username.string = usernameL;
    this.score.string = `${scoreL}`;
    this.rank.string = `${rankL}`;
  }
}
