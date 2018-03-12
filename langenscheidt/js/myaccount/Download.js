import {h, render, Component} from 'preact';

import DownloadItem from './DownloadItem';


export default class Downloads extends Component {
  constructor(props) {
    super(props);
    this.state = {
        downloads: []
    }
  }

  componentWillMount() {
      SirupRestApi.getOrderDownloads().then((data)=> {
          this.setState({downloads: data})
      })
  }

  render() {
      var {downloads} = this.state;
      var renderDownloads = downloads.map((item, index)=> {
          return (
              <div class="row" key={`DownloadItem_${item.sku}`}>
                <DownloadItem item={item} index={index}
                themePath={this.props.themePath}/>
              </div>
          )
      })
    return (
      <div class="col-xs-12 col-sm-8">
        <h2>{Drupal.t("Meine Downloads")}</h2>
        <div class="s-content__abstract">
          {Drupal.t("Hier finden Sie alle von Ihnen gekauften downloadbaren Produkte. Ab Kaufdatum stehen Ihnen diese für zwei Jahre zum Reload zur Verfügung. Jedes Produkt kann bis zu fünf mal heruntergeladen werden.")}
        </div>
        {renderDownloads}

      </div>
    )
  }

}
