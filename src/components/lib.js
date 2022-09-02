export const sendWatsapp = (num, text) => {
	if (!num) alert('Couldn\'t send, needs number')
	else { window.open(`https://wa.me/${encodeURIComponent(num.split(' ').join(''))}?text=${encodeURIComponent(text)}`, '_blank') }
}

export const sendClient = (client, txt, fields = {}) =>
	client && sendWatsapp(client.phone, replaceAll(txt)(Object.entries(fields)).trim())

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
