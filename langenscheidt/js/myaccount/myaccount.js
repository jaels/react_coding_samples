import {h, render} from 'preact';
import Routes from './Routes';

jQuery(document).ready(function($) {

  const themePath = (window.drupalSettings && window.drupalSettings.themePath) || '.';


  render((
    <main class="s-content s-account">
          <Routes themePath={themePath}/>
    </main>

  ), document.getElementById("s-myaccount"));

});
