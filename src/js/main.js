// Javascript that is inline. Should be used for anything that needs to be immediate
import jquery from './vendor/jquery.js';
window.$ = jquery;

import share from './modules/share.js';
import hover from './modules/hover.js';
import select from './modules/select.js';
import scrollTo from './modules/scrollTo.js';

share.init();
hover.init();
select.init();
scrollTo.init();
