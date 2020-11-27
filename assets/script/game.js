// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        rockAudio: {
            default: null,
            type: cc.AudioClip,
        },

        circleAudio: {
            default: null,
            type: cc.AudioClip,
        },
        // 地面
        ground:{
            type:cc.Node,
            default:null
        },
        //   发射的球
        firstball:{
            type:cc.Sprite,
            default:null,
            tooltip:'球的发射位置'
        },
        // 普通盒子
        box:{
            type:cc.Prefab,
            default:null,
            tooltip:'带撞击次数的普通盒子'
        },
        lifeBox:{
            type:cc.Prefab,
            default:null,
            tooltip:'增加球数的盒子'
        },
        line:{
            type:cc.Node,
            default:null,
            tooltip:'瞄准辅助线'
        },
        gameOverNode:{
            type:cc.Node,
            default:null,
        },
        levelLabel:{
            type:cc.Label,
            default:null,
            tooltip:'当前等级'
        },
        ballPrefab:{
            type:cc.Prefab,
            default:null,
            tooltip:'球的Prefab组件'
        },
        // 灵敏度
        sensitivity:{
            type:cc.Float,
            default:3.2,
            slide:true,
            range:[1.2,3.2,0.02],    
            tooltip:'角度移动灵敏度'
        },
        // 所有小球计数
        allBalls: 1,
        // 新增球数
        addBolls: 0,
        ballnumlabel:{
            type: cc.Label,
            default:null,
        },
        // 用于计算是否所有球都落入地面
        allBallsCount:0,
        // 盒子列表   
        // boxList:{
        //     type:cc.Prefab,
        //     default:[]
        // },
        // 是否显示辅助线 (表示是否在游戏中)
        gameActive:false,
        // 是否开始游戏
        isBegin: false,
        // 游戏等级
        level:1,
        ballDown:false,
       
        
    },
    // 初始化游戏
    initGame (){
        cc.director.getPhysicsManager().enabled = true //开启物理引擎
        cc.director.getCollisionManager().enabled = true//开启碰撞检测
        cc.director.getPhysicsManager().gravity =  cc.v2(0, -160) //配置重力加速度
        this.boxPool = new cc.NodePool()
        this.lifeboxPool = new cc.NodePool()
        this.ballPool = new cc.NodePool()
        this.ground.getComponent('ground').game = this

        this.node.on('touchstart',function ( event ) {
            this.touchStart( event )
          }.bind(this))
        this.node.on('touchmove',function ( event ) {
            this.touchMove( event )
          }.bind(this))
        this.node.on('touchend',function ( event ) {
            this.touchEnd( event )
          }.bind(this))
    },
    // 创建盒子
    createBox(){
        if(this.level==1 || this.isBegin==true){
            let viewWidth = cc.view.getVisibleSize().width
            var childrenNode = this.node.children;
            for (var i = 0; i < childrenNode.length; i++) {
                var node = childrenNode[i];
                if (node.name == "box" || node.name == "lifebox") {
                    if (node.y <= 450) {
                        node.y -= 100;
                        if (node.y == -350) {
                            this.gameOver()
                        }
                    }
                }
            }
    
            let isShowLifeBox = false
            for(let i = 0; i<(viewWidth)/100-1; i++){
                let box = null
                var isBox = Math.ceil(Math.random() * 10) % 2;
                if (isBox == 1){ //是否在这个位置创建box
                    var isLife = Math.ceil(Math.random() * 10) % 2;
                    if (isLife == true && isShowLifeBox == false){
                        isShowLifeBox = true //确保一行只有一个
                        // 创建lifeBox
                        if (this.lifeboxPool.size() > 0) { // 通过 size 接口判断对象池中是否有空闲的对象
                            box = this.lifeboxPool.get();
                        } else { // 如果没有空闲对象，也就是对象池中备用对象不够时，我们就用 cc.instantiate 重新创建
                            box = cc.instantiate(this.lifeBox);
                        }
                    }else{
                        if (this.boxPool.size() > 0) { // 通过 size 接口判断对象池中是否有空闲的对象
                            box = this.boxPool.get();
                        } else { // 如果没有空闲对象，也就是对象池中备用对象不够时，我们就用 cc.instantiate 重新创建
                            box = cc.instantiate(this.box);
                        }
                        let label = box.children[0].getComponent(cc.Label)
                        let isDouble = Math.ceil(Math.random() * 10)>7;
                        if (isDouble ) {
                            label.string = 2 * this.level;
                        } else {
                            label.string = this.level;
                        }
                    }
                    box.x = -viewWidth/2 + 50 + 100 * i
                    box.y = 450
                    // var colorArr = this.hslToRgb(this.level * 0.025, 0.5, 0.5);
                    // box.setColor(cc.color(colorArr[0], colorArr[1], colorArr[2]));
                    box.parent = this.node
                }
            }
            this.ballDown = false
            this.levelLabel.string = `当前等级：${this.level}`
            this.level++
        }
        
        
    },
    // 重启游戏
    reStart(){
        // 清空对象池，貌似不会销毁
        this.gameOverNode.active = false
        this.boxPool.clear()
        this.lifeboxPool.clear()
        this.ballPool.clear()
        cc.director.loadScene('ballgame');
    },
    // 游戏结束
    gameOver() {
        this.isBegin = false
        this.gameOverNode.active = true
        this.gameOverNode.zIndex = 1000
        this.createBox()
    },
    touchStart(event) {
        let viewWidth = cc.view.getVisibleSize().width
        // 角度在-85~85之间
        let rotate = -(event.touch._point.x - viewWidth/2)/this.sensitivity
        // console.log('rotate:',rotate ,'viewWidth:',viewWidth,'event_x:',event.touch._point.x)
        if(this.gameActive == false){
            this.line.active = true
            this.line.angle = rotate
        }
    },
    touchMove(event) {
        if(this.gameActive == false){
            let viewWidth = cc.view.getVisibleSize().width
            let rotate = -(event.touch._point.x - viewWidth/2)/this.sensitivity
            this.line.angle = rotate
        }
    },
    touchEnd(event) {
        if (this.gameActive == false) {
            this.line.active = false;
            
            if (this.isBegin == false) {
              this.isBegin = true;
            }
            let sendcount = 0
            this.schedule(function(dt){
                sendcount ++
                let ball = null
                // 创建发射球
                if(this.ballPool.size()>0){
                    ball = this.ballPool.get();
                }else{// 如果没有空闲对象，也就是对象池中备用对象不够时，我们就用 cc.instantiate 重新创建
                    ball = cc.instantiate(this.ballPrefab)
                }
                ball.setPosition(this.firstball.node.getPosition())
                ball.game = this;
                this.node.addChild(ball)
                this.sendBall(ball)
                if(sendcount==this.allBalls){
                    this.firstball.enabled = false
                    this.gameActive = true;
                }
            },0.1, this.allBalls-1, 0.08)
            // for(let i = 0; i < this.allBalls; i++ ){
                
            // }
         
          }
    },
    // 发射球体
    sendBall(ball) {
        let speed = 1000
        let radians = (this.line.angle + 90) / 180 *Math.PI
        ball.getComponent(cc.RigidBody).linearVelocity = cc.v2(speed * Math.cos(radians),speed * Math.sin(radians));
        console.log(ball)
    },
    onLoad () {
        this.initGame()
        this.createBox()
    },
    start () {
        // cc.tween(this.boll).to(1,{position:cc.v2(100,100,0)}).by(3, {eulerAngles: cc.v3(360, 0, 360) }).start()
    },
    // moveBoll(){
    //     // cc.tween(this.boll).by(3, {eulerAngles: cc.v3(360, 360, 360)}).start()
    //     this.boll.linearVelocity = cc.v2(200 * 1, 1300 * 1);
    // },
    update (dt) {
        if(this.ballDown){
            this.createBox()
        }
    },
    // ahakid的的个性化教育是怎么体现的，和
    // 
});
