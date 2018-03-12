import {h, render} from 'preact';
import Main from './Main';


jQuery(document).ready(function ($) {

    const isDrupalEnvironment = (typeof window.drupalSettings === 'object');
    const magentoHost = (isDrupalEnvironment) ? (window.drupalSettings.magentoHost || 'http://lgs-shop.sirup.priv') : '';

    const magentoStoreViewPartial = (isDrupalEnvironment && window.drupalSettings.magentoStoreView) ? ('/' + window.drupalSettings.magentoStoreView) : '';
    const checkoutUrl = magentoHost + magentoStoreViewPartial + '/checkout';


    render((
            <div class="s-basket">
                <h1>Warenkorb</h1>
                <Main jQuery={$} checkoutUrl={checkoutUrl} />
            </div>
    ), document.getElementById("s-cart"));

});
