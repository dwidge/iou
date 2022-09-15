# iou

Make invoices. Import payments from bank statement. Send statements via Watsapp. Export and backup to file or Google Drive.

# api keys

You need 2 sets of keys.

Create .env.development.local in project root:
REACT_APP_GOOGLE_CLIENT_ID=xxxxxx.apps.googleusercontent.com
REACT_APP_GOOGLE_API_KEY=xxxxxx

Add localhost:3000/* to allowed HTTP referrers in Google console.

-

Create .env.production.local in project root:
REACT_APP_GOOGLE_CLIENT_ID=xxxxxx.apps.googleusercontent.com
REACT_APP_GOOGLE_API_KEY=xxxxxx

Important: For production build keys, do not add localhost:3000/* to allowed HTTP referrers in Google console.

# license

Copyright 2022 DWJ

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
