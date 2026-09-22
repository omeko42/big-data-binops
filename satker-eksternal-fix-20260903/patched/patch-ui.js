'use strict';
const fs=require('fs');let s=fs.readFileSync(process.argv[2],'utf8');
function replace(a,b){if(s.split(a).length!==2)throw new Error('Expected unique UI target: '+a.slice(0,90));s=s.replace(a,b);}
replace('[N,T]=(0,a.useState)("")','[N,T]=(0,a.useState)(""),[extQuery,extSetQuery]=(0,a.useState)(""),[extPage,extSetPage]=(0,a.useState)(1),[extRows,extSetRows]=(0,a.useState)(25),[extTotal,extSetTotal]=(0,a.useState)(0),extRequest=(0,a.useRef)(0)');
replace('et=(0,a.useCallback)(async()=>{B(!0);try{let e=await w.apiAuth.get("/bdb/satker-eksternal",{params:N?{search:N}:{}});P(e.data?.data||[])}catch{P([])}finally{B(!1)}},[N]);',
'et=(0,a.useCallback)(async()=>{let req=++extRequest.current;B(!0);try{let response=await w.apiAuth.get("/bdb/satker-eksternal",{params:{search:extQuery||undefined,page:extPage,row:extRows}});if(req!==extRequest.current)return;let body=response.data,total=Number(body?.total||0),last=Math.max(1,Math.ceil(total/extRows));extSetTotal(total);if(extPage>last){extSetPage(last);return}P(body?.data||[])}catch(error){if(req!==extRequest.current)return;P([]);extSetTotal(0);e.current?.show({severity:"error",summary:"Gagal",detail:"Data satker eksternal gagal dimuat. Silakan coba lagi."})}finally{if(req===extRequest.current)B(!1)}},[extQuery,extPage,extRows]);function extSubmit(){let query=N.trim();if(extQuery===query&&extPage===1){et();return}++extRequest.current;extSetQuery(query);extSetPage(1)}');
replace('(0,a.useEffect)(()=>{et()},[et]);','(0,a.useEffect)(()=>{et();return()=>{++extRequest.current}},[et]);');
replace('onKeyDown:e=>"Enter"===e.key&&et()','onKeyDown:e=>{if("Enter"===e.key){e.preventDefault();extSubmit()}}');
replace('label:"Cari",icon:"pi pi-search",onClick:et','label:"Cari",icon:"pi pi-search",onClick:extSubmit');
replace('value:O,loading:M,size:"small",stripedRows:!0','value:O,loading:M,size:"small",stripedRows:!0,dataKey:"id",lazy:!0,paginator:!0,first:(extPage-1)*extRows,rows:extRows,totalRecords:extTotal,rowsPerPageOptions:[25,50,100],onPage:event=>{++extRequest.current;extSetPage(event.rows!==extRows?1:event.page+1);extSetRows(event.rows)},paginatorTemplate:"FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown CurrentPageReport",currentPageReportTemplate:"{first}–{last} dari {totalRecords}"');
replace('header:"No",body:(e,t)=>t.rowIndex+1','header:"No",body:e=>(extPage-1)*extRows+O.indexOf(e)+1');
fs.writeFileSync(process.argv[3],s);console.log('EXTERNAL_UI_PAGINATION_SEARCH=1');

