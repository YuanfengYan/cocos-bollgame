// 配置sensor  传感器类型的碰撞体，有回调，但不会有触发效果
cc.Class({
    
    extends: cc.Component,

    properties: {

    },

    onBeginContact: function (contact, selfCollider, otherCollider) {
        if (otherCollider.node.name == "lifebox") {
            selfCollider.node.destroy();
        }
    },

    // onLoad () {},

    start () {

    },
    // update (dt) {},


});
