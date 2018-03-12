B2B.BigImageModal = class extends React.Component {
    constructor(props) {
        super(props);
        var {product, chosenColorId, chosenColorIndex, chosenPicRoute, colorsArr} = this.props;
        this.state = {
            product: product,
            chosenColorId: chosenColorId,
            chosenColorName: product.colors[chosenColorIndex].color.name,
            chosenPicRoute: chosenPicRoute,
            whichOne: 0,
            picsArr: product.colors[chosenColorIndex].images,
            colorsArr: colorsArr
        }

        this.changeImage = this.changeImage.bind(this);
        this.arrayPressed = this.arrayPressed.bind(this);
        this.thumbnailPressed = this.thumbnailPressed.bind(this);
    }

    changeImage(e) {
        var { product, colorsArr} = this.state;
        var picId = e.target.id;
        var index = colorsArr.indexOf(picId);
        var colorName = product.colors.filter(item => {
            return item.color.id == picId;
        })[0].color.name;
        var picsArr = product.colors[index].images;
        this.setState({picsArr:picsArr,
            whichOne:0,
            chosenPicRoute:picsArr[0],
            chosenColorId:picId,
            chosenColorName:colorName
        })
    }

    arrayPressed(e) {
        var direction = e.target.id;
        var {whichOne, picsArr} = this.state;
       if (direction === "right") {
           if (whichOne < picsArr.length-1) {
               var temp = parseInt(whichOne) + 1;
           } else {
               var temp = 0;
           }
       } else if (direction === "left") {
           if (whichOne > 0) {
               var temp = parseInt(whichOne) - 1;

           } else {
               var temp = picsArr.length - 1;
           }
       }
       this.setState({chosenPicRoute: this.state.picsArr[temp], whichOne: temp});
    }

    thumbnailPressed(e) {
        var thumbPressed = e.target.id;
        this.setState({whichOne: thumbPressed, chosenPicRoute: this.state.picsArr[thumbPressed]})
    }

    render() {
        var that = this;
        var {
            product,
            chosenColorId,
            chosenColorName,
            picsArr,
            chosenPicRoute,
            whichOne
        } = this.state;
        var name = product.name.slice(0, product.name.indexOf(' '));
        var num = product.name.split(" ")[1];

        var colors = product.colors.map(color => {
            return (
                <div className={that.state.chosenColorId == color.color.id
                    ? "modal-color-circle-pressed"
                    : "modal-color-circle"} id={color.color.id} style={{
                    backgroundColor: color.color.webcolor
                }} onClick={this.changeImage} key={`bigPicsModalColors-${color.sku}`}></div>
            )
        });
        var thumbnails = picsArr.map(function(thumbnail, index) {
            return (
                <div>
                    <img src={thumbnail} className={that.state.whichOne == index
                        ? "chosenThumbnail"
                        : "thumbnail"} id={index} key={`bigPicsModalThumbs-${product.id}-${index}`} onClick={that.thumbnailPressed}/>
                </div>
            )
        })

        return (
            <div className="modalWrapper" >
                <div>
                <img className="modal-theBigPic" src={chosenPicRoute}/>
                </div>
                <div className="modal-thunmbNails-box">
                    {thumbnails}
                </div>
                <img src={this.props.imagePath + "/closeButton.png"} className="modal-closeButton" onClick={this.props.onClose}/>
                <div className={picsArr.length>1 ? "modal-arrows" : "display-none"}>
                    <img src={this.props.imagePath + "/arrowLeftBtn.png"} className="modal-arrowBtn" id="left" onClick={this.arrayPressed}/>
                    <img src={this.props.imagePath + "/arrowRightBtn.png"} className="modal-arrowBtn" id="right" onClick={this.arrayPressed}/>
                </div>
                <div className="modal-details-box">
                    <div className="modal-text-wrapper">
                        <h1 className="modal-main-name">{name.toLowerCase()}</h1>
                        <p className="modal-details-number">{num}</p>
                        <p className="modal-short-description" dangerouslySetInnerHTML={{__html: product.short_description.toLowerCase()}}></p>
                        <p className="modal-color-name">{chosenColorId} {' '}
                            {chosenColorName}</p>
                        <div className="modal-colors-area">
                            {colors}
                        </div>
                    </div>
                </div>
            </div>
        )

    }
}
