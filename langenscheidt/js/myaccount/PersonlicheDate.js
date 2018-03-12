import {h, render, Component} from 'preact';

import PersonlicheDatenForm from './PersonlicheDatenForm';

export default class PersonlicheDaten extends Component {
  constructor(props) {
    super(props);
    this.state = {
      customerInfo: this.props.customerInfo,
      renderForm: false,
      prefixes: []
    }

    this.handleClickOnPencil = this.handleClickOnPencil.bind(this);
    this.handleClickOnAbbrechen = this.handleClickOnAbbrechen.bind(this);
    this.successChangeOfPassword = this.successChangeOfPassword.bind(this);

  }

  handleClickOnPencil() {
    var {renderForm} = this.state;
    this.setState({
        renderForm: true,
        prefixes: "herr"
    })
{/*    SirupRestApi.getNamePrefixes().then((data) => {
      console.log(data);
      this.setState({
        prefixes: data,
        renderForm: !renderForm
      })
  }) */}



  }

  handleClickOnAbbrechen() {
    this.setState({renderForm: false});
  }

  successChangeOfPassword() {
      this.props.successChangeOfPassword();
  }

  render() {
    var {customerInfo, renderForm, prefixes, passwordChangeFlag} = this.state;
    var {handleClickOnPencil, handleClickOnAbbrechen, successChangeOfPassword} = this;


    function renderDataOrForm() {
      if (renderForm) {
        return (
          <div class="row">
            <PersonlicheDatenForm customerInfo={customerInfo} handleClickOnAbbrechen={handleClickOnAbbrechen} prefixes={prefixes}
            successChangeOfPassword={successChangeOfPassword}/>
          </div>
        )
      } else {
        return (
          <div>
            <h3>{Drupal.t("Persönliche Daten")}</h3>
            <div class="row">
              <div class="col-md-6">
                <div class="s-account__address">
                  <i class="icon--lgs-pencil-grey icon--lgs-arrow" onClick={handleClickOnPencil}></i>
                  <p>{customerInfo.salutation.length > 0 ? customerInfo.salutation[0].value === "m" ? "Herr" : "Frau" : ""}</p>
                  <p>{customerInfo.title.length > 0 ? customerInfo.title[0].value : "" }</p>

                  <p>{customerInfo.first_name[0].value + " " + customerInfo.last_name[0].value}</p>
                  <p id="personalData-mail">{customerInfo.mail[0].value}</p>
                </div>
              </div>
            </div>

          </div>
        )
      }
    }
    return (
      <div class="col-xs-12 col-sm-7 col-sm-push-1">
        <div class="s-account__headline s-font--nice">{Drupal.t("Hallo")} {customerInfo.first_name[0].value + " " + customerInfo.last_name[0].value}</div>
        {renderDataOrForm()}
      </div>

    )
  }

}
