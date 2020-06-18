## 1. v-for与v-if优先级
> 会先执行v-for，
> 首先这两个指令是不能写在一起的，会报错。然后在源码里，执行v-if是在v-for之后的
> 顺序：static =》genOnce =》genFor =》genIf =》genChildren =》genSlot
> 如果想要只实现v-for只渲染其中的某一部分部分，那可以通过computed来过滤掉不需要的部分
>
## 2.key值有什么作用
> key的主要作用是为了更高效地更新虚拟DOM。
> key在patch过程中用来判断两个节点是否相同，
> key是必要条件，如果是渲染一个泪飙，那么key就是唯一标识，
> key相同那么正在比较中的两个vnode就是相同的。如果不设置
> key值，那么vue就会更新全部的列表，这样性能就比较差了。
> 如果是渲染一个列表，那么key值是必须设置的，而且必须是唯一标识，
> 要减少将数组索引作为key，这可能会有隐藏bug，而且在用过渡动画时，
> 也要用key。
> 源码中key是在sameVnode方法中用来比较两个Vnode是不是同一个节点
>
## 3.讲一下vue的双向绑定
> vue中的双向绑定是v-model
>
## 4.diff算法
> diff算法是虚拟DOM技术的产物，Vue1是没有虚拟DOM的，依靠watcher，但是太耗性能，
> 为了降低watcher颗粒度，引入了虚拟DOM。 
> vue中叫做patch，深度优先(先子节点，再父节点)，同层比较(头尾节点先尝试比较是否相同)
> 借助key精确找到相同节点