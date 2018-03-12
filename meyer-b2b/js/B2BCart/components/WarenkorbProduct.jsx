B2BCart.WarenkorbProduct = class extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            product: this.props.product,
            overSizeClicked: false
        }
    }


    render() {
        var {product} = this.state;
        var {basePath, imagePath} = options.props;
        var {optionType, handleClickOnQuestion, handleErrorInBestellung} = this.props;
        function renderEachColor(colors) {
            var arrOfColors=[];
            for (var key in colors) {
              arrOfColors.push(colors[key]);
            }
            return arrOfColors.map((color, index) => {
                return (
                    <div className="wk-color-area">
                        <B2BCart.WarenkorbSizes color={color}
                            optionType={optionType}
                            handleErrorInBestellung={handleErrorInBestellung}/>
                        <hr className={index==arrOfColors.length-1 ? "style1" : "style2"}/>
                    </div>
                )
            })
        }

        return (
            <div>
                <div className="wk-title-area">
                <h2 className="wk-product-title">{product.name}                </h2>
                    <a href={`${basePath}catalogsearch/result/?q=${product.id}`}>
                    <img className="edit-btn" src={`${imagePath}/edit-btn.png`}/>
                    </a>
                <div className="wk-price-question" onClick={product.attribute_set=="trousers" ? handleClickOnQuestion : ""}>
                    <p className="wk-price">
                         AB {' '}{options.props.language=="de" ? product.ek.toLocaleString("de-DE", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2
                        }) : product.ek.toFixed(2)}
                        {options.props.currencySymbol}
                    </p>
                    <img className="wk-question-btn" src={`${imagePath}/Iconsammlung-16.svg`}
                        style={product.attribute_set=="trousers" ? {display:"inline"} : {display:"none"}}/>
                    </div>
                    </div>
                <hr className="style2"/>
                <div className="wk-color-area">
                    {renderEachColor(product.colors)}
                </div>
            </div>
        )
    }

}
