//console.log('Loaded!');
var myHTMLButton=document.getElementById("myButton");
myHTMLButton.onClick=function(){

//alert("1");

var request=new XMLHttpRequest();
request.onreadystatechange=function(){
	if(request.readyState===XMLHttpRequest.DONE){
		if(request.status===200){
			var currentCounter=request.responseText;
			var spanTagValue=document.getElementById(spanCount);
			spanTagValue.innerHTML=counter.toString();
		}
	}
};

//Now Make the request
request.open('GET','/counter');


};
