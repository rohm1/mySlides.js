mySlides.js
===========

##Usage##

##Features##

##Parameters##
* lang: used for the date
  + values: de|en|fr
  + default: en
  + can be extended by extending the mySlides.lang object
* tocLevel: number of levels in the table of contents
  + values: 1|2
  + default: 2
* navPopupAsContextMenu: sets the nav popup as a context menu or a popup; activates one of the ```navPopupContextMenu``` or ```navPopupPopup``` classes
  + values: true|false
  + default: true
* exposeMode: displays exposé in grid or inline mode;  activates one of the ```exposeGrid``` or ```exposeInline``` classes
  + values: grid|inline
  + default: grid
* slideNumberStyle: defines how the slide number will be displayed
  + default: %p/%t
  + use %p for the current slide number, %n for the total slides number

##Classes and IDs##
**All these classes and IDs are used by mySlides.js**
* .crt: current slide
* #date: where the date will be displayed
* .expose: a slide in exposé mode
* #expose: the exposé frame
* #exposeButton: button to activate exposé
* #exposeClose: button to close exposé
* #exposeContainer: the container for exposé
* .exposeGrid: sets exposé in grid mode; use ```exposeMode: 'grid'``` to activate this class
* .exposeInline: sets exposé in inline mode; use ```exposeMode: 'inline'``` to activate this class
* #exposeSlideContainer: exposé slides will be inside
* #loader: a loading frame; dismissed when mySlides is ready
* #navButton: button to activate the nav popup
* #navForm: form to jump directly to a slide, given a slide number; can contain a submit button, but only one ```<input type="text" />```; this input's value will be used after the form is submitted
* #navPopup: the nav popup
* #navPopupClose: button to close the nav popup
* #navPopupContainer: container form the nav popup
* .navPopupContextMenu: displays the nav popup as a context menu; use ```navPopupAsContextMenu: true``` to activate this class
* .navPopupPopup: displays the nav popup as popup; use ```navPopupAsContextMenu: false``` to activate this class
* #pages: where the pages will be displayed
* .pause: use an invisible element with this class to make pauses in your slides
* .section: used to generate the table of contents; top level
* .slide: a slide
* #slides: container for the slides
* .subsection: used to generate the table of contents; second level
* .title: title of a slide; the content/value will be used in the table of contents
* .toc: hosts the table of contents

##License##
