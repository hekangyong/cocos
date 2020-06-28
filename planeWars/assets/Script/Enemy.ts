// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

export enum EnemyClassify {
  SMALL_PLANE = 0,
  MEDIUM_PLANE = 1,
  BIG_PLANE = 2,
}

const plane: { plane: number; color: number[]; blood: number }[] = [
  {
    plane: EnemyClassify.MEDIUM_PLANE,
    color: [85, 237, 241, 255],
    blood: 200,
  },
  {
    plane: EnemyClassify.BIG_PLANE,
    color: [86, 76, 239, 255],
    blood: 300,
  },
  {
    plane: EnemyClassify.SMALL_PLANE,
    color: [239, 184, 76, 255],
    blood: 100,
  },
];

@ccclass
export default class EnemyClass extends cc.Component {
  @property(cc.Label) planeName = null;

  private enemySpeed: number = 0;
  init(enemySpeed: number) {
    const planeRandom = Math.floor(Math.random() * plane.length);
    const planeSize = plane[planeRandom];
    this.enemySpeed = enemySpeed;

    if (planeSize.plane === EnemyClassify.SMALL_PLANE) {
      this.planeName.string = "小飞机";
      this.node.color = new cc.Color(...planeSize.color);
    }
    if (planeSize.plane === EnemyClassify.BIG_PLANE) {
      this.planeName.string = "大飞机";
      this.node.color = new cc.Color(...planeSize.color);
    }
    if (planeSize.plane === EnemyClassify.MEDIUM_PLANE) {
      this.planeName.string = "中等飞机";
      this.node.color = new cc.Color(...planeSize.color);
    }
  }

  update(dt: number) {
    const status = this.node.parent.getComponent("Game").schedulerStatus;
    if (status) return;
    const parentWidth = this.node.parent.width / 2;
    this.node.x -= dt * this.enemySpeed;
    if (-parentWidth * 2 >= this.node.x) {
      this.node.parent.getComponent('Game').destoryEnemy(this.node)
    }
  }
}
