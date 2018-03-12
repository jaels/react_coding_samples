'use strict';

define([
    'jquery',
    'mage/translate',
    'sirup-react'
], function($) {
    return function load(options, mountElement) {


        //
        //  Load components
        //
        const B2B = {};
        const B2BCart = {};
        //
        //=include B2BCart/components/App.jsx
        //=include B2BCart/components/WarenkorbProduct.jsx
        //=include B2BCart/components/WarenkorbSizes.jsx
        //=include B2BCart/components/OverSizePriceModal.jsx
        //=include B2BCart/api/warenkorbAPI.js
        //=include B2B/components/LoadingModal.jsx


        //

                var {Router, Route, Link, IndexRoute, hashHistory, browserHistory} = ReactRouter;

                ReactDOM.render(
                    <Router history={hashHistory}>
                    <Route path='/' component={B2BCart.App}>
                    <IndexRoute component={B2BCart.Main}/>
                    <Route path="warenkorb" component={B2BCart.Warenkorb}/>
                    </Route>
                    </Router>,
                    mountElement);


}

});
