### Main Functionality

---

For Dota2 custom addons makers.  
Fast print variables, use print() in .ts files and use $.Msg() in .tsx files.

Dota2 制图用的.在 ts 文件中用 print()生成 log,在 tsx 文件中用$.Msg().

### Features

---

```typescript
// ts file
OnSpellStart(): void {
	const caster = this.GetCaster()
    // Auto-generate log
	print('~OnSpellStart()  ~caster:' + caster)
}

// tsx file
export function Test() {
	const [count, setCount] = useState(0)
    // Auto-generate log
	$.Msg('~Test()  ~count:' + count)
}
```

### Usage

---

- Selecting the variable which is the subject of the debugging.
- Pressing ctrl + shift + L

- 选中变量
- 按 ctrl + shift + L
