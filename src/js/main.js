// Javascript that is inline. Should be used for anything that needs to be immediate
import jquery from 'jquery';
window.$ = jquery;

import legend from './modules/legend.js';
import share from './modules/share.js';
import hover from './modules/hover.js';

legend.init();
share.init();
hover.init();
