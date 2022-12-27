"use strict";

function functionPEEK(args) {
	// 仮想メモリからデータを読み込む
	return readVirtualMem(args[0]);
}

function functionRND(args) {
	// 0以上第一引数未満の乱数を返す
	const max = args[0];
	if (max <= 0) return 0;
	return (Math.random() * max) >>> 0;
}