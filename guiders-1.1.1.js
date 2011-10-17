/**
 * guider.js
 *
 * Developed at Optimizely. (www.optimizely.com)
 * We make A/B testing you'll actually use.
 *
 * Released under the Apache License 2.0.
 * www.apache.org/licenses/LICENSE-2.0.html
 *
 * Questions about Guiders or Optimizely?
 * Email us at jeff+pickhardt@optimizely.com or hello@optimizely.com.
 * 
 * Enjoy!
 */
 
 /* Functionality added:
 *  if the position for an attachedTo = -1, then the popup
 * is positioned at the bottom with no arrows, and
 * the document element of the attachedTo is highlighted
 * with a red border (adjustable via the globals immediately following).
 * Also: Pressing the space bar presses the Next button.
 *
 * Thank you, Optimizely! (Optimizely obviously is not responsible
 * for the errors and ugliness I'm introducing 
 * - David Weinberger
 *   self@evident.com
 *   July 28, 2011
 *
 *  Added Back buttons -dw, August 5, 2011
 *
 *  Added Audio tour - dw August 26, 2011
 *   Add an "audio" paramater to your guiders that points at an
 *   audio file and it should play.
 *
 */
 
 
 //---------------- dw additions ----------------
 
 // globals. Yes, globals. I'm an amateur.

 // how to highlight an item?
 var highlightBorderString = "#0099ff 2px solid"; //  Color the border of highlighted item
 var highlightBackgroundString = "#F3FF91"; // put in a colored background for highlighted item
 
 var nextButtonPressed=false;
 var prevEl=null;
 var prevBorder=null;
 var prevColor=null;
 var paused = false;
 var pausedGuider = null;
 var pauseButtonClicked = false;
 var previousGuiderId = null;
 // use a cookie so that if you go to a new page, the guider automatically shows up
 var globalRunDemo = true; // set true if you want to ignore the cookie and always run the demo
 var globalPlay = false; // automatically play audio commentary?
 var stopAudioLabel = "Stop Audio Tour";
 var playAudioLabel = "Start Audio Tour";
 var showAudioControl = false;
 
 function scrollToElement(elll){
 
  var top = elll.offsetTop;
            $('html,body').animate({scrollTop: top}, 1000);
         }

function guiderGetCookie()
   // check cookie to see if we should show anything at all
   {
   var i,x,y,ARRcookies=document.cookie.split(";");
	globalPlay = false; // default to off
   for (i=0;i<ARRcookies.length;i++)
   {
	 x=ARRcookies[i].substr(0,ARRcookies[i].indexOf("="));
	 y=ARRcookies[i].substr(ARRcookies[i].indexOf("=")+1);
	 x=x.replace(/^\s+|\s+$/g,""); // trim whitespace
	 if (x=="doDemo")
	   {
	   if (y=="GUIDER_AUDIO_ON") {
		  globalPlay = true;
		  //alert("x=" + x + " y=" + y);
	   }
	   }
	 }
  
}

guiderGetCookie(); // wow, this has to be pretty ugly

function guiderSetCookie(which){
		  var cookieValue;
		  if (which) {
			cookieValue = "GUIDER_AUDIO_ON";
		  }
		  else {
			cookieValue = "GUIDER_AUDIO_OFF";
		 }
		 var today = new Date();
		 var expire = new Date();
		  nDays=1;
		 expire.setTime(today.getTime() + 3600000*24*nDays);
		 document.cookie = "doDemo" +"="+escape(cookieValue)
						 + ";expires="+expire.toGMTString();
}

 
 // Highlight the element (dw)
function highlightElement(el){
  // Draw highlight around selected element and/or add colored background,
  // and restore previous element's original border
  // el = #id
  
  // get the dom object
  if ((el !== "") && (el !== null) && (el !== "undefined")) {
    el = el.substring(1); // get rid of the #
    var ell = document.getElementById(el);
   }
   
   // get rid of the old border, if any
   if (prevEl !==null) {
         if (prevBorder !== null) {
            prevEl.style.border = prevBorder;		// set border of previous element to its previous border
        }
        else {
        	prevEl.style.borderWidth="0px";			// if previous element had none, set it to none 
        }
        if (prevColor !== null) {
            prevEl.style.backgroundColor = prevColor;		// set border of previous element to its previous border
        }
        else {
        	prevEl.style.backgroundColor=null;;			// if previous element had none, set it to none 
        }
    }
    
    // If there's an element that needs highlighting...
   
    if (typeof ell !== "undefined" && ell !== null) { // not a null element
    	var currentBorder = ell.style.border; 		  // capture current el's border
    	var currentColor = ell.style.backgroundColor;
    	ell.style.border= highlightBorderString; 	  // draw the new highlight border
    	ell.style.backgroundColor=highlightBackgroundString; 
    	scrollToElement(ell);						  // scroll to it						  
   		prevEl = ell;								  // preserve this element, now as previous element
    	prevBorder = currentBorder;					  // and it's little dog, too.
    	prevColor = currentColor;
    }
 }  
 
 
function pause(mg){
 // Pause it by lowering the bottom-hugging guider and displaying a translucent banner
 // at the top.
 // NOTE: This requires adding the pause banner as a hidden div in the page
 // Unpause by clicking on the banner, or by typing a space
    if (mg.position !== -1) {return}; // exit if not in bottom hugging mode
    var myHeight = mg.elem.innerHeight();
	var lowtop=window.innerHeight - 20;
    paused = true; 		// global
    pausedGuider = mg; // capture guider itself as global
    var pid = pausedGuider.id;
    $("#" + pid).hide("slow");
    pauseButtonClicked = true;
    // show the restore overlay
    var pauseoverlay =     document.getElementById("overlayPauseGlider");
    if ((pauseoverlay !== null) && (pauseoverlay !== undefined)){
    	//pauseoverlay.style.display="block";
    	$("#overlayPauseGlider").show("slow");
    	}
    	else { // if there is no overlay banner
           alert("You've paused the demo tour.\n\nTo resume the demo tour, press the Space bar.\n\nIn case of emergency, reload the page, which will take you back to the first demo note on this page.\n\nClick the 'Ok' button on this popup to begin interacting with ShelfLife. ");
    }
}

function unhideMe(){
 // restore guider
 
  // is the guider visible?
  if (pausedGuider != null){
    var pid = pausedGuider.id;
  }
  var pguider = document.getElementById(pid);
  if (pguider.style.display !== "none") {
      paused = true; // set the global
      return
    }
    
    // if it is invisible, then show it
    $("#" + pid).show("slow");
     
   // hide the overlay
   var pauseoverlay =     document.getElementById("overlayPauseGlider");
    if ((pauseoverlay !== null) && (pauseoverlay !== undefined)) {
       $("#overlayPauseGlider").hide("slow");
    }
  pausedGuider = null; // reset the damn globals
  paused = false;
  // make sure it doesn't repeat the audio
  playTheAudio(pid, "SILENCE");

}

function getButtonFromId(gid,txt){
   // give it the guider's id and the text on the buttonCustomHTML
   var children = document.getElementById(gid).getElementsByTagName("*");
   
  		for (i=0; i < children.length; i++) {
  		  // get text for each child
  		  ctxt = children[i].text;
  		  if (ctxt == txt){
  		    var btn = children[i];
  		    }
  		}
  		
  return btn;
}

function stopTheAudio(curid){
    var curguide = document.getElementById(curid);
   var children = curguide.getElementsByTagName("*");
       for (i=0; i < children.length; i++) {
       	if (children[i].id == "audiodiv"){
       	    var par = children[i].parentNode;
       	    par.removeChild(children[i]);
       	}
       	}
}

function playTheAudio(id, source){
		// get the audio button within this guider
		
  		var myguide = document.getElementById(id);
  		var btn = getButtonFromId(id,playAudioLabel);
  		if (btn == null) {
  		  btn = getButtonFromId(id,stopAudioLabel);
  		  }
  		  
  		  if (btn == null) {return} // if no audio button, then skeedaddle
  		    	
        // did we click on a stop playing button?
       if (btn.text == stopAudioLabel){
           globalPlay = false;
           btn.innerHTML = playAudioLabel;
           }
        else {
          globalPlay = true;
           btn.innerHTML = stopAudioLabel;
        
        }
        
         // set a cookie so the next page will know what to document
       	 guiderSetCookie(globalPlay);
       	  
           
       // if there's already a div playing, get rid of it
       stopTheAudio(id);
       	
       	if (source == "SILENCE") { 
       	return
       	}
       	
       	var guiderSpot = null
       if ((globalPlay) && (source != "SILENCE")) {
		 // create a div that will play it
		 
		 // find the description paragraph to append the play statement to
		 children = myguide.getElementsByTagName("p");
		 for (i=0; i < children.length; i++){
		 	if (children[i].className == "guider_description"){
		 	guiderSpot = children[i];
		 	}
		 }
		  
		  if (guiderSpot != null){
		  
		    audiodiv = document.createElement("div");	 
		 	audiodiv.setAttribute("id","audiodiv");
		 	
		 	var audiostring = '-+[Playing]+-' + '<embed type="application/x-shockwave-flash" flashvars="playerMode=embedded" src="http://www.google.com/reader/ui/3523697345-audio-player.swf?audioUrl='+source+'&autoPlay=true" width="400" height="27" quality="best" autostart="true" hidden="true"></embed>';

		 	audiodiv.innerHTML = audiostring;
		 	guiderSpot.appendChild(audiodiv);
		 	
       	 }
    }
}


//----- end of dw additions ----------------------

var guider = (function($){
// get window width
var winwid = window.innerWidth;
  var guider = {
    _defaultSettings: {
      attachTo: null,
      buttons: [{name: "Close"}],
      buttonCustomHTML: "",
      description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
      isHashable: true,
      onShow: null,
      overlay: false,
      position: 0, // 1-12 follows an analog clock, 0 means centered
      title: "Sample title goes here",
      width: 650,//(winwid - 400),
      audio: null, //(dw)
      previousId: null, // (dw ... for the Back button)
      
    },
 
  _htmlSkeleton: [
      "<div class='guider'>",
      "  <div class='guider_content'>",
      "    <h1 class='guider_title'></h1>",
      "    <p class='guider_description'></p>",
      "    <div class='guider_buttons'>",
      "    </div>",
      "  </div>",
      "  <div class='guider_arrow'>",
      "  </div>",
      "</div>"
    ].join(""),
    

    
    _arrowSize: 42, // = arrow's width and height
    _guiders: {},
    _currentGuiderID: null,
    _lastCreatedGuiderID: null,
    _lastHighlightedElement:null,
//------ BUTTONS
    _addButtons: function(myGuider) { 
    
      // Add buttons
      var guiderButtonsContainer = myGuider.elem.find(".guider_buttons");
      for (var i = myGuider.buttons.length-1; i >= 0; i--) {
        var thisButton = myGuider.buttons[i];
        var thisButtonElem = $("<a></a>", { // added id (dw)
                                "class" : "guider_button b" +  i,
                                "btntype" : thisButton.name,
                                "text" : thisButton.name });
        if (typeof thisButton.classString !== "undefined" && thisButton.classString !== null) {
          thisButtonElem.addClass(thisButton.classString);
        }

        guiderButtonsContainer.append(thisButtonElem);

        if (thisButton.onclick) {
          thisButtonElem.bind("click", thisButton.onclick);
        } else if (!thisButton.onclick && thisButton.name.toLowerCase() === "close") {
          thisButtonElem.bind("click", function() { guider.hideAll(); });
        } else if (!thisButton.onclick && thisButton.name.toLowerCase() === "next") {
          thisButtonElem.bind("click", function() { guider.next(); });
        } 
        // Pause button (dw)
         else if (!thisButton.onclick && thisButton.name.toLowerCase() === "pause") {
          thisButtonElem.bind("click", function() { pause(myGuider); });
        }
        // Back buton (dw)
         else if (!thisButton.onclick && thisButton.name.toLowerCase() === "back") {
          thisButtonElem.bind("click", function() { guider.back(); });
        }
        // audio buton (dw)
         else if ((!thisButton.onclick) &&  ((thisButton.name.toLowerCase()).indexOf("audio") > -1)) {
          thisButtonElem.bind("click", function() { guider.playAudio(); });
        }    
      }
 

      if (myGuider.buttonCustomHTML !== "") {
        var myCustomHTML = $(myGuider.buttonCustomHTML);
        myGuider.elem.find(".guider_buttons").append(myCustomHTML);
      }
     },
//------- ATTACH
       _attach: function(myGuider) {
      if (typeof myGuider.attachTo === "undefined" || myGuider === null) {
        return;
      }
      
      var myHeight = myGuider.elem.innerHeight();
      var myWidth = myGuider.elem.innerWidth();
          
    // if position = -1, then put it on the bottom [dw]
    
    if (myGuider.position === -1) {
    	var toppos=window.innerHeight - (myHeight + 30);
    	var leftpos = (window.innerWidth - myWidth) / 2;
    	var wd = (window.innerWidth - 50) + "px";
     	 myGuider.elem.css({
       		"position":"fixed",
        	"top": toppos,
        	"left": leftpos,
        	//"width":wd 
      	});
      	return // if at bottom, do not want any arrows
      }

 
      if (myGuider.position === 0) {
        myGuider.elem.css("position", "absolute");
        myGuider.elem.css("top", ($(window).height() - myHeight) / 3 + $(window).scrollTop() + "px");
        myGuider.elem.css("left", ($(window).width() - myWidth) / 2 + $(window).scrollLeft() + "px");
        return;
      }

      myGuider.attachTo = $(myGuider.attachTo);
      var base = myGuider.attachTo.offset();
      var attachToHeight = myGuider.attachTo.innerHeight();
      var attachToWidth = myGuider.attachTo.innerWidth();

      var top = base.top;
      var left = base.left;

      var bufferOffset = 0.9 * guider._arrowSize;

      var offsetMap = { // Follows the form: [height, width]
        1: [-bufferOffset - myHeight, attachToWidth - myWidth],
        2: [0, bufferOffset + attachToWidth],
        3: [attachToHeight/2 - myHeight/2, bufferOffset + attachToWidth],
        4: [attachToHeight - myHeight, bufferOffset + attachToWidth],
        5: [bufferOffset + attachToHeight, attachToWidth - myWidth],
        6: [bufferOffset + attachToHeight, attachToWidth/2 - myWidth/2],
        7: [bufferOffset + attachToHeight, 0],
        8: [attachToHeight - myHeight, -myWidth - bufferOffset],
        9: [attachToHeight/2 - myHeight/2, -myWidth - bufferOffset],
        10: [0, -myWidth - bufferOffset],
        11: [-bufferOffset - myHeight, 0],
        12: [-bufferOffset - myHeight, attachToWidth/2 - myWidth/2]
      };

      offset = offsetMap[myGuider.position];
      top += offset[0];
      left += offset[1];

      myGuider.elem.css({
        "position":"absolute",
        "top": top,
        "left": left
      });

      
    },
    
   

    _guiderById: function(id) {
      if (typeof guider._guiders[id] === "undefined") {
        throw "Cannot find guider with id " + id;
      }
      return guider._guiders[id];
    },
    
    _showOverlay: function() {
      $("#guider_overlay").fadeIn("fast");
    },
    
    _hideOverlay: function() {
      $("#guider_overlay").fadeOut("fast");
    },
    
    _initializeOverlay: function() {
      if ($("#guider_overlay").length === 0) {
        $("<div id=\"guider_overlay\"></div>").hide().appendTo("body");
      }
    },
    
    _styleArrow: function(myGuider) {
      var position = myGuider.position || 0;
      if (!position) {
        return;
      }
      var myGuiderArrow = $(myGuider.elem.find(".guider_arrow"));
      var newClass = {
        1: "guider_arrow_down",
        2: "guider_arrow_left",
        3: "guider_arrow_left",
        4: "guider_arrow_left",
        5: "guider_arrow_up",
        6: "guider_arrow_up",
        7: "guider_arrow_up",
        8: "guider_arrow_right",
        9: "guider_arrow_right",
        10: "guider_arrow_right",
        11: "guider_arrow_down",
        12: "guider_arrow_down"
      };
      myGuiderArrow.addClass(newClass[position]);

      var myHeight = myGuider.elem.innerHeight();
      var myWidth = myGuider.elem.innerWidth();
      var arrowOffset = guider._arrowSize / 2;
      var positionMap = {
        1: ["right", arrowOffset],
        2: ["top", arrowOffset],
        3: ["top", myHeight/2 - arrowOffset],
        4: ["bottom", arrowOffset],
        5: ["right", arrowOffset],
        6: ["left", myWidth/2 - arrowOffset],
        7: ["left", arrowOffset],
        8: ["bottom", arrowOffset],
        9: ["top", myHeight/2 - arrowOffset],
        10: ["top", arrowOffset],
        11: ["left", arrowOffset],
        12: ["left", myWidth/2 - arrowOffset]
      };
      var position = positionMap[myGuider.position];
      myGuiderArrow.css(position[0], position[1] + "px");
    },

    /**
     * One way to show a guider to new users is to direct new users to a URL such as
     * http://www.mysite.com/myapp#guider=welcome
     *
     * This can also be used to run guiders on multiple pages, by redirecting from
     * one page to another, with the guider id in the hash tag.
     *
     * Alternatively, if you use a session variable or flash messages after sign up,
     * you can add selectively add JavaScript to the page: "guider.show('first');"
     */
    _showIfHashed: function(myGuider) {
      var GUIDER_HASH_TAG = "guider=";
      var hashIndex = window.location.hash.indexOf(GUIDER_HASH_TAG);
      if (hashIndex !== -1) {
        var hashGuiderId = window.location.hash.substr(hashIndex + GUIDER_HASH_TAG.length);
        if (myGuider.id.toLowerCase() === hashGuiderId.toLowerCase()) {
          // Success!
          guider.show(myGuider.id);
        }
      }
    },
    
    // NEXT function
    next: function() {
      var currentGuider = guider._guiders[guider._currentGuiderID];
      if (typeof currentGuider === "undefined") {
        return;
      }
      stopTheAudio(guider._currentGuiderID);
      var nextGuiderId = currentGuider.next || null;
      if (nextGuiderId !== null && nextGuiderId !== "") {
        var myGuider = guider._guiderById(nextGuiderId);
        var omitHidingOverlay = myGuider.overlay ? true : false;
        guider.hideAll(omitHidingOverlay);
        guider.show(nextGuiderId);
      
      }
    },
    
        // BACK function (dw)
    back: function() {
      var currentGuider = guider._guiders[guider._currentGuiderID];
      if ((typeof currentGuider === "undefined") || (currentGuider.previousId === null)) {
        return;
      }
      var previousGuider =guider._guiders[guider._lastCreatedGuiderID] || null;
      if (previousGuider !== null && previousGuider !== "") {
        //var previousGuiderID = previousGuider.id;
        var previousGuiderId = currentGuider.previousId;
        var myGuider = guider._guiderById(previousGuiderId);
        var omitHidingOverlay = myGuider.overlay ? true : false;
        guider.hideAll(omitHidingOverlay);
       
        guider.show(previousGuiderId);
      
      }
    },
    
    // ----------- AUDIO function (dw)
    playAudio: function() {
   		 // get the guider
   		 var myguide = guider._guiders[guider._currentGuiderID];
   		 var id = guider._currentGuiderID;
      	 // get the button
      	 playTheAudio(id,myguide.audio);
      	 return 
        },
     
    

    createGuider: function(passedSettings) {
      if (passedSettings === null || passedSettings === undefined) {
        passedSettings = {};
      }

      // Extend those settings with passedSettings
      myGuider = $.extend({}, guider._defaultSettings, passedSettings);
      myGuider.id = myGuider.id || String(Math.floor(Math.random() * 1000));

      var guiderElement = $(guider._htmlSkeleton);
      myGuider.elem = guiderElement;
      myGuider.elem.css("width", myGuider.width + "px");
      guiderElement.find("h1.guider_title").html(myGuider.title);
      guiderElement.find("p.guider_description").html(myGuider.description);
      guiderElement.find("span.guider_audio").html("Audio");

      guider._addButtons(myGuider);

      guiderElement.hide();
      guiderElement.appendTo("body");
      guiderElement.attr("id", myGuider.id);
      myGuider.previousId = previousGuiderId; //(dw)
      previousGuiderId = myGuider.id;
          

      // Ensure myGuider.attachTo is a jQuery element.
      if (typeof myGuider.attachTo !== "undefined" && myGuider !== null) {
        guider._attach(myGuider);
        //guider._styleArrow(myGuider);
      }

      guider._initializeOverlay();

      guider._guiders[myGuider.id] = myGuider;
      guider._lastCreatedGuiderID = myGuider.id;
      
      /**
       * If the URL of the current window is of the form
       * http://www.myurl.com/mypage.html#guider=id
       * then show this guider.
       */
      if (myGuider.isHashable) {
        guider._showIfHashed(myGuider);
      }
      
          

      return guider;
    },

    hideAll: function(omitHidingOverlay) {
      $(".guider").fadeOut("fast");
      if (typeof omitHidingOverlay !== "undefined" && omitHidingOverlay === true) {
        // do nothing for now
      } else {
        guider._hideOverlay();
      }
      return guider;
    },


 // ---------------SHOW function
    show: function(id) {
     
      if (!id && guider._lastCreatedGuiderID) {
        id = guider._lastCreatedGuiderID;
      }
      
      var myGuider = guider._guiderById(id);
      if (myGuider.overlay) {
        guider._showOverlay();
      }
      
       
      // You can use an onShow function to take some action before the guider is shown.
      if (myGuider.onShow) {
        myGuider.onShow(myGuider);        
        }
      
      guider._attach(myGuider);
      
      
        // Audio tour (dw)
        // stop the current one from playing
        var prevID = guider._currentGuiderID;
        if ((prevID!= undefined) && (prevID !== null)) {
        	stopTheAudio(prevID);
        	}
        
        if (globalPlay){
           playTheAudio(id,myGuider.audio);
           // change the label
           var btn = getButtonFromId(id,playAudioLabel);
           if (btn != null) { // it's a "play audio" label so it needs to be changed
           		btn.text = stopAudioLabel;
           }
        }
        
      
      
 // ---- HIGHLIGHT IT [dw]
      var elem = $(myGuider.attachTo);
      var elem1 = elem.selector;
      highlightElement(elem1);
      
      myGuider.elem.fadeIn("fast");

      var windowHeight = $(window).height();
      var scrollHeight = $(window).scrollTop();
      var guiderOffset = myGuider.elem.offset();
      var guiderElemHeight = myGuider.elem.height();
      
      // don't scroll to the guider if position != -1 [dw]
      var myGuiderPosition = myGuider.position;
      if ((myGuiderPosition != -1) && (guiderOffset.top - scrollHeight < 0 ||
         guiderOffset.top + guiderElemHeight + 40 > scrollHeight + windowHeight)) {
        window.scrollTo(0, Math.max(guiderOffset.top + (guiderElemHeight / 2) - (windowHeight / 2), 0));
      }

      guider._currentGuiderID = id;
      return guider;
    }
  };
  
  
  

  return guider;
}).call(this, jQuery);


// bind space bar to Next Guider (dw)
 function keyHandler(e)
 {
 	var pressedKey;
 	if (document.all)	{ e = window.event; }
	if (document.layers || e.which) { pressedKey = e.which; }
 	if (document.all)	{ pressedKey = e.keyCode; }
 
 	pressedCharacter = String.fromCharCode(pressedKey);
 	var el = document.activeElement;
 	var elt = el.tagName.toLowerCase();
 	if ( (elt != "textarea") && (elt != "input") && (pressedKey==32)){
 		// if we're paused, then we're going to be unhidden. So hide the pause ribbon at the top
 		  	var pauseoverlay =     document.getElementById("overlayPauseGlider");
    		if ((pauseoverlay !== null) && (pauseoverlay !== undefined)) {
      	 		$("#overlayPauseGlider").hide("slow");
    		}
 		
 		var myguide = guider._guiders[guider._currentGuiderID];
 		var gid = myguide.id;
 		var btns = myguide.buttons;
 		var nextbtn = null;
 		// find the next button
 		for (var i=0; i < btns.length; i++) {
 		   if (btns[i].name = "Next") {
 		      nextbtn = btns[i];
 		   }
 		}
 		if (nextbtn == null) { return }
 		
 		var nextAct = myguide.next;
 		if (( nextAct === null) || (nextAct == undefined)) { // if no next guider specified, then do the click
 		   stopTheAudio(gid);
 		   nextbtn.onclick();
 		   return
 		}
 		
 		
 		guider.next();
 		}
 	else { nextButtonPressed=false;}
 }
 document.onkeypress = keyHandler;