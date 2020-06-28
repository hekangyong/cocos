// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {
  onLoad() {
    this.schedule(this.aconsole, 1);
  }
  aconsole() {
    console.log("asdaaaaa");
  }
  checkStatus() {
    console.log("status", cc.director.getScheduler().isTargetPaused(this));
    console.log(
      "exist",
      cc.director.getScheduler().isScheduled(() => {
        console.log("asd");
      }, this)
    );
  }
  stop() {
    cc.director.getScheduler().pauseTarget(this);
  }
  continue() {
    console.log("asd");
    cc.director.getScheduler().resumeTarget(this);
  }
}
