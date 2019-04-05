// Javascript that is inline. Should be used for anything that needs to be immediate
import jquery from './vendor/jquery.js';
window.$ = jquery;

import share from './modules/share.js';
import hover from './modules/hover.js';
import scroll from './modules/scroll.js';

share.init();
hover.init();
scroll.init();
