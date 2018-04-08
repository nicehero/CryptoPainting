g_SceneSize = 720;
g_ObjectSize = 24;

var GameInput = {
	m_UpInput:false,
	m_DownInput:false,
	m_LeftInput:false,
	m_RightInput:false,
	m_FireInput:false,
};

var GameSceneLogic = {
	m_AsyncRate:6,
	m_mapData:null,
	//m_watchMapData:null,
	m_armyList:null,
	m_armyMapData:{},
	m_fireMapData:{},
	m_fires:{},
	m_FrameNum:1,
	convertXYToKey:function(x,y)
	{
		return x.toString() + "_" + y.toString();
	},
	convertKeyToXY:function(k)
	{
		var spo = k.split("_",2);
		if (spo.length != 2)
		{
			return null;
		}
		var po = [];
		for (var k1 in spo)
		{
			po.push(spo[k1].parseInt());
		}
		return po;
	},
	initLogic:function(mapDataJson,armyList)
	{
		if (armyList.length < 2)
		{
			return false;
		}
		this.m_armyList = clone(armyList);
		this.m_mapData = this.jsonToMapData(mapDataJson);
		for (var k in this.m_armyList) {
			this.m_armyList[k].watchMapData = clone(this.m_mapData);
		}
		return true;
	},
	getBlockSpeed:function(army,dir)
	{
		if (dir === 0 && army.pixOffset[1] < 0)
		{
			if (army.speed > (-army.pixOffset[1]))
			{
				return (-army.pixOffset[1]);
			}
			else
			{
				return army.speed;
			}
		}
		if (dir === 1 && army.pixOffset[0] < 0)
		{
			if (army.speed > (-army.pixOffset[0]))
			{
				return (-army.pixOffset[0]);
			}
			else
			{
				return army.speed;
			}
		}
		if (dir === 2 && army.pixOffset[1] > 0)
		{
			if (army.speed > (army.pixOffset[1]))
			{
				return (army.pixOffset[1]);
			}
			else
			{
				return army.speed;
			}
		}
		if (dir === 3 && army.pixOffset[0] > 0)
		{
			if (army.speed > (army.pixOffset[0]))
			{
				return (army.pixOffset[0]);
			}
			else
			{
				return army.speed;
			}
		}
		return 0;
	},
	checkBlock:function(army,po,dir)
	{
		if (dir === 0)
		{
			if (army.po2[1] + 2 >= this.m_mapData.maxHeight)
			{
				return this.getBlockSpeed(army,dir);
			}
			if (typeof this.m_mapData.data[this.convertXYToKey(army.po2[0],army.po2[1] + 2)]["build"] === "object"
				|| typeof this.m_mapData.data[this.convertXYToKey(army.po2[0] + 1,army.po2[1] + 2)]["build"] === "object"
				)
			{
				return this.getBlockSpeed(army,dir);
			}
			if (this.m_armyMapData[this.convertXYToKey(army.po2[0],army.po2[1] + 2)] != null
				|| this.m_armyMapData[this.convertXYToKey(army.po2[0] + 1,army.po2[1] + 2)] != null
				)
			{
				return this.getBlockSpeed(army,dir);
			}
		}
		else if (dir === 1)
		{
			if (army.po2[0] + 2 >= this.m_mapData.maxWidth)
			{
				return this.getBlockSpeed(army,dir);
			}
			if (typeof this.m_mapData.data[this.convertXYToKey(army.po2[0] + 2,army.po2[1])]["build"] === "object"
				|| typeof this.m_mapData.data[this.convertXYToKey(army.po2[0] + 2,army.po2[1] + 1)]["build"] === "object"
				)
			{
				return this.getBlockSpeed(army,dir);
			}
			if (this.m_armyMapData[this.convertXYToKey(army.po2[0] + 2,army.po2[1])] != null
				|| this.m_armyMapData[this.convertXYToKey(army.po2[0] + 2,army.po2[1] + 1)] != null
				)
			{
				return this.getBlockSpeed(army,dir);
			}
		}
		else if (dir === 2)
		{
			if (army.po2[1] - 1 < 0)
			{
				return this.getBlockSpeed(army,dir);
			}
			if (typeof this.m_mapData.data[this.convertXYToKey(army.po2[0],army.po2[1] - 1)]["build"] === "object"
				|| typeof this.m_mapData.data[this.convertXYToKey(army.po2[0] + 1,army.po2[1] - 1)]["build"] === "object"
				)
			{
				return this.getBlockSpeed(army,dir);
			}
			if (this.m_armyMapData[this.convertXYToKey(army.po2[0],army.po2[1] - 1)] != null
				|| this.m_armyMapData[this.convertXYToKey(army.po2[0] + 1,army.po2[1] - 1)] != null
				)
			{
				return this.getBlockSpeed(army,dir);
			}
		}
		else if (dir === 3)
		{
			if (army.po2[0] - 1 < 0)
			{
				return this.getBlockSpeed(army,dir);
			}
			if (typeof this.m_mapData.data[this.convertXYToKey(army.po2[0] - 1,army.po2[1])]["build"] === "object"
				|| typeof this.m_mapData.data[this.convertXYToKey(army.po2[0] - 1,army.po2[1] + 1)]["build"] === "object"
				)
			{
				return this.getBlockSpeed(army,dir);
			}
			if (this.m_armyMapData[this.convertXYToKey(army.po2[0] - 1,army.po2[1])] != null
				|| this.m_armyMapData[this.convertXYToKey(army.po2[0] - 1,army.po2[1] + 1)] != null
				)
			{
				return this.getBlockSpeed(army,dir);
			}
		}
		return army.speed;
	},
	getArmyViewPos:function(army)
	{
		var pos = [army.po2[0] * g_ObjectSize + army.pixOffset[0],army.po2[1] * g_ObjectSize + army.pixOffset[1]];
		return pos;
	},
	getFireViewPos:function(fire)
	{
		var pixOffset = [0,0];
		if (fire.dir === 0) 
		{
			pixOffset[1] = fire.pixOffset;
		}
		else if (fire.dir === 1)
		{
			pixOffset[0] = fire.pixOffset;
		}
		else if (fire.dir === 2)
		{
			pixOffset[1] = -fire.pixOffset;
		}
		else if (fire.dir === 3)
		{
			pixOffset[0] = -fire.pixOffset;
		}
		var pos = [fire.po[0] * g_ObjectSize + pixOffset[0],fire.po[1] * g_ObjectSize + pixOffset[1]];
		return pos;
	},
	setArmyNewPo2:function(army)
	{
		if (army.pixOffset[0] > g_ObjectSize / 2)
		{
			army.pixOffset[0] -= g_ObjectSize;
			army.po2[0] += 1;
		}
		else if (army.pixOffset[0] < - g_ObjectSize / 2)
		{
			army.pixOffset[0] += g_ObjectSize;
			army.po2[0] -= 1;
		}
		if (army.pixOffset[1] > g_ObjectSize / 2)
		{
			army.pixOffset[1] -= g_ObjectSize;
			army.po2[1] += 1;
		}
		else if (army.pixOffset[1] < - g_ObjectSize / 2)
		{
			army.pixOffset[1] += g_ObjectSize;
			army.po2[1] -= 1;
		}
	},
	setFireNewPo:function(fire)
	{
		if (fire.pixOffset <= g_ObjectSize / 2)
		{
			return;
		}
		fire.pixOffset -= g_ObjectSize;
		if (fire.dir === 0) 
		{
			fire.po[1] += 1;
		}
		else if (fire.dir === 1)
		{
			fire.po[0] += 1;
		}
		else if (fire.dir === 2)
		{
			fire.po[1] -= 1;			
		}
		else if (fire.dir === 3)
		{
			fire.po[0] -= 1;			
		}
	},
	popFireFromMap:function(army)
	{
		this.m_fireMapData[this.convertXYToKey(fire.po[0] + 0,fire.po[1] + 0)] = null;
		this.m_fireMapData[this.convertXYToKey(fire.po[0] + 1,fire.po[1] + 0)] = null;
		this.m_fireMapData[this.convertXYToKey(fire.po[0] + 0,fire.po[1] + 1)] = null;
		this.m_fireMapData[this.convertXYToKey(fire.po[0] + 1,fire.po[1] + 1)] = null;
	},
	pushFireToMap:function(army)
	{
		this.m_fireMapData[this.convertXYToKey(fire.po[0] + 0,fire.po[1] + 0)] = fire;
		this.m_fireMapData[this.convertXYToKey(fire.po[0] + 1,fire.po[1] + 0)] = fire;
		this.m_fireMapData[this.convertXYToKey(fire.po[0] + 0,fire.po[1] + 1)] = fire;
		this.m_fireMapData[this.convertXYToKey(fire.po[0] + 1,fire.po[1] + 1)] = fire;
	},
	popArmyFromMap:function(army)
	{
		this.m_armyMapData[this.convertXYToKey(army.po2[0] + 0,army.po2[1] + 0)] = null;
		this.m_armyMapData[this.convertXYToKey(army.po2[0] + 1,army.po2[1] + 0)] = null;
		this.m_armyMapData[this.convertXYToKey(army.po2[0] + 0,army.po2[1] + 1)] = null;
		this.m_armyMapData[this.convertXYToKey(army.po2[0] + 1,army.po2[1] + 1)] = null;
	},
	pushArmyToMap:function(army)
	{
		this.m_armyMapData[this.convertXYToKey(army.po2[0] + 0,army.po2[1] + 0)] = army;
		this.m_armyMapData[this.convertXYToKey(army.po2[0] + 1,army.po2[1] + 0)] = army;
		this.m_armyMapData[this.convertXYToKey(army.po2[0] + 0,army.po2[1] + 1)] = army;
		this.m_armyMapData[this.convertXYToKey(army.po2[0] + 1,army.po2[1] + 1)] = army;
	},
	processMove:function(army,dir,speed)
	{
		if (dir == 0)
		{
			army.pixOffset[1] += speed;
		}
		if (dir == 1)
		{
			army.pixOffset[0] += speed;
		}
		if (dir == 2)
		{
			army.pixOffset[1] -= speed;
		}
		if (dir == 3)
		{
			army.pixOffset[0] -= speed;
		}
		var armyViewPos = this.getArmyViewPos(army);
		this.changeDrawerObj("tank1.png",armyViewPos[0], armyViewPos[1],true,army.objName,dir);
	},
	processDirInput:function(army,dir)
	{
		if (dir === 0 && army.dir != 0)
		{
			army.dir = 0;
			army.pixOffset[0] = 0;
			var armyViewPos = this.getArmyViewPos(army);
			this.changeDrawerObj("tank1.png",armyViewPos[0], armyViewPos[1],true,army.objName,dir);
			//todo write to inputlog
			return;
		}
		else if (dir === 1 && army.dir != 1)
		{
			army.dir = 1;
			army.pixOffset[1] = 0;
			var armyViewPos = this.getArmyViewPos(army);
			this.changeDrawerObj("tank1.png",armyViewPos[0], armyViewPos[1],true,army.objName,dir);
			//todo write to inputlog
			return;
		}
		else if (dir === 2 && army.dir != 2)
		{
			army.dir = 2;
			army.pixOffset[0] = 0;
			var armyViewPos = this.getArmyViewPos(army);
			this.changeDrawerObj("tank1.png",armyViewPos[0], armyViewPos[1],true,army.objName,dir);
			//todo write to inputlog
			return;
		}
		else if (dir === 3 && army.dir != 3)
		{
			army.dir = 3;
			army.pixOffset[1] = 0;
			var armyViewPos = this.getArmyViewPos(army);
			this.changeDrawerObj("tank1.png",armyViewPos[0], armyViewPos[1],true,army.objName,dir);
			//todo write to inputlog
			return;
		}
		else
		{
			var speed = this.checkBlock(army,army.po2,dir);
			if (speed === 0)
			{
				return;
			}
			this.popArmyFromMap(army);
			var po3 = clone(army.po2);
			this.processMove(army,dir,speed);
			this.setArmyNewPo2(army);
			this.pushArmyToMap(army);
			//cc.log("po2:" + this.convertXYToKey(army.po2[0],army.po2[1]));
			if (po3[0] != army.po2[0] || po3[1] != army.po2[1])
			{
				//todo write to inputlog
			}
		}
	},
	doInputLogs:function()
	{
		for (var k in this.m_armyList)
		{
			if (typeof this.m_armyList[k].inputs === "object")
			{
				var army = this.m_armyList[k];
				army.po = army.po2;
				this.doInputLog(army);
			}
		}
	},
	doInputLog:function(army)
	{
		for (var i = 0; i < army.inputlog.firelog.length; i++)
		{
			if (this.m_FrameNum > army.fireCDOverFrame)
			{
				this.createFire(army.inputlog.firelog[i]);
				army.fireCDOverFrame = this.m_FrameNum + army.fireCD;
			}
		}
	},
	isInputLogsReady:function()
	{
		var waitArmyIndexList = [];
		/*
		for (var k in this.m_armyList)
		{
			if (typeof this.m_armyList[k].inputs === "object")
			{
				var army = this.m_armyList[k];
				if (army.inputlog.isReady != true)
				{
					waitArmyIndexList.push(k);
				}
			}
		}
		*/
		return waitArmyIndexList;
	},
	clearInputLogs:function()
	{
		for (var k in this.m_armyList)
		{
			if (typeof this.m_armyList[k].inputs === "object")
			{
				var army = this.m_armyList[k];
				army.inputlog = {};
				army.inputlog.firelog = [];
			}
		}
	},
	processFireInput:function(army)
	{
		var po = clone(army.po2);
		if (army.dir === 0)
		{
			po[1] += 2;
		}
		else if (army.dir === 1)
		{
			po[0] += 2;
		}
		else if (army.dir === 2)
		{
			po[1] -= 2;
		}
		else if (army.dir === 3)
		{
			po[0] -= 2;
		}
		army.inputlog.firelog.push({
			"dir":army.dir,"po":po,"fireSpeed":army.fireSpeed,
			"campID":army.campID,"pixOffset":(-g_ObjectSize / 2),
			"objID":("fire_" + army.armyIndex + this.m_FrameNum),
			"goPix":0,"range":army.fireRange,"armyIndex":army.armyIndex,
			"killSelfCamp":army.killSelfCamp
		});

	},
	createFire:function(fire)
	{
		this.m_fires[fire.objID] = fire;
		var fireViewPos = this.getFireViewPos(fire);
		this.createDrawerObj("fire.png",fireViewPos[0] , fireViewPos[1],true,fire.objID,fire.dir);
	},
	isBlockWall:function(po,dir)
	{
		if (typeof this.m_mapData.data[this.convertXYToKey(po[0],po[1])]["build"] === "object")
		{
			return true;
		}
		return false;
	},
	getFireRealPos:function(fire)
	{
		var fPo1 = null;
		var fPo2 = null;
		if (fire.dir === 0) 
		{
			fPo1 = clone(fire.po);
			fPo2 = [fire.po[0] + 1,fire.po[1] + 0];
		}
		else if (fire.dir === 1)
		{
			fPo1 = clone(fire.po);
			fPo2 = [fire.po[0] + 0,fire.po[1] + 1];
		}
		else if (fire.dir === 2)
		{
			fPo1 = [fire.po[0] + 0,fire.po[1] + 1];
			fPo2 = [fire.po[0] + 1,fire.po[1] + 1];
		}
		else if (fire.dir === 3)
		{
			fPo1 = [fire.po[0] + 1,fire.po[1] + 0];
			fPo2 = [fire.po[0] + 1,fire.po[1] + 1];
		}
		return [fPo1,fPo2];
	},
	isFireBlockWall:function(fire)
	{
		var pos = this.getFireRealPos(fire);
		var ret = [];

		if (pos[0][0] < 0 || pos[0][0] >= this.m_mapData.maxWidth
			|| pos[0][1] < 0 || pos[0][1] >= this.m_mapData.maxHeight
			)
		{
			return [null];
		}
		if (pos[1][0] < 0 || pos[1][0] >= this.m_mapData.maxWidth
			|| pos[1][1] < 0 || pos[1][1] >= this.m_mapData.maxHeight
			)
		{
			return [null];
		}

		if (this.isBlockWall(pos[0],fire.dir) === true)
		{
			ret.push(pos[0]);
		}
		if (this.isBlockWall(pos[1],fire.dir) === true)
		{
			ret.push(pos[1]);
		}
		return ret;
	},
	isFireBlockTank:function(fire)
	{
		var tanks = [];
		var pos = this.getFireRealPos(fire);
		for (var k in pos)
		{
			var po = pos[k];
			var keyx = this.convertXYToKey(po[0],po[1]);
			if (this.m_armyMapData[keyx] === null)
			{
				continue;
			}
			var army = this.m_armyMapData[keyx];
			if (army.armyIndex === fire.armyIndex)
			{
				continue;
			}
			if (army.killSelfCamp === false && fire.campID === army.campID)
			{
				continue;
			}
			var isFind = false;
			for (var k1 in tanks)
			{
				if (tanks[k1] != null && tanks[k1].objName === army.objName)
				{
					isFind = true;
				}
			}
			if (isFind === false)
			{
				tanks.push(army);
			}
		}
		return tanks;
	},
	deleteArmy:function(army)
	{
		this.popArmyFromMap(army);
		army.isDead = true;
		//this.m_armyList[army.armyIndex] = null;
		this.deleteDrawerObj(army.objName);
	},
	deleteWall:function(po)
	{
		if (po === null)
		{
			return;
		}
		var keyx = this.convertXYToKey(po[0],po[1]);
		this.m_mapData.data[keyx] = {};
		this.deleteDrawerObj("build_" + keyx);
	},
	runFires:function()
	{
		for (var k in this.m_fires)
		{
			var fire = this.m_fires[k];
			fire.pixOffset += fire.fireSpeed;
			fire.goPix += fire.fireSpeed;
		}
		var newFires = {};
		for (var k in this.m_fires)
		{
			var fire = this.m_fires[k];
			if (fire.goPix >= fire.range)
			{
				this.deleteDrawerObj(fire.objID);
				continue;
			}
			var walls = this.isFireBlockWall(fire);
			if (walls.length > 0)
			{
				this.deleteDrawerObj(fire.objID);
				for (var k1 in walls)
				{
					this.deleteWall(walls[k1]);
				}
				continue;
			}
			var tanks = this.isFireBlockTank(fire);
			if (tanks.length > 0)
			{
				this.deleteDrawerObj(fire.objID);
				for (var k1 in tanks) 
				{
					this.deleteArmy(tanks[k1]);
				}				
			}
			newFires[k] = fire;
		}
		this.m_fires = newFires;
		for (var k in this.m_fires)
		{
			var fire = this.m_fires[k];
			var fireViewPos = this.getFireViewPos(fire);
			this.changeDrawerObj("fire.png",fireViewPos[0], fireViewPos[1],true,fire.objID,fire.dir);
			this.setFireNewPo(fire);
		}
	},
	logicUpdate:function()
	{
		if (this.m_FrameNum % this.m_AsyncRate == 0)
		{
			var ret = this.rowUpdate();
			++ this.m_FrameNum;
			return ret;
		}
		else
		{
			this.virtualUpdate();
			++ this.m_FrameNum;
			return [];
		}
	},
	rowUpdate:function()
	{
		var waitArmyIndexList = this.isInputLogsReady();
		if (waitArmyIndexList.length < 1)
		{
			this.doInputLogs();
			this.clearInputLogs();
			this.virtualUpdate();
			return [];
		}
		return [];
	},
	virtualUpdate:function()
	{
		for (var k in this.m_armyList)
		{
			if (typeof this.m_armyList[k].inputs === "object")
			{
				var army = this.m_armyList[k];
				if (army.isDead === true)
				{
					continue;
				}
				if (army.inputs.m_UpInput === true)
				{
					this.processDirInput(army,0);
				}
				else if (army.inputs.m_RightInput === true)
				{
					this.processDirInput(army,1);
				}
				else if (army.inputs.m_DownInput === true)
				{
					this.processDirInput(army,2);
				}
				else if (army.inputs.m_LeftInput === true)
				{
					this.processDirInput(army,3);
				}

				if (army.inputs.m_FireInput === true)
				{
					this.processFireInput(army);
				}
			}
		}
		this.runFires();
	},
	jsonToMapData:function(mapDataJson)
	{
		var mapData = {};
		if (typeof mapDataJson["maxWidth"] != "number")
		{
			return null;
		}
		if (typeof mapDataJson["maxHeight"] != "number")
		{
			return null;
		}
		
		mapData.maxWidth = mapDataJson["maxWidth"];
		mapData.maxHeight = mapDataJson["maxHeight"];
		mapData.data = {};
		mapData.bornPoint = [];
		for (var i=0;i< mapData.maxWidth; i++)
		{
			for (var j=0;j< mapData.maxHeight; j++)
			{
				var keyx = this.convertXYToKey(i,j);
				this.m_armyMapData[keyx] = null;
			}
		}
		for (var i=0;i< mapData.maxWidth; i++)
		{
			for (var j=0;j< mapData.maxHeight; j++)
			{
				var keyx = this.convertXYToKey(i,j);
				
				mapData.data[keyx] = {};
				if (typeof mapDataJson[keyx] === "object")
				{
					mapData.data[keyx] = mapDataJson[keyx];
					if (typeof mapData.data[keyx]["bornPoint"] === "number")
					{
						var bornPointCampID = mapData.data[keyx]["bornPoint"];
						var dir = 0;
						if (typeof mapData.data[keyx]["dir"] === "number"
							&& mapData.data[keyx]["dir"] >= 0 && mapData.data[keyx]["dir"] < 4) 
						{
							dir = mapData.data[keyx]["dir"];
						}
						var po = [i,j];
						try
						{
							mapData.bornPoint[bornPointCampID].push(po);
						}
						catch (e)
						{
							mapData.bornPoint[bornPointCampID] = [];
							mapData.bornPoint[bornPointCampID].push(po);
						}
						finally {}
						
						for (var k in this.m_armyList)
						{
							if (this.m_armyList[k].campID === bornPointCampID 
								&&  typeof this.m_armyList[k].bornPoint != "object")
							{
								var army = this.m_armyList[k];
								this.initArmy(army,k,po,dir);
								this.pushArmyToMap(army);
								var armyViewPos = this.getArmyViewPos(army);
								this.createDrawerObj("tank1.png",armyViewPos[0] , armyViewPos[1],true,army.objName,dir);
								break;
							}
						}

					}
					else if (typeof mapData.data[keyx]["build"] === "object" && typeof mapData.data[keyx]["build"]["frameName"] === "string")
					{
						this.createDrawerObj(
							mapData.data[keyx]["build"]["frameName"],i * g_ObjectSize, j * g_ObjectSize,true,"build_" + keyx);
					}
				}
			}
		}
		//cc.log("gen data ok!");
		return mapData;
	},
	initArmy:function(army,armyIndex,po,dir)
	{
		army.pixOffset = [0,0];
		army.bornPoint = clone(po);
		army.po = clone(po);
		army.po2 = clone(po);
		army.dir = dir;
		army.inputlog = {};
		army.inputlog.firelog = [];
		army.armyIndex = armyIndex;
		army.fireCDOverFrame = 0;

		var objName = "player_" + armyIndex;
		army.objName = objName;
	},
	input:function(armyIndex,inputs)
	{
		if (armyIndex >= this.m_armyList.length)
		{
			return;
		}
		this.m_armyList[armyIndex].inputs = inputs
	},
	nextFrame:function()
	{
		
	},
};

