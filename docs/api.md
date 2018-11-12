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




  * /user
    * /cognition/lookout
    * /cognition/dialogues
    * /cover/appearpath
      * ? id

|router|main|minor|query|method|resJSON|
|-----|-----|
|units/:id|/|||GET<br>PATCH||PATCH: check 原作者 ify|
|units/:id|/basic|||GET|<ul><li>unitBasic</li><li>authorBasic</li>|
|units/:id|/responses|||GET|<ul><li>unitsList</li><li>unitsBasic</li><li>marksBasic</li><li>authorsBasic</li>|
|units/:id|/track|||GET<br>POST<br>PATCH||
|units/:id|/broad|||GET<br>POST||
|units/:id|/marks/:markId|/dialogues||GET<br>POST||*<-*`/unit/general/dialogue`<br> *<-* `/action/dialogue`|
|units/:id|/marks/:markId|/inspired||POST<br>DELETE||<br>*<-*`/action/inspired`|
