// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    onEndContact(contact, selfCollider, otherCollider){
        // console.log(selfCollider)
        if(otherCollider.node.name == 'box'){
            cc.audioEngine.play(selfCollider.node.game.rockAudio, false, 1)
            let label = otherCollider.node.getComponentInChildren(cc.Label)
            if(label.string > 1){
                label.string -= 1
            }else{
                label.node.parent.destroy()
            }
        }else if(otherCollider.node.name == 'lifebox'){
            cc.audioEngine.play(selfCollider.node.game.circleAudio, false, 1)
            otherCollider.node.destroy()
            // selfCollider.node.game.allBalls ++ 不能直接总数上加，
            selfCollider.node.game.addBolls ++
        }
    },
    // update (dt) {},
});
