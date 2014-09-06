/*Authored by Guindy Labs*/
console.log("Injection");
var nodes;
var prevWord=".", nextWord=" ";
var starting = true;
var focused;
var wordsArr;
var localData;
var isDropdownShown = false;
var injected = injected || (function () {

    var methods = {};
    methods.getBgColor = function () {

        (function ($) {
            $(document).on('click', function () {
                console.log('setting up jquery textcomplete');
                focused = $(':focus');
                var textBox = '.uiTextareaAutogrow _552m';
                var div=document.getElementsByClassName('_552h')[0];
                var autoText=document.createElement('textarea');
                autoText.id="autocomplete";
                autoText.cols="80";
                autoText.rows="40";
                if(div!=='undefined')
                {
                	div.appendChild(autoText);
                }
                if (focused.prop("tagName") == 'TEXTAREA' && focused.prop("className") == textBox.substring(1)) {
                    //leave some room at the bottom of the chatbox so that the dropdown is visible
                    document.getElementsByClassName("fbNubFlyout fbDockChatTabFlyout")[0].style.bottom = '700%';
                    document.getElementsByClassName("_552h")[0].style.maxHeight = '180px';
                    document.getElementsByClassName("_552h")[0].style.height = '250px';
                    document.getElementsByClassName("_552h")[0].style.overflow = 'hidden';
                    focused.textcomplete([{
                        match: /\b(\w{1,})$/,
                        search: function (term, callback) {
                            console.log("searching for " + (term===undefined?'space':term));
                            console.log("term's length : "+(term===undefined?0:term.length));
                            
                            wordsArr = searchHelper(term,prevWord || ".");
                            console.log("WordsArr[0]:"+wordsArr[0]);
                            grey_word=wordsArr[0];
                            $('#autocomplete').val('');
                            if(wordsArr.length && term.length>=1){	
                               $('#autocomplete').val(focused.val()+grey_word.substr(term.length,wordsArr[0].length));
                           }
                            //for every keyup event, the algo is queried for a possible list of words from the wordTree
                            callback($.map(wordsArr, function (word) {
                        	isDropdownShown = true;
                                return word.indexOf(term) === 0 ? word : null;
                            }));
                        },
                        index: 1,
                        replace: function (word) {
                            return word + ' ';
                        }
                    }]).on({
                        'textComplete:select': function (e, enteredWord) {
                            isDropdownShown = false;
                            console.log("You choose : " + enteredWord);
                            addWordPair($.trim(enteredWord));

                            //                            TODO: searchWords
                            console.log("Next possible words for " + enteredWord + ": " + searchWord(enteredWord.toUpperCase()));
                        },
                        'textComplete:show': function (e) {
                            // 		TODO :				Show hint of the first word in the dropdown list.
                            $(this).data('autocompleting', true);
                        },
                        'textComplete:hide': function (e) {
                            $(this).data('autocompleting', false);
                        }
                    });
                    
                    function syncMainAndShadowTextBox() {
                	if(!isDropdownShown) {
                	    $("#autocomplete").val(focused.val());
                	}
                	if(focused.val().length===0){
                	    $("#autocomplete").val("");
                	}
                    }
                    
                    //periodically syncMainAndShadowTextBox
                    setInterval(syncMainAndShadowTextBox,100);
                    
                    var prevKeyCode = -1;
                    // Manually detecting "spaces"
                    //if there is a space entered that means that the user has manually entered a "new" word and the machine should learn it.
                    focused.on('keyup', function (e) {
                	
                       console.log(e.keyCode);
                       if (e.keyCode === 32) {
                        console.log("looks like you dint find a word in the text predictor");
                        var text = focused.val();
                        var latestWord = text.substring(0, text.lastIndexOf(' '));
                        latestWord = latestWord.indexOf(' ') != -1 ? latestWord.substring(latestWord.lastIndexOf(' ')+1, latestWord.length) : latestWord;
                        console.log("New word learnt : " + latestWord);
                        insert($.trim(latestWord));
                        addWordPair($.trim(latestWord));
                            //list the next possible words
                            //                            TODO: searchWords
                            console.log("Next possible words for " + latestWord + ": "+ searchWord(latestWord.toUpperCase()));
                            $('#autocomplete').val('');
                       }
                       //ENTER
                       if(e.keyCode === 13) {
                	   console.log("statement submitted to facebook..");
                	   if(focused.val().length>=1){
                	       focused.val("");
                	   }
                	   $("#autocomplete").val("");
                       }
                       /*
                       //BACKSPACE
                       if(prevKeyCode !== 17 && e.keyCode === 8) {
                	   console.log("backspace pressed..");
                	   var val = $("#autocomplete").val();
                	   $("#autocomplete").val(val.substring(0,val.length-2));
                       }
                       //CTRL + BACKSPACE
                       if(prevKeyCode === 17 && e.keyCode ===8) {
                	   console.log("CTRL + BACKSPACE pressed");
                	   var val = $("#autocomplete").val();
                	   $("#autocomplete").val(val.substring(0,val.lastIndexOf(" ")));
                       }
                       
                       prevKeyCode = e.keyCode;
                       */
                    });

                    // this updates the frequency of wordpairs.


                    function addWordPair(enteredWord) {
                        if (starting == true) {
                            starting = false;
                            prevWord = ".";
                            updateWordMap(prevWord, enteredWord);
                            prevWord = enteredWord;
                        } else {
                            if(prevWord!==enteredWord){
                               console.log("Putting :" + prevWord + "-" + enteredWord);
                               updateWordMap(prevWord, enteredWord);
                               prevWord = enteredWord;
                           }
                       }
                        //manually keyup
                        /*var e = $.Event('keyup');
                        e.keyCode = 65; // Character 'A'
                        focused.trigger(e);
                        e.keyCode = 66;
                        focused.trigger(e);*/
                    }
                    
                    function searchHelper(term,prevWord){
                        
                        if (term!==null && term!==undefined && term.length!=0){
                           console.log("searching for : "+term);
                           return (predictorSearchRedefined(prevWord,term));
                       }                	
                   }
               }

           });

})(window.jQuery);
};

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    var data = {};
    if (methods.hasOwnProperty(request.method)) {
        data = methods[request.method]();

    }

    sendResponse({
        data: data
    });
    return true;
});

})();

 


