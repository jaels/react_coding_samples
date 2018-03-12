import {h, render, Component} from 'preact';
import DeleteAddressModal from './DeleteAddressModal';
import AddressenForm from './AddressenForm';


export default class Addressen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      customerInfo: this.props.customerInfo,
      addressesInfo: {},
      defaultBilling: {},
      defaultShipping: {},
      otherAddresses: [],
      originalOtherAddresses: [],
      gotTheInfo: false,
      renderForm: false,
      pressedAddressType: "",
      pressedAddressInfo: ""

    }

    this.splitotherAddresses = this.splitotherAddresses.bind(this);
    this.handleClickOnLoschen = this.handleClickOnLoschen.bind(this);
    this.handleClickOnPencil = this.handleClickOnPencil.bind(this);
    this.handleClickOnAbbrechen = this.handleClickOnAbbrechen.bind(this);
    this.handleChangeOfDetails = this.handleChangeOfDetails.bind(this);

  }

  componentWillMount() {
    var {splitotherAddresses} = this;
    {/*jQuery("html, body").animate({ scrollTop: 0 }, "slow");*/}
    SirupRestApi.customerGetAddresses().then((data) => {
      let info = data;
      var defaultBilling;
      var defaultShipping;

    if(info.default_billing) {
        defaultBilling =   info.addresses.filter((address)=> {
             return address.id == info.default_billing;
         })[0];
    }

    else {
        defaultBilling={};
    }


    if(info.default_shipping) {
        defaultShipping = info.addresses.filter((address)=> {
             return address.id == info.default_shipping;
         })[0];
    }

    else {
        defaultShipping={};
    }


       var otherAddresses = info.addresses.filter((address)=> {
            return (!info.default_shipping || address.id != info.default_shipping) && (!info.default_shipping || address.id != info.default_billing);
        })

      this.setState({addressesInfo: info, defaultBilling: defaultBilling, defaultShipping: defaultShipping, originalOtherAddresses: otherAddresses, otherAddresses: splitotherAddresses(otherAddresses)})
    }).then(() => {
      SirupRestApi.getCountries().then((data) => {
        this.setState({countries: data, gotTheInfo: true})
      })
    })
  }

  splitotherAddresses(otherAddresses) {
    var newArr = [];
    if (otherAddresses.length > 0) {
      otherAddresses.map((item, index) => {
        if (index % 2 === 1) {
          newArr.push(otherAddresses.slice(index - 1, index + 1))
        }
        if (index == otherAddresses.length - 1 && otherAddresses.length % 2 === 1) {
          newArr.push([item]);
        }
      })
    }
    return newArr;
  }

  handleClickOnLoschen(addressId) {
    var {customerInfo, originalOtherAddresses, addressesInfo} = this.state;
    var {splitotherAddresses} = this;
    SirupRestApi.customerDeleteAddress(addressesInfo, addressId).then((data) => {
    })
    let newOriginal = originalOtherAddresses.filter((address) => {
      return address.id !== addressId;
    })

    this.setState({
      originalOtherAddresses: newOriginal,
      otherAddresses: newOriginal.length > 0
        ? splitotherAddresses(newOriginal)
        : []
    })
  }

  handleClickOnPencil(type, id) {
      let {addressesInfo} = this.state;
      let chosenAddress;

      if(id>0)
      {
           chosenAddress = addressesInfo.addresses.filter((address)=> {
              return address.id == id;
          })
      }


    this.setState({renderForm: true,
    pressedAddressType: type, pressedAddressInfo: id > 0 ? chosenAddress[0] : "" })
  }

  handleClickOnAbbrechen() {
    this.setState({renderForm: false});
  }

  handleChangeOfDetails() {
      location.reload();

      {/*let { addressesInfo } = this.state;
      this.setState({addressesInfo: newObject, renderForm: false});*/}
  }

  render() {

    var {
      customerInfo,
      addressesInfo,
      defaultBilling,
      defaultShipping,
      otherAddresses,
      gotTheInfo,
      countries,
      renderForm,
      pressedAddressType,
      pressedAddressInfo
      } = this.state;

    var {handleClickOnLoschen, handleClickOnPencil, handleClickOnAbbrechen, handleChangeOfDetails} = this;
    var {themePath} = this.props;

    function renderEverything() {
      function findNameOfCountry(countryId) {
        var chosenCountry = countries.filter((item) => {
          return item.id == countryId;
        })
        return chosenCountry[0].full_name_locale;
      }
      function renderMoreAddresses() {
        if (otherAddresses.length > 0) {
          var theAddresses = otherAddresses.map((item, index) => {
            var twoAddresses = item.map((address, index) => {
              return (
                <div class={index == 0
                  ? "col-md-4"
                  : "col-md-4 col-md-push-2"} key={`addressId-${address.id}`}>
                  <div class="s-account__address s-account__address--editable">
                    <i id="otherAddress" class="icon--lgs-pencil-grey icon--lgs-arrow" onClick={()=>handleClickOnPencil("otherAddress", address.id)}></i>
                    <a href="#delete-modal" data-toggle="modal">
                      <i class="icon--lgs-close-icon icon--lgs-close"></i>
                    </a>

                    <DeleteAddressModal customerInfo={customerInfo} addressId={address.id} handleClickOnLoschen={handleClickOnLoschen}
                    themePath={themePath}/>

                    <p style={address.prefix ? {display: "block"} : {display: "none"}}>{address.prefix ? address.prefix : ""}</p>
                    <p>{address.firstname + " " + address.lastname}</p>
                    <p>{address.street[0]}</p>
                    <p>{address.postcode + " " + address.city}</p>
                    <p>{address.region.region
                        ? address.region.region + ", "
                        : ""} {findNameOfCountry(address.country_id)}</p>

                  </div>
                </div>
              )

            })
            return (
              <div class="row" key={`twoAddresses-${index}`}>
                {twoAddresses}
              </div>
            )
          })
          return (
            <div>
              <div class="row">
                <div class="col-xs-12">
                  <h3>{Drupal.t("Weitere Adressen")}</h3>
                </div>
              </div>
              {theAddresses}
            </div>
          )
        }
      }

      function renderDefaultBilling() {
          if(defaultBilling.id) {
              return (
                    <div>
                    <i class="icon--lgs-pencil-grey icon--lgs-arrow" id="defaultBilling" onClick={()=>handleClickOnPencil("defaultBilling", defaultBilling.id)}></i>
                    <p>{defaultBilling.prefix ? defaultBilling.prefix : ""}</p>
                    <p>{defaultBilling.firstname + " " + defaultBilling.lastname}</p>
                    <p>{defaultBilling.street[0]}</p>
                    <p>{defaultBilling.postcode + " " + defaultBilling.city}</p>
                    <p>{defaultBilling.region.region
                        ? defaultBilling.region.region + ", "
                        : ""} {findNameOfCountry(defaultBilling.country_id)}</p>
                  </div>
              )
          }

          else {
              return (
                  <div>
                  <p>{Drupal.t("Sie haben keine Standardrechnungsadresse in Ihrem Adressbuch.")}</p>
                  </div>
              )
          }

      }

      function renderDefaultShipping () {
          if(defaultShipping.id) {
              return (
                  <div>
                    <i class="icon--lgs-pencil-grey icon--lgs-arrow" id="defaultShipping" onClick={()=>handleClickOnPencil("defaultShipping",defaultShipping.id)}></i>
                    <p>{defaultShipping.prefix ? defaultShipping.prefix : ""}</p>
                    <p>{defaultShipping.firstname + " " + defaultShipping.lastname}</p>
                    <p>{defaultShipping.street[0]}</p>
                    <p>{defaultShipping.postcode + " " + defaultShipping.city}</p>
                    <p>{defaultShipping.region.region
                        ? defaultShipping.region.region + ", "
                        : ""} {findNameOfCountry(defaultShipping.country_id)}</p>
                  </div>
              )
          }
          else return (
              <div>
              <p>{Drupal.t("Sie haben keine Standardversandadresse in Ihrem Adressbuch.")}</p>
              </div>
          )
      }

      if (gotTheInfo) {
        return (
          <div>
            <h3>{Drupal.t("Adressbuch")}</h3>
            <div class="row">
              <div class="col-md-4">
              <div class="s-account__address">
                <h4>{Drupal.t("Standard-Rechnungsadresse")}</h4>
              {renderDefaultBilling()}
              </div>
              </div>
              <div class="col-md-4 col-md-push-2">
              <div class="s-account__address">
                <h4>{Drupal.t("Standard-Versandadresse")}</h4>
              {renderDefaultShipping()}
              </div>
              </div>
            </div>

            {renderMoreAddresses()}

            <div class="row">
              <div class="col-xs-12">
                <div style={{
                  width: "15rem"
              }} class="s-button--submit" id="addAddress" onClick={()=>handleClickOnPencil("addAddress", 0)}>{Drupal.t("Adresse hinzufügene")}
                </div>
              </div>
            </div>
          </div>
        )
      }
    }
    if (!renderForm) {
      return (
        <div class="col-xs-12 col-sm-7 col-sm-push-1">
          {renderEverything()}
        </div>
      )
    } else {
      return (
        <div class="col-xs-12 col-sm-7 col-sm-push-1">
          <AddressenForm handleClickOnAbbrechen={handleClickOnAbbrechen}
          handleChangeOfDetails={handleChangeOfDetails}
          countries={countries}
          addressType={pressedAddressType}
          addressInfo={pressedAddressInfo}
          generalInfo={addressesInfo}
          />
        </div>
      )
    }

  }

}
