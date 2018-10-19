function getCaretPosition(editableDiv) {
    var caretPos = 0,
        sel, range;
    if (window.getSelection) {
        sel = window.getSelection();
        if (sel.rangeCount) {
            range = sel.getRangeAt(0);
            if (range.commonAncestorContainer.parentNode == editableDiv) {
                caretPos = range.endOffset;
            }
        }
    } else if (document.selection && document.selection.createRange) {
        range = document.selection.createRange();
        if (range.parentElement() == editableDiv) {
            var tempEl = document.createElement("span");
            editableDiv.insertBefore(tempEl, editableDiv.firstChild);
            var tempRange = range.duplicate();
            tempRange.moveToElementText(tempEl);
            tempRange.setEndPoint("EndToEnd", range);
            caretPos = tempRange.text.length;
        }
    }
    return caretPos;
}
function setCaret(childNode,caretPos) {
    var range = document.createRange();
    var sel = window.getSelection();

    console.log(childNode);

    range.setStart(childNode, caretPos);
    range.collapse(true);
    sel.removeAllRanges();
    sel.addRange(range);
}


$(document).ready(function(){
    var bgnSmJS = {
    	jsList:{}
    }
    var totalCount = $('code').length;
    $('code').each(function(i,elem) {
    	var elem = $(elem);
    	var of = elem.attr('of');
    	elem.load("./js/listofcodes/"+of+".js",function(response,status) {
    		bgnSmJS.jsList[of] = new Function("return ("+response+")")();
    		if(totalCount === i+1){
				hljs.configure({
					tabReplace:'    '
				});
				hljs.initHighlighting();
    		}
    	});
    });



    $('code').on('keypress',function(event) {
    	console.log(event.which);
    	if (event.which === 13) {
			// insert 2 br tags (if only one br tag is inserted the cursor won't go to the next line)
			document.execCommand('insertHTML', false, '\r    <replacecode></replacecode>');
			// prevent the default behaviour of return key pressed
			return false;
		}
    	if(event.which == 32){
    		/*var target = $(event.target);
    		var newCode = target.text();

    		target.empty();
    		target.html(newCode);
    		setTimeout(function() {

				hljs.highlightBlock(event.target);
    		}, 100);*/
    		// var newElem = document.createElement('code');
    		// newElem.innerHtml = $(event.target).
    		var caretPosition = getCaretPosition(this);
    		var self = this;


    		setTimeout(function() {
				hljs.highlightBlock(event.target);
				setTimeout(function() {



		    		var childNodesArray = self.childNodes;

		    		var childNodesNames = [];
		    		self.childNodes.forEach(function(item) {
		    			childNodesNames.push(item.nodeName.toLowerCase()||item.localName);
		    		});

		    		var index = childNodesNames.indexOf('replacecode');
		    		console.dir(self.childNodes[index-2]);
		    		self.childNodes[index-2].innerHtml = self.childNodes[index-2].innerHtml + " ";

		    		console.log(caretPosition);


    				setCaret(self.childNodes[index-2].childNodes[0],caretPosition - 6);




				}, 10);





    		}, 10);


    	}
    })
});