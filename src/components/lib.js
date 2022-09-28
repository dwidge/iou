import isMatch from 'date-fns/isMatch'
import parse from 'date-fns/parse'
import format from 'date-fns/format'

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

export const dbg = (...a) => alert(a.map(aa => JSON.stringify(aa)).join('\n'))

const removeElementById = (id) => {
	const e = document.getElementById(id)
	e?.parentNode.removeChild(e)
}
const appendScript = (js) => {
	const firstJs = document.getElementsByTagName('script')[0]
	firstJs.parentNode.insertBefore(js, firstJs)
}

export const loadScript = (id, src) => new Promise((resolve, reject) => {
	removeElementById(id)

	// alert('loading: '+src)
	const js = document.createElement('script')
	js.id = id
	js.src = src
	js.onload = () => {
		// alert('loaded: '+src)
		resolve()
	}
	js.onerror = reject
	appendScript(js)
})

export const ifTimeout = async (f, t = 5000) =>
	new Promise((resolve, reject) => {
		let tt = setTimeout(() => resolve(true), t)
		f.then(a => {
			if (tt) {
				clearTimeout(tt)
				tt = null
				resolve(false)
			}
		}, reject)
	})

export const sleep = async (t = 2000) =>
	new Promise((resolve, reject) => {
		setTimeout(() => resolve(), t)
	})

export const promisify = f => (...a) => new Promise((resolve, reject) => f(...a, resolve, reject))

// stackoverflow.com/a/50636286
export function partition(array, filter) {
	const pass = []; const fail = []
	array.forEach((e, idx, arr) => (filter(e, idx, arr) ? pass : fail).push(e))
	return [pass, fail]
}

export const parsePrice = s =>
	+('' + s).split(',').join('')

export const printPrice = n =>
	n.toFixed(2)

export const formatPrice = s =>
	printPrice(parsePrice(s))

export const parseDate = (s) => {
	const matchparse = (s, f) =>
		isMatch(s, f) && parse(s, f, new Date())

	const d = ('' + s).replace(/[/ -]/g, '-')
	return matchparse(d, 'dd-MM-yyyy') || matchparse(d, 'yyyy-MM-dd')
}

export const printDate = d =>
	d ? format(d, 'yyyy/MM/dd') : '-'

export const formatDate = s =>
	printDate(parseDate(s))

export const byDateAsc = col => (a, b) =>
	parseDate(a[col]) - parseDate(b[col])
