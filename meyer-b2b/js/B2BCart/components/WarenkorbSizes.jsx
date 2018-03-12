B2BCart.WarenkorbSizes = class extends React.Component {
    constructor(props) {
        super(props);
        var optionId;
        this.props.productType == 'belts'
            ? optionId = 147
            : optionId = 122;

        var color = this.props.color;

        var deletedSizes = {};
        var changedQtyFlag = false;

        color.systems.map((system) => {
            system.groups.map((group) => {
                group.sizes.map((size) => {
                    if (size.qty > size.stock) {
                        changedQtyFlag = true;
                        this.props.handleErrorInBestellung();
                        deleteFromWarenkorb(size.item_id).then(response => {
                            console.log('deleted');
                            console.log(response);
                            if (size.stock == 0) {
                                deletedSizes[size.item_id] = {
                                    name: size.size_name,
                                    group: group.name
                                };

                            } else {
                                let temp = {};
                                var {color, quoteId, optionId} = this.state;
                                temp.cartItem = {
                                    sku: color.sku,
                                    qty: size.stock,
                                    quote_id: quoteId,
                                    product_option: {
                                        extension_attributes: {
                                            configurable_item_options: [
                                                {
                                                    option_id: optionId,
                                                    option_value: size.id
                                                }
                                            ]
                                        }
                                    }
                                }
                                console.log(temp);
                                postToTheWarenkorb(temp).then(response => {
                                    console.log("posted");
                                })
                            }
                        })
                    }

                })
            })
        })

        this.state = {
            color: this.props.color,
            language: options.props.language,
            deletedSizes: deletedSizes,
            quoteId: options.props.quoteId,
            optionId: optionId,
            changedQtyFlag: changedQtyFlag
        }
    }

    render() {
        var {color, language, changedQtyFlag} = this.state;
        var systemsFunc = systems => {
            var systems = systems.map(system => {
                var sysType = system.id;
                var groups = system.groups.map(group => {
                    var groupName;
                    if (sysType == "inch_size") {
                        groupName = group.name.slice(group.name.indexOf(" ") + 1);
                    } else {
                        groupName = "";
                    }
                    if (language == "fr") {
                        var sizes = group.sizes.map(size => {
                            return (
                                <div className="fr-wk-measures" key={"wk" + size.sku + "-" + size.id}>
                                    <p className="fr-wk-measure">{size.size_name}</p>
                                    <p className="fr-wk-alt-measure">{size.alt_label
                                            ? size.alt_label
                                            : " "}</p>
                                    <div className={size.qty > size.stock
                                        ? "wk-qty-box-error"
                                        : "wk-qty-box"}>
                                        <p>{size.qty > size.stock
                                                ? size.stock
                                                : size.qty}</p>
                                    </div>
                                </div>
                            )
                        })
                    } else {
                        var sizes = group.sizes.map(size => {
                            return (
                                <div className="wk-measures" key={"wk" + size.sku + "-" + size.id}>
                                    <p className="wk-measure">{size.size_name}</p>
                                    <div className={size.qty > size.stock
                                        ? "wk-qty-box-error"
                                        : "wk-qty-box"}>
                                        <p>{size.qty > size.stock
                                                ? size.stock
                                                : size.qty}</p>
                                    </div>
                                </div>
                            )
                        })
                    }
                    return (
                        <div className="sizesArea" key={"wk-" + group.name}>
                            <div className="size-title-block">
                                <div className="size-title">{groupName}</div>
                            </div>
                            <div className="wk-sizesBox">
                                {sizes}
                            </div>
                        </div>
                    )
                })
                return (
                    <div className="wk-system-area" key={"wk-" + system.name}>
                        {groups}
                    </div>
                )
            })
            return systems;
        }

        function renderMessage() {
            if (changedQtyFlag) {
                return (
                    <div className="wk-message-area">
                        <p>{$.mage.__('Die Bestellmenge für die markierten Größen wurde auf die maximal verfügbare Anzahl reduziert. Eine Anpassung ist über das Stift-Icon möglich.')}
                        </p>
                    </div>
                )
            }
        }

        return (
            <div>
                <div className="wk-color-area">
                    <div className="wk-colorTitle-area">
                        <div className="wk-product-colorCircle" style={{
                            backgroundColor: color.color.webcolor
                        }}>
                            <p className="colorNum">{color.color.id}</p>
                        </div>

                        <h3 className="wk-colorName">{color.color.name}
                            <span>{color.depot}</span>
                        </h3>
                        <p className="menge-number">{color.product_total_qty}</p>
                        <p className="betrag-number">{    options.props.language=="de" ? color.product_total_brutto.toLocaleString("de-DE", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2
                            }) : color.product_total_brutto.toFixed(2)} {options.props.currencySymbol}</p>

                    </div>
                    {systemsFunc(color.systems)}
                    {renderMessage()}
                </div>

            </div>
        )
    }

}
