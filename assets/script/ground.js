cc.Class({
    extends: cc.Component,

    properties: {
        isTouchBoll: false,

        game: {
            default: null,
            serializable: false,//默认会被序列化，设置false，就不会在场景加载时被编辑器中设置的值替换
        },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},
    // z设置地面与球体碰撞的事件
    onBeginContact(contact, selfCollider, otherCollider) {
        // console.log(otherCollider)
        if(this.game.lineActive){
            if(otherCollider.node.name == 'boll'){
                this.game.bollDown = true
                this.game.boll.linearVelocity = cc.v2(0, 0);//注意点，必须在编辑器中把地面的摩擦系数设置为0，才会停止
                this.game.line.x = otherCollider.node.x; //将辅助线坐标移到球上
                this.game.lineActive = false
            }
        }
    },
    start () {

    },

    // update (dt) {},
});
