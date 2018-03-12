B2B.Product = class extends React.Component {
    constructor(props) {
        super(props);
        var product = this.props.product;
        var id = product.id;
        var colorsArr = product.colors.map(color => {
            return color.color.id;
        })

        this.state = {
            product: product,
            showMoreDetails: false,
            showBigColors: false,
            id: id,
            chosenColorId: product.colors[0].color.id,
            chosenPicRoute: product.colors[0].images ? product.colors[0].images[0] : "",
            isModalOpen: false,
            prepareTheOrders: {},
            colorsArr: colorsArr,
            chosenColorIndex: 0,
            hoveredIcon: [],
            productType:this.props.productType
        }

        this.getMoreDetails = this.getMoreDetails.bind(this);
        this.getBigColors = this.getBigColors.bind(this);
        this.chooseHosenColor = this.chooseHosenColor.bind(this);
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.handleOrderChange = this.handleOrderChange.bind(this);
        this.handleIconHover = this.handleIconHover.bind(this);
        this.handleIconLeave = this.handleIconLeave.bind(this);
    }

    handleOrderChange(orderArr) {
        this.props.handleOrderChange(orderArr);

    }

    getMoreDetails() {
        this.setState({
            showMoreDetails: !this.state.showMoreDetails
        })
    }

    getBigColors() {
        this.setState({
            showBigColors: !this.state.showBigColors
        })
    }

    chooseHosenColor(e) {
        var product = this.state.product;
        var picId = e.target.id;
        var index = this.state.colorsArr.indexOf(picId);
        this.setState({chosenColorId: picId, chosenPicRoute: product.colors[index].images[0], chosenColorIndex: index, showBigColors: true});
    }

    openModal() {
        this.setState({isModalOpen: true});
        $("body").css("overflow-y", "hidden");
        $("#wrapper").addClass("wrapperOfModal");
        $("#maincontent").css("z-index", 100);
    }

    closeModal() {
        this.setState({isModalOpen: false});
        $("body").css("overflow-y", "visible");
        $("#wrapper").removeClass("wrapperOfModal");
        $("#maincontent").css("z-index", '');
    }

    handleIconHover (e) {
        var {hoveredIcon} = this.state;
        hoveredIcon.push(e.target.id);
        this.setState({hoveredIcon});
    }

    handleIconLeave () {
        this.setState({hoveredIcon:[]});
    }

    render() {
        var that = this;
        var {
            product,
            allIcons,
            showMoreDetails,
            showBigColors,
            chosenColorId,
            chosenPicRoute,
            isModalOpen,
            hoveredIcon,
            productType
        } = this.state;
        var {
            getMoreDetails,
            getBigColors,
            handleClickOnScreen,
            chooseHosenColor,
            closeModal,
            openModal,
            handleIconHover,
            handleIconLeave
        } = this;

        var {pressedFiltersState, handleClickOnQuestion} = this.props;
        var colors = product.colors.map(color => {
            return (
                <div className="small-color-circle" style={{
                    backgroundColor: color.color.webcolor
                }} key={`smallCircles${color.sku}`}></div>
            )
        });

        function renderEachColor(colors) {
            function checkAvailableSize(color) {
                var check=false;

                if(pressedFiltersState.grosse.clothing_size.length==0 && pressedFiltersState.grosse.inch_size.length==0) {
                    return true;
                }
                if(pressedFiltersState.grosse.clothing_size.length>0) {
                    pressedFiltersState.grosse.clothing_size.map((sizeObj)=> {
                        color.systems.map((system)=> {
                            if (system.id=="clothing_size") {
                                system.groups.map((group)=>{
                                    if (group.sizes.filter((size) => {
                                        return size.id == sizeObj.id && size.available == true;
                                    }).length > 0) {
                                        check = true;
                                    }
                                })
                            }
                        })
                    })
                }
                if(pressedFiltersState.grosse.inch_size.length>0) {
                    pressedFiltersState.grosse.inch_size.map((sizeObj)=> {
                        color.systems.map((system)=> {
                            if (system.id=="inch_size") {
                                system.groups.map((group)=>{
                                    if (group.sizes.filter((size) => {
                                        return size.id == sizeObj.id && size.available == true;
                                    }).length > 0) {
                                        check = true;
                                    }
                                })
                            }
                        })
                    })
                }

                if(check==true) {
                    return true;
                }
                else return false;
            }

            return colors.map(color => {
                if ((pressedFiltersState.farbe.length == 0 || pressedFiltersState.farbe.filter((item) => {
                    return item.id == color.color.color_group_id;
                }).length > 0) && checkAvailableSize(color)==true) {
                    return (
                        <div>
                            <B2B.Sizes color={color} key={`renderColors${color.sku}`} cartId={that.props.cartId}
                                 handleOrderChange={that.handleOrderChange} productName={that.state.product.name} productPrice={that.state.product.ek} productId={that.state.product.id} productType={that.state.product.attribute_set}/>
                        </div>
                    )
                }
            })
        }

        function renderBigColors(product) {
            var bigColors = product.colors.map(color => {
                return (
                    <div className={that.state.chosenColorId == color.color.id
                        ? "big-dot-pressed"
                        : "big-color-circle"} id={color.color.id} style={{
                        backgroundColor: color.color.webcolor
                    }} key={`bigColors${color.sku}`} onClick={chooseHosenColor}></div>
                )
            })
            if (showBigColors) {
                return (
                    <div className="big-colors-area" id="bigColorsArea">
                        {bigColors}
                    </div>
                )
            }
        }

        function renderIconHover (id, label, type) {
            if(hoveredIcon.indexOf(id)>-1) {
                return (
                    <div className="hover-rect" style={type==0 ? {marginTop: 36} : {marginTop: 1}}>
                        <p>{label}</p>
                    </div>
                )
            }
        }

        function renderDetails(product) {
            var featuresFunc = () => {
                if (product.features) {
                    var features = product.features.map(feature => {
                        var featuresIconName = feature.id;
                        return (
                            <div className="features-icons-area">
                                <img src={that.props.imagePath + `/features/${featuresIconName}.png`} label={feature.label} key={`feature-${product.id}-${feature.id}`} className="featuresIcons"
                                    id={`${feature.id}`}
                                    onMouseOver={handleIconHover}
                                    onMouseLeave={handleIconLeave}/>
                                {renderIconHover(feature.id, feature.label, 0)}
                            </div>
                        )
                    })
                    return features;
                }
            }

            var careFunc = () => {
                if (product.care) {
                    var care = product.care.map(item => {
                        var careIconName = item.id;
                        return (
                            <div className="care-icons-area">
                                <img src={that.props.imagePath + `/care/${careIconName}.png`} alt={item.label} label={item.label} className="careIcons" key={`care-${product.id}-${item.id}`}
                                id={`${item.id}`}
                                onMouseOver={handleIconHover}
                                onMouseLeave={handleIconLeave}/>
                            {renderIconHover(item.id, item.label, 1)}
                            </div>
                        )
                    })
                    return care;
                }
            }

            var iconsFunc = () => {
                if (product.icons) {
                    var icons = product.icons.map(icon => {
                        var counter = product.icons.length;
                        var iconName = icon.id;
                        return (
                            <div>
                                <img src={that.props.imagePath + `/icons/${iconName}.png`} label={icon.label} alt={icon.label} className={counter < 5
                                    ? "detailsImage4"
                                    : counter == 5
                                        ? "detailsImage5"
                                        : "detailsImage6"} key={`icon-${product.id}-${icon.id}`}/>
                            </div>
                        )
                    })
                    return icons;
                }
            }

            if (showMoreDetails) {
                function renderFeaturesPflege() {
                    if (product.attribute_set !== "belts") {
                        return (
                            <div className="details-care-features-area">
                                <div className="features">
                                    <p className="features-title">{$.mage.__('Features')}:
                                    </p>
                                    <div className="features-icons-area">{featuresFunc(product)}</div>
                                </div>
                                <div className="care">
                                    <p className="pflege-title">{$.mage.__('Pflege')}:
                                    </p>
                                    <div className="care-icons-area">{careFunc(product)}</div>
                                </div>
                            </div>
                        )
                    }
                }
                return (
                    <div>
                        <div className="style"
                            dangerouslySetInnerHTML={{__html: product.description.slice(0,150)}}>
                            </div>
                        <div className="fabric">
                            <img src={that.props.imagePath + "/fabric.png"}/>
                            <span className="fabricText">
                                {product.composition}{' '}
                                |{' '}{product.weight}
                            </span>
                        </div>
                        {renderFeaturesPflege()}
                        <div className="icons-area">
                            {iconsFunc(product)}
                        </div>
                    </div>
                )
            }
        }

        function renderModal(product, isModalOpen) {
            var {chosenPicRoute, chosenColorIndex, chosenColorId, colorsArr} = that.state;
            if (isModalOpen) {
                return (
                    <div>
                        <B2B.BigImageModal isOpen={isModalOpen} product={product} onClose={closeModal} imagePath={that.props.imagePath} chosenPicRoute={chosenPicRoute} chosenColorIndex={chosenColorIndex} chosenColorId={chosenColorId} colorsArr={colorsArr}/>
                    </div>
                )
            }
        }

        return (
            <main>

                <div className="product-main">
                    {renderModal(product, isModalOpen)}
                    <div key={product.name} className="product-text-wrapper">
                        <hr className="style11"/>
                        <div className="image-and-colors">
                            <div className="main-image-wrapper">
                                <img src={chosenPicRoute} alt='No image found'/>
                                <div className="enlarge-icon-frame" onClick={openModal}>
                                    <img className="enlargeIcon" src={this.props.imagePath + "/enlarge.png"}/>
                                </div>
                            </div>

                            <div className="choose-colors-area">
                                <div className="smallColorsArea" onClick={getBigColors}>
                                    {colors}
                                </div>
                                <div className={showBigColors
                                    ? "colors-arrow-up"
                                    : "colors-arrow-down"} id={product.name} onClick={getBigColors}></div>
                                {renderBigColors(product)}
                            </div>

                        </div>
                        <div className="mainDetails">
                            <div className="product-main-title">
                                {product.name}
                            </div>
                            <div className="wk-price-question" onClick={productType=="trousers" ? handleClickOnQuestion : ""}>
                                <p className="price">
                                    {$.mage.__('AB')} {' '}{ options.props.language=="de" ? product.ek.toLocaleString("de-DE", {
                                      minimumFractionDigits: 2,
                                      maximumFractionDigits: 2
                                    }) : product.ek.toFixed(2)}
                                    {options.props.currencySymbol}
                                </p>
                                <img className="wk-question-btn" src={`${options.props.imagePath}/Iconsammlung-16.svg`}
                                style={productType=="trousers" ? {display:"inline"} : {display:"none"}}/>
                            </div>


                            <div
                                 className="product-short-description" dangerouslySetInnerHTML={{__html: product.short_description.toLowerCase()}}></div>
                        </div>
                        <div className="more-details-area" onClick={getMoreDetails}>
                            <div className="details-title-area">
                                <h3 className="details-title" id={product.name}>
                                    {$.mage.__('Details')}
                                    <div onClick={getMoreDetails} className={showMoreDetails
                                        ? "details-arrow-up"
                                        : "details-arrow-down"} id={product.name}></div>
                                </h3>
                            </div>
                            {renderDetails(product)}
                        </div>
                    </div>
                    {renderEachColor(product.colors)}
                </div>
            </main>
        )
    }
}
