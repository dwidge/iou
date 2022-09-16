import React from 'react'

const About = () =>
	(<>
		<h3>IoU</h3>
		<p>Make invoices. Import payments from bank statement. Send statements to clients. Import, export and backup.</p>
		<p><a href="//github.com/dwidge/iou" className="link-primary">Source on Github</a></p>
		<p><a href="/iou/privacy" className="link-primary">Privacy Policy</a></p>
		<p><a href="/iou/terms" className="link-primary">Terms of Service</a></p>
		<pre style={{ whiteSpace: 'pre-wrap' }}>{`
Copyright 2022 DWJ

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
`.trim()}</pre>
		<h4>3rd party</h4>
		<p>Google Drive is a trademark of Google Inc. Use of this trademark is subject to Google Permissions.</p>
		<p>Compatible with WhatsApp. Not endorsed or affiliated with WhatsApp.</p>
	</>)

export default About
