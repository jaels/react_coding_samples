import {h, render, Component} from 'preact';

export default class Tracking extends Component {

  constructor(props) {
    super(props);
    let {data} = this.props;
    this.state = {
      data: data,
      items: data.tracking.items
    }
  }

  render() {
    var {items, themePath} = this.state;
    var renderItems = items.map((item, index) => {
      return (
        <div class="row">
          <div class="col-xs-4">
            {new Intl.DateTimeFormat('de-DE').format(new Date(item.created_at))}
          </div>
          <div class="col-xs-4">
            <a href={"https://nolp.dhl.de/nextt-online-public/de/search?piececode=" + item.track_number} target="_blank" style={{
              fontWeight: "700",
              textDecoration: "underline"
            }}>
              {item.track_number}
            </a>
          </div>
        </div>
      )
    })
    return (
      <div>
        <div class="row">
          <div class="col-xs-4">
            <div class="s-font--copytext s-basket__headertext s-basket__headertext--first">{Drupal.t("Datum")}</div>
          </div>
          <div class="col-xs-4">
            <div class="s-font--copytext s-basket__headertext s-basket__headertext--first">{Drupal.t("Tracking Nr.")}</div>
          </div>
        </div>
        {renderItems}
      </div>
    )
  }

}
