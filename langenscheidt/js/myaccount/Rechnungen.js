import {h, render, Component} from 'preact';


export default class Rechnungen extends Component {

  constructor(props) {
    super(props);
    let {data, themePath} = this.props;

    const isDrupalEnvironment = (typeof window.drupalSettings === 'object');
    const magentoHost = (isDrupalEnvironment) ? (window.drupalSettings.magentoHost || 'http://lgs-shop.sirup.priv') : '';

    const magentoStoreViewPartial = (isDrupalEnvironment && window.drupalSettings.magentoStoreView) ? ('/' + window.drupalSettings.magentoStoreView) : '';
    const pdfUrl = magentoHost + magentoStoreViewPartial + '/pdf_invoice/download/pdf/invoice_id/';


    this.state = {
        data: data,
        invoices: data.invoices.items,
        themePath: themePath,
        pdfUrl: pdfUrl
    }



}

render() {
    var {invoices, themePath, pdfUrl} = this.state;
    var renderInvoices = invoices.map((invoice, index)=>{
        return (
            <div class="row">
            <div class="col-xs-4">
            {new Intl.DateTimeFormat('de-DE').format(new Date(invoice.created_at))}
            </div>
            <div class="col-xs-4">
            {parseInt(invoice.base_subtotal_incl_tax).toFixed(2)}
              €
            </div>
            <div class="col-xs-4">
            <a href={pdfUrl + invoice.entity_id + "/"}>
            <img
             src={'/' + themePath + '/images/logo/button-download-klein.png'} style={{width:"70px", height:"25px"}}/></a>
            </div>
            </div>
        )
    })
    return (
        <div>
        <div class="row">
        <div class="col-xs-4">
          <div class="s-font--copytext s-basket__headertext s-basket__headertext--first">{Drupal.t("Datum")}</div>
        </div>
        <div class="col-xs-4">
          <div class="s-font--copytext s-basket__headertext s-basket__headertext--first">{Drupal.t("Summe")}</div>
        </div>
        <div class="col-xs-4">
          <div class="s-font--copytext s-basket__headertext s-basket__headertext--first">{Drupal.t("Download")}</div>
        </div>
        </div>
            {renderInvoices}
        </div>
    )
}


}
