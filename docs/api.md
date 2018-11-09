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
|actions|/threads/:sharedId/dialogue||markId participantId|GET<br>POST||

 `/unit/general/dialogue`

  * /user
    * /cognition/lookout
    * /cognition/inspired
    * /cognition/dialogues
    * /cover/appearpath
      * ? id
    * /action/inspired
    * /action/dialogue

|router|main|minor|method|resJSON|
|-----|-----|
|units/:id|/||GET||
|units/:id|/basic||GET|<ul><li>unitBasic</li><li>authorBasic</li>|
|units/:id|/responses||GET|<ul><li>unitsList</li><li>unitsBasic</li><li>marksBasic</li><li>authorsBasic</li>|
