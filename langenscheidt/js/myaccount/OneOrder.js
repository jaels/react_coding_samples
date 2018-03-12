import {h, render, Component} from 'preact';
import OneItem from './OneItem';
import Rechnungen from './Rechnungen';
import Tracking from './Tracking';


export default class OneOrder extends Component {

  constructor(props) {
    super(props);
    var {item, addData, index, countries, themePath} = this.props;
    this.state = {
      item: item,
      addData: addData,
      index: index,
      countries: countries,
      themePath: themePath,
      showBills: false,
      showTracking: false
    }

    this.handleShowBills = this.handleShowBills.bind(this);
    this.handleShowTracking = this.handleShowTracking.bind(this);

  }

  handleShowBills() {
    this.setState({
      showBills: !this.state.showBills
    });
  }

  handleShowTracking() {
      this.setState({
        showTracking: !this.state.showTracking
      });

  }

  render() {
    var {
      item,
      addData,
      index,
      countries,
      showBills,
      showTracking,
      themePath
    } = this.state;
    var {handleShowBills, handleShowTracking} = this;
    var orderredItems = item.items.map((book, index) => {
      return (
        <div key={`order_${item.sku}`}>
          <OneItem book={book} index={index}/>
        </div>
      )
    })

    function getCountryName(id) {
      let name = countries.filter((country) => {
        return country.id == id;
      })
      return name[0].full_name_locale;
    }

    function renderOrderInfo() {
      if (showBills) {
        return (
          <div>
            <Rechnungen data={addData} themePath={themePath}/>
          </div>
        )
      }
      else if (showTracking) {
          return (
              <div>
                <Tracking data={addData}/>
              </div>
          )
      }
      else
        return (
          <div>
            <div class="row">
              <div class="col-md-4">
                <div class="s-account__address">
                  <h5>{Drupal.t("Rechnungsadresse")}</h5>
                  <p>{item.billing_address.firstname + " " + item.billing_address.lastname}</p>
                  <p>{item.billing_address.street[0]}</p>
                  <p>{item.billing_address.postcode + " " + item.billing_address.city}</p>
                  <p>
                    {getCountryName(item.billing_address.country_id)}</p>
                </div>
              </div>
              <div class="col-md-4 col-md-push-2">
                <div class="s-account__address">
                  <h5>{Drupal.t("Versandadresse")}</h5>
                  <p>{addData.shipping_address.firstname + " " + addData.shipping_address.lastname}</p>
                  <p>{addData.shipping_address.street}</p>
                  <p>{addData.shipping_address.postcode + " " + addData.shipping_address.city}</p>
                  <p>
                    {getCountryName(addData.shipping_address.country_id)}</p>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-md-4">
                <div class="s-account__address">
                  <h5>{Drupal.t("Versandmethode")}</h5>
                  <p>{item.shipping_description}</p>
                </div>
              </div>
              <div class="col-md-4 col-md-push-2">
                <div class="s-account__address">
                  <h5>{Drupal.t("Zahlungsmethode")}</h5>
                  <p>{item.payment.additional_information[0]}</p>
                </div>
              </div>
            </div>
          </div>
        )
    }
    return (
      <div class="panel-body">
        <row>
          <p style={{
            marginBottom: "0rem"
          }}>{Drupal.t("Vom")}:
            <span style={{
              color: "#000000"
          }}>{" " + new Intl.DateTimeFormat('de-DE').format(new Date(item.created_at))}</span>
          </p>
        </row>
        <row>
          <p style={{
            marginBottom: "3rem"
          }}>{Drupal.t("Status")}:
            <span style={{
              color: "#000000"
          }}>{" " + item.status}</span>
          </p>
        </row>
        <div id="organisms-account-download-first-row" class="sg-pattern">
          {orderredItems}
        </div>
        <div class="bestellung-sums-area">
          <div class="row s-checkout__panel__order">
            <div class="col-xs-9 col-xs-push-0 col-sm-9">
              <div class="s-checkout__panel__order__title">{Drupal.t("Zwischensumme")}</div>

            </div>
            <div class="col-xs-3 col-xs-push-0 col-sm-1 col-sm-push-2">
              <div class="s-checkout__panel__order__price">{item.subtotal_incl_tax}
                €</div>
            </div>
          </div>
          <div class="row s-checkout__panel__order">
            <div class="col-xs-9 col-xs-push-0 col-sm-9">
              <div class="s-checkout__panel__order__title">{Drupal.t("Versandkosten")}</div>

            </div>
            <div class="col-xs-3 col-xs-push-0 col-sm-1 col-sm-push-2">
              <div class="s-checkout__panel__order__price">{item.shipping_amount.toFixed(2)}
                €</div>
            </div>
          </div>
        </div>
        <div class="bestellung-gesamt-area">
          <div class="row s-checkout__panel__order">
            <div class="col-xs-9 col-xs-push-0 col-sm-9">
              <div class="s-checkout__panel__order__title bestellung-gesamt-text">{Drupal.t("Gesamtpreis")}</div>

            </div>
            <div class="col-xs-3 col-xs-push-0 col-sm-2 col-sm-push-1 col-md-1 col-md-push-2">
              <div class="s-checkout__panel__order__price bestellung-gesamt-num">{item.grand_total.toFixed(2)}
                €</div>
              <div class="s-pdp__basket__description__vat">{Drupal.t("Preise inkl. MwSt.")}</div>
            </div>
          </div>
        </div>
        <hr class="bestellung-blue"/>
        <h3 style={{
          marginTop: "3rem"
        }}>{showBills == true
            ? Drupal.t("Rechnungen")
            : showTracking == true ? Drupal.t("Versandinformationen") : Drupal.t("Bestellinformationen")}</h3>
        {renderOrderInfo()}

        <div class="row">
          <div class={addData.has_invoices > 0 && showTracking==false ? "col-md-4 col-sm-6 col-xs-12" : "noDisplay" }>
            <div class="s-button--submit"
              onClick={handleShowBills}><div>{showBills == true
                ? Drupal.t("schließen")
                : addData.has_invoices > 1
                  ? Drupal.t("Rechnungen anzeigen")
                  : Drupal.t("Rechnung anzeigen")}</div>
            </div>
          </div>
          <div class={addData.has_shipments > 0 && showBills==false ? "col-md-4 col-sm-6 col-xs-12" : "noDisplay"}>
            <div class= "s-button--submit"
          onClick={handleShowTracking}><div>{showTracking == true
                ? Drupal.t("schließen")
                : "  " + Drupal.t("Sendung Verfolgung") + "  "}</div>
            </div>
          </div>
        </div>

      </div>
    )
  }

}
