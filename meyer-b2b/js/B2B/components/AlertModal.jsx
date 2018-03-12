B2B.AlertModal = class extends React.Component {
    constructor(props) {
        super(props);
        var alertOverlay = $('<div></div>').prependTo('#wrapper-and-filters').attr('id', 'alertOverlay');
    }

    render() {
        return (
            <div className="alert-container">
                <h5 className="alert-title">{this.props.productName}</h5>
                <p className="alert-text">
                    {$.mage.__("ist momentan nicht in der gewünschten Anzahl verfügbar. Die Höchstbetellmenge für diese Größe beträgt")} <span> maximal {this.props.stock}</span> {$.mage.__(' Stück')}</p>
                <button onClick={this.props.closeAlertModal} className="closeAlert-btn"> Wert ändern </button>
            </div>
        )
    }
}
