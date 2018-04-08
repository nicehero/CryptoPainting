var TSpriteCallback = {
	onClickDown:function(eventObj,worldPos)
	{
		var localPos = eventObj.convertToNodeSpace(worldPos);
		cc.log("onClickDown worldPos.x:" + worldPos.x + " worldPos.y:" + worldPos.y + " localPos.x:" + localPos.x + " localPos.y:" + localPos.y);
	},
	onClickUp:function(eventObj,worldPos,isObjContainsPoint)
	{
		var localPos = eventObj.convertToNodeSpace(worldPos);
		cc.log("onClickUp worldPos.x:" + worldPos.x + " worldPos.y:" + worldPos.y + " localPos.x:" + localPos.x + " localPos.y:" + localPos.y + " isObjContainsPoint:" + isObjContainsPoint);
	},
	onMovedIn:function(eventObj,worldPos)
	{
		var localPos = eventObj.convertToNodeSpace(worldPos);
		cc.log("onMovedIn worldPos.x:" + worldPos.x + " worldPos.y:" + worldPos.y + " localPos.x:" + localPos.x + " localPos.y:" + localPos.y);
	},
	onMovedOut:function(eventObj,worldPos)
	{
		var localPos = eventObj.convertToNodeSpace(worldPos);
		cc.log("onMovedOut worldPos.x:" + worldPos.x + " worldPos.y:" + worldPos.y + " localPos.x:" + localPos.x + " localPos.y:" + localPos.y);
	},
	onMoved:function(eventObj,worldPos)
	{
		var localPos = eventObj.convertToNodeSpace(worldPos);
		cc.log("onMoved worldPos.x:" + worldPos.x + " worldPos.y:" + worldPos.y + " localPos.x:" + localPos.x + " localPos.y:" + localPos.y);
	},
}
var TEx = {
	
	m_canTouch:true,	
	m_canDrag:false,
	m_isMoveOnSelected:false,
	m_isMovedOn:false,
	m_beganPoint:null,
	m_touchPoint:null,
	m_callback:null,
	
	setCanTouch:function(canTouch)
	{
		if (this.m_canTouch === true && canTouch === false)
		{
			this.removeTouchEventListenser();
		}
		else if (this.m_canTouch === false && canTouch === true)
		{
			this.addTouchEventListenser();
		}
		this.m_canTouch = canTouch;
	},
	
	setCallback:function(callback)
	{
		this.m_callback = callback;
	},
	
	setCanDrag:function(canDrag_){
		this.m_canDrag = canDrag_;
	},
	
	onEnter:function(){
		this._super();
		if (this.m_canTouch)
		{
			this.addTouchEventListenser();
		}
		
	},
	onExit:function () {
		if (this.m_canTouch)
		{
			this.removeTouchEventListenser();
		}
	},
	
	addTouchEventListenser:function(){
		//touch event
		this.touchListener = cc.EventListener.create({
			event: cc.EventListener.TOUCH_ONE_BY_ONE,
			// When "swallow touches" is true, then returning 'true' from the onTouchBegan method will "swallow" the touch event, preventing other listeners from using it.
			swallowTouches: false,
			//onTouchBegan event callback function                      
			onTouchBegan: function (touch, event) { 
				var pos = touch.getLocation();
				var target = event.getCurrentTarget();  
				if ( cc.rectContainsPoint(target.getBoundingBox(),pos)) {
					//响应精灵点中
					target.m_beganPoint = target.getPosition();
					target.m_touchPoint = pos;
					target.m_isMovedOn = true;
					if (target.m_callback && typeof target.m_callback.onClickDown == "function")
					{
						target.m_callback.onClickDown(target,pos);
					}
					return true;
				}
				else
				{
					target.m_isMovedOn = false;
					if (target.m_isMoveOnSelected === true)
					{
						return true;
					}
				}
				return false;
			},
			onTouchMoved: function (touch, event) { 
				var pos = touch.getLocation();
				var target = event.getCurrentTarget();  
				if (target.m_canDrag)
				{
					if (target.m_beganPoint != null && target.m_touchPoint != null)
					{
						target.setPosition(target.m_beganPoint.x - target.m_touchPoint.x + pos.x,target.m_beganPoint.y - target.m_touchPoint.y + pos.y);
					}
				}
				if ( cc.rectContainsPoint(target.getBoundingBox(),pos)) {
					
					if (target.m_isMoveOnSelected === true && target.m_isMovedOn === false)
					{
						target.m_isMovedOn = true;
						
						if (target.m_callback && typeof target.m_callback.onMovedIn == "function")
						{
							target.m_callback.onMovedIn(target,pos);
						}

						return true;
					}
					else if (target.m_isMovedOn === false && target.m_beganPoint != null && target.m_touchPoint != null)
					{
						target.m_isMovedOn = true;
						
						if (target.m_callback && typeof target.m_callback.onMovedIn == "function")
						{
							target.m_callback.onMovedIn(target,pos);
						}

						return true;
					}
					if (target.m_callback && typeof target.m_callback.onMoved == "function")
					{
						target.m_callback.onMoved(target,pos);
					}

					return true;
				}
				else
				{
					if (target.m_isMovedOn === true && target.m_canDrag === false)
					{
						target.m_isMovedOn = false;
						if (target.m_callback && typeof target.m_callback.onMovedOut == "function")
						{
							target.m_callback.onMovedOut(target,pos);
						}
					}
					return false;
				}
				return false;
			},
			onTouchEnded: function (touch, event) { 
				var pos = touch.getLocation();
				var target = event.getCurrentTarget();  
				if ( cc.rectContainsPoint(target.getBoundingBox(),pos)) {
					//响应精灵点中
					target.m_beganPoint = null;
					target.m_touchPoint = null;
					target.m_isMovedOn = false;
					if (target.m_callback && typeof target.m_callback.onClickUp == "function")
					{
						target.m_callback.onClickUp(target,pos,true);
					}
					return true;
				}
				else if (target.m_beganPoint != null && target.m_touchPoint != null)
				{
					target.m_beganPoint = null;
					target.m_touchPoint = null;
					target.m_isMovedOn = false;
					if (target.m_callback && typeof target.m_callback.onClickUp == "function")
					{
						target.m_callback.onClickUp(target,pos,false);
					}
					return false;
				}
				target.m_beganPoint = null;
				target.m_touchPoint = null;
				target.m_isMovedOn = false;
				return false;
			}
		});

		cc.eventManager.addListener(this.touchListener,this);
	},
	
	removeTouchEventListenser:function(){
		cc.eventManager.removeListener(this.touchListener);
	}

};
var TSprite = cc.Sprite.extend(Object.create(TEx));
