import {h, render, Component} from 'preact';

export default class DeleteAddressModal extends Component {
  constructor(props) {
    super(props);
    let { addressId } = this.props;
    this.state = {
        addressId: addressId
    }
  }



  render() {
    var { handleClickOnLoschen, themePath } = this.props;
    var { addressId } = this.state;
    return (
        <div class="modal fade" id="delete-modal" role="dialog">

      <div class="modal-dialog">
        <div class="modal-content">
          <div class="s-message-overlay">
            <div class="s-message-overlay--question">
              <div class="s-message-overlay--question__icon">
                <img style={{
                  height: "7rem",
                  width: "7rem"
              }} src={'/' + themePath + '/images/pictures/papierkorb.png'} title="" alt="" class=""/>
              </div>
              <div class="s-message-overlay--question__text">
                {Drupal.t("Sind Sie sicher, dass Sie diese Adresse löschen möchten?")}
              </div>
              <div class="s-message-overlay--question__button">
                <a href="#" class="button s-message-overlay--question__button--delete" data-dismiss="modal" onClick={()=>handleClickOnLoschen(addressId)}>                {Drupal.t("Löschen")}
                    </a>
              </div>
              <div class="s-message-overlay--question__button">
                <a href="#" class="button s-button--close-modal" data-dismiss="modal">{Drupal.t("Abbrechen")}</a>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    )
  }

}
