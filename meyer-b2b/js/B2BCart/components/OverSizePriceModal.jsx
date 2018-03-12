B2BCart.OverSizePriceModal = class extends React.Component {
    constructor(props) {
        super(props);
        console.log(options.props);
        var osOverlay = $('<div></div>').prependTo('body').attr('id', 'osOverlay');

    }
    render() {
        var {customerGroupId, imagePath} = options.props;
        return (
                <div className="os-table-area" >
                    <div className="os-text-area">
                        <div id="os-close-btn" onClick={this.props.handleClickOnQuestion}>x</div>
                        <h4 className="os-table-title">{$.mage.__('Übergrößentabelle')}</h4>
                        <div className="os-table-headlines">
                            <p>{$.mage.__('ZUSCHLAG')}</p>
                            <p>{$.mage.__('GRÖSSEN')}</p>
                        </div>

                    </div>
                    <div className="os-img-area">
                        <img src={customerGroupId==12 ? `${imagePath}/oversize-table_GB.svg` : customerGroupId==14 || customerGroupId==15 ? `${imagePath}/oversize-table_FR.svg` : customerGroupId==28 ? `${imagePath}/oversize-table_IT.svg` : `${imagePath}/oversize-table_DE.svg`  }
                            className="os-table-img"/>
                        </div>
                </div>
        )

    }

}
