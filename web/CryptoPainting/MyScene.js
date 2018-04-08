var TButton = TSprite.extend({
	m_Context:null,
	m_InputFieldName:"m_UpInput",
	onClickDown:function(eventObj,worldPos)
	{
		var localPos = eventObj.convertToNodeSpace(worldPos);
		//cc.log("onClickDown worldPos.x:" + worldPos.x + " worldPos.y:" + worldPos.y + " localPos.x:" + localPos.x + " localPos.y:" + localPos.y);
		if (this.m_Context != null)
		{
			this.m_Context[this.m_InputFieldName] = true;
		}
	},
	onClickUp:function(eventObj,worldPos,isObjContainsPoint)
	{
		var localPos = eventObj.convertToNodeSpace(worldPos);
		//cc.log("onClickUp worldPos.x:" + worldPos.x + " worldPos.y:" + worldPos.y + " localPos.x:" + localPos.x + " localPos.y:" + localPos.y + " isObjContainsPoint:" + isObjContainsPoint);
		if (this.m_Context != null)
		{
			this.m_Context[this.m_InputFieldName] = false;
		}
	},
	onMovedIn:function(eventObj,worldPos)
	{
		var localPos = eventObj.convertToNodeSpace(worldPos);
		//cc.log("onMovedIn worldPos.x:" + worldPos.x + " worldPos.y:" + worldPos.y + " localPos.x:" + localPos.x + " localPos.y:" + localPos.y);
		if (this.m_Context != null)
		{
			this.m_Context[this.m_InputFieldName] = true;
		}
	},
	onMovedOut:function(eventObj,worldPos)
	{
		var localPos = eventObj.convertToNodeSpace(worldPos);
		//cc.log("onMovedOut worldPos.x:" + worldPos.x + " worldPos.y:" + worldPos.y + " localPos.x:" + localPos.x + " localPos.y:" + localPos.y);
		if (this.m_Context != null)
		{
			this.m_Context[this.m_InputFieldName] = false;
		}
	},
	onMoved:function(eventObj,worldPos)
	{
		var localPos = eventObj.convertToNodeSpace(worldPos);
	},
});

var Ai = {
	m_armyIndex:1,
	m_AiInputsChangeFrame:1,
	m_CurrentFrameIndex:1,
	m_RandomCirle:20,
	m_AiInputs:null,
	m_StartFireFrame:10,
	update:function()
	{
		if (this.m_AiInputs === null)
		{
			this.m_AiInputs = Object.create(GameInput);
		}
		++ this.m_CurrentFrameIndex;
		if (this.m_CurrentFrameIndex > this.m_StartFireFrame)
		{
			this.m_AiInputs.m_FireInput = true;
		}
		if (this.m_CurrentFrameIndex % this.m_RandomCirle == this.m_AiInputsChangeFrame)
		{
			var r = Math.random();
			this.m_AiInputs.m_UpInput = false;
			this.m_AiInputs.m_DownInput = false;
			this.m_AiInputs.m_LeftInput = false;
			this.m_AiInputs.m_RightInput = false;
			if (r < 0.2)
			{
				this.m_AiInputs.m_UpInput = true;
			}
			else if (r >= 0.2 && r < 0.4)
			{
				this.m_AiInputs.m_DownInput = true;
			}
			else if (r >= 0.4 && r < 0.6)
			{
				this.m_AiInputs.m_LeftInput = true;
			}
			else if (r >= 0.6 && r < 0.8)
			{
				this.m_AiInputs.m_RightInput = true;
			}
		}
	}
};


var GameSceneDrawer = {
	m_spriteMap:{},
	m_armyIndex:0,
	m_GameSceneLayer:null,
	m_AiList:[],
	m_InitArmyList:[],
	initButton:function(){
		{
			var sprite = new TButton();
				sprite.initWithSpriteFrameName("up.png")
				sprite.m_InputFieldName = "m_UpInput";
				sprite.setAnchorPoint(0,0);
				sprite.setPosition(250, 130);
				sprite.setCallback(sprite);
				sprite.m_Context = this;
				sprite.m_isMoveOnSelected = true;
				this.addChild(sprite,5);
		}
		{
			var sprite = new TButton();
				sprite.initWithSpriteFrameName("down.png")
				sprite.m_InputFieldName = "m_DownInput";
				sprite.setAnchorPoint(0,0);
				sprite.setPosition(250, 5);
				sprite.setCallback(sprite);
				sprite.m_Context = this;
				sprite.m_isMoveOnSelected = true;
				this.addChild(sprite,5);
		}
		{
			var sprite = new TButton();
				sprite.initWithSpriteFrameName("left.png")
				sprite.m_InputFieldName = "m_LeftInput";
				sprite.setAnchorPoint(0,0);
				sprite.setPosition(80, 50);
				sprite.setCallback(sprite);
				sprite.m_Context = this;
				sprite.m_isMoveOnSelected = true;
				this.addChild(sprite,5);
		}
		{
			var sprite = new TButton();
				sprite.initWithSpriteFrameName("right.png")
				sprite.m_InputFieldName = "m_RightInput";
				sprite.setAnchorPoint(0,0);
				sprite.setPosition(600, 50);
				sprite.setCallback(sprite);
				sprite.m_Context = this;
				sprite.m_isMoveOnSelected = true;
				this.addChild(sprite,5);
		}
		{
			var sprite = new TButton();
				sprite.initWithSpriteFrameName("fireButton.png")
				sprite.m_InputFieldName = "m_FireInput";
				sprite.setAnchorPoint(0,0);
				sprite.setPosition(338, 50);
				sprite.setCallback(sprite);
				sprite.m_Context = this;
				sprite.m_isMoveOnSelected = true;
				this.addChild(sprite,5);
		}
		this.m_GameSceneLayer = new cc.Layer();
		this.m_GameSceneLayer.setColor(cc.color(0,0,0));
		this.m_GameSceneLayer.setPositionY(this.m_GameSceneLayer.getPositionY() + 180);
		this.addChild(this.m_GameSceneLayer,1);
	},
	initArmyList:function()
	{
		this.m_InitArmyList = [
		{campID:1,charID:1,name:"abc",speed:1.5,fireSpeed:2.5,color:1,fireRange:300,fireCD:60,killSelfCamp:true},
		{campID:2,charID:0,name:"abc2",speed:1.5,fireSpeed:2.5,color:2,fireRange:900,fireCD:60,killSelfCamp:false},
		{campID:2,charID:0,name:"abc3",speed:1.5,fireSpeed:2.5,color:2,fireRange:900,fireCD:60,killSelfCamp:false},
		{campID:2,charID:0,name:"abc4",speed:1.5,fireSpeed:2.5,color:2,fireRange:900,fireCD:60,killSelfCamp:false},
		{campID:2,charID:0,name:"abc5",speed:1.5,fireSpeed:2.5,color:2,fireRange:900,fireCD:60,killSelfCamp:false},
		{campID:2,charID:0,name:"abc6",speed:1.5,fireSpeed:2.5,color:2,fireRange:900,fireCD:60,killSelfCamp:false},
		];
	},
	initAiList:function()
	{
		for (var i in this.m_InitArmyList) {
			if (this.m_InitArmyList[i].campID === 2)
			{
				var ai = Object.create(Ai);
				ai.m_armyIndex = i;
				ai.m_StartFireFrame += 15;
				this.m_AiList.push(ai);
			}
		};
	},
	initDrawer:function(){
		this.initButton();
	},
	onEnter:function () {
		this._super();
		this.scheduleUpdate();
	},
	onExit:function() {
		this.removeAllChild(true);
		this._super();
		this.unscheduleUpdate();
	},
	createDrawerObj:function(frameName,x,y,visable,objName,dir)
	{
		if (typeof dir != "number")
		{
			dir = 0;
		}
		var sprite = new TSprite();
		sprite.initWithSpriteFrameName(frameName)
		sprite.setAnchorPoint(0.5,0.5);

		sprite.setPosition(x + sprite.width / 2, y + sprite.height / 2);
		sprite.setVisible(visable);
		sprite.setRotation(dir * 90);
		this.m_GameSceneLayer.addChild(sprite,2);
		this.m_spriteMap[objName] = sprite;
	},
	changeDrawerObj:function(frameName,x,y,visable,objName,dir)
	{
		if (typeof this.m_spriteMap[objName] === "object")
		{
			if (typeof dir != "number")
			{
				dir = 0;
			}
			var sprite = this.m_spriteMap[objName];
			sprite.setPosition(x + sprite.width / 2, y + sprite.height / 2);
			sprite.setVisible(visable);
			sprite.setRotation(dir * 90);
			//sprite.setColor(cc.color(180, 180, 180));
		}
	},
	deleteDrawerObj:function(objName)
	{
		if (typeof this.m_spriteMap[objName] === "object")
		{
			var sprite = this.m_spriteMap[objName];
			this.m_GameSceneLayer.removeChild(sprite,true);
		}
	},
	update:function(dt)
	{
		var inputs = Object.create(GameInput);
		inputs.m_UpInput = this.m_UpInput;
		inputs.m_DownInput = this.m_DownInput;
		inputs.m_LeftInput = this.m_LeftInput;
		inputs.m_RightInput = this.m_RightInput;
		inputs.m_FireInput = this.m_FireInput;
		this.m_FireInput = true;


		this.input(this.m_armyIndex,inputs);

		for (var i in this.m_AiList)
		{
			this.m_AiList[i].update();
			this.input(this.m_AiList[i].m_armyIndex,this.m_AiList[i].m_AiInputs);
		}

		this.logicUpdate();		
		//this.m_GameSceneLayer.setPositionX(this.m_GameSceneLayer.getPositionX() + 0.5);
	}
};
//var GameScene = cc.Scene.extend(merge(Object.create(GameSceneDrawer),Object.create(GameSceneLogic)));

var MyScene = cc.Scene.extend(
{
	onEnter:function () 
	{
		this._super();
		//var f = new cc.SpriteFrame("TankWorld.png", cc.rect(100,100,100,100));
		cc.spriteFrameCache.addSpriteFrames("IoriRun.plist");
		var wall1Tex = cc.textureCache.addImage("wall1.png");
		cc.spriteFrameCache.addSpriteFrame(cc.SpriteFrame.create(
		wall1Tex,cc.rect(0,0,wall1Tex.pixelsWidth,wall1Tex.pixelsHeight)),"wall1.png");
		var tank1Tex = cc.textureCache.addImage("tank1.png");
		cc.spriteFrameCache.addSpriteFrame(cc.SpriteFrame.create(
		tank1Tex,cc.rect(0,0,tank1Tex.pixelsWidth,tank1Tex.pixelsHeight)),"tank1.png");
		var fireTex = cc.textureCache.addImage("fire.png");
		cc.spriteFrameCache.addSpriteFrame(cc.SpriteFrame.create(
		fireTex,cc.rect(0,0,fireTex.pixelsWidth,fireTex.pixelsHeight)),"fire.png");
		
		var fireButtonTex = cc.textureCache.addImage("fireButton.png");
		cc.spriteFrameCache.addSpriteFrame(cc.SpriteFrame.create(
		fireButtonTex,cc.rect(0,0,fireButtonTex.pixelsWidth,fireButtonTex.pixelsHeight)),"fireButton.png");

		{
			var tex = cc.textureCache.addImage("up.png");
			cc.spriteFrameCache.addSpriteFrame(cc.SpriteFrame.create(
			tex,cc.rect(0,0,tex.pixelsWidth,tex.pixelsHeight)),"up.png");
		}
		
		{
			var tex = cc.textureCache.addImage("down.png");
			cc.spriteFrameCache.addSpriteFrame(cc.SpriteFrame.create(
			tex,cc.rect(0,0,tex.pixelsWidth,tex.pixelsHeight)),"down.png");
		}
		
		{
			var tex = cc.textureCache.addImage("left.png");
			cc.spriteFrameCache.addSpriteFrame(cc.SpriteFrame.create(
			tex,cc.rect(0,0,tex.pixelsWidth,tex.pixelsHeight)),"left.png");
		}
		
		{
			var tex = cc.textureCache.addImage("right.png");
			cc.spriteFrameCache.addSpriteFrame(cc.SpriteFrame.create(
			tex,cc.rect(0,0,tex.pixelsWidth,tex.pixelsHeight)),"right.png");
		}
		cc.log("xx:");
		var _contractAddress = '0xdc4dc033ea819279e4772204beb08051267a396e';
		var mypetContract = web3.eth.contract([{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"onSellPetPrices","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"taxNum","outputs":[{"name":"","type":"uint32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"petOwnerMap","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"onSellPets","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"i","type":"uint256"}],"name":"getOnSellPetHashs8","outputs":[{"name":"","type":"bytes32"},{"name":"","type":"bytes32"},{"name":"","type":"bytes32"},{"name":"","type":"bytes32"},{"name":"","type":"bytes32"},{"name":"","type":"bytes32"},{"name":"","type":"bytes32"},{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"taxNum_","type":"uint32"}],"name":"changeTax","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"manager","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"v","type":"uint256"}],"name":"uintToBytes","outputs":[{"name":"ret","type":"bytes32"}],"payable":false,"stateMutability":"pure","type":"function"},{"constant":false,"inputs":[{"name":"onSellIndex","type":"uint256"},{"name":"onSellIndexValue","type":"uint256"}],"name":"buyPet","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"playerSellPetMap","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"pets","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"v","type":"bytes32"}],"name":"bytesToUint","outputs":[{"name":"ret","type":"uint256"}],"payable":false,"stateMutability":"pure","type":"function"},{"constant":true,"inputs":[{"name":"i","type":"uint256"}],"name":"getOnSellPetPrice8","outputs":[{"name":"","type":"uint256"},{"name":"","type":"uint256"},{"name":"","type":"uint256"},{"name":"","type":"uint256"},{"name":"","type":"uint256"},{"name":"","type":"uint256"},{"name":"","type":"uint256"},{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"i","type":"uint256"}],"name":"uint2str","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"pure","type":"function"},{"constant":true,"inputs":[{"name":"i","type":"uint256"}],"name":"getMyPets8","outputs":[{"name":"","type":"bytes32"},{"name":"","type":"bytes32"},{"name":"","type":"bytes32"},{"name":"","type":"bytes32"},{"name":"","type":"bytes32"},{"name":"","type":"bytes32"},{"name":"","type":"bytes32"},{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"_num","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"PlayerAddress","type":"address"},{"indexed":true,"name":"petIndex","type":"uint256"}],"name":"LogNoOwnerPet","type":"event"}]);
		var etherflip = mypetContract.at(_contractAddress);
		var xresult = null;
		var scene = this;
		etherflip.getOnSellPetHashs8.call(0, function (error, result){
			if (!error) 
			{
				cc.log(result);
				xresult = result;
				{
					var sprite = new TSprite();
					sprite.initWithSpriteFrameName("up.png")
					sprite.setAnchorPoint(0,0);
					sprite.setPosition(250, 130);
					//scene.addChild(sprite,5);
					
					//ccSkelNode = sp.SkeletonAnimation.create("data/a.json", "data/a.atlas",0.7);
					ccSkelNode = sp.SkeletonAnimation.create(s_spineboyJSON, s_spineboyATLAS,0.7);

					ccSkelNode.setPosition(cc.p(0, 130));
					ccSkelNode.updateWorldTransform();

/*
					ccSkelNode.setMix("walk", "jump", 0.2);
					ccSkelNode.setMix("jump", "walk", 0.4);

					ccSkelNode.setAnimationListener(scene, scene.animationStateEvent);
					ccSkelNode.setAnimation(0, "walk", false);
					ccSkelNode.addAnimation(0, "jump", false);
					ccSkelNode.addAnimation(0, "drawOrder", false);
					ccSkelNode.addAnimation(0, "walk", true);
*/
					//ccSkelNode.debugBones = true;
					//ccSkelNode.debugSlots = true;

					scene.addChild(ccSkelNode);
				}

			}
			else
			{
				console.error(error);
			}
		});
		/*
		cc.loader.loadJson("Map1.json",function (r,j)
			{
				if (r === null)
				{
					var gameScene = new GameScene();
					gameScene.initArmyList();
					gameScene.initAiList();
					gameScene.initDrawer();
					gameScene.initLogic(j,
						gameScene.m_InitArmyList);
					cc.director.pushScene(gameScene);
				}
			})
			*/

	}
}
);
					  
					  
