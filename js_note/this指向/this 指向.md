# this 指向
## this定义
> this 是执行上下文的一个属性，其值在进入执行上下文的时候就已经确定了。
>
## 透彻认识 function 的 this 在不同调用环境下的指向
* 事件调用环境
	* 谁触发事件，函数里面的 this 指向的就是谁
* 全局环境下
	* 浏览器环境下指向 window
	* node 环境下，this === module.exports
* 函数内部
	* 【this 最终指向的是调用它的对象】
		* 普通函数直接调用与 window 调用
		* 对象中的函数直接调用与 window 调用
	* 【函数被多层对象所包含，如果函数被最外层对象调用，this 指向的也只是它的上一级对象】
		* 多层对象中的函数的 this 指向
		* 对象中的函数被赋值给另一个变量
```javascript
var b = '123'
var a = {
	b: '234',
	c: function() {
		console.log(this.b)
	},
	d: {
		b: '345',
		f: function() {
			console.log(this.b)
		}
	}
}
a.c(); // 234
a.d.f(); // 345
const g = a.c;
g() // 123
```
	* 【构造函数中的 this 指向的是实例对象】
		* 构造函数中的 this 指向
		* new 运算符的作用
```javascript
function Parent(name){
	this.name = name
}
const Child = new Parent('Bob');
Child.prototype.getName = function() {
	console.log(this.name)
}
/*
* 在 new 的过程中进行了：
* 1、隐式生成一个对象，
* 2、将 this 与创建的对象进行绑定，
* 3、如果构造出来的函数没有返回值，则隐式返回 this 对象
*/
```

* 【如果构造函数中有 return，且 return 是对象类型的数值，则 this 指向返回的对象，如果 return 的数据不是对象类型，则 this 指向保持原来的规则，在这里，null 比较特殊，this 指向隐式声明的对象】
* 了解箭头函数中的 this 指向的特殊性
	* 箭头函数与 function 函数的区别
		1.箭头函数本身没有 this，箭头函数内部的 this 指向其所在的上下文环境，因此对象是不能形成独立的作用域的。
		
		2.箭头函数没有 arguments，要看参数只能用 ...rest 解构出来
		
		3.箭头函数没有 prototype
		
		4.箭头函数不能 new
		
		5.外形不同
		
		6.箭头函数都是匿名函数
		
		7.箭头函数不能声明 Generator 函数
		
		8.箭头函数不具有 super  
* 改变 this 指向
	* call，apply，bind 可以改变 this 指向 
	* 箭头函数不能用 call，apply，bind 改变 this 指向 