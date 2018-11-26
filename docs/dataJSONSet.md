# DB Object Set
|Type | object |composition|
|---  | ---    |
|__sendingData__|{<br>...<br> temp: {}<br>}|
|__tempData__|{<br>...<br> temp: {}<br>}|
|__unitsList__|[&nbsp;:&nbsp;unitId&nbsp;]|
|__unitsBasic__|{<br>&nbsp;:&nbsp;unitId&nbsp;:{<br>unitsId,<br>marksListt: [],<br>                     authorId,<br>pic_layer0,<br>created<br>}}|
|__unitBasic__|{<br>unitId,<br>authorId,<br>pic_layer0,<br>created,<br>nouns: {<br>list: [], basic: {<br>:nounId{<br>id, name}<br>}<br>}<br>}|
|__marksBasic__|{<br>&nbsp;:&nbsp;markId&nbsp;:{<br>editorContent: JSON.parse(),<br>layer<br>}}|
|__marksSet__|{<br>&nbsp;:&nbsp;markId&nbsp;:{<br>id, <br>editorContent: JSON.parse(),<br>layer,<br>markCoordinate: {top, left},<br>serial<br>}|
|__authorsBasic__ <- __usersBasic__|{<br>&nbsp;:&nbsp;userId&nbsp;:{<br>authorAccount,<br>id<br>}}|
|__authorBasic__|{<br>&nbsp;account,<br>&nbsp;id<br>}|
|__userInfo__|{<br>&nbsp;account,<br>&nbsp;id<br>}|
|__threadsLists__|{<br>:markId&nbsp;:[<br>:threadsId(By Oreder)<br>&nbsp; ]<br>}|
|__threadsBasic__|{<br>:threadId&nbsp;:{<br>                      editorContent(latest),<br>participant,<br>lastTime,<br>lastTalker<br>&nbsp; }<br>}|
