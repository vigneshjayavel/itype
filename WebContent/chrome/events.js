/*Authored by Guindy Labs*/
var resp;

function injectedMethod(tab, method, callback) {
    chrome.tabs.insertCSS(tab.id, {
        file: "css/textcomplete/bootstrap.css"
    }, function () {
        console.log("added 1");
        chrome.tabs.insertCSS(tab.id, {
            file: "css/textcomplete/main.css"
        }, function () {
            console.log("added 2");
            chrome.tabs.executeScript(tab.id, {
                file: 'libs/jquery.js'
            }, function () {
                console.log("added 3");
                chrome.tabs.executeScript(tab.id, {
                    file: 'libs/jquery.textcomplete.js'
                }, function () {
                    console.log("added 4");
                    chrome.tabs.executeScript(tab.id, {
                        file: 'libs/predict.js'
                    }, function () {
                        console.log("added 5");
                        chrome.tabs.executeScript(tab.id, {
                            file: 'inject.js'
                        }, function () {
                            console.log("added 6");
                            chrome.tabs.sendMessage(tab.id, {
                                method: method
                            });
                        });
                    });
                });
            });
        });
    });
}

function getBg(tab) {
    //This should run only once
    //Help appreciated
    injectedMethod(tab, 'getBgColor', function (response) {
        return true;
    });
}

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    if (changeInfo.status === 'complete' && tab.active) {
        tablink=tab.url;
            chrome.storage.local.get("status",function(dbData){
                console.log(dbData.status);
                //DB check

                if(dbData.status==="true" || dbData.status===undefined){
                        if(tablink.substr(0,20).search("facebook")>=0 || tablink.search("fbpage.html")>=0){
                        chrome.pageAction.setIcon({
                            tabId:tab.id,
                            path:'images/icon.png'
                        });
                        getBg(tab);
                        chrome.pageAction.show(tab.id);            
                        console.log("enabled");
                    }
                    
                                       
                }
                
                else{
                    chrome.pageAction.show(tab.id);
                    console.log("Not enabled");
                }
            });
       
                
            //End of db status check
        }
    });



    
