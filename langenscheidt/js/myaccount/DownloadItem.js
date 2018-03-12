import {h, render, Component} from 'preact';

export default class DownloadItem extends Component {
  constructor(props) {
    super(props);
    var {item, index} = this.props;
    this.state = {
        item: item,
        index: index,
        product: {},
        screenWidth: jQuery(window).width()

    }
  }

  componentWillMount() {
    var {item} = this.state;
    SirupRestApi.getProduct(item.sku).then((data) => {
      this.setState({product: data})
    })
  }


render () {
    var {item, product, screenWidth, index} = this.state;
    var { themePath } = this.props;
    return (
        <div class="col-sm-12">
          <div class={screenWidth < 768 ? "row s-basket s-account__row" : "row s-basket__first-line s-account__row"}>
            <div class="col-xs-3 col-sm-2">
              <div class="s-font--copytext s-basket__headertext s-basket__headertext--first  s-basket__headertext--article" style={index === 0 && screenWidth > 767 ? {display: "block"}: screenWidth < 768 ? {display: "none"} : {visibility: "hidden"}}>{Drupal.t("Artikel")}</div>
              <img src={product.cover} class="img-responsive" alt="" title=""/></div>
            <div class="col-xs-9 col-sm-3">
              <div class="s-basket__title">{product.name}</div>
              <div class="s-basket__description">{product.title_short}</div>
            </div>
            <div class="col-xs-3 col-sm-2 col-sm-push-0">
              <div class="s-font--copytext s-basket__headertext s-basket__headertext--first" style={index === 0 || screenWidth < 768 ? {visibility: "visible"}: {visibility: "hidden"}}>{Drupal.t("Kaufdatum")}</div>
              <div class="s-basket__price">{new Intl.DateTimeFormat('de-DE').format(new Date(item.date))}</div>
            </div>
            <div class="col-xs-3 col-sm-2 col-sm-push-0">
              <div class="s-font--copytext s-basket__headertext s-basket__headertext--first" style={index === 0 || screenWidth < 768 ? {visibility: "visible"}: {visibility: "hidden"}}>{Drupal.t("Größe")}</div>
              <div class="s-basket__price">{product.filesize} MB</div>
            </div>
            <div class="col-xs-3 col-sm-1 col-sm-push-0">
              <div class="s-font--copytext s-basket__headertext s-basket__headertext--first  s-basket__headertext--download" style={index === 0 || screenWidth < 768
                ? {
                  display: "block"
                }
                : {
                  visibility: "hidden"
              }} >{Drupal.t("Download")}</div>
              <div class="s-basket__price--total">
              <a href={item.url} download>
                  <img
                   src={'/' + themePath + '/images/logo/button-download-klein.png'} style={{width:"70px", height:"25px"}}/>
                  </a>
              </div>
            </div>
          </div>

        </div>
    )

}


}
