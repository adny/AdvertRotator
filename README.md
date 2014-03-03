AdvertRotator
=============

A Windows 8.1 advert rotator in for HTML/JS apps 


Firstly, use this at your own risk for the moment, it is in very early stages, and is quite tailored to my own needs at the moment, thou feel free to fork/push changes.

Usage
=============

Add the JS files to your project, and include them in the html

ie:
```html
<script src="/advertRotator/advertRotator.js"></script>
<script src="/advertRotator/ar-bing.js"></script>
<script src="/advertRotator/ar-adduplex.js"></script>
```
And dont forgot to add the libs for each of the advert networks too (before advertRotator scripts)


Then you use it like so:
```html
<div 
  data-win-control="AdvertRotator.Controls.AdControl"
  data-win-options="{sizes: [ {min: '625', max: '999999'},
                              {min: '500', max: '625'},
                              {min: '0', max: '500'} ],
                    networks: [{type: 'bing', id: '<<id>>', size: ['10053957','10241954', '10241954'] },
                              {type: 'adduplex', id: '<<id>>', size: ['250x250','500x130', '300x250'] }]
                    }"></div>
```
So sizes is the range in which the advert will need to adapt to a new size, and size in networks corresponds to that.
