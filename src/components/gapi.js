import { loadScript, ifTimeout, promisify } from './lib'

function listFileC({ name = '' } = {}, resolve = console.log, reject = console.log) {
	const request = window.gapi.client.drive.files.list({
		q: 'name=\'' + name + '\'',
		fields: 'nextPageToken, files(id, name)',
		spaces: 'drive',
		orderBy: 'recency desc',
	})
	request.execute(resolve)
}
const listFile = promisify(listFileC)

function downloadFileC(file, resolve = console.log, reject = console.log) {
	const fileId = file.id
	const accessToken = window.gapi.auth.getToken().access_token
	const xhr = new XMLHttpRequest()
	xhr.open('GET', 'https://www.googleapis.com/drive/v3/files/' + fileId + '?alt=media', true)
	xhr.setRequestHeader('Authorization', 'Bearer ' + accessToken)
	xhr.onload = function () {
		resolve(xhr.responseText)
	}
	xhr.onerror = reject
	xhr.send()
}
const downloadFile = promisify(downloadFileC)

// stackoverflow.com/a/35182924
const createFileTxtC = ({ name, fileId = '', data = '', method = 'POST', mimeType = 'application/json' }, callback = console.log) => {
	const boundary = '-------314159265358979323846'
	const delimiter = '\r\n--' + boundary + '\r\n'
	const closeDelim = '\r\n--' + boundary + '--'

	const metadata = {
		name,
		mimeType,
	}

	const multipartRequestBody =
        delimiter +
        'Content-Type: application/json\r\n\r\n' +
        JSON.stringify(metadata) +
        delimiter +
        'Content-Type: ' + mimeType + '\r\n\r\n' +
        data +
        closeDelim

	const request = window.gapi.client.request({
		path: '/upload/drive/v3/files/' + fileId,
		method,
		params: { uploadType: 'multipart' },
		headers: {
			'Content-Type': 'multipart/related; boundary="' + boundary + '"',
		},
		body: multipartRequestBody,
	})
	request.execute(callback)
}
const createFileTxt = promisify(createFileTxtC)

const uploadFileTxt = (fileId, tokens, body) =>
	fetch('https://www.googleapis.com/upload/drive/v3/files/' + fileId + '?uploadType=media',
		{
			headers: {
				'Content-Type': 'multipart/related; boundary=a5cb0afb-f447-48a6-b26f-328b7ebd314c',
				'Accept-Encoding': 'gzip',
				Authorization: tokens.token_type + ' ' + tokens.access_token,
				Accept: 'application/json',
			},
			method: 'PATCH',
			body,
		})

const loadGapi = name => new Promise((resolve, reject) => {
	window.gapi.load(name, { callback: resolve, onerror: reject })
})

const requestToken = (tokenClient) =>
	new Promise((resolve, reject) => {
		if (window.gapi.client.getToken()) { resolve(window.gapi.client.getToken()) } else {
			tokenClient.callback = async (resp) => {
				if (resp.error !== undefined) { reject(resp) } else { resolve(resp) }
			}
			tokenClient.requestAccessToken({ prompt: '' })
		}
	})

const initGClient = async (clientId, scope, progress = s => s) => {
	progress('gclient')
	await loadScript('gclient', 'https://accounts.google.com/gsi/client')

	progress('initTokenClient')
	const tokenClient = window.google.accounts.oauth2.initTokenClient({
		client_id: clientId,
		scope,
		callback: '',
	})

	progress('requestToken')
	return await requestToken(tokenClient)
}

const initGapi = async (apiKey, discoveryDocs, progress = s => s) => {
	progress('gapi')
	await loadScript('gapi', 'https://apis.google.com/js/api.js')

	progress('gapi.client')
	await loadGapi('client')
	if (!window.gapi.client) { throw new Error('gapi.client null') }

	progress('gapi.client.init')
	if (await ifTimeout(window.gapi.client.init({
		apiKey,
		discoveryDocs,
	}))) { throw new Error('gapi.client.init timeout') }
}

const googleClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID
const googleApiKey = process.env.REACT_APP_GOOGLE_API_KEY

const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'
const SCOPES = 'https://www.googleapis.com/auth/drive.file'

export const init = async () => {
	try {
		await initGapi(googleApiKey, [DISCOVERY_DOC])
		if (!window.gapi.client.drive) { throw new Error('gapi.client.drive null') }

		return await initGClient(googleClientId, SCOPES)
	} catch (e) {
		alert('Please refresh (pull down from top or press F5) and try again.')
		throw e
	}
}

export const save = async (name, data) => {
	const token = await init()
	const file = (await listFile({ name })).files[0]

	if (file) {
		if (!confirm('Overwrite existing ' + name + ' on Google Drive?')) return

		await uploadFileTxt(file.id, token, data)
	} else { await createFileTxt({ name, data }) }

	// confirm
	if (await load(name) !== data) {
		alert('Failed to save ' + name)
		throw new Error('save fail')
	}

	alert('Successfully saved ' + name)
}

export const load = async (name) => {
	await init()
	const file = (await listFile({ name })).files[0]
	if (file) { return await downloadFile(file) }
}
