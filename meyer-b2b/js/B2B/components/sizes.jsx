B2B.Sizes = class extends React.Component {
    constructor(props) {
        super(props);
        var {sku} = this.props.color;
        this.state = {
            color: this.props.color,
            sku: sku,
            bestellung: 0,
            sizesArr: [],
            cartId: this.props.cartId,
            inputBoxesState: {},
            activeSizeId: 0,
            activeSizeObj: {},
            lastAddedNumber: 0,
            openAlertModal: {},
            productType: this.props.productType,
            customerGroup: options.props.customerGroupId

        }
        this.handleChange = this.handleChange.bind(this);
        this.countingOrders = this.countingOrders.bind(this);
        this.closeAlertModal = this.closeAlertModal.bind(this);
        this.prepareForWarenKorb = this.prepareForWarenKorb.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
    }

    componentDidMount() {
        let {sizesArr, inputBoxesState} = this.state;
        sizesArr.map(item => {
            if (item.qty > 0) {
                inputBoxesState[item.id] = {};
                inputBoxesState[item.id].orders = item.qty;
                inputBoxesState[item.id].approved = true;
                inputBoxesState[item.id].itemId = item.item_id;
            }
        })
        this.setState({inputBoxesState});
        this.countingOrders();
    }

    handleBlur(e) {
        if (options.props.quoteId.length == 0) {
            window.location.href = `${options.props.basePath}customer/account/login/`;
        } else {
            let id = e.target.id.slice(e.target.id.indexOf('-') + 1);
            if (e.target.value > 0 && this.state.inputBoxesState[id] || e.target.value == 0 && this.state.inputBoxesState[id] && this.state.inputBoxesState[id].itemId) {
                this.prepareForWarenKorb(id);
            }
        }
    }

    closeAlertModal() {
        var id = this.state.activeSizeObj.id;
        var sku = this.state.sku;
        let target = "size" + sku + "-" + id;
        this.setState({openAlertModal: {}});
        let tempParent = document.getElementById("wrapper-and-filters");
        tempParent.removeChild(alertOverlay);

        $('#' + target).focus();
    }

    prepareForWarenKorb(id) {
        let {
            inputBoxesState,
            sku,
            activeSizeObj,
            cartId,
            categoryId,
            productType
        } = this.state;
        let qty = inputBoxesState[id].orders;
        let target = "size" + sku + "-" + id;
        var optionId;
        productType == 'belts'
            ? optionId = 147
            : optionId = 122;

        if (inputBoxesState[id].orders == 0 && inputBoxesState[id].itemId) {
            deleteFromWarenkorb(inputBoxesState[id].itemId).then(response => {
                inputBoxesState[id].approved = true;
                delete inputBoxesState[id].itemId;
                this.setState({inputBoxesState});
            })
        } else if (!jQuery.isEmptyObject(activeSizeObj)) {
            let temp = {};
            temp.cartItem = {
                sku: sku,
                qty: qty,
                quote_id: cartId,
                product_option: {
                    extension_attributes: {
                        configurable_item_options: [
                            {
                                option_id: optionId,
                                option_value: id
                            }
                        ]
                    }
                }
            }

            if (inputBoxesState[id].itemId) {
                var itemId = inputBoxesState[id].itemId;
                deleteFromWarenkorb(itemId).then(response => {
                    postToTheWarenkorb(temp).then(response => {
                        if (response == "error") {
                            $('#' + target).val("");
                            inputBoxesState[id] = {};
                            inputBoxesState[id].orders = 0;
                            this.setState({inputBoxesState});
                            this.countingOrders();
                        } else {
                            inputBoxesState[id].approved = true;
                            inputBoxesState[id].itemId = response["item_id"];
                            this.setState({inputBoxesState});
                        }
                    })
                })
            } else {
                postToTheWarenkorb(temp).then(response => {
                    if (response == "error") {
                        $('#' + target).val("");
                        inputBoxesState[id] = {};
                        inputBoxesState[id].orders = 0;
                        this.setState({inputBoxesState});
                        this.countingOrders();
                    } else {
                        inputBoxesState[id].approved = true;
                        inputBoxesState[id].itemId = response["item_id"];
                        this.setState({inputBoxesState});
                    }
                })
            }
        }
    }

    countingOrders() {
        var {inputBoxesState} = this.state;
        var sum = 0;
        for (var key in inputBoxesState) {
            if (parseInt(inputBoxesState[key].orders) > 0) {
                sum += parseInt(inputBoxesState[key].orders);
            }
        }
        this.setState({bestellung: sum})
    }

    handleChange(e) {
        e.preventDefault();
        var {inputBoxesState, bestellung, openAlertModal, sku} = this.state;
        var {countingOrders} = this;
        var order = e.target.value;
        if (order % 1 !== 0) {
            alert('Bitte geben Sie nur Zahlen ein');
            e.target.value = '';
        } else {
            if (order == '') {
                order = 0;
            }
            var target = e.target.id;
            var orderId = target.slice(target.indexOf('-') + 1);
            var activeSizeObj = this.state.sizesArr.filter(size => {
                return parseInt(size.id) == parseInt(orderId);
            })
            this.setState({activeSizeObj: activeSizeObj[0]});
            if (parseInt(order) > activeSizeObj[0].stock) {
                e.target.value = '';
                $('#' + target).blur();
                openAlertModal[sku] = {};
                openAlertModal[sku][activeSizeObj[0].id] = true;
                this.setState({openAlertModal});
                inputBoxesState[orderId] = {};
                inputBoxesState[orderId].orders = 0;
                this.setState({inputBoxesState});
                countingOrders();
            } else {
                if (inputBoxesState[orderId]) {
                    inputBoxesState[orderId].approved = false;
                    this.setState({inputBoxesState});
                }
                if (inputBoxesState[orderId]) {
                    inputBoxesState[orderId].orders = order;
                    this.setState({inputBoxesState});
                } else {
                    inputBoxesState[orderId] = {};
                    inputBoxesState[orderId].orders = order;
                    this.setState({inputBoxesState});
                }
                countingOrders();
            }
        }
    }

    render() {
        var that = this;
        var {
            color,
            bestellung,
            sizesArr,
            inputBoxesState,
            sku,
            openAlertModal,
            productType,
            customerGroup
        } = this.state;
        var {handleChange, handleClickEvent, countingOrders, closeAlertModal, handleExistingQty} = this;
        var {productName} = this.props;
        function renderAlertModal(stock, id) {
            if (openAlertModal[sku]) {
                if (openAlertModal[sku][id]) {
                    return (
                        <div>
                            <B2B.AlertModal stock={stock} productName={productName} closeAlertModal={closeAlertModal}/>
                        </div>
                    )
                }
            }
        }
        var systemsFunc = systems => {
            var {sku} = this.state;
            var systems = systems.map(system => {
                var groups = system.groups.map(group => {
                    var sizes = group.sizes.map(size => {
                        sizesArr.push(size);
                        if (size.alt_label) {
                            return (
                                <div className="fr-measures" key={sku + "-" + size.id}>
                                    <p className="fr-measure">{size.name}</p>
                                    <p className="fr-alt-measure">{size.alt_label}</p>
                                    <input type="text" defaultValue={size.qty > 0
                                        ? size.qty
                                        : size.available == false
                                            ? '/'
                                            : ''} className={(inputBoxesState[size.id] && inputBoxesState[size.id].orders > 0 && inputBoxesState[size.id].approved == true) || (inputBoxesState[size.id] && inputBoxesState[size.id].orders == 0 && inputBoxesState[size.id].approved == true)
                                        ? "fr-inputHighlighted"
                                        : "fr-input"} id={"size" + sku + "-" + size.id} disabled={size.available == false && !size.qty
                                        ? true
                                        : false} onChange={handleChange} onBlur={this.handleBlur}></input>
                                    {renderAlertModal(size.stock, size.id)}
                                </div>
                            )
                        } else
                            return (
                                <div className="measures" key={sku + "-" + size.id}>
                                    <p className="measure">{size.name}</p>
                                    <input type="text" defaultValue={size.qty > 0
                                        ? size.qty
                                        : size.available == false
                                            ? '/'
                                            : ''} className={(inputBoxesState[size.id] && inputBoxesState[size.id].orders > 0 && inputBoxesState[size.id].approved == true) || (inputBoxesState[size.id] && inputBoxesState[size.id].orders == 0 && inputBoxesState[size.id].approved == true)
                                        ? "inputHighlighted"
                                        : "input"} id={"size" + sku + "-" + size.id} disabled={size.available == false && !size.qty
                                        ? true
                                        : false} onChange={handleChange} onBlur={this.handleBlur}></input>
                                    {renderAlertModal(size.stock, size.id)}
                                </div>
                            )
                    })
                    return (
                        <div className="sizesArea" key={group.name}>
                            <div className="size-title-block">
                                <div className="size-title">{group.name}</div>
                            </div>
                            <div className="sizesBox">
                                {sizes}
                            </div>
                        </div>
                    )
                })
                return (
                    <div className="system-area" key={system.name}>
                        <div className="size-lang-title" style={productType == "trousers"
                            ? {
                                dispaly: "block"
                            }
                            : {
                                display: "none"
                            }}>
                            {system.name}
                        </div>
                        {groups}
                    </div>
                )
            })
            return systems;
        }
        return (
            <div key={color.sku} className="product-color-area">
                <hr className="style22"/>
                <div className="each-color-title">
                    <div className="product-colorCircle" style={{
                        backgroundColor: color.color.webcolor
                    }}>
                        <p className="colorNum">{color.color.id}</p>
                    </div>
                    <div className="colorText">
                        <h3 className="colorName">{color.color.name} {"  "}<span>{color.depot}</span>
                        </h3>
                        <p className="bestellung">{$.mage.__('Bestellung')}:
                            <span className="bestellungNum">
                                {bestellung}
                            </span>
                        </p>
                    </div>
                </div>
                {systemsFunc(color.systems)}
            </div>
        )
    }
};
