# 白鹭项目代码机器人


## 背景

本项目包含了一些常用的自动修改 TypeScript 代码的工具，开发者可以 git clone 此项目进行任意定制


## 目前包括功能

### 修改嵌套 namespace

采用白鹭引擎 5.3.8 版本的 EgretWebpackBundler 后，如果项目中包含如下代码会出现报错

```typescript 
namespace a.b {

    export class C {

    }
}
```

您需要将代码修改为如下所示

```typescript
namespace a {
    namespace b {
        export class C {

        }
    }
}
```

您可以克隆此项目后，修改 src/index.ts 中的项目路径，并去掉 ```// project.saveSync()``` 中的注释，就可以自动将您项目中的全部 TypeScript 代码进行自动修改

> 注意，运行本脚本前请先对项目进行备份
