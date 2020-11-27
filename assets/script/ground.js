cc.Class({
    extends: cc.Component,

    properties: {
        isTouchBall: false,

        game: {
            default: null,
            serializable: false,//默认会被序列化，设置false，就不会在场景加载时被编辑器中设置的值替换
        },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},
    // z设置地面与球体碰撞的事件
    // 之前是onBeginContact回调函数，每次发球时会进入改成了end
    onBeginContact(contact, selfCollider, otherCollider) {
        if(this.game.gameActive){
            if(otherCollider.node.name == 'ball' && otherCollider.body.linearVelocity.y<0){
                this.game.allBallsCount++ 
                if(this.game.firstball.enabled == false){
                    this.game.firstball.node.x = otherCollider.node.x
                    this.game.firstball.enabled = true
                    this.game.line.x = otherCollider.node.x; //将辅助线坐标移到球上
                }
                if(this.game.allBallsCount == this.game.allBalls){
                    this.game.ballDown = true
                    this.game.allBallsCount = 0
                    this.game.gameActive = false
                }
                console.log(this.game.allBallsCount)
                otherCollider.node.destroy()
                // this.game.ball.linearVelocity = cc.v2(0, 0);//注意点，必须在编辑器中把地面的摩擦系数设置为0，才会停止
            }
        }
    },
    start () {

    },

    // update (dt) {},
});
