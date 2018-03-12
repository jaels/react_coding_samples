B2B.Main = class extends React.Component {
    constructor(props) {
        super(props);
        {/*console.log(options.props);*/}
        var productType = options.props.categoryName;
        this.state = {
            products: [],
            theOrders: {},
            cartId: '',
            filterClicked: $(window).width() > 1240 ? true : false,
            filters: {
                kategorie: [],
                farbe: [],
                grosse: {},
                material: [],
                model: []
            },
            pressedFiltersState: {},
            emptyFlag: false,
            searchValue: options.props.query.slice(1,-1),
            overSizeClicked: false,
            isLoading: true,
            isAllProductsRendered: false,
            hoverOnWkButton: false,
            hoverOnScrollButton: false,
            hoverOnFilterButton: false,
            displayScrollUpBtn: false
        }

        this.handleOrderChange = this.handleOrderChange.bind(this);
        this.handleClickOnfilterBtn = this.handleClickOnfilterBtn.bind(this);
        this.handleClickOnfilterMain = this.handleClickOnfilterMain.bind(this);
        this.handleClickOnAlleLoschenMain = this.handleClickOnAlleLoschenMain.bind(this);
        this.handleClickOnQuestion = this.handleClickOnQuestion.bind(this);
        this.flashFunc = this.flashFunc.bind(this);
        this.handleHoverOnWkButton = this.handleHoverOnWkButton.bind(this);
        this.handleLeaveWkButton = this.handleLeaveWkButton.bind(this);
        this.handleClickOnScrollTop = this.handleClickOnScrollTop.bind(this);
        this.handleHoverOnScrollButton = this.handleHoverOnScrollButton.bind(this);
        this.handleLeaveScrollButton = this.handleLeaveScrollButton.bind(this);
        this.handleSearchByNumber = this.handleSearchByNumber.bind(this);
    }

    componentDidMount() {
        let {filters} = this.state;

        getTheProducts().then(response => {
            if(response.products.length>0) {
                console.log(response.products);
                let productType = response.products[0].attribute_set;
                this.setState({productType:productType,
                    pressedFiltersState: {
                      kategorie: [],
                      farbe: [],
                      grosse: productType == "trousers" ? {
                        clothing_size: [],
                        inch_size: []
                    } : {belt_sizes:[]},
                      material: [],
                      model: []
                  }
                })
                const allProducts = sortTheProducts(response.products);
                let products = allProducts;
                var filters = getTheRenderedFilters(allProducts);


                setTimeout((function() {
                    this.setState({filters: filters});
                }).bind(this), 1);

                const batchSize = 1;
                let currentProducts = [];

                this.setState({isLoading: false});

                var processBatch = function() {
                    currentProducts = currentProducts.concat(products.splice(0, batchSize));
                    this.setState({allProducts: currentProducts, products: currentProducts});

                    if (products.length) {
                        setTimeout(processBatch.bind(this), 1);
                    } else {
                        this.setState({isAllProductsRendered: true});
                    }
                };
                processBatch.call(this);
             }
             else {
                 this.setState({emptyFlag: true, isLoading:false});
             }
        });
    }

    flashFunc() {
        if ('remove' in Element.prototype) {
            let flash = $('<div></div>').prependTo('#wrapper-and-filters').attr('id', 'flash');
            setTimeout(() => {
                flash.remove()
            }, 600);
        }
    }

    handleClickOnAlleLoschenMain(emptyPressedFiltersState) {
        this.flashFunc();
        this.setState({emptyFlag: false});
        var {allProducts} = this.state;
        this.setState({products: allProducts, pressedFiltersState: emptyPressedFiltersState});
        $("html, body").animate({ scrollTop: 0 }, "slow");
    }

    handleClickOnfilterMain(filterObj, pressedFiltersState, isNewFilter) {
        var {products, allProducts, productType} = this.state;
        this.flashFunc();
        if (isNewFilter) {
            if (newFilterCalc(pressedFiltersState, allProducts).length == 0) {
                this.setState({emptyFlag: true});
            }
            this.setState({
                products: newFilterCalc(pressedFiltersState, allProducts),
                pressedFiltersState: pressedFiltersState
            });
        } else {
            let checkIfEmpty = true;
            this.setState({emptyFlag: false});
            for (var key in pressedFiltersState.grosse) {
                if (pressedFiltersState.grosse[key].length > 0) {
                    checkIfEmpty = false;
                }
            }
            if (pressedFiltersState.kategorie.length == 0 && pressedFiltersState.farbe.length == 0 && pressedFiltersState.material.length == 0 && pressedFiltersState.model.length == 0 && checkIfEmpty) {
                this.setState({
                    products: allProducts,
                    pressedFiltersState: {
                      kategorie: [],
                      farbe: [],
                      grosse: productType == "trousers" ? {
                        clothing_size: [],
                        inch_size: []
                    } : {belt_sizes:[]},
                      material: [],
                      model: []
                  }
                });
            } else {
                this.setState({
                    products: newFilterCalc(pressedFiltersState, allProducts),
                    pressedFiltersState: pressedFiltersState
                });
            }
        }
        $("html, body").animate({ scrollTop: 0 }, "slow");

    }

    handleClickOnfilterBtn() {
        var {filterClicked} = this.state;
        filterClicked = !filterClicked;
        this.setState({filterClicked: filterClicked});
        if (filterClicked) {
            $(".general-filter-area").addClass("general-filter-area-pressed");
        } else {
            $(".general-filter-area").removeClass("general-filter-area-pressed");
        }
    }

    handleOrderChange(orderArr) {
        var {theOrders} = this.state;
        var sku = orderArr[0].cartItem.sku;
        theOrders[sku] = [];
        theOrders[sku] = orderArr;
        this.setState({theOrders});
    }

    handleClickOnQuestion() {
        var {overSizeClicked} = this.state;
        if (!overSizeClicked) {
            $("body").css("overflow-y", "hidden");
        } else {
            $("body").css("overflow-y", "visible");
            let tempParent = document.getElementById("wrapper-and-filters");
            tempParent.removeChild(mainOsOverlay);
        }
        this.setState({
            overSizeClicked: !overSizeClicked
        });
    }

    handleHoverOnWkButton() {
        this.setState({hoverOnWkButton: true})
    }

    handleLeaveWkButton() {
        this.setState({hoverOnWkButton: false})
    }


    handleHoverOnScrollButton() {
        this.setState({hoverOnScrollButton: true})
    }

    handleLeaveScrollButton() {
        this.setState({hoverOnScrollButton: false})
    }

    handleClickOnScrollTop() {
        $("html, body").animate({
            scrollTop: 0
        }, "slow");
        this.setState({hoverOnScrollButton: false})
    }

    handleSearchByNumber(searchValue, emptyPressedFiltersState) {
        let productNum = "";
        let foundProduct = [];
        var {allProducts, products, productType} = this.state;
        allProducts.map((product)=> {
            if(productType == "trousers") {
                productNum = product.article_number[0].label;
            }
            let productName = product.name;
            if(searchValue==productNum || searchValue==productNum.split("-")[1] || productName.toLowerCase().indexOf(searchValue.toLowerCase())>-1 || searchValue == product.id) {
                foundProduct.push(product);
            }
        })
            this.setState({products: foundProduct, pressedFiltersState: emptyPressedFiltersState});
            $("html, body").animate({ scrollTop: 0 }, "slow");

            if(foundProduct.length==0) {
                this.setState({emptyFlag:true, searchValue: searchValue})
            }
    }

    render() {
        var {
            products,
            theOrders,
            filterClicked,
            cartId,
            filters,
            emptyFlag,
            pressedFiltersState,
            overSizeClicked,
            isLoading,
            hoverOnWkButton,
            hoverOnScrollButton,
            isAllProductsRendered,
            displayScrollUpBtn,
            productType,
            searchValue
        } = this.state;

        var {
            handleOrderChange,
            handleClickOnScreen,
            handleClickOnfilterBtn,
            handleClickOnfilterMain,
            handleClickOnAlleLoschenMain,
            handleClickOnQuestion,
            handleHoverOnWkButton,
            handleLeaveWkButton,
            handleClickOnScrollTop,
            handleHoverOnScrollButton,
            handleLeaveScrollButton,
            handleSearchByNumber,
            handleHoverOnFilterButton,
            handleLeaveFilterButton
        } = this;
        var that = this;
        var ergebnisse = products.length;
        var {quoteId, imagePath, basePath, categoryName} = options.props;
        function renderProducts(products) {
            return products.map(function(product) {
                    return (
                        <div>
                            <B2B.Product product={product}
                                productType={productType} key={'product' + product.id} imagePath={imagePath} cartId={quoteId} pressedFiltersState={pressedFiltersState} handleOrderChange={handleOrderChange} handleClickOnQuestion={handleClickOnQuestion}/>
                        </div>
                    )

            })
        }

        function renderWarenkorbBtn() {
            if (products.length > 0) {
                return (
                    <a href={`${basePath}checkout/cart`}>
                        <button id="inDenWarenKorb-btn" onMouseOver={handleHoverOnWkButton} onMouseOut={handleLeaveWkButton}>
                            {$.mage.__('Warenkorb öffnen')}
                            <img src={hoverOnWkButton
                                ? `${imagePath}/arrow_right-30.svg`
                                : `${imagePath}/arrow_right-white-31.svg`} className="thin-arrow-right"/>
                        </button>
                    </a>
                )
            }
        }

        function renderScrollTop() {
            if(displayScrollUpBtn) {
                return (
                    <button id="scroll-top-btn" onClick={handleClickOnScrollTop} onMouseOver={handleHoverOnScrollButton} onMouseOut={handleLeaveScrollButton}>
                        <img src={hoverOnScrollButton
                        ? `${imagePath}/jump_mark_arrow_up.svg`
                        : `${imagePath}/jump_mark_arrow_up-white.svg`}/></button>
                )
            }
        }

        function renderFilterArea() {
            function checkFilterLogoState () {
                if(filterClicked) {
                    if(hoverOnFilterButton) {
                        return imagePath + "/filter_close_white.svg";
                    }
                    else {
                        return imagePath + "/filter_close_black.svg";
                    }
                }
                else {
                    if(hoverOnFilterButton) {
                        return imagePath + "/filter_icon_white.svg";
                    }
                    else {
                        return imagePath + "/filter_icon_black.svg";
                    }
                }
            }

            if (isAllProductsRendered) {
                return (
                    <div className={filterClicked ? "general-filter-area-pressed" : "general-filter-area"}>
                        <div className="filtern">
                            <div className="filter-title-main" onClick={handleClickOnfilterBtn}>
                                <p className="filtern-text">{filterClicked
                                        ? ""
                                        : $.mage.__('Produkte filtern')}</p>
                                <img className="filtern-logo" src={filterClicked
                                ? imagePath + "/closeButton.png"
                                : imagePath + "/filter_btn.png"}/>
                            </div>
                        </div>
                        <B2B.FilterModal filters={filters}
                            productType={productType}
                             handleClickOnfilterMain={handleClickOnfilterMain} handleClickOnAlleLoschenMain={handleClickOnAlleLoschenMain}
                             handleSearchByNumber={handleSearchByNumber}/>
                    </div>

                )
            }
        }
        function renderOverSizeModal() {
            if (overSizeClicked) {
                return (
                    <div>
                        <B2B.OverSizePriceModal handleClickOnQuestion={handleClickOnQuestion}/>
                    </div>
                )
            }
        }
        function renderLoadingModal() {
            if (isLoading) {
                return (
                    <div>
                        <B2B.LoadingModal/>
                    </div>
                )
            }
        }

        function renderNotFoundproduct () {
            return (
                <div style={{display: "inline-block"}}>
                    <h1 className="hosenMainTitle">
                    {$.mage.__('Suchergebnisse für:') + " " + searchValue}</h1>
                    <p className="noErgebnisse">{$.mage.__('Leider haben wir keine passenden Produkte')}</p>
                </div>
            )
        }

        return (
            <div id="wrapper-and-filters">
                {renderFilterArea()}

                {/*{renderScrollTop()}*/}
                <div id="wrapper">
                    {renderOverSizeModal()}
                    {renderLoadingModal()}
                    <header>
                        <div className="main-page-title">
                            <h1 className={isLoading || emptyFlag ? "noDisplay" :  "hosenMainTitle"}>{categoryName}</h1>
                            <p className={!isLoading && !emptyFlag
                                ? "ergebnisse" :
                                !isLoading && emptyFlag ? "noErgebnisse"
                                : ""}>
                                {isLoading
                                    ? ""
                                    : ergebnisse > 0
                                        ? $.mage.__("Ergebnisse") +
                                        ": " + ergebnisse
                                        : emptyFlag
                                            ? renderNotFoundproduct()
                                            : ""}</p>
                                        <img
                                        onClick={handleClickOnfilterBtn}
                                         className={isAllProductsRendered ? "filtern-logo-phone" : "filtern-logo-phone-loading"} src={filterClicked
                                ? imagePath + "/closeButton.png"
                                : imagePath + "/filter_btn.png"}
                                 ></img>
                        </div>

                    </header>
                    {renderWarenkorbBtn()}
                    <div>
                        {renderProducts(products)}
                    </div>
                </div>
            </div>
        )
    }
};
