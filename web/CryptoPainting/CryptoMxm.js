

var hw = hw || {};

hw.main = function(){
	
	cc.game.onStart = function(){
	if (typeof web3 !== 'undefined') 
	{
		cc.log("web3 a")
		web3 = new Web3(web3.currentProvider);
	} 
	else 
	{
		cc.log("web3 b")
		// set the provider you want from Web3.providers
		web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
	}

	cc.view.adjustViewPort(true); //设置html5的viewport meta属性

	cc.view.setDesignResolutionSize(720, 1000, cc.ResolutionPolicy.SHOW_ALL); //设置画面尺寸和适配规则

	cc.view.resizeWithBrowserSize(true); //设置是否跟随浏览器窗口变化              
	//load resources
	cc.LoaderScene.preload(g_preloaderList, function () {

	cc.director.runScene(new MyScene());
	}, this);
	};
	cc.game.run("gameCanvas");
};

