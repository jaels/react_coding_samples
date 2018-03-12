import {h, render, Component} from 'preact';

export default class OneItem extends Component {
  constructor(props) {
    super(props);
    var {book, index} = this.props;
    this.state = {
      book: book,
      product: {},
      index: index,
      screenWidth: jQuery(window).width()
    }
  }

  componentWillMount() {
    var {book, screenWidth, index} = this.state;
    SirupRestApi.getProduct(book.sku).then((data) => {
      this.setState({product: data})
    })
  }

  render() {
    var {book, index, product, screenWidth} = this.state;
    return (
      <div class= {screenWidth < 768 ? "row s-basket s-account__row" : "row s-basket__first-line s-account__row"}>
        <div class="col-xs-3 col-sm-2">
          <div class="s-font--copytext s-basket__headertext s-basket__headertext--first  s-basket__headertext--article" style={index === 0 && screenWidth > 767
            ? {
              display: "block"
            }
            : screenWidth < 768
              ? {
                display: "none"
              }
              : {
                visibility: "hidden"
              }}>{Drupal.t("Artikel")}</div>
          <img src={product.cover} class="img-responsive" alt={product.title} title=""/>
        </div>
        <div class="col-xs-9 col-sm-3">
          <div class="s-basket__title">{product.subtitle}</div>
          <div class="s-basket__description">{product.subtitle_other}</div>
        </div>
        <div class="col-xs-3 col-sm-2 col-sm-push-0">
          <div class="s-font--copytext s-basket__headertext s-basket__headertext--first s-basket__headertext--artikelnr" style={index === 0 || screenWidth < 768
            ? {
              visibility: "visible"
            }
            : {
              visibility: "hidden"
            }}>{Drupal.t("Artikelnr.")}</div>
          <div class="s-basket__price s-basket__sku">{product.id}</div>
        </div>
        <div class="col-xs-3 col-sm-2 col-sm-push-0">
          <div class="s-font--copytext s-basket__headertext s-basket__headertext--first" style={index === 0 || screenWidth < 768
            ? {
              visibility: "visible"
            }
            : {
              visibility: "hidden"
            }}>{Drupal.t("Preis")}</div>
          <div class="s-basket__price">{book.price_incl_tax.toFixed(2)}</div>
        </div>
        <div class="col-xs-3 col-sm-2 col-sm-push-0">
          <div class="s-font--copytext s-basket__headertext s-basket__headertext--first" style={index === 0 || screenWidth < 768
            ? {
              visibility: "visible"
            }
            : {
              visibility: "hidden"
            }}>{Drupal.t("Menge")}</div>
          <div class="s-basket__price account-menge">{book.qty_ordered}</div>
        </div>
        <div class="col-xs-12 col-xs-push-3 col-sm-1 col-sm-push-0">
          <div class="s-font--copytext s-basket__headertext s-basket__headertext--first  s-basket__headertext--download" style={index === 0 || screenWidth < 768
            ? {
                display: "block"
            }
            : {
              visibility: "hidden"
          }}>{Drupal.t("Summe")}</div>
          <div class="s-basket__price--total">{book.row_total}
          </div>
        </div>
      </div>



    )

  }

}
