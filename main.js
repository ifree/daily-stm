function getRandNumber(config){
	var config={
		length:config.length||1,
		precision:config.precision||[7]
	}
	var result=[];
	
	for (var i = config.length - 1; i >= 0; i--){
		var prec;
		if(config.precision.length==1){
			prec=config.precision[0];	
		}else{
			if(config.precision[i]){
				prec=config.precision[i];
			}else{
				prec=config.precision[0];
			}
		}
		result.push(parseInt(Math.random()*(Math.pow(10,prec))));
	};
	
	return result;
}

function alarmClock(count,duration){
	duration=duration||1;
	function updateClock(handler,callback){
		count-=1;
		if(count>0){
			handler(count);
			setTimeout(function(){
				return updateClock(handler,callback);
			},duration*1000);
		}else{
			callback();
		}
	}
	return updateClock;
}

function STMTester(config){
	this.config={
		count:config.count||1,
		rule:config.rule||{start:5,end:20},
	}
	this.currentLevel=this.config.rule.start;
	
	this.lastResult=getRandNumber({
		length:this.config.count,
		precision:[this.currentLevel++]
	});
}
STMTester.prototype.process=function(result){
	if(this.config.rule.end<this.currentLevel)
		return false;
	this.LastNotMatch=false;
	if(result.length!=this.lastResult.length){
		this.currentLevel--;
		this.LastNotMatch=true;
	}
	else
		for (var i=0; i < result.length; i++) {
			if(result[i]!=this.lastResult[i]){
				this.currentLevel--;
				this.LastNotMatch=true;
				break;
			}
		};
	return this.lastResult=getRandNumber({
		length:this.config.count,
		precision:[this.currentLevel++]
	});	
}
