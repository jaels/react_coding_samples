'use strict';

define([
    'jquery',
    'Magento_Customer/js/customer-data',
    'mage/translate',
    'sirup-react'
], function($, customerData) {
    return function load(options, mountElement) {

        //
        //  Load components
        //
        const B2B = {};

        var triggerCartUpdate = function() {
            var sections = ['cart'];
            customerData.invalidate(sections);
            customerData.reload(sections, true);
        };


        //
        //=include B2B/App.jsx
        //=include B2B/components/Sizes.jsx
        //=include B2B/components/Main.jsx
        //=include B2B/components/Product.jsx
        //=include B2B/components/BigImageModal.jsx
        //=include B2B/components/AlertModal.jsx
        //=include B2B/components/FilterModal.jsx
        //=include B2B/components/LoadingModal.jsx
        //=include B2B/components/OverSizePriceModal.jsx
        //=include B2B/api/Filter.js
        //=include B2B/api/API.js
        //

        var {Router, Route, Link, IndexRoute, hashHistory, browserHistory} = ReactRouter;


        ReactDOM.render(
            <Router history={hashHistory}>
            <Route path='/' component={B2B.App}>
            <IndexRoute component={B2B.Main}/>
            <Route path="warenkorb" component={B2B.Warenkorb}/>
            </Route>
            </Router>,
            mountElement);
    };

});
