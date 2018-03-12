import {h, render, Component} from 'preact';

export default class PersonlicheDatenForm extends Component {
  constructor(props) {
    super(props);

    var {customerInfo, prefixes} = this.props;

    this.state = {
      customerInfo: customerInfo,
      prefixes: prefixes,
      changePassword: false,
      nameChange: false,
      oldPassword: "",
      newPassword: "",
      repeatPassword: "",
      wrongRepeatPassword: false,
      oldPassMissing: false,
      newPassMissing: false,
      repeatPassMissing: false,
      wrongOldPassword: false,
      newPasswordShort: false
    }

    this.checkboxPressed = this.checkboxPressed.bind(this);
    this.handleChangeInDetails = this.handleChangeInDetails.bind(this);
    this.handleClickOnSaveDetails = this.handleClickOnSaveDetails.bind(this);
    this.handleChangeInPassword = this.handleChangeInPassword.bind(this);

  }

  componentDidMount() {
    var {prefixes} = this.state;
    jQuery(this.prefixDiv).prettyDropdown();

  }

  componentDidUpdate() {
    jQuery(this.containerDiv).find('.prettydropdown').remove();
    jQuery(this.prefixDiv).prettyDropdown();
  }

  checkboxPressed(e) {
    this.setState({changePassword: e.target.checked})
  }

  handleChangeInDetails(e) {
    var {customerInfo} = this.state;
    let id = e.target.id;
    let value = e.target.value;
    if (id == "first_name" && value.length !== 0) {
      customerInfo.first_name[0].value = value;
    } else if (id == "last_name" && value.length !== 0) {
      customerInfo.last_name[0].value = value;
    } else if (id == "prefix" && value.length !== 0) {
      value == "herr"
        ? customerInfo.salutation[0].value = "m"
        : customerInfo.salutation[0].value = "f";
    } else if (id == "title") {
      customerInfo.title[0] =  {};
      customerInfo.title[0].value = value;
    }
    this.setState({customerInfo: customerInfo, nameChange: true})
  }

  handleChangeInPassword(e) {
    var id = e.target.id;
    var value = e.target.value;
    if (value.length > 0) {
      if (id === "old_password") {
        this.setState({oldPassword: value});
      } else if (id === "new_password") {
        this.setState({newPassword: value});
      } else if (id === "repeat_password") {
        this.setState({repeatPassword: value})
      }
    }
  }

  handleClickOnSaveDetails() {
    this.setState({
      wrongRepeatPassword: false,
      oldPassMissing: false,
      newPassMissing: false,
      repeatPassMissing: false,
      wrongOldPassword: false,
      newPasswordShort: false
    })
    var {
      customerInfo,
      nameChange,
      changePassword,
      newPassword,
      oldPassword,
      repeatPassword
    } = this.state;

    if (nameChange) {
      SirupRestApi.customerUpdateInfo(customerInfo).then((data) => {
      })
    }

    function checkValidNewPassword() {
      let checkPass = /^(?=.*\d)(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,105}$/;
      if (newPassword.match(checkPass)) {
        return true;
      } else {
        return false
      }
    }

    if ((oldPassword.length > 0 || newPassword.length > 0 || repeatPassword.length > 0) && changePassword) {
      if (oldPassword.length > 0 && newPassword.length > 0 && repeatPassword.length > 0) {
        if (!checkValidNewPassword()) {
          this.setState({newPasswordShort: true});
        } else {
          if (newPassword == repeatPassword) {
            SirupRestApi.customerChangePassword(oldPassword, newPassword).then((data) => {
              this.props.successChangeOfPassword();
              this.props.handleClickOnAbbrechen();
            }).catch(xhr => {
              if (xhr.status == 422) {
                this.setState({wrongOldPassword: true});
              }
            });

          } else {
            this.setState({wrongRepeatPassword: true})
          }
        }

      } else {
        if (oldPassword.length === 0) {
          this.setState({oldPassMissing: true})
        }
        if (newPassword.length === 0) {
          this.setState({newPassMissing: true})
        }
        if (repeatPassword.length === 0) {
          this.setState({repeatPassMissing: true})
        }
      }

    } else {
      this.props.handleClickOnAbbrechen();
    }

  }

  render() {
    var {
      customerInfo,
      changePassword,
      prefixes,
      wrongRepeatPassword,
      oldPassMissing,
      newPassMissing,
      repeatPassMissing,
      wrongOldPassword,
      newPasswordShort
    } = this.state;
    var {checkboxPressed, handleChangeInDetails, handleClickOnSaveDetails, handleChangeInPassword} = this;
    var {handleClickOnAbbrechen} = this.props;

    var countrynames = ["Germany", "Italy", "France", "USA"]

    {/*function renderPrefixes(prefixes) {
      var select = document.getElementById("s-select--mr-ms");
      var options = "";
      for (var i = 0; i < prefixes.length; i++) {
        options += '<option>' + prefixes[i].prefix_locale + '</option>'
      }
      return options;
  }*/
    }

    function checkErrorinOldPassword() {
      if (oldPassMissing) {
        return (
          <div class="s-input--error__message">{Drupal.t("Dieses Feld muss ausgefüllt sein.")}</div>
        )
      }
      if (wrongOldPassword) {
        return (
          <div class="s-input--error__message">{Drupal.t("Falsches Passwort")}</div>
        )
      }
    }

    function checkErrorinNewPassword() {
      if (newPassMissing) {
        return (
          <div class="s-input--error__message">{Drupal.t("Dieses Feld muss ausgefüllt sein.")}</div>
        )
      }
    }

    function checkErrorinRepeatPassword() {
      if (wrongRepeatPassword) {
        return (
          <div class="s-input--error__message">{Drupal.t("Erneut falsches Passwort")}</div>
        )
      }
      if (repeatPassMissing) {
        return (
          <div class="s-input--error__message">{Drupal.t("Dieses Feld muss ausgefüllt sein.")}</div>
        )
      }
    }

    function renderPasswordChangeForm() {
      if (changePassword) {
        return (
          <div>
            <div class="row">
              <div class="col-xs-12 col-md-9 col-lg-8">
                <label class="form-group has-float-label s-input s-input__standard">
                  <input type="password" class="form-control s-input__input" placeholder="Placeholder" id="old_password" onBlur={handleChangeInPassword}/>
                  <span class="s-input__text">{Drupal.t("Aktuelles Password")}*
                  </span>
                </label>
                {checkErrorinOldPassword()}

              </div>
            </div>
            <div class="row">
              <div class="col-xs-12 col-md-9 col-lg-8">
                <label class="form-group required has-float-label s-input s-input__standard s-input__standard--required">
                  <input class="form-control s-input__input" type="password" placeholder="Passwort" required="" id="new_password" onBlur={handleChangeInPassword}/>
                  <span class="s-input__text">{Drupal.t("Neues Password")}
                    <span>*</span>
                  </span>
                </label>
                {checkErrorinNewPassword()}
                <div class="s-input__password--error__message" style={newPasswordShort
                  ? {
                    color: "#d0021b"
                  }
                  : {
                    color: "#a4a4a4"
                  }}>{Drupal.t("Das Passwort muss mindestens 8 Zeichen, ein Sonderzeichen (z.B. @, _ , ?,!), ein Großbuchstaben und eine Zahl umfassen")}
                </div>
                <div class="s-input__standard--required__message">{Drupal.t("Die Passwörter stimmen nicht überein")}</div>
              </div>
            </div>
            <div class="row">
              <div class="col-xs-12 col-md-9 col-lg-8">
                <label class="form-group has-float-label s-input s-input__standard">
                  <input type="password" class="form-control s-input__input" placeholder="Placeholder" id="repeat_password" onBlur={handleChangeInPassword}/>
                  <span class="s-input__text">{Drupal.t("Neues Password wiederholen")}*
                  </span>
                  <span class="s-input__password__strength"></span>
                </label>
                {checkErrorinRepeatPassword()}
              </div>
            </div>
          </div>
        )
      }
    }

    function checkSalutation() {
      if (customerInfo.salutation.length > 0) {
        return (
          <div class="row">
            <div class="col-xs-12 col-md-9 col-lg-8">
              <div class="row" style="margin-bottom: 15px;">
                <span class="prefix-title">{Drupal.t("Anrede auswählen")}</span>


                  <select class="prefixes-list" id="prefix" onBlur={handleChangeInDetails}>
                  <option value="herr" selected={customerInfo.salutation[0].value === "m"
                    ? true
                    : false}>{Drupal.t("Herr")}</option>
                  <option value="frau"
                  selected={customerInfo.salutation[0].value === "f" ? true : false}>{Drupal.t("Frau")}</option>
                  </select>
              </div>
            </div>
          </div>
        )

      }
    }
    return (
      <div style={{
        marginLeft: "1rem"
      }} ref={containerDiv => this.containerDiv = containerDiv}>
        <h3>{Drupal.t("Persönliche Daten ändern")}</h3>
        {checkSalutation()}
        <div class="row">
          <div class="col-xs-12 col-md-9 col-lg-8">
            <label class="form-group required has-float-label s-input s-input__standard s-input__standard--required">
              <input class="form-control s-input__input" type="text" required="" id="title" value={customerInfo.title.length > 0 ? customerInfo.title[0].value : "" } onBlur={handleChangeInDetails}/>
              <span class="s-input__text">{Drupal.t("Titel")}
              </span>
            </label>
          </div>
        </div>

        <div class="row">
          <div class="col-xs-12 col-md-9 col-lg-8">
            <label class="form-group required has-float-label s-input s-input__standard s-input__standard--required">
              <input class="form-control s-input__input" type="text" value={customerInfo.first_name[0].value} required="" id="first_name" onBlur={handleChangeInDetails}/>
              <span class="s-input__text">{Drupal.t("Vorname")}
                <span>*</span>
              </span>
            </label>
            <div class="s-input__standard--required__message">{Drupal.t("Dieses Feld muss ausgefüllt sein.")}
            </div>
          </div>
        </div>

        <div class="row">
          <div class="col-xs-12 col-md-9 col-lg-8">
            <label class="form-group required has-float-label s-input s-input__standard s-input__standard--required">
              <input class="form-control s-input__input" type="text" placeholder="Nachname" required="" id="last_name" value={customerInfo.last_name[0].value} onBlur={handleChangeInDetails}/>
              <span class="s-input__text">{Drupal.t("Nachname")}
                <span>*</span>
              </span>
            </label>
            <div class="s-input__standard--required__message">{Drupal.t("Dieses Feld muss ausgefüllt sein.")}
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-xs-12 col-md-9 col-lg-8">
            <div class="has-float-label">
              <span class="has-float-label s-input
              s-input__standard--required s-input__text">{Drupal.t("E-Mail-Adresse")}
              </span>
            </div>
            <div class="s-register__required-text" style={{
              marginTop: "2.5rem",
              marginBottom: "1.5rem"
            }}>{customerInfo.mail[0].value}</div>
            <div class="s-input__password--error__message">{Drupal.t("Sollten Sie Ihre E-Mail Adresse ändern wollen, wenden Sie sich bitte an unseren Kundenservice.")}</div>
          </div>
        </div>
        <div class="row">
          <div class="col-xs-12 col-md-9 col-lg-8">
            <div class="s-input__checkbox">
              <input class="magic-checkbox" type="checkbox" id="changePassword" onChange={checkboxPressed} checked={changePassword}/>
              <label class="s-input__checkbox__label" for="changePassword">
                {Drupal.t("Password ändern")}
              </label>
            </div>
          </div>
        </div>
        {renderPasswordChangeForm()}
        <div class="row" style={{
          marginTop: "3rem"
        }}>

          <div class="col-xs-12 col-md-9 col-lg-8">
            <a href="#" class="s-button--submit" onClick={handleClickOnSaveDetails}>{Drupal.t("Anderungen speichern")}
            </a>
          </div>
        </div>
        <div class="row">
          <div class="col-xs-12 col-md-9 col-lg-8">
            <a href="#" class="button s-button--close-window" onClick={handleClickOnAbbrechen}>{Drupal.t("Abbrechen")}</a>
          </div>
        </div>
      </div>
    )

  }

}
