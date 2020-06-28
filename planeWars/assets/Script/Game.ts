// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { DataType } from "./Rank";

const { ccclass, property } = cc._decorator;

enum GameState {
  EASY = 0,
  MEDIUM = 1,
  DIFFCULTY = 2,
  HELL = 3,
}

@ccclass
export default class Game extends cc.Component {
  @property(cc.Prefab) bullet: cc.Prefab = null;
  @property(cc.Node) plane: cc.Node = null;
  @property(cc.Prefab) enemyPrefab: cc.Prefab = null;
  @property(cc.Node) bg1: cc.Node = null;
  @property(cc.Node) bg2: cc.Node = null;
  @property(cc.Prefab) oil: cc.Prefab = null;
  @property(cc.Label) score: cc.Label = null;
  @property(cc.Node) reset: cc.Node = null;
  @property(cc.Node) rankBtn: cc.Node = null;
  @property(cc.Node) goBack: cc.Node = null;
  @property(cc.ProgressBar) timeProGressBar: cc.ProgressBar = null;
  @property gameTime: number = 0;
  @property enemySpeed: number = 0;
  @property(cc.Node) gameOverNode: cc.Node = null;
  @property(cc.Prefab) protectionCover: cc.Prefab = null;
  @property(cc.Label) diffutly: cc.Label = null;
  @property(cc.Node) resetNode: cc.Node = null;
  @property(cc.Node) statusItem: cc.Node = null;
  @property(cc.Prefab) nBoomb: cc.Prefab = null;
  @property(cc.Node) spacecraft: cc.Node = null;

  private total: number = 0;
  private oilNodePool: cc.NodePool = new cc.NodePool("Oil");
  private enemyNodePool: cc.NodePool = new cc.NodePool("Enemy");
  private protectionCoverNodePool: cc.NodePool = new cc.NodePool(
    "protectionCover"
  );
  private nBoombNodePool: cc.NodePool = new cc.NodePool("N-boomb");
  private gameAllTime: number;
  private gamediffiuclty: number = null;

  onLoad() {
    this.enabled = true;
    let manger = cc.director.getCollisionManager();
    manger.enabled = true;
    this.gameAllTime = this.gameTime;
    cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
    cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    this.gameStart();
  }

  gameStart() {
    this.total = 0;
    this.gamediffiuclty = 0;
    const viewSize = cc.view.getVisibleSize();
    this.bg2.getComponent(cc.Widget).left = viewSize.width;
    this.bg2.getComponent(cc.Widget).right = -viewSize.width;
    this.rankBtn.active = false;
    this.gameOverNode.active = false;
    this.goBack.active = false;
    this.reset.active = false;
    this.schedule(this.createOil, 2);
    this.schedule(this.gameTimeFunc, 1);
  }

  gameTimeFunc() {
    this.gameTime--;
    if (!this.gameTime) {
      return this.gameOver();
    }
    const coverRandom = Math.floor(Math.random() * 100);
    if (coverRandom >= 75 && coverRandom <= 90) {
      this.createProtectionCover();
    }
    if (coverRandom > 90 && coverRandom <= 96) {
      this.createNBoomb();
    }
  }

  createNBoomb() {
    let nBoomb: cc.Node;
    if (this.nBoombNodePool.size() > 0) {
      nBoomb = this.nBoombNodePool.get();
    } else {
      nBoomb = cc.instantiate(this.nBoomb);
    }
    this.node.addChild(nBoomb);
    nBoomb.setPosition(this.getPositionEnemy());
  }

  createProtectionCover() {
    let protectionCoverNode: cc.Node;
    if (this.protectionCoverNodePool.size() > 0) {
      protectionCoverNode = this.protectionCoverNodePool.get();
    } else {
      protectionCoverNode = cc.instantiate(this.protectionCover);
    }
    this.node.addChild(protectionCoverNode);
    protectionCoverNode.setPosition(this.getPositionEnemy());
  }

  checkprotectionState(other: cc.Component, self: cc.Component) {
    const statusFun = this.statusItem.getComponent("StatusBar");
    const status = statusFun.satatusItem.protect;
    if (!status) {
      this.gameOver();
    }
    statusFun.changeProtectStatus();
    this.enemyNodePool.put(other.node);
  }

  update(dt: number) {
    if (this.schedulerStatus) return;
    this.timeProGressBar.progress = this.gameTime / this.gameAllTime;
    const temp = dt * (this.enemySpeed - 200);
    if (this.bg2.x - temp <= 0) {
      this.bg1.x = this.bg2.x;
      this.bg2.x = this.bg1.x + this.bg1.width;
    }
    if (this.enabled) {
      this.bg1.x -= temp;
      this.bg2.x -= temp;
    }
    if (this.total < 15 && this.gamediffiuclty !== GameState.EASY) {
      this.unschedule(this.createEnemyNode);
      this.gamediffiuclty = GameState.EASY;
      this.diffutly.string = "简单";
      this.enemySpeed = 500;
    } else if (
      this.total >= 15 &&
      this.total < 25 &&
      this.gamediffiuclty !== GameState.MEDIUM
    ) {
      this.unschedule(this.createEnemyNode);
      this.gamediffiuclty = GameState.MEDIUM;
      this.diffutly.string = "中等";
      this.enemySpeed = 550;
    } else if (
      this.total >= 25 &&
      this.total < 40 &&
      this.gamediffiuclty !== GameState.DIFFCULTY
    ) {
      this.unschedule(this.createEnemyNode);
      this.gamediffiuclty = GameState.DIFFCULTY;
      this.enemySpeed = 620;
      this.diffutly.string = "困难";
    } else if (
      this.total >= 40 &&
      this.total &&
      this.gamediffiuclty !== GameState.HELL
    ) {
      this.unschedule(this.createEnemyNode);
      this.gamediffiuclty = GameState.HELL;
      this.enemySpeed = 670;
      this.diffutly.string = "地狱";
    }
    switch (this.gamediffiuclty) {
      case GameState.EASY:
        return this.schedule(this.createEnemyNode, 1.5);
      case GameState.MEDIUM:
        return this.schedule(this.createEnemyNode, 1);
      case GameState.DIFFCULTY:
        return this.schedule(this.createEnemyNode, 0.5);
      case GameState.HELL:
        return this.schedule(this.createEnemyNode, 0.3);
      default:
        return this.schedule(this.createEnemyNode, 0.2);
    }
  }

  resetGame() {
    this.oilNodePool.clear();
    this.enemyNodePool.clear();
    this.gameTime = this.gameAllTime;
    this.enabled = true;
    this.gameOverNode.active = false;
    this.reset.active = false;
    this.rankBtn.active = false;
    this.goBack.active = false;
    this.total = 0;
    this.plane.x = -333.149;
    this.plane.y = -43.428;
    this.score.string = `${this.total}`;
    this.plane.getComponent("Plane").startMove();
    this.schedule(this.createOil, 2);
    this.schedule(this.createEnemyNode, 0.8);
    this.schedule(this.gameTimeFunc, 1);
    this.statusItem.getComponent("StatusBar").resetGame();
  }

  goRankPage() {
    const username = prompt("请输入您的用户名: ");
    const localStorageData = cc.sys.localStorage.getItem("RANK");
    if (username) {
      const data = {
        rank: 1,
        username,
        score: this.total,
      };
      if (username.length > 4 || username.length <= 2)
        return alert("您的用户名太长了");
      if (!localStorageData) {
        cc.sys.localStorage.setItem("RANK", JSON.stringify([data]));
      } else {
        const parseDataLocalStorage = JSON.parse(localStorageData);
        parseDataLocalStorage.push({
          rank: parseDataLocalStorage.length,
          username,
          score: this.total,
        } as DataType);
        const sort: DataType[] = this.shellSort(parseDataLocalStorage);
        cc.sys.localStorage.setItem("RANK", JSON.stringify(sort));
      }
    }
    cc.director.loadScene("Rank");
  }

  shellSort(arr: DataType[]) {
    const len = arr.length;
    for (let gap = Math.floor(len / 2); gap > 0; gap = Math.floor(gap / 2)) {
      for (let i = gap; i < len; i++) {
        let j = i;
        let current = arr[i];
        while (j - gap >= 0 && current.score > arr[j - gap].score) {
          arr[j] = arr[j - gap];
          j -= gap;
        }
        arr[j] = current;
      }
    }
    const fin = arr.map((v, index) => ({ ...v, rank: index + 1 }));
    return fin;
  }

  private enemyNodeArr: cc.Node[] = [];
  createEnemyNode() {
    let enemyNode: cc.Node = null;
    if (this.enemyNodePool.size() > 0) {
      enemyNode = this.enemyNodePool.get();
    } else {
      enemyNode = cc.instantiate(this.enemyPrefab);
    }
    this.node.addChild(enemyNode);
    enemyNode.getComponent("Enemy").init(this.enemySpeed);
    enemyNode.setPosition(this.getPositionEnemy());
    this.enemyNodeArr.push(enemyNode);
  }

  getPositionEnemy() {
    const randX = this.node.x;
    const randY = (Math.random() - 0.5) * 2 * (this.node.height / 2);
    return cc.v2(randX, randY);
  }

  gameOver() {
    this.enabled = false;
    this.unschedule(this.gameTimeFunc);
    this.unschedule(this.createEnemyNode);
    this.unschedule(this.createOil);
    this.gameOverNode.active = true;
    this.reset.active = true;
    this.rankBtn.active = true;
    this.goBack.active = true;
    this.plane.getComponent("Plane").stopMove();
  }

  destoryEnemy(node: cc.Node) {
    node.destroy();
    this.enemyNodeArr.shift();
  }

  addGameScore() {
    this.total += 1;
    this.score.string = `${this.total}`;
  }

  goBackFun() {
    cc.director.loadScene("Start");
  }

  createOil() {
    let oilNode = null;
    if (this.oilNodePool.size() > 0) {
      oilNode = this.oilNodePool.get(this);
    } else {
      oilNode = cc.instantiate(this.oil);
    }
    this.node.addChild(oilNode);
    oilNode.setPosition(this.getPositionOil());
  }

  getPositionOil() {
    const randY = this.node.y;
    const randX = (Math.random() - 0.5) * 2 * (this.node.width / 2);
    return cc.v2(randX, randY);
  }

  private stopStatus: boolean = false;
  private nBoombStatus: boolean = false;

  onKeyDown(event) {
    switch (event.keyCode) {
      case cc.macro.KEY.escape:
        if (!this.stopStatus) {
          this.stop();
          this.stopStatus = true;
        }
        break;
      case cc.macro.KEY.enter:
        this.continue();
        break;
      case cc.macro.KEY.y:
        if (!this.nBoombStatus) {
          this.onsetnBoomb();
          this.nBoombStatus = true;
        }
        break;
    }
  }

  onKeyUp(event) {
    switch (event.keyCode) {
      case cc.macro.KEY.escape:
        this.stopStatus = false;
        break;
      case cc.macro.KEY.y:
        this.nBoombStatus = false;
        break;
    }
  }

  onsetnBoomb() {
    const onsetStatus = this.statusItem
      .getComponent("StatusBar")
      .checknBoombAmount();
    if (onsetStatus) {
      cc.director.getScheduler().pauseTarget(this);
      this.schedulerStatus = true;
      this.plane.getComponent("Plane").stopMove();
      cc.tween(this.spacecraft)
        .to(1.4, {
          position: cc.v2(
            this.node.width + this.node.width / 2,
            this.spacecraft.y
          ),
        })
        .call(() => {
          this.enemyNodePool.clear();
          this.total += this.enemyNodeArr.length;
          this.score.string = `${this.total}`;
          this.enemyNodeArr.map((v) => v.destroy());
          this.schedulerStatus = false;
          this.plane.getComponent("Plane").startMove();
          this.spacecraft.setPosition(cc.v2(-500, this.spacecraft.y));
        })
        .start();
    }
  }

  addGameTime(oilNode: cc.Node) {
    this.oilNodePool.put(oilNode);
    const sumTime = this.gameTime + 4;
    if (sumTime >= 10) {
      this.gameTime = this.gameAllTime;
    } else {
      this.gameTime = sumTime;
    }
  }

  private schedulerStatus: boolean = false;

  stop() {
    if (!this.enabled) return;
    cc.director.getScheduler().pauseTarget(this);
    this.schedulerStatus = true;
    this.plane.getComponent("Plane").stopMove();
    this.resetNode.active = true;
  }

  continue() {
    cc.director.getScheduler().resumeTarget(this);
    this.resetNode.active = false;
    this.schedulerStatus = false;
    this.plane.getComponent("Plane").startMove();
  }

  onDestroy() {
    cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
    cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
  }
}
