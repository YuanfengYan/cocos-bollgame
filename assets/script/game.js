// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        // 地面
        ground:{
            type:cc.Node,
            default:null
        },
        //   发射的球
        boll:{
            type:cc.RigidBody,
            default:null
        },
        // 普通盒子
        box:{
            type:cc.Prefab,
            default:null
        },
        lifeBox:{
            type:cc.Prefab,
            default:null
        },
        line:{
            type:cc.Node,
            default:null,
        },
        // 灵敏度
        sensitivity:{
            type:cc.Float,
            default:3.2,
            slide:true,
            range:[1.2,3.2,0.02],    
        },
        // 所有小球计数
        allBolls: 1,
        // 盒子列表   
        // boxList:{
        //     type:cc.Prefab,
        //     default:[]
        // },
        bg:{
            type:cc.Node,
            default:null
        },
        // 是否显示辅助线 (表示是否在游戏中)
        lineActive:false,
        // 是否开始游戏
        isBegin: false,
        // 游戏等级
        level:1,
        bollDown:false,
    },
    // 初始化环境
    initSceneConfig (){
        cc.director.getPhysicsManager().enabled = true //开启物理引擎
        cc.director.getCollisionManager().enabled = true//开启碰撞检测
        cc.director.getPhysicsManager().gravity =  cc.v2(0, -640) //配置重力加速度
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
    // 初始化游戏
    initGame(){
        this.boxPool = new cc.NodePool()
        this.lifeboxPool = new cc.NodePool()
        this.bollPool = new cc.NodePool()
        this.ground.getComponent('ground').game = this
    },
    // // 重启游戏
    // reStart(){

    // },
    onLoad () {
        this.initSceneConfig()
        this.initGame()
        this.createBox()
    },
    // 创建盒子
    createBox(){
        this.level++
        let viewWidth = cc.view.getVisibleSize().width
        var childrenNode = this.node.children;
        for (var i = 0; i < childrenNode.length; i++) {
            var node = childrenNode[i];
            if (node.name == "box" || node.name == "lifeBox") {
                if (node.y <= 450) {
                    node.y -= 100;
                    if (node.y == -350) {
                        this.gameOver();
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
                }
                box.x = -viewWidth/2 + 50 + 100 * i
                box.y = 450
                // var colorArr = this.hslToRgb(this.level * 0.025, 0.5, 0.5);
                // box.setColor(cc.color(colorArr[0], colorArr[1], colorArr[2]));
                box.parent = this.node
            }
        }
        this.bollDown = false
        
    },
    gameOver() {
        
    },
    touchStart(event) {
        let viewWidth = cc.view.getVisibleSize().width
        // 角度在-85~85之间
        let rotate = -(event.touch._point.x - viewWidth/2)/this.sensitivity
        // console.log('rotate:',rotate ,'viewWidth:',viewWidth,'event_x:',event.touch._point.x)
        if(this.lineActive == false){
            this.line.active = true
            this.line.angle = rotate
        }
    },
    touchMove(event) {
        if(this.lineActive == false){
            let viewWidth = cc.view.getVisibleSize().width
            let rotate = -(event.touch._point.x - viewWidth/2)/this.sensitivity
            this.line.angle = rotate
        }
    },
    // 发射球体
    sendBoll(boll) {
        let speed = 4000
        let radians = (this.line.angle + 90) / 180 *Math.PI
        boll.linearVelocity = cc.v2(speed * Math.cos(radians),speed * Math.sin(radians));
    },
    touchEnd(event) {
        if (this.lineActive == false) {
            this.line.active = false;
            
            if (this.isBegin == false) {
              this.isBegin = true;
            }
            this.sendBoll(this.boll)
            this.lineActive = true;
          }
    },
    start () {
       
        // cc.tween(this.boll).to(1,{position:cc.v2(100,100,0)}).by(3, {eulerAngles: cc.v3(360, 0, 360) }).start()
    },
    moveBoll(){
        // cc.tween(this.boll).by(3, {eulerAngles: cc.v3(360, 360, 360)}).start()
        this.boll.linearVelocity = cc.v2(200 * 1, 1300 * 1);
    },


    update (dt) {
        if(this.bollDown){
            this.createBox()
        }
    },
});
