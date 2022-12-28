"use strict";

function functionBTN(args) {
	// ボタンの状態を取得する
	const btnId = args.length > 0 ? args[0] : 0;
	if (btnId < 0) {
		return btnStatus;
	} else {
		switch (btnId) {
			case 0: // 本体ボタン
				return 0;
			case 28: // ←
				return btnStatus & 1;
			case 29: // →
				return (btnStatus >> 1) & 1;
			case 30: // ↑
				return (btnStatus >> 2) & 1;
			case 31: // ↓
				return (btnStatus >> 3) & 1;
			case 32: // スペース
				return (btnStatus >> 4) & 1;
			case 88: // X
				return (btnStatus >> 5) & 1;
			default:
				return 0;
		}
	}
}

function functionTICK(args) {
	// 時刻を取得する
	const isHiRes = args.length > 0 && args[0] !== 0;
	const tick = (performance.now() - tickOrigin) / 1000 * TICK_PER_SECOND * (isHiRes ? TICK_HIRES_MULT : 1);
	return Math.floor(tick) % 32768;
}

function functionINKEY() {
	// キー入力を1文字取得する
	const key = dequeueKey();
	if (key < 0) return 0;
	if (key === 0) return 0x100;
	return key;
}

function functionSCR(args) {
	// 指定した位置のVRAMを読む
	if (args.length !== 0 && args.length !== 2) throw "Syntax error";
	const x = args.length === 0 ? cursorX : args[0];
	const y = args.length === 0 ? cursorY : args[1];
	if (x < 0 || SCREEN_WIDTH <= x || y < 0 || SCREEN_HEIGHT <= y) return 0;
	return vramView[SCREEN_WIDTH * y + x];
}

function functionABS(args) {
	// 絶対値を得る
	const value = args[0];
	if (value === -32768 || value >= 0) return value;
	return -value;
}

function functionFREE() {
	// プログラムの残り容量を得る
	let ptr = 0;
	while (ptr + 3 <= prgView.length) {
		const lineNo = prgView[ptr] | (prgView[ptr + 1] << 8);
		const lineSize = prgView[ptr + 2];
		if (lineNo === 0) break;
		ptr += lineSize + 4;
	}
	return ptr > prgView.length ? 0 : prgView.length - ptr;
}

function functionPEEK(args) {
	// 仮想メモリからデータを読み込む
	return readVirtualMem(args[0]);
}

function functionLINE() {
	// 実行中の行番号を得る
	return currentLine;
}

function functionLEN(args) {
	// 文字列の長さを得る
	let count = 0;
	let ptr = args[0];
	for (;;) {
		const c = readVirtualMem(ptr + count);
		if (c == 0 || c == 0x22) return count;
		count++;
	}
}

function functionRND(args) {
	// 0以上第一引数未満の乱数を返す
	const max = args[0];
	if (max <= 0) return 0;
	return (Math.random() * max) >>> 0;
}

function functionPOS(args) {
	// カーソル位置や画面サイズを得る
	const select = args.length > 0 ? args[0] : 0;
	switch (select) {
		case 1: return cursorX;
		case 2: return cursorY;
		case 3: return SCREEN_WIDTH;
		case 4: return SCREEN_HEIGHT;
		default: return SCREEN_WIDTH * cursorY + cursorX;
	}
}

function functionCOS(args){
	// 余弦の256倍を返す
	return Math.round(Math.cos(args[0] * Math.PI / 180) * 256);
}

function functionSIN(args){
	// 正弦の256倍を返す
	return Math.round(Math.sin(args[0] * Math.PI / 180) * 256);
}
