B2BCart.App = class extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            theOrders: [],
            gesamtMenge: 0,
            gesamtBetrag: 0,
            checkBoxState: false,
            overSizeClicked: false,
            changedQtyFlag:false,
            isLoading: true,
            isEmptyFlag: false,
            hoverOnButton: false,
            language: options.props.language
        }

        this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
        this.handleClickOnQuestion = this.handleClickOnQuestion.bind(this);
        this.handleBestellung = this.handleBestellung.bind(this);
        this.handleErrorInBestellung = this.handleErrorInBestellung.bind(this);
        this.handleHoverOnButton = this.handleHoverOnButton.bind(this);
        this.handleLeaveButton = this.handleLeaveButton.bind(this);
    }

    componentDidMount() {
        getTheWarenkorb().then((response) => {
            console.log(response);
            if(response.items.length==0) {
                this.setState({isEmptyFlag: true})
            }
            let gesamtBetrag;
            options.props.language=="de" ? gesamtBetrag = response.grand_total.toLocaleString("de-DE", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
          }) : gesamtBetrag = response.grand_total.toFixed(2);

            this.setState({theOrders: response.items, gesamtMenge: response.items_qty, gesamtBetrag: gesamtBetrag});
            this.setState({isLoading: false});
        });
    }

    handleCheckboxChange() {
        this.setState({
            checkBoxState: !this.state.checkBoxState
        });
    }

    handleClickOnQuestion() {
        var {overSizeClicked} = this.state;
        if(!overSizeClicked) {
            $("body").css("overflow-y", "hidden")
        }
        else {
            $("body").css("overflow-y", "visible");
            let tempParent = document.getElementsByTagName("body")[0];
            tempParent.removeChild(osOverlay);
        }

        this.setState({
            overSizeClicked: !overSizeClicked
        })
    }

    handleBestellung() {
        console.log('bestellung clicked');
        var {checkBoxState} = this.state;
        var customerNote = $(".komentar-area").val();
        if(!checkBoxState) {
            alert ($.mage.__("Bitte überprüfen Sie das gewünschte Feld"));
        }
        else {
            let temp = {
                "paymentMethod": {
                    "method": "free",
                    "additional_data": {
                        "customer_note": customerNote
                    }
                }
            }
            putTheBestellung(temp).then(response=> {
                console.log(response);
                if(response!=="error") {
                    window.location.href = `${options.props.basePath}checkout/onepage/success`;
                }
                else {
                        location.reload();
                }
            })
        }
    }

    handleErrorInBestellung () {
        this.setState({changedQtyFlag:!this.state.changedQtyFlag});
    }

    handleHoverOnButton () {
        this.setState({hoverOnButton:true})
    }

    handleLeaveButton() {
        this.setState({hoverOnButton:false})
    }

    render() {
        var {
            theOrders,
            gesamtBetrag,
            gesamtMenge,
            checkBoxState,
            language,
            overSizeClicked,
            changedQtyFlag,
            isLoading,
            isEmptyFlag,
            hoverOnButton
        } = this.state;
        var {handleCheckboxChange, handleClickOnQuestion, handleBestellung, handleErrorInBestellung, handleHoverOnButton, handleLeaveButton} = this;
        var {imagePath, basePath} = options.props;
        function renderProducts(theOrders) {
            return theOrders.map(product => {
                return (
                    <div className="wk-product" id={product.id} key={"wk-" + product.id}>
                        <B2BCart.WarenkorbProduct product={product} optionType={product.attribute_set} handleClickOnQuestion={handleClickOnQuestion}
                        handleErrorInBestellung={handleErrorInBestellung}    />
                    </div>
                )
            })
        }
        function renderBottomElements() {
            if (theOrders.length > 0) {
                return (
                    <div>
                        <textarea className="komentar-area" placeholder={$.mage.__("Ihr Kommentar zur Bestellung (optional)")}></textarea>
                        <div className="wk-checkbox-area">
                            <input type="checkbox" className="wk-checkbox" id="checkbox-img"></input>
                            <label for="checkbox-img" style={checkBoxState
                                ? {
                                    background: `url(${imagePath}/checkbox-btn.png) no-repeat`
                                }
                                : {
                                    backgroundColor: "white"
                                }} onClick={handleCheckboxChange}></label>
                            <div className="wk-checkbox-text">
                                {$.mage.__('Ich habe die Tabelle für Übergrößenzuschläge gesehen und bin einverstanden.')}

                            </div>
                        </div>

                        <button id="abschicken-btn" onClick={handleBestellung}
                            onMouseOver={handleHoverOnButton} onMouseOut={handleLeaveButton}>
                            {$.mage.__('Bestellung abschicken')}
                            <img src={hoverOnButton ? `${imagePath}/arrow_right-30.svg` : `${imagePath}/arrow_right-white-31.svg`} className="wk-thin-arrow-right"/>
                        </button>

                        <div className="weiterEinkaufen-area">
                            <img src={`${imagePath}/backArrow.png`}/>
                            <a href={`${basePath}hosen`} className="weiter-txt">{$.mage.__('Weiter einkaufen')}</a>
                        </div>
                    </div>
                )
            }
        }

        function renderOverSizeModal() {
            if (overSizeClicked) {
                return (
                    <div>
                        <B2BCart.OverSizePriceModal handleClickOnQuestion={handleClickOnQuestion}/>
                    </div>
                )
            }
        }

        function renderUpperError() {
                if(changedQtyFlag) {
                    return (
                        <div className="upper-error-message">
                            <img src={`${imagePath}/error.png`}/>
                            <h4> {$.mage.__('Einige Produkte sind nicht in der gewünschten Menge verfügbar. Die Bestellmengen wurden angepasst.')}</h4>
                            <p onClick={handleErrorInBestellung}>x</p>
                        </div>
                    )
                }
        }
        function renderLoadingModal () {
            if(isLoading) {
                return (
                    <div>
                        <B2B.LoadingModal/>
                    </div>
                )
            }
        }

        return (
            <div id="wk-wrapper">
                {renderUpperError()}
                {renderLoadingModal()}
                <header>
                    <p className={isLoading ? "" : "warenKorb-produkte"}>
                        {isLoading ? "" : isEmptyFlag ? $.mage.__("Der Warenkorb ist leer") : gesamtMenge + ' ' + $.mage.__('Produkte')}
                    </p>
                </header>

                <div className={isLoading ? "warenKorb-table-hiding" : "warenKorb-table"}>

                    <p className="table-headers" id="artikelTitle">{$.mage.__('ARTIKEL')}</p>
                    <p className="table-headers" id="mengeTitle">{$.mage.__('MENGE')}</p>
                    <p className="table-headers" id="betragTitle">{$.mage.__('BETRAG')}</p>
                    <hr className="style1"/> {renderProducts(theOrders)}
                </div>
                {renderOverSizeModal()}

                <div className="gesamt-numbers">
                    <p className="gesamtbetrag-title">{gesamtMenge > 0
                            ? $.mage.__('Gesamtbetrag:')
                            : ""}</p>
                    <p className="gesamt-menge-number">{gesamtMenge > 0
                            ? gesamtMenge
                            : ""}</p>
                    <p className="gesamt-betrag-number">{gesamtMenge > 0
                            ? gesamtBetrag + " " + options.props.currencySymbol
                            : ""}</p>
                </div>
                {renderBottomElements()}
            </div>
        )
    }
}
