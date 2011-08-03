README for forked additions to Guiders-JS

Caveats
--------------------------

I am a amateur, embarrassingly bad hobbyist programmer. I wanted Guiders-JS to work a little differently, so I made some changes. The modified version seems to work, although I have not put it through rigorous field testing, so I figured I'd make the forked version available, if only as a demonstration of some functionality that a competent developer might add.

Thank you Jeff for creating Guiders, and GitHub for enabling amateurs to fork it all up.

- David Weinberger
  August 2, 2011
  self@evident.com

Functionality Added: 
--------------------------

If you set "position" to -1, the guider will be fixed at the bottom of the window.

If you set "position" to -1 and "attachedTo" to a document element's ID, the page will scroll to that element and put a thick, red, dashed border around it. The element's original border will be restored after you click ahead to the next guider.

The space key now advances to the next guider.

If you put in a button named "pause" and are using position= -1 option, a guider will have a button that moves the guider down so that only the top of its head is visible above the bottom of the window. Clicking anywhere in the visible portion of the guider, or pressing the space bar, brings the guider back into full view.
