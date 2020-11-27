// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {

    },
    onLoad () {},
    onEndContact(contact, selfCollider, otherCollider){
        // console.log(selfCollider)
        if(selfCollider.node.name == 'box'){
            let label = selfCollider.node.getComponentInChildren(cc.Label)
            if(label.string > 1){
                label.string -= 1
            }else{
                label.node.parent.destroy()
            }
        }
    },
    start () {

    },

    // update (dt) {},
});
