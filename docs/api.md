# api

/router
  * /img/:user/:file
  * /login
  * /register
  * /status
  * /lists/nouns/search
    * GET
    * POST
      * ? prefix
      * ? limit
  * /cosmic
    * /compound/index
    * /pick/user/appearpath
      * ? id
    * /pick/user/overview
      * ? id
    * /pick/noun/regular
      * ? id

|router|main|minor|query|method|resJSON|
|---|---|---|
|actions|/shareds|||GET<br>POST|| *<-*  `/cognition/shared`<br> *<-* `/:id/shareds?primer=:id`
|actions|/threads/:sharedId|||GET|<ul><li>        marksSet</li><li>threadsBasic</li><li>threadsLists</li><li>authorsBasic</li></ul>|
|actions|/threads/:sharedId|/dialogue|:threadId|GET<br>POST||different from dialogue from viewer|
|embedded|/inspireds|||GET<br>DELETE||*<-*  `/cognition/inspired`
|embedded|/broads|||GET<br>PATCH|<ul><li>              unitsList</li><li>unitsBasic</li><li>marksBasic</li><li>authorsBasic</li></ul>|
|collaterals|/tracks|||GET|<ul><li>              unitsList</li><li>unitsBasic</li><li>authorsBasic</li></ul>|

<table>
<tr><th>router<th>main<th>minor<th>query<th>method<th>reqJSON<th>resJSON</tr>
<tr><th colspan="7">user</tr>
<tr><td rowspan="2">profile<td>/sheet<td><td><td>GET<td><td><ul><li>sheetSet</tr>
<tr><td>/sheet<td><td><td>PATCH<td><td><td>check user本人 ify</tr>
<tr><th colspan="7">account</tr>
<tr><td rowspan="3">account<td>/sheet<td><td><td>GET<td><td><ul><li>accountSet/!name<td>did not be used in light version</tr>
<tr><td>/setting<td><td><td>GET<td><td><ul><li>accountSet</tr>
<tr><td>/setting<td><td><td>PATCH<td><td></tr>
</table>


  * /user
    * /cognition/lookout
    * /cognition/dialogues
    * /cover/appearpath
      * ? id

|router|main|minor|query|method|reqJSON|resJSON|
|-----|-----|
|units/:id|/basic|||GET||<ul><li>unitBasic</li><li>authorBasic</li>|
|units/:id|/responses|||GET||<ul><li>unitsList</li><li>unitsBasic</li><li>marksBasic</li><li>authorsBasic</li>|
|units/:id|/track|||GET<br>POST<br>PATCH|||
|units/:id|/broad|||GET<br>POST|||
|units/:id|/marks/:markId|/dialogues||GET<br>POST|||*<-*`/unit/general/dialogue`<br> *<-* `/action/dialogue`|
|units/:id|/marks/:markId|/inspired||POST<br>DELETE|||<br>*<-*`/action/inspired`|

<table>
<tr><th>router<th>main<th>minor<th>query<th>method<th>reqJSON<th>resJSON</tr>
<tr><td rowspan="2">units/:id<td>/<td><td><td>GET<td></tr>
<tr><td>/<td><td><td>PATCH<td><ul><li>joinedMarksList:[]<li>joinedMarks:{}<li>refsArr:[]<li>nouns:{list:[], basic:{}}<li>submitTime: num</ul><td><td>check 原作者 ify</tr>
</table>
