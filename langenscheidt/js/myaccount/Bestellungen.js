import {h, render, Component} from 'preact';

import OneOrder from './OneOrder';

export default class Bestellungen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      theOrders: [],
      pageNumber: 1,
      gotTheOrders: false,
      countries: [],
      numPerPage: 5
    }

    this.getTheOrders = this.getTheOrders.bind(this);
    this.handleClickOnLoadmore = this.handleClickOnLoadmore.bind(this);
    this.activateTabArrow = this.activateTabArrow.bind(this);

  }

  componentWillMount() {
      let { numPerPage } = this.state;
    SirupRestApi.getCountries().then((data)=> {
        this.setState({countries: data})
    }).then(()=>{
        this.getTheOrders();
    })
  }

handleClickOnLoadmore() {
    let { numPerPage } = this.state;
    this.setState({numPerPage: numPerPage+5});
    this.getTheOrders();
}

  getTheOrders() {
    let {theOrders, numPerPage} = this.state;
    SirupRestApi.getOrders(1, numPerPage).then((data) => {
        this.setState({theOrders: data, gotTheOrders: true});
    })
  }

  activateTabArrow(e) {
      let temp  = e.target.id;
      let id = temp.slice(temp.indexOf("_") + 1);
      jQuery("#heading_" + id).toggleClass("active");

  }

  render() {
    var {theOrders, gotTheOrders, countries, numPerPage} = this.state;
    var {handleClickOnLoadmore, activateTabArrow} = this;
    var {themePath} = this.props;
    function renderTheOrders() {
      if (gotTheOrders) {
        return theOrders.items.map((orderItem, index) => {
          var addData = theOrders.additional_data.filter((item) => {
            return orderItem.entity_id == item.entity_id;
          })

          return (
              <div class="panel panel-default" key={`heading_${index}`}>
              <div class={index===0 ? "panel-headline active" : "panel-headline"} role="tab" id={`heading_${index}`}>
                <h4 class="panel-title">
                  <a class="collapsed" role="button" data-toggle="collapse"  href={`#collapse_${index}`} aria-expanded="false" aria-controls={`collapse_${index}`}
                  onClick={activateTabArrow}
                  id={`a_${index}`}>
                    {Drupal.t("Bestellung Nr.") + " "}
                    {orderItem.increment_id}
                  </a>
                </h4>
              </div>
              <div id={`collapse_${index}`} class={index==0 ? "panel-collapse collapse in" : "panel-collapse collapse"} role="tabpanel" aria-labelledby={`heading_${index}`}>
                <OneOrder item={orderItem} addData={addData[0]} countries={countries} index={index}
                themePath={themePath}/>
              </div>
              <div class="panel-divider"></div>
            </div>
          )
        })
      }

    }
    return (
      <div class="col-xs-12 col-sm-8" style={{paddingRight: "2rem"}}>
        <h2>{Drupal.t("Meine Bestellungen")}</h2>
        <div class="s-content__abstract">
          {Drupal.t("Hier finden Sie alle von Ihnen gekauften downloadbaren Produkte. Ab Kaufdatum stehen Ihnen diese für zwei Jahre zum Reload zur Verfügung. Jedes Produkt kann bis zu fünf mal heruntergeladen werden.")}
        </div>
        <div class="panel-group" id="accordion" role="tablist" aria-multiselectable="true">
        {renderTheOrders()}
        </div>
        <div class={theOrders.total_count > numPerPage ? "button s-message-overlay--success__button--basket" : "noDisplay"} onClick={handleClickOnLoadmore}>{Drupal.t("Mehr laden")}</div>
      </div>
    )
  }

}
