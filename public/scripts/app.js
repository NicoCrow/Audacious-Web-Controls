// const el = (x) => document.getElementById(x);

// const prev  = el("prev");
// const play  = el("play");
// const pause = el("pause");
// const stop  = el("stop");
// const next  = el("next");

const el = (x) => document.getElementsByTagName(x);
let controls = el("button")
for(let i = 0; i < controls.length; i++){
	controls[i].addEventListener("click", (ev)=>{
		console.log(ev.target.id);

		// create request with this id;
		httpGetAsync(ev.target.id, (cb)=>{console.log(cb)});
	});
}



function httpGetAsync(theUrl, callback){
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.onreadystatechange = function(){
		if (xmlHttp.readyState == 4 && xmlHttp.status == 200){
			callback(xmlHttp.responseText);
		}
	}
	xmlHttp.open("GET", theUrl, true); // true for asynchronous 
	xmlHttp.send(null);
};