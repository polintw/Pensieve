# State Map

<table>
<tr>
<th rowspan="4">EditingModal
<td rowspan="4">focusBlock: string<br>contentModalify: bool<br>coverSrc: base64<br>beneathSrc:base64<br>coverMarks:{list: [ ], data: {top,<br>left,<br>editorContent,<br>serial,<br>layer,<br>}}<br>beneathMarks:{list: [ ], data: { }}<br>nouns:{list: [ ], basic: {<br>:nounId:{<br>name:"",id:"",ify: bool<br>}<br>}}<br>refsArr:[]
<th>ContentModal<td>marksList: []<br>markCircles: {:markId:{}}<br>markEditorContent: {:markId: editorContent}<br>markExpand: int<br>markExpandify: bool<br>imgWidth:""<br>imgHeight:""
</tr>
<tr><th>MarksArticle<td>coverMarks: coverMarks <br>beneathMarks: beneathMarks<br>
<tr><th>EditingInfoSide<td><br><th>NounsEditor<td>nounsList:[]<br>nounsBasic:{}<th>SearchModalNouns<td>query:""<br>options:[<br>:{<br>name:"",<br>id:""<br>}]
<tr><th>ImgBlock<td>imgSrc: coverSrc<>beneathSrc
</table>
