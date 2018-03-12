import {h, Component} from 'preact';
import Product from './Product';

export default class Main extends Component {
  constructor(props) {
    super(props);
    var {jQuery} = this.props;
    this.state = {
      cart: [],
      isLoading: true,
      zwischensumme: 0,
      jQuery: jQuery,
      screenWidth: jQuery(window).width(),
      emptyFlag: false
    }
    this.deleteItem = this.deleteItem.bind(this);
    this.changedQuantity = this.changedQuantity.bind(this);
  }

  componentWillMount() {
    SirupRestApi.cartList().then((data) => {
      let cart = data;
      if (cart.length === 0) {
        this.setState({emptyFlag: true, isLoading: false})
      } else {
        var getAll = Promise.all(cart.map((item) => {
          SirupRestApi.getProduct(item.sku).then((data) => {
            item.product = data;
            this.setState({cart:cart});
          });
        }));
        getAll.then(() => {
          this.setState({isLoading: false});
        });
      }
    })
  }

  deleteItem(id) {
    let {cart} = this.state;
    let remainingItems = cart.filter((item)=> {
        return item.item_id !== id;
    })
    this.setState({ cart: remainingItems });
    if (remainingItems.length===0) {
        this.setState({emptyFlag: true});
    }
    SirupRestApi.cartDelete(id).then(() => {

    })
  }

  changedQuantity(qty, id) {
    let {cart} = this.state;
    cart.map((item) => {
      if (item.item_id == id) {
        item.qty = qty;
      }
    })
    this.setState({cart: cart});
  }

  render() {
    let {
      isLoading,
      cart,
      zwischensumme,
      jQuery,
      emptyFlag
    } = this.state;
    let {deleteItem, changedQuantity} = this;

    function renderEverything() {
      if (isLoading === false && emptyFlag === false) {
        return cart.map((item, index) => {
          return (
            <div>
              <Product key={item.item_id} cartDetails={item} indexOfProduct={index} deleteItem={deleteItem} changedQuantity={changedQuantity} jQuery={jQuery}/>
            </div>
          )
        })
      } else if (isLoading === false && emptyFlag === true) {
        return (
          <div class="wk-is-empty">
            {Drupal.t("Der Warenkorb ist leer")}
          </div>
        )
      }
    }
    function zwischensummeCalc() {
      let zwischensumme = 0;
      cart.map((item) => {
        zwischensumme += item.price * item.qty;
      })
      return zwischensumme.toFixed(2);
    }

    return (
      <div class="row">
        <div class="col-sm-8">
          {renderEverything()}
        </div>
        <div class={isLoading || emptyFlag
          ? "noDisplay"
          : "col-sm-4"}>
          <div class="row">
            <div class="col-md-12">
              <div class="s-pdp__basket">
                <div class="s-pdp__basket__category"></div>
                <div class="s-pdp__basket__description">
                  <div class="s-pdp__basket__description__headline">{Drupal.t("Zwischensumme")}</div>
                  <div class="s-pdp__basket__description__price">{zwischensummeCalc()}
                    €</div>
                </div>
                <div class="s-pdp__basket__description__vat">{Drupal.t("Preise inkl. MwSt.")}</div>
                <div class="s-pdp__basket__description__delivery">{Drupal.t("Kostenloser Versand innerhab DE/AT/CH")}</div>
                <div class="s-pdp__basket__description__link">
                  <a href="#">
                    {Drupal.t("Weitere Informationen hier")}</a>
                </div>
                <a href={this.props.checkoutUrl} class="s-pdp__basket__add-to">
                  <div class="s-pdp__basket__add-to--text">{Drupal.t("Zur Kasse")}</div>
                  <div class="s-pdp__basket__add-to--icon icon--lgs-arrow" style={{textDecoration: "none"}}></div>
                </a>
              </div>

            </div>
          </div>
        </div>
      </div>

    )
  }
}
