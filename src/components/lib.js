export const sendWatsapp = (num, text, localdialcode = '+27') => {
	if (!num) return alert('Couldn\'t send, needs number')
	if (num[0] !== '+') num = localdialcode + num.slice(1)
	num = num.split(' ').join('')

	window.open(`https://wa.me/${encodeURIComponent(num)}?text=${encodeURIComponent(text)}`, '_blank')

// https://api.whatsapp.com/send/?phone=${encodeURIComponent(num)}&text=${encodeURIComponent(text)}&type=phone_number&app_absent=0
}

export const replaceKV = txt => (keyvalues = {}) =>
	replaceAll(txt)(Object.entries(keyvalues)).trim()

export const replaceAll = txt => subs =>
	subs.reduce((txt, [a, b]) => txt.split(a).join(b), txt)

export const newRef = ([conf, confSet, confSetKey]) => (kpre, knext) => {
	const pre = conf[kpre]
	let next = (+conf[knext])
	return () => {
		const id = pre + ('' + (next++)).padStart(3, '0')
		confSetKey(knext, next)
		return id
	}
}

export const useKeyVal = ([o, oSet], init = {}) =>
	[{ ...init, ...o }, oSet, (k, v) => oSet(o => ({ ...o, [k]: v }))]
