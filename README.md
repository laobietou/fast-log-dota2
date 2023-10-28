### Main Functionality

---

For Dota2 custom addons makers.  
Fast print variables, use print() in .ts files and use $.Msg() in .tsx files.

### Features

---

```typescript
// ts file
OnSpellStart(): void {
	const caster = this.GetCaster()
    // Fast-generate log
	print('~OnSpellStart()  ~caster:' + caster)
}

// tsx file
export function Test() {
	const [count, setCount] = useState(0)
    // Fast-generate log
	$.Msg('~Test()  ~count:' + count)
}
```

### Usage

---

-   Selecting the variable -> Pressing ctrl + shift + L

-   ctrl + shift + P -> Input Annotation Logs
-   ctrl + shift + P -> Input Unannotation Logs

### 功能

DOTA2 制图用的  
快速打印变量,在 ts 文件中用 print(),在 tsx 文件中用$.Msg()  
注释全部 log  
取消注释全部 log

### 例子

---

```typescript
// ts file
OnSpellStart(): void {
	const caster = this.GetCaster()
    // 快速生成
	print('~OnSpellStart()  ~caster:' + caster)
}

// tsx file
export function Test() {
	const [count, setCount] = useState(0)
    // 快速生成
	$.Msg('~Test()  ~count:' + count)
}
```

### 用法

---

-   选中/不选中变量 -> 按快捷键 ctrl + shift + L ,或者点击右键选择 Generate log

-   ctrl + shift + P -> 输入 Annotation Logs
-   ctrl + shift + P -> 输入 Unannotation Logs
