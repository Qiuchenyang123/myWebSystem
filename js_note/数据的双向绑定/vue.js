class Vue extends EventTarget {
    constructor(option) {
        super();
        this._data = option.data;
        this.el = document.querySelector(option.el);
        this.observe(this._data);
        this.compileNode(this.el);

    }

    observe(data) {
        const self = this;
        this._data = new Proxy(data, {
            get(target, p, receiver) {
                return target[p]
            },
            set(target, p, value, receiver) {
                console.log(p, value);
                const event = new CustomEvent(p, {detail: value});
                self.dispatchEvent(event)
                return Reflect.set(...arguments)
            }
        })
    }

    compileNode(el) {
        const childNode = el.childNodes;
        [...childNode].forEach(node => {
            const nodeType = node.nodeType;
            if (nodeType === 3) {
                let content = node.nodeValue;
                const reg = /(\{\{\s*)([^\s\{\}]*)(\s*\}\})/g;
                if (reg.test(content)) {
                    const $2 = RegExp.$2;
                    console.log($2);
                    if (this._data[$2]) node.nodeValue = content.replace(reg, this._data[$2]);
                    this.addEventListener($2, function (e) {
                        node.nodeValue = content.replace(reg, e.detail)
                    })
                }
            } else if (nodeType === 1) {
                if (node.hasAttributes()) {
                    const attrs = node.attributes;
                    if (attrs['v-model']) {
                        const key = node.getAttribute('v-model')
                        const self = this;
                        node.value = this._data[key]
                        node.addEventListener('input', function (e) {
                            self._data[key] = this.value;
                            // self.dispatchEvent('model')
                        }, false)
                    }
                }
                if (node.hasChildNodes()) {
                    this.compileNode(node)
                }
            }
        })
    }
}