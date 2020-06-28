// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
const { ccclass, property } = cc._decorator;
import StatusBar from "./StatusBar";

@ccclass
export default class Plane extends cc.Component {
  @property(cc.Node) palne: cc.Node = null;
  @property speed: number = 0;
  @property(cc.Prefab) bullent: cc.Prefab = null;
  @property(cc.Node) main: cc.Node = null;
  @property(cc.Canvas) Home: cc.Canvas = null;
  @property(cc.Node) statusItem: cc.Node = null;
  private moveLeft: boolean = false;
  private moveRight: boolean = false;
  private moveTop: boolean = false;
  private moveBottom: boolean = false;
  private shuotBullent: boolean = false;

  onLoad() {
    this.enabled = true;
    this.node.y = 0;
    this.node.x = -this.node.parent.width / 2 + 150;
    cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
    cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
  }

  onKeyDown(event) {
    switch (event.keyCode) {
      case cc.macro.KEY.a:
        this.moveLeft = true;
        break;
      case cc.macro.KEY.d:
        this.moveRight = true;
        break;
      case cc.macro.KEY.w:
        this.moveTop = true;
        break;
      case cc.macro.KEY.s:
        this.moveBottom = true;
        break;
      case cc.macro.KEY.space:
        if (this.shuotBullent) return;
        this.shuotBullent = true;
        this.shotBullet();
        break;
    }
  }

  onKeyUp(event) {
    switch (event.keyCode) {
      case cc.macro.KEY.a:
        this.moveLeft = false;
        break;
      case cc.macro.KEY.d:
        this.moveRight = false;
        break;
      case cc.macro.KEY.w:
        this.moveTop = false;
        break;
      case cc.macro.KEY.s:
        this.moveBottom = false;
        break;
      case cc.macro.KEY.space:
        this.shuotBullent = false;
        break;
    }
  }

  update(dt: number) {
    if (!this.enabled) return;
    if (this.moveBottom) {
      this.speed -= dt;
      this.node.y -= this.speed;
    }
    if (this.moveLeft) {
      this.speed -= dt;
      this.node.x -= this.speed;
    }
    if (this.moveRight) {
      this.speed += dt;
      this.node.x += this.speed;
    }
    if (this.moveTop) {
      this.speed += dt;
      this.node.y += this.speed;
    }
    if (this.node.x >= this.node.parent.width / 2) {
      this.node.x = this.node.parent.width / 2;
    } else if (this.node.x < -this.node.parent.width / 2) {
      this.node.x = -this.node.parent.width / 2;
    }
    if (this.node.y >= this.node.parent.height / 2) {
      this.node.y = this.node.parent.height / 2;
    } else if (this.node.y <= -this.node.parent.height / 2) {
      this.node.y = -this.node.parent.height / 2;
    }
  }

  shotBullet() {
    const randY = this.node.y;
    const randX = this.node.x + this.node.width / 2;
    let bullet = cc.instantiate(this.bullent);
    this.node.parent.addChild(bullet);
    bullet.setPosition(cc.v2(randX, randY));
  }

  onCollisionEnter(other: cc.BoxCollider, self: cc.Component) {
    if (other.name === "Oil<BoxCollider>") {
      this.Home.getComponent("Game").addGameTime(other.node);
    }
    if (other.name === "ProtectionCover<BoxCollider>") {
      this.statusItem.getComponent("StatusBar").addProtectionCover(other.node);
    }
    if (other.name === "Enemy<BoxCollider>") {
      this.node.parent.getComponent("Game").checkprotectionState(other, self);
    }
    if (other.name === "N-boomb<BoxCollider>") {
      this.statusItem.getComponent("StatusBar").addNBoomb(other.node);
    }
  }

  startMove() {
    cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
    cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    this.enabled = true;
  }

  stopMove() {
    cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
    cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    this.enabled = false;
    this.moveBottom = false;
    this.moveLeft = false;
    this.moveRight = false;
    this.moveTop = false;
  }

  onDestroy() {
    cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
    cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
  }
}
