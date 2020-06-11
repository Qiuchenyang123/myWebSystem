/*
Proxy vs defineProperty
Proxy 可以拦截所有操作，不需要 $set $delete，支持全部的数据格式 Map Set,拥有烂手机的特性，
      不会再一开始就深层遍历收集，是浏览器自带的能力
defineProperty 数组需要单独拦截，对象新增和删除属性，不能拦截所以需要 $set $delete，初始化的时候就会全部递归完毕，
*/
const baseHandler = {
    get(target, key) {
        // 这里可以优化为 Reflect.get(target, key)
        const res = Reflect.get(target, key);
        // TODO 依赖收集
        track(target, key);
        return typeof res === 'object' ? reactive(res) : res
    },
    set(target, key, val) {
        const info = {oldValue: target[key], newValue: val};
        // TODO 响应式去通知变化
        // target[key] = val;
        Reflect.set(target, key, val);
        trigger(target, key, info);
    }
};

function reactive(target) {
    // vue3还需要考虑 Map 这些对象，这里不作考虑
    const observed = new Proxy(target, baseHandler);

    return observed
}

function computed(fn, options = {}) {
    // computed 是特殊的 effect
    const runner = effect(fn, {computed: true, lazy: options.lazy});
    return {
        effect: runner,
        get value() {
            return runner()
        }
    }
}

function effect(fn, options = {}) {
    // 依赖函数
    const e = createReactiveEffect(fn, options);
    if (!options.lazy) {
        // 不是懒执行
        e()
    }
    return e
}

function createReactiveEffect(fn, options) {
    // 这是用来格式化 effect 函数的
    const effect = function effect(...args) {
        return run(effect, fn,args )
    };
    // effect 的配置
    effect.deps = [];
    effect.computed = options.computed;
    effect.lazy = options.lazy;
    return effect
}

function run(effect, fn, args) {
    // 执行 effect
    if (effectStack.indexOf(effect) === -1) {
        try {
            effectStack.push(effect);
            return fn(...args)
        } finally {
            effectStack.pop() // effect 执行完毕
        }
    }
}

const effectStack = []; // 存储 effect

/*
* 怎么收集依赖——用一个巨大的 Map对象 来收集
* {
*   target1: {
*       key: [依赖的函数1, 依赖的函数2]
*   },
*   target2: {
*       key2: []
*   }
* }
* */
const targetMap = new WeakMap(); // 依赖收集器
function track(target, key) {
    // 收集依赖
    // 每次收集的都是最新的依赖函数
    const effect = effectStack[effectStack.length - 1];
    if (effect) {
        let depMap = targetMap.get(target); // 依赖关系
        if (!depMap) { // 如果依赖关系不存在，则创建依赖关系，即35~45注释中的target1、target2
            depMap = new Map();
            targetMap.set(target, depMap)
        }
        let dep = depMap.get(key);
        if (!dep) {
            dep = new Set();
            depMap.set(key, dep)
        }
        // 容错
        if (!dep.has(effect)) {
            // 新增依赖
            // 双向存储 方便优化查找
            dep.add(effect);
            effect.deps.push(dep)
        }
    }
}


function trigger(target, key, info) {
    // 数据变化后，派发更新 执行effect
    // 1、找到依赖
    const depMap = targetMap.get(target);
    if (!depMap) {
        return
    }
    // 区分普通的effect和computed，普通的effect优先于computed
    // 因为computed可能会依赖普通的effect
    const effects = new Set();
    const computedRunner = new Set();
    if (key) {
        let deps = depMap.get(key);
        deps.forEach(effect => {
            if (effect.computed) {
                computedRunner.add(effect)
            } else {
                effects.add(effect)
            }
        });
        effects.forEach(effect => effect());
        computedRunner.forEach(effect => effect())
    }
}