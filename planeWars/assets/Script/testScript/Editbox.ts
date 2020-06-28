// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

interface Data {
  a: number;
  b: string;
}

@ccclass
export default class NewClass extends cc.Component {
  onLoad() {
    console.log(cc.Canvas.instance);
  }
  editboxDidBegan(editbox: cc.EditBox, custom: string) {
    console.log("oneditBoxDidBegan", editbox, custom);
  }
  onEditDidEnded(editbox: cc.EditBox, custiomEventData: string) {
    console.log("onEditDidEnded", editbox, custiomEventData);
  }
  onTextChanged(text: string, editBox: cc.EditBox, customEventData: string) {
    console.log("onTextChanged", text, editBox, customEventData);
  }
  onEditingReturn(editBox: cc.EditBox, customEventData: string) {
    console.log("onEditingReturn", editBox, customEventData);
  }
}
