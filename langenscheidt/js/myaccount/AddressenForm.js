import {h, render, Component} from 'preact';

export default class AddressenForm extends Component {
  constructor(props) {
    super(props);
    let {countries, addressType, addressInfo, generalInfo} = this.props;
    if (addressType == "addAddress") {
      addressInfo = {
        city: "",
        country_id: "",
        customer_id: generalInfo.id,
        firstname: "",
        lastname: "",
        prefix: "",
        postcode: "",
        region: {
          region: null,
          region_code: null,
          region_id: 0
        },
        region_id: 0,
        street: [],
        telephone: ""
      }
    }
    let temp = [];
    let bothTypes;

    if((generalInfo.default_billing && generalInfo.default_shipping) && generalInfo.default_billing==generalInfo.default_shipping) {
         bothTypes = true;
    }
    else {
         bothTypes = false;
    }

    this.state = {
      addressType: addressType,
      addressInfo: addressInfo,
      countries: countries,
      generalInfo: generalInfo,
      setTheType: {
          defaultBilling: false,
          defaultShipping: false
      },
      detailsChanged: false,
      bothTypes: bothTypes,
      missingFields: {
        firstname: false,
        lastname: false,
        street: false,
        postcode: false,
        city: false,
        country: false,
        region: false
      }
    }


    this.handleChooseCountry = this.handleChooseCountry.bind(this);
    this.handleChooseRegion = this.handleChooseRegion.bind(this);
    this.findChosenCountry = this.findChosenCountry.bind(this);
    this.handleChangeInDetails = this.handleChangeInDetails.bind(this);
    this.handleClickOnSaveDetails = this.handleClickOnSaveDetails.bind(this);
    this.handleChangeInAddressType = this.handleChangeInAddressType.bind(this);

  }

  handleChooseCountry(e) {
    this.setState({detailsChanged: true});
    var {addressInfo} = this.state;
    addressInfo.country_id = e.target.value;
    this.setState({addressInfo});
  }

  handleChooseRegion(e) {
    this.setState({detailsChanged: true});
    let {addressInfo} = this.state;
    let regionCode = e.target.value;
    let availableRegions = this.findChosenCountry(addressInfo.country_id)[0].available_regions;
    var chosenRegionInfo = availableRegions.filter((region) => {
      return region.code === regionCode;
    })[0];
    addressInfo.region.region_code = chosenRegionInfo.code;
    addressInfo.region.region = chosenRegionInfo.name;
    addressInfo.region.region_id = chosenRegionInfo.id;
    addressInfo.region_id = chosenRegionInfo.id;
    this.setState({addressInfo});

  }

  findChosenCountry(countryId) {
    let {countries} = this.state;
    let chosenCountry = countries.filter((item) => {
      return item.id == countryId;
    })
    return chosenCountry;
  }

  handleChangeInDetails(e) {
    this.setState({detailsChanged: true});
    let {addressInfo} = this.state;
    let id = e.target.id;
    let value = e.target.value;
    if (id == "prefix") {
      addressInfo.prefix = value;
    } else if (id == "firstname" && value.length > 0) {
      addressInfo.firstname = value;
    } else if (id == "lastname" && value.length > 0) {
      addressInfo.lastname = value;
    } else if (id == "street" && value.length > 0) {
      addressInfo.street = [];
      addressInfo.street[0] = value;
    } else if (id == "city" && value.length > 0) {
      addressInfo.city = value;
  } else if (id == "postcode" && value.length > 0) {
      addressInfo.postcode = value;
    } else if (id == "telephone") {
      addressInfo.telephone = value;
    }
    this.setState({addressInfo});
  }

  handleClickOnSaveDetails() {
     this.setState({missingFields: {
       firstname: false,
       lastname: false,
       street: false,
       postcode: false,
       city: false,
       country: false,
       region: false
     }})

    let {addressInfo, addressType, missingFields, generalInfo, setTheType, detailsChanged} = this.state;
    let {handleClickOnAbbrechen, handleChangeOfDetails} = this.props;
    let {findChosenCountry} = this;

    function findMissingRegion() {
        if (addressInfo.country_id.length>0 && findChosenCountry(addressInfo.country_id)[0].available_regions && addressInfo.region_id==0) {
            return true;
        }
        else {
            return false;
        }
    }
    if (addressType == "addAddress") {
      if (addressInfo.city.length == 0 || addressInfo.country_id.length == 0 || addressInfo.firstname.length == 0 || addressInfo.lastname.length == 0 || addressInfo.postcode.length == 0 || addressInfo.street.length == 0 ||
       findMissingRegion()) {
        if (addressInfo.city.length == 0) {
          missingFields.city = true;
          this.setState({missingFields})
        }

        if (addressInfo.country_id.length == 0) {
          missingFields.country = true;
          this.setState({missingFields})
        }

        if (addressInfo.firstname.length == 0) {
          missingFields.firstname = true;
          this.setState({missingFields})
        }

        if (addressInfo.lastname.length == 0) {
          missingFields.lastname = true;
          this.setState({missingFields})
        }

        if (addressInfo.postcode.length == 0) {
          missingFields.postcode = true;
          this.setState({missingFields})
        }

        if (addressInfo.street.length == 0) {
          missingFields.street = true;
          this.setState({missingFields})
        }
        if (findMissingRegion()==true) {
          missingFields.region = true;
          this.setState({missingFields})
        }
      }

      else {
          if(setTheType.defaultBilling==true) {
              addressInfo.default_billing = true;
              this.setState({addressInfo})
          }
          if(setTheType.defaultShipping==true) {
              addressInfo.default_shipping = true;
              this.setState({addressInfo})
          }
          SirupRestApi.customerAddAddress(generalInfo, addressInfo).then((data)=> {
              handleChangeOfDetails();
          }).catch(xhr => {
              alert("Ein Fehler ist aufgetreten");
          });
      }
    }

    else {
        if (!detailsChanged) {
            if (setTheType.defaultBilling==true) {
                SirupRestApi.customerSetDefaultBillingAddress(generalInfo, addressInfo.id).then((data)=> {
                    handleChangeOfDetails();

                })
            }

            if (setTheType.defaultShipping==true) {
                SirupRestApi.customerSetDefaultShippingAddress(generalInfo, addressInfo.id).then((data)=> {
                    handleChangeOfDetails();
                })
            }
        }

        else {
            if (findMissingRegion()) {
                missingFields.region = true;
                this.setState({missingFields})
            }

            else {
                if(setTheType.defaultBilling==true) {
                    addressInfo.default_billing = true;
                    this.setState({addressInfo})
                }
                if(setTheType.defaultShipping==true) {
                    addressInfo.default_shipping = true;
                    this.setState({addressInfo})
                }

                var updatedAddresses = generalInfo.addresses.filter((address)=> {
                    return address.id != addressInfo.id;
                });
                updatedAddresses.push(addressInfo);
                generalInfo.addresses = updatedAddresses;
                SirupRestApi.customerUpdateAddresses(generalInfo).then((data)=> {
                    handleChangeOfDetails();
                }).catch(xhr => {
                    alert("Ein Fehler ist aufgetreten");
                });
            }
            }
    }

  }

  handleChangeInAddressType(e) {
      let { setTheType } = this.state;
      let id = e.target.id;
      let checked = e.target.checked;

      if(id=="setBilling") {
          setTheType.defaultBilling = checked;
          this.setState({setTheType})
      }

      if(id=="setShipping") {
          setTheType.defaultShipping = checked;
          this.setState({setTheType})
      }
  }

  render() {
    var {countries, countrynames, addressType, addressInfo, missingFields, bothTypes} = this.state;
    var {handleClickOnAbbrechen, handleChangeOfDetails} = this.props;
    var {handleChooseCountry, handleChooseRegion, findChosenCountry, handleChangeInDetails, handleClickOnSaveDetails, handleChangeInAddressType} = this;
    var renderCountryNames = countries.map((country) => {
      return (
        <option value={country.id} selected={addressInfo.country_id == country.id
          ? true
          : false}>{country.full_name_locale}</option>
      )
    });

    function renderDefaultCountryOption() {
      if (addressType == "addAddress") {
        return (
          <option value="" disabled selected>{Drupal.t("Wähle dein Land")}</option>
        )
      }
    }



    function renderRegion() {
      if (addressInfo.country_id.length > 0 && findChosenCountry(addressInfo.country_id)[0].available_regions) {
        var regions = findChosenCountry(addressInfo.country_id)[0].available_regions;
        var renderRegionNames = regions.map((region) => {
          return (
            <option selected={addressInfo.region.region_code == region.code
              ? true
              : false} value={region.code}>{region.name}</option>
          )
        });
        return (
          <div class="row">
            <div class="col-xs-12 col-md-9 col-lg-8">
              <label class="form-group required has-float-label s-input s-input__standard s-input__standard--required">
                <span class="s-input__text">{Drupal.t("Region")}*</span>
                <select class="countriesDrop" onChange={handleChooseRegion}>
                <option style={{color: "#a4a4a4"}} value="">{Drupal.t("Bitte wählen Sie Region, Bundesland oder Provinz.")}</option>
                  {renderRegionNames}
                </select>
              </label>
              <div class={missingFields.region ? "s-input--error__message" : "noDisplay"  }>{Drupal.t("Dieses Feld muss ausgefüllt sein.")}</div>
            </div>
          </div>
        )
      }
    }

    function renderAddressTypeArea() {
      return (
        <div>
          <div class="row">
            <div class="col-xs-12 col-md-5 col-lg-5">
              <div class="s-input__checkbox">
                <input class="magic-checkbox" type="checkbox" name="setBilling" id="setBilling" value="option"
                onChange={handleChangeInAddressType}/>
                <label class="s-input__checkbox__label" for="setBilling" id="menu1509527789172">
                  {Drupal.t("Als Rechnungsadresse festlegen")}
                </label>
              </div>
            </div>
          </div>

          <div class="row">
            <div class="col-xs-12 col-md-5 col-lg-5">
              <div class="s-input__checkbox">
                <input class="magic-checkbox" type="checkbox" name="setShipping" id="setShipping" value="option"
                onChange={handleChangeInAddressType}/>
                <label class="s-input__checkbox__label" for="setShipping" id="menu1509527789172">
                  {Drupal.t("Als Versandadresse festlegen")}
                </label>
              </div>
            </div>
          </div>
        </div>
      )
    }

    return (
      <div class="row">
        <div style="margin-left: 1rem;">
          <h3>{Drupal.t("Addresse ändern")}</h3>
          <div class="row">
            <div class="col-xs-12 col-md-9 col-lg-8">
              <div class="row" style="margin-bottom: 15px;">
                <span class="prefix-title">{Drupal.t("Anrede auswählen")}</span>
                <input list="prefixes" name="prefixes" class="prefixes-list" id="prefix" value={addressInfo.prefix
                  ? addressInfo.prefix
                  : ""} onBlur={handleChangeInDetails}/>
                <datalist id="prefixes">
                  <option>{Drupal.t("Herr")}</option>
                  <option>{Drupal.t("Frau")}</option>
                </datalist>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-xs-12 col-md-9 col-lg-8">
              <label class="form-group required has-float-label s-input s-input__standard s-input__standard--required">
                <input class="form-control s-input__input" type="text" id="firstname" value={addressInfo.firstname} onBlur={handleChangeInDetails}/>
                <span class="s-input__text">{Drupal.t("Vorname")}
                  <span>*</span>
                </span>
              </label>
              <div class={missingFields.firstname ? "s-input--error__message" : "noDisplay"  }>{Drupal.t("Dieses Feld muss ausgefüllt sein.")}</div>
            </div>
          </div>
          <div class="row">
            <div class="col-xs-12 col-md-9 col-lg-8">
              <label class="form-group required has-float-label s-input s-input__standard s-input__standard--required">
                <input class="form-control s-input__input" type="text"  id="lastname" value={addressInfo.lastname} onBlur={handleChangeInDetails}/>
                <span class="s-input__text">{Drupal.t("Nachname")}
                  <span>*</span>
                </span>
              </label>
              <div class={missingFields.lastname ? "s-input--error__message" : "noDisplay"  }>{Drupal.t("Dieses Feld muss ausgefüllt sein.")}</div>
            </div>
          </div>

          <div class="row">
            <div class="col-xs-12 col-md-9 col-lg-8">
              <label class="form-group required has-float-label s-input s-input__standard s-input__standard--required">
                <input class="form-control s-input__input" type="text" placeholder="street" id="street" value={addressInfo.street[0]} onBlur={handleChangeInDetails}/>
                <span class="s-input__text">{Drupal.t("Straße und Hausnummer")}
                  <span>*</span>
                </span>
              </label>
              <div class={missingFields.street ? "s-input--error__message" : "noDisplay"  }>{Drupal.t("Dieses Feld muss ausgefüllt sein.")}</div>
            </div>
          </div>

          <div class="row">
            <div class="col-xs-12 col-md-9 col-lg-8">
              <label class="form-group required has-float-label s-input s-input__standard s-input__standard--required">
                <input class="form-control s-input__input" type="text" placeholder="postcode" id="postcode" value={addressInfo.postcode} onBlur={handleChangeInDetails}/>
                <span class="s-input__text">{Drupal.t("PLZ")}
                  <span>*</span>
                </span>
              </label>
              <div class={missingFields.postcode ? "s-input--error__message" : "noDisplay"  }>{Drupal.t("Dieses Feld muss ausgefüllt sein.")}</div>
            </div>
          </div>

          <div class="row">
            <div class="col-xs-12 col-md-9 col-lg-8">
              <label class="form-group required has-float-label s-input s-input__standard s-input__standard--required">
                <input class="form-control s-input__input" type="text" placeholder="city" id="city" value={addressInfo.city} onBlur={handleChangeInDetails}/>
                <span class="s-input__text">{Drupal.t("Ort")}
                  <span>*</span>
                </span>
              </label>
              <div class={missingFields.city ? "s-input--error__message" : "noDisplay"  }>{Drupal.t("Dieses Feld muss ausgefüllt sein.")}</div>
            </div>
          </div>


          <div class="row">
            <div class="col-xs-12 col-md-9 col-lg-8">
              <label class="form-group required has-float-label s-input s-input__standard s-input__standard--required">
                <span class="s-input__text">{Drupal.t("Land")}*</span>
                <select class="countriesDrop" onChange={handleChooseCountry}>
                  {renderDefaultCountryOption()}
                  {renderCountryNames}
                </select>
              </label>
              <div class={missingFields.country ? "s-input--error__message" : "noDisplay"  }>{Drupal.t("Dieses Feld muss ausgefüllt sein.")}</div>
            </div>
          </div>

          {renderRegion()}


          <div class="row">
            <div class="col-xs-12 col-md-9 col-lg-8">
              <label class="form-group required has-float-label s-input s-input__standard s-input__standard--required">
                <input class="form-control s-input__input" type="text" value={addressInfo.telephone} id="telephone" onBlur={handleChangeInDetails}/>
                <span class="s-input__text">{Drupal.t("Telefon")}
                </span>
              </label>
            </div>
          </div>

          <div class="changeAddressTypeArea">
            <div class={addressType=="addAddress" || addressType=="otherAddress" ||  (addressType=="defaultShipping" && bothTypes==false) ? "row" : "noDisplay" }>
              <div class="col-xs-12 col-md-5 col-lg-5">
                <div class="s-input__checkbox">
                  <input class="magic-checkbox" type="checkbox" name="setBilling" id="setBilling" value="option"
                  onChange={handleChangeInAddressType}/>
                  <label class="s-input__checkbox__label" for="setBilling" id="menu1509527789172">
                    {Drupal.t("Als Rechnungsadresse festlegen")}
                  </label>
                </div>
              </div>
            </div>

            <div class={addressType=="addAddress" || addressType=="otherAddress" ||  (addressType=="defaultBilling" && bothTypes==false) ? "row" : "noDisplay" } >
              <div class="col-xs-12 col-md-5 col-lg-5">
                <div class="s-input__checkbox">
                  <input class="magic-checkbox" type="checkbox" name="setShipping" id="setShipping" value="option"
                  onChange={handleChangeInAddressType}/>
                  <label class="s-input__checkbox__label" for="setShipping" id="menu1509527789172">
                    {Drupal.t("Als Versandadresse festlegen")}
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div class="row" style="margin-top: 3rem;">
            <div class="col-xs-12 col-md-9 col-lg-8">
              <div onClick={handleClickOnSaveDetails} class="s-button--submit addressForm-submit">{Drupal.t("Anderungen speichern")}</div>
            </div>
          </div>
          <div class="row">
            <div class="col-xs-12 col-md-9 col-lg-8">
              <a href="#/addressen" class="button s-button--close-window" onClick={handleClickOnAbbrechen}>{Drupal.t("Abbrechen")}</a>
            </div>
          </div>
        </div>
      </div>
    )

  }

}
