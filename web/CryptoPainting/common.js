
function clone(obj) {  
    var o;  
    if (typeof obj == "object") {  
        if (obj === null) {  
            o = null;  
        } else {  
            if (obj instanceof Array) {  
                o = [];  
                for (var i = 0, len = obj.length; i < len; i++) {  
                    o.push(clone(obj[i]));  
                }  
            } else {  
                o = {};  
                for (var j in obj) {  
                    o[j] = clone(obj[j]);  
                }  
            }  
        }  
    } else {  
        o = obj;  
    }  
    return o;  
}

function merge(obj1,obj2)
{
	for (var k in obj2)
	{
		if (obj1.hasOwnProperty(k))
		{
			continue;
		}
		obj1[k] = obj2[k];
	}
	return obj1;
}

