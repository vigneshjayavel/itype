var messages = "";
var count = 0;
require(
	[ "events.js", "libs/jquery.js" ],
	function(util) {
	    console.log("loaded required scripts for app.html");
	    $("#fetchFb").on("click", function() {
		console.log("reading fb messages..");
		fetchFb();
	    });
	    $("#loginFb").on("click", function() {
		console.log("loginFb");
		loginFb();
	    });
	    
	    $("#flushLocalStorage").on("click",function(){
		flushLocalStorage();
	    });
	    //Start of user disabling option
	    $('#wish_yes').click(function(){
	    	var wish=document.getElementById("wish_yes").value;
	    	app_status={"status":JSON.stringify(true)};
			console.log(app_status);
			chrome.storage.local.set(app_status,function(){
			console.log("set to enabled");
			chrome.tabs.getSelected(null,function(tab){
			var code="window.location.reload();";
			chrome.tabs.executeScript(tab.id,{code:code});
			});
			
			});
	    	console.log("Wish is" + wish);
	    	
	    });
	    $('#wish_no').click(function(){
	    	var wish=document.getElementById("wish_no").value;
	    	app_status={"status":JSON.stringify(false)};
			console.log(app_status);
			chrome.storage.local.set(app_status,function(){
			console.log("set to disabled");
			chrome.tabs.getSelected(null,function(tab){
			var code="window.location.reload();";
			console.log(tab.url);
			chrome.tabs.executeScript(tab.id,{code:code});
			//chrome.tabs.executeScript(tab.id,{code:code});
			});
			});
	    	console.log("Wish is" + wish);
	    	
	    });
	    //End of user disabling option
	    function flushLocalStorage(){
		chrome.storage.local.remove("trainingTree",function(){
		    console.log("flushed trainingTree");
		    chrome.storage.local.remove("dictionaryTree",function(){
			console.log("flushed dictionaryTree");
			chrome.storage.local.remove("wordMap",function(){
			    console.log("flushed wordMap");
			    alert("LocalStorage cleared!..");
			});
		    });
		});
	    }

	    var appId = "651377341552809";
	    var token;
	    function loginFb() {
		var oauthUrl = "https://www.facebook.com/dialog/oauth?client_id="
			+ appId
			+ "&redirect_uri=http://54.255.136.160/contacts&scope=read_mailbox&response_type=token";
		chrome.tabs.create({
		    'url' : oauthUrl
		}, null);
	    }

	    function processAccess() {
		$.getJSON(apiUrl + "/me", {
		    access_token : token
		}, function(response) {
		    you = response.id;
		}).done(function(){ testFb2();});

	    }
	    
	    function updateFbMessagesLocalStorage() {
		 // get fbmessages from localstorage
		    chrome.storage.local.get("fbMessages",function(data){
				
			    console.log("fbMessages present in db : "+(data!==undefined));
			    var j = {"fbMessages":messages};
			    chrome.storage.local.set(j,function(){
				console.log("stored fbMessages string..");
			    });

		    });
	    }
	    
	    function testFb2(){
		count++;
		console.log("inside testFb2.. Count : "+count);
		var ajaxUrl = arguments[0]!==undefined?arguments[0]:apiUrl+"/me/inbox";
		$.getJSON(ajaxUrl , {
		    access_token : token
		}, function(response) {
		    console.log((response));
		    if (response.error !== undefined) {
			console.log("error!!" + response.error);
			return;
		    } 
		    else{
			for (var i = 0; response.data !== undefined
				&& i < response.data.length; i++) {
			    var datai = response.data[i];
			    var commentsi = response.data[i].comments;
			    for (var j = 0; commentsi !== undefined
				    && j < commentsi.data.length; j++) {
				var dataj = commentsi.data[j];
				messages += ". " + dataj.message;
			    }
			    if(commentsi!==undefined && commentsi.paging!==undefined && commentsi.paging.next!==undefined && commentsi.paging.next!=""){
				console.log(commentsi.paging.next + " is the next api call");
				testFb2Inner(commentsi.paging.next);
			    } 
			}
			console.log(messages);
		    }

		})
		.done(function(response){
		    console.log("getAjax done..");
		    updateFbMessagesLocalStorage();
		    if(response.paging!==undefined && response.paging.next!==undefined && response.paging.next!==""){
			console.log("Paging is valid : "+response.paging.next);
			testFb2(response.paging.next);
		    } else {
			console.log("Paging is invalid : "+response.paging);
			return;
		    }
		})
		.error(function() {
		    console.log( "$.getJSON failed in testFb2, api call count : "+count);
		});
	    }
	    
	    function testFb2Inner(u){
		count ++ ;
		console.log("inside testFb2Inner.. Count : "+count);
		$.getJSON(u , {
		    access_token : token
		}, function(response) {
		    console.log((response));
		    if (response.error !== undefined) {
			console.log("error!!" + response.error);
			return;
		    } 
		    else{
			for (var i = 0; response.data !== undefined
				&& i < response.data.length; i++) {
			    var datai = response.data[i];
			    messages += ". " + datai.message;
			}
			console.log(messages);
		    }
		})
		.done(function(response) {
		    return;
		})
		.error(function() {
		    console.log( "$.getJSON failed in testFb2Inner!, api call count : "+count);
		});
	    }
	    
	   
	   
	    chrome.tabs.onUpdated.addListener(function() {
		var lis = this;
		chrome.tabs.getSelected(null, function(tab) {
		    if (tab.url.search("http://54.255.136.160/contacts") >= 0) {
			// var token =
			// tab.url.match(/[\\?&#]access_token=([^&#])*/i);
			token = tab.url.substring(tab.url.indexOf("=") + 1,
				tab.url.indexOf("&"));
			console.log("gen AccessToken:" + token);
			// chrome.tabs.onUpdated.removeListener(lis);
//			chrome.tabs.remove(tab.id,function(){console.log("fb success page closed..");});
			processAccess(token);
		    }
		});
	    });

	    var apiUrl = "https://graph.facebook.com";
	    
	    var you;
	
	});
