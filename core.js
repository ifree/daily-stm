/*
* Reverse Polish Nation
* file:core.js
* author:ifree
* lastModified:2010/08/16 14:00
* */

function RPN(input){
	var inputStack=[],symbles=[],output=[];
	
	input=input.replace(/\s/g,'');
	for(var i=0,il=input.length;i<il;i++){
			if(/[a-zA-Z]/.test(input[i])||/[()]/.test(input[i])){
			inputStack.push(input[i]);
		}else{
			if(i<input.length-1&&/[^a-zA-Z]/.test(input[parseInt(i)+1])&&/[^()]/.test(input[parseInt(i)+1])){
				inputStack.push(input[i]+input[parseInt(i)+1]);
				i++;
			}else{
				inputStack.push(input[i]);
			}
		}	
	}
	
	
	function priorityMapping(a,b){
		var p=['!','||','&&','->','<->','(',')'];
		if(a===b)
			return true;
		else{
			return p.indexOf(a)<p.indexOf(b);
		}
	}
	var steps={
		'vars':function(obj){
			if(/[a-zA-Z]/.test(obj)){
				output.push(obj);
			}else if(/[()]/.test(obj)){
				if(obj==='('){
					steps.lb(obj);
				}else{
					steps.rb(obj);
				}
			}else{
				steps.symbles(obj);
			}
			
		},
		'symbles':function(obj){
			if(symbles.length>0){
				if(priorityMapping(obj,symbles[symbles.length-1])){
					symbles.push(obj);//goto vars
					steps.current="vars";
				}else{
					output.push(symbles.pop());
					steps.symbles(obj);
				}
			}else{
				symbles.push(obj);//goto vars
				steps.current="vars";
			}
		},
		'lb':function(obj){
			symbles.push(obj)//goto vars
			steps.current="vars";
		},
		'rb':function(obj){
			if(symbles.length==0)
				throw "bracket mismatch";
			if(symbles[symbles.length-1]=='('){
				symbles.pop();//goto vars
				steps.current="vars";
			}
			else{
				output.push(symbles.pop());
				steps.rb(obj);
			}
		},
		'end':function(){
			if(symbles.length>0){
				if(symbles[symbles.length-1]==='(')
					throw "invalid input";
				else{
					output.push(symbles.pop());//goto end;
					steps.end();
				}
			}
		},
		'current':'vars'
	};
	return (function(){
		inputStack.forEach(function(obj,idx){
			steps[steps.current](obj);
		});
		steps.end();
		return output.join(' ');
	})();
}
