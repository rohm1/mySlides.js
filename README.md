mySlides.js
===========

##Usage##

##Features##
* table of contents automatic generation with links to slides
* nav popup/context menu
* exposé mode (grid, inline)
* responsive design (resize the text depending on your screen height)
* pauses: display your slides step by step
* only: to display elements of your slides exactly when you want
* localization: select your language to display properly the date
* create your own theme

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
  + use %p for the current slide number, %t for the total slides number
* dateFormat: custom date format overriding the language's default date format
  + default: the date format of the selected language
  + %l: a full textual representation of the day of the week
  + %j: day of the month without leading zeros
  + %F: a full textual representation of a month
  + %n: numeric representation of a month, without leading zeros
  + %y: a two digit representation of a year
  + %Y: a full numeric representation of a year, 4 digits

##Classes and IDs##
**All these classes and IDs are used by mySlides.js**

* .crt: current slide
* #date: where the date will be displayed
* .expose: a slide in exposé mode
* #expose: the exposé frame
* #exposeButton: button to activate exposé
* #exposeClose: button to close exposé
* .exposeGrid: sets exposé in grid mode; use ```exposeMode: 'grid'``` to apply this class to #expose
* .exposeInline: sets exposé in inline mode; use ```exposeMode: 'inline'``` to apply this class to #expose
* #exposeSlideContainer: exposé slides will be inside
* #loader: a loading frame; dismissed when mySlides.js is ready
* #navButton: button to activate the nav popup
* #navForm: form to jump directly to a slide, given a slide number; can contain a submit button, but only one ```<input type="text" />```; this input's value will be used after the form is submitted
* #navPopup: the nav popup
* #navPopupClose: button to close the nav popup
* .navPopupContextMenu: displays the nav popup as a context menu; use ```navPopupAsContextMenu: true``` to apply this class to #navPopup
* .navPopupPopup: displays the nav popup as popup; use ```navPopupAsContextMenu: false``` to apply this class to #navPopup
* #pages: where the pages will be displayed
* .onclick-classname: adds the class classname to the element when its clicked, and removes it when clicked again; classname is removed when changing slide
* .only_..: cf. \only in LaTeX
* .pause: use an invisible element with this class to make pauses in your slides
* .section: used to generate the table of contents; top level
* .slide: a slide
* #slides: container for the slides
* .subsection: used to generate the table of contents; second level
* .title: title of a slide; the content/value will be used in the table of contents
* .toc: hosts the table of contents

##License##
