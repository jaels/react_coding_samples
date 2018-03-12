import {h, render, Component} from 'preact';

import Main from './Main';
import PersonlicheDaten from './PersonlicheDaten';
import Addressen from './Addressen';
import Bestellungen from './Bestellungen';
import Downloads from './Downloads';

import {BrowserRouter as Router, Route, Switch, Link, NavLink, PropsRoute, HashRouter} from 'react-router-dom';

export default class Routes extends Component {
  constructor(props) {
    super(props);
    let url = window.location.href;
    let location = url.slice(url.lastIndexOf("/")+1);
    this.state = {
        customerInfo : {},
        gotTheInfo: false,
        passwordChangeFlag: false,
        screenWidth: jQuery(window).width(),
        currentActive: location=="user" || location=="" ? "Personlische_Daten" : location,
        openMobileMenu: false
    }

    this.successChangeOfPassword = this.successChangeOfPassword.bind(this);
    this.closeSuccessMessage = this.closeSuccessMessage.bind(this);
    this.activateTabArrow = this.activateTabArrow.bind(this);
    this.handleClickOnLink = this.handleClickOnLink.bind(this);
  }

  componentWillMount() {
      SirupRestApi.customerGetInfo().then((data) => {
        this.setState({
            customerInfo : data,
            gotTheInfo: true})
      });
  }

  successChangeOfPassword() {
      this.setState({passwordChangeFlag: true})
  }

  closeSuccessMessage() {
      this.setState({passwordChangeFlag: false})
  }

  activateTabArrow() {
      let {openMobileMenu} = this.state;
      jQuery(".small-drop").toggleClass("active");
      this.setState({openMobileMenu: !openMobileMenu});

  }

  handleClickOnLink(e) {
      var {screenWidth} = this.state;
      if(screenWidth<768) {
          jQuery(".small-drop").toggleClass("active");
      }
      this.setState({currentActive: e.target.id, openMobileMenu: false});

  }

  render() {
      var {customerInfo, gotTheInfo, passwordChangeFlag, screenWidth, currentActive, openMobileMenu} = this.state;
      var { themePath } = this.props;
      var { successChangeOfPassword, closeSuccessMessage, activateTabArrow, handleClickOnLink } = this;

      function renderPasswordChangeMessage() {
        if (passwordChangeFlag) {
          return (
              <div class="s-message" style={{marginTop: "-3rem"}}>
                <div class="row s-message--success">
                  <div class="col-xs-9 col-xs-push-1">
                    <div class="s-message--success__icon">
                      <img class="green-v"
                       src={'/' + themePath + '/images/svgs/success-check.svg'} width="8rem" height="8rem" title="" alt=""/>
                    </div>
                    <div class="s-message--success__text">
                      {Drupal.t("Ihr Passwort wurde erfolgreich geändert")}
                    </div>
                  </div>
                  <div class="col-xs-2">
                    <div class="s-message--success__close">
                      <i class="icon--lgs-close-icon icon--lgs-close" style={{cursor: "pointer"}}
                      onClick={closeSuccessMessage}></i>
                    </div>
                  </div>
                </div>
              </div>
          )
        }
      }

      function renderSideBarMenu() {
          if(openMobileMenu===true || screenWidth > 767) {
              return (
                  <div>
                  <a class={screenWidth<768 ? "small-drop" : "noDisplay"} href="#mobile-drop"
                  data-toggle="collapse"
                  aria-expanded="false"
                  style={{position: "relative",
                  top: "1.5rem"}}
                  onClick={activateTabArrow}></a>
                    <div class={screenWidth<768 ? "s-account__sidebar__menu collapse" : "s-account__sidebar__menu"}
                     id="mobile-drop">
                      <ul class="s-account__sidebar__menu__category__list">
                        <li onClick={handleClickOnLink}
                         class="s-account__sidebar__menu__category__list--item">
                          <NavLink to="/" exact
                          id="Personlische_Daten"
                           activeClassName="selected">{Drupal.t("PERSÖNLICHE DATEN")}</NavLink>
                        </li>
                        <li onClick={handleClickOnLink}
                        class="s-account__sidebar__menu__category__list--item">
                          <NavLink to="/Adressbuch"
                          id="Adressbuch" activeClassName="selected">{Drupal.t("ADRESSBUCH")}</NavLink>
                        </li>
                        <li
                        onClick={handleClickOnLink}
                         class="s-account__sidebar__menu__category__list--item">
                          <NavLink to="/Meine_Bestellungen"
                          id="Meine_Bestellungen"
                          activeClassName="selected">{Drupal.t("MEINE BESTELLUNGEN")}</NavLink>
                        </li>
                        <li
                        onClick={handleClickOnLink}
                         class="s-account__sidebar__menu__category__list--item">
                          <NavLink to="/Meine_Downloads"
                          id="Meine_Downloads"
                          activeClassName="selected">{Drupal.t("MEINE DOWNLOADS")}</NavLink>
                        </li>
                        <li class="s-account__sidebar__menu__category__list--item">
                              <a href="/user/logout" class="abmelden" >{Drupal.t("ABMELDEN")}</a>
                        </li>
                      </ul>
                    </div>
                  </div>
              )
          }

          else return (
              <div class="s-account__sidebar__menu">
              <p style={{display: "inline-block", fontWeight: "700", color: "#000000"}}>{Drupal.t(currentActive.split("_").join(" ").toUpperCase())}</p>
              <a class="small-drop" href="#mobile-drop"
              data-toggle="collapse"
              aria-expanded="false"
              style={{top: "0.3rem"}}
              onClick={activateTabArrow}></a>
              </div>
          )
      }

      function renderEverything() {
          if(gotTheInfo) {
              return (
                <HashRouter>
                  <div class="container">
                  {renderPasswordChangeMessage()}
                    <div class="row">
                      <div class="col-xs-12 col-sm-4 col-md-3">
                      {renderSideBarMenu()}
                      </div>
                      <div>
                        <Route exact path="/" render={()=><PersonlicheDaten customerInfo={customerInfo}
                        successChangeOfPassword={successChangeOfPassword}/>}/>
                        <Route path="/Adressbuch" render={()=><Addressen customerInfo={customerInfo}
                        themePath={themePath}/>}/>
                        <Route path="/Meine_Bestellungen"
                        render={()=><Bestellungen
                        themePath={themePath}/>}/>
                        <Route path="/Meine_Downloads"
                        render={()=><Downloads
                        themePath={themePath}/>}/>
                      </div>
                    </div>
                  </div>
                </HashRouter>
              )
          }
      }

    return (
      <div>
      <div class="breadcrumbs">
      <i class="icon--lgs-house-navigation crumb"></i>
      <i class="icon--lgs-icon-right crumb"></i>
      <p class="breadcrumbs--text crumb">{Drupal.t("Mein Konto")}</p>
      <i class="icon--lgs-icon-right crumb"></i>
      <p class="breadcrumbs--text crumb">{currentActive.split("_").join(" ")}</p>
      </div>
      {renderEverything()}
      </div>
    )
  }

}
