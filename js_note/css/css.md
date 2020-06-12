# CSS
## 元素水平垂直居中
* 定位
* JavaScript
* display: table-cell;vertical-align: middle;text-align: center;要固定宽高，且内部元素要为行内元素
* display: flex;justify-content: center;align-items: center;
## CSS盒模型
* 标准盒模型 box-sizing: content-box;
* 怪异盒模型(ie盒模型) box-sizing: border-box;
* 弹性盒模型
## 几大经典布局方案
> 圣杯布局
>
> 双飞翼布局
>
> =》左右固定，中间自适应
>
* 圣杯布局：浮动 + 负margin
```html
<div class="container">
    <div class="center"></div>
    <div class="left"></div>
    <div class="right"></div>
</div>
<style>
    html, body{
        height: 100vh;
        overflow: hidden;
    }
    .container{
        min-height: 100vh;
        padding: 0 200px;
    }
    .center{
        
    }
    .left{
        float: left;
        position: relative;
        left: -200px;
        width: 200px;
        margin-left: -100%;
    }
    .right{
        width: 200px;
        float: right;
        margin-left: -200px;
    }
</style>
```
* 双飞翼布局：浮动 + 负margin
```html
<div class="wrap">
    <div class="container">
        <div class="center"></div>
    </div>
    <div class="left"></div>
    <div class="right"></div>
</div>
<style>
    .wrap{
        width: 100%;
    }
    .container{
        float: left;
        margin: 0 200px;
    }
    .left{
        margin-left: -100%;
    }
    .right{
        margin-left: -200px;
    }
</style>
```

* calc——调整width宽度
```html
<style>
    .center{
        width: calc(100% - 400px);
    }
</style>
```

* flex

* 定位

## 移动端布局
* @media
* rem
* flex
* vw/vh