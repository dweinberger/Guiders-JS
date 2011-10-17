README for forked additions to Guiders-JS

Caveats
--------------------------

I am an amateur, embarrassingly bad hobbyist programmer. I wanted Guiders-JS to work a little differently, so I made some changes. The modified version seems to work, although I have not put it through rigorous field testing, so I figured I'd make the forked version available, if only as a demonstration of some functionality that a competent developer might add.

Thank you Jeff for creating Guiders, and GitHub for enabling amateurs to fork it all up.

- David Weinberger
  August 2, 2011
  self@evident.com

Functionality Added: 
--------------------------

If you set "position" to -1, the guider will be fixed at the bottom of the window.

If you set "position" to -1 and "attachedTo" to a document element's ID, the page will scroll to that element and put a thick, red, dashed border around it. The element's original border will be restored after you click ahead to the next guider.

The space key now advances to the next guider.

If you put in a button named "pause" and are using the position= -1 option, a guider will display a Pause button that hides the guider down and displays a translucent banner at the top of the page. Unpause by clicking on the banner, or by pressing the space bar.  NOTE THAT THIS REQUIRES putting the banner into the page as a hidden div. For example:

     <!-- guider pause -->
     <div id="overlayPauseGlider" onclick="unhideMe()" style="display:none">
       <p>Guided tour is  PAUSED. Click this box to resume. (Or reload page if necessary.)</p>
     </div> 

If you add "audio" as a parameter to a guider, it will attempt to play the file you specify. You can use this to create an audio tour. It does this simply by creating a div with an <embed> that embeds a flash player in order to achieve cross- browser goodness. The "play audio" button can be renamed, but it has to have "audio" in it. Sorry that's so inelegant. Fix it at line 363 or so, if you'd like.

Sample:
-----------------------

You can try out these features here: 
http://librarylab.law.harvard.edu/dpla/demo/tour/index.php

If it asks for a password:
user: dpla
password: slideplay

