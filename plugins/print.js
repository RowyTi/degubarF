import Vue from 'vue';
import VueHtmlToPaper from 'vue-html-to-paper';

const options = {
  name: '_blank',
  // specs: [
  //   'fullscreen=no',
  //   'titlebar=no',
  //   'scrollbars=no'
  // ],
  styles: [
    'https://unpkg.com/tailwindcss@^2/dist/tailwind.min.css'
  ],
  // timeout: 1000, // default timeout before the print window appears
  // autoClose: true, // if false, the window will not close after printing
  // windowTitle: window.document.title, // override the window title
}

Vue.use(VueHtmlToPaper, options);
