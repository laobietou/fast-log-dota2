// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode"
import {TextDocument} from "vscode"

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	vscode.commands.registerCommand("fast-log-dota2.generator-log", () => {
		// 获取当前活动编辑器
		const editor = vscode.window.activeTextEditor

		if (editor) {
			// 获取选中内容
			const selection = editor.selection
			const text = editor.document.getText(selection)

			// 获取选中行的位置
			const position = selection.active

			// 获取当前行前面制表符
			const trimmedLine = editor.document.lineAt(position.line).text.substring(0, position.character)
			const tab = trimmedLine.match(/^\t*/)?.[0] || ""

			// 判断文件类型
			let logMethod: string = ""
			const fileType = editor.document.fileName.split(".").pop()
			if (fileType == "ts") logMethod = "print"
			else logMethod = "$.Msg"

			// 判断在class内还是function内
			const className = enclosingBlockName(editor.document, position.line, "class")
			const functionName = enclosingBlockName(editor.document, position.line, "function")

			if (functionName.length > 0) {
				editor.edit(editBuilder => {
					editBuilder.insert(
						new vscode.Position(position.line + 1, 0),
						`${tab}${logMethod}('~${functionName}()  ~${text}:' + ${text})\n`
					)
				})
			} else if (className.length > 0) {
				editor.edit(editBuilder => {
					editBuilder.insert(
						new vscode.Position(position.line + 1, 0),
						`${tab}${logMethod}('~class:${className}  ~${text}:' + ${text})\n`
					)
				})
			} else {
				editor.edit(editBuilder => {
					editBuilder.insert(new vscode.Position(position.line + 1, 0), `${tab}${logMethod}('~${text}:' + ${text})\n`)
				})
			}
		}
	})
}

// This method is called when your extension is deactivated
export function deactivate() {}

/**
 * 下面的代码来自于Chakroun-Anas
 * https://github.com/Chakroun-Anas/turbo-console-log
 */
type BlockType = "class" | "function"
enum BracketType {
	PARENTHESIS = "PARENTHESIS",
	CURLY_BRACES = "CURLY_BRACES",
}
type LogBracket = {
	openingBrackets: number
	closingBrackets: number
}
function enclosingBlockName(document: TextDocument, lineOfSelectedVar: number, blockType: BlockType): string {
	let currentLineNum = lineOfSelectedVar

	while (currentLineNum >= 0) {
		const currentLineText = document.lineAt(currentLineNum).text

		switch (blockType) {
			case "class":
				if (doesContainClassDeclaration(currentLineText)) {
					if (
						lineOfSelectedVar > currentLineNum &&
						lineOfSelectedVar < closingBracketLine(document, currentLineNum, BracketType.CURLY_BRACES)
					) {
						return `${getClassName(currentLineText)}`
					}
				}
				break

			case "function":
				if (doesContainsNamedFunctionDeclaration(currentLineText) && !doesContainsBuiltInFunction(currentLineText)) {
					if (
						lineOfSelectedVar >= currentLineNum &&
						lineOfSelectedVar < closingBracketLine(document, currentLineNum, BracketType.CURLY_BRACES)
					) {
						if (getFunctionName(currentLineText).length !== 0) {
							return `${getFunctionName(currentLineText)}`
						}

						return ""
					}
				}
				break
		}

		currentLineNum--
	}

	return ""
}
function doesContainClassDeclaration(loc: string): boolean {
	return /class(\s+).*{/.test(loc)
}
export function closingBracketLine(document: TextDocument, declarationLine: number, bracketType: BracketType): number {
	let nbrOfOpenedBraces = 0
	let nbrOfClosedBraces = 0
	while (declarationLine < document.lineCount) {
		const {openingBrackets, closingBrackets} = locBrackets(document.lineAt(declarationLine).text, bracketType)
		nbrOfOpenedBraces += openingBrackets
		nbrOfClosedBraces += closingBrackets
		if (nbrOfOpenedBraces - nbrOfClosedBraces === 0) {
			return declarationLine
		}
		declarationLine++
	}
	return -1
}
function locBrackets(loc: string, bracketType: BracketType): LogBracket {
	let openingBrackets = 0
	let closingBrackets = 0
	const openedElement: RegExp = bracketType === BracketType.PARENTHESIS ? /\(/g : /{/g
	const closedElement: RegExp = bracketType === BracketType.PARENTHESIS ? /\)/g : /}/g
	while (openedElement.exec(loc)) {
		openingBrackets++
	}
	while (closedElement.exec(loc)) {
		closingBrackets++
	}
	return {
		openingBrackets,
		closingBrackets,
	}
}
function getClassName(loc: string): string {
	if (doesContainClassDeclaration(loc)) {
		return loc.split("class ")[1].trim().split(" ")[0].replace("{", "")
	} else {
		return ""
	}
}
function getFunctionName(loc: string): string {
	if (doesContainsNamedFunctionDeclaration(loc)) {
		if (/(const|let|var)(\s*)[a-zA-Z0-9]*\s*=/.test(loc)) {
			return loc.split("=")[0].replace(/export |module.exports |const |var |let |=|(\s*)/g, "")
		} else if (/function(\s+)/.test(loc)) {
			return loc.split("function ")[1].split("(")[0].replace(/(\s*)/g, "")
		} else {
			return loc.split(/\(.*\)/)[0].replace(/async |static |public |private |protected |export |default |(\s*)/g, "")
		}
	} else {
		return ""
	}
}
function doesContainsNamedFunctionDeclaration(loc: string): boolean {
	const locWithoutFunctionKeyword = loc.replace("function", "")
	const regularNamedFunctionRegex = new RegExp(/\s*[a-zA-Z0-9]+\s*\(.*\):?.*{/)
	const regularFunctionAssignedToVariableRegex = new RegExp(/(const|let|var)(\s*)[a-zA-Z0-9]*\s*=(\s*)\(.*\)(\s*){/)
	const arrowFunctionAssignedToVariableRegex = new RegExp(/(const|let|var)(\s*)[a-zA-Z0-9]*\s*=.*=>.*/)
	return (
		regularNamedFunctionRegex.test(locWithoutFunctionKeyword) ||
		regularFunctionAssignedToVariableRegex.test(locWithoutFunctionKeyword) ||
		arrowFunctionAssignedToVariableRegex.test(loc)
	)
}
function doesContainsBuiltInFunction(loc: string): boolean {
	const locWithoutWhiteSpaces = loc.replace(/\s/g, "")
	return /(if|switch|while|for|catch|do)\(.*\)/.test(locWithoutWhiteSpaces)
}
