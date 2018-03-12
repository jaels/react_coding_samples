B2B.FilterModal = class extends React.Component {
  constructor(props) {
    super(props);
    let { filters, productType } = this.props;
    let { websiteId } = options.props;
    let lengthOfGrosse = Object.keys(filters.grosse).length;
    this.state = {
      recievedFilters: filters,
      filters: filters,
      productType: productType,
      showFiltersState: {
        kategorie: false,
        farbe: false,
        grosse: false,
        material: false,
        model: false
      },
      pressedFiltersState: {
        kategorie: [],
        farbe: [],
        grosse: productType == "trousers" ? {
          clothing_size: [],
          inch_size: []
      } : {belt_sizes:[]},
        material: [],
        model: []
    },
      grossenType: productType !== "trousers" ? "belt_sizes" : websiteId=="5" ? "inch_size" : "clothing_size",
      isSearchActive: false
    }

    this.handleArrowClick = this.handleArrowClick.bind(this);
    this.handleGrosseTypeClick = this.handleGrosseTypeClick.bind(this);
    this.handlefilterClick = this.handlefilterClick.bind(this);
    this.handleClickOnAlleLoschen = this.handleClickOnAlleLoschen.bind(this);
    this.handleClickOnSearchIcon = this.handleClickOnSearchIcon.bind(this);
    this.handleKeyPressInSearch = this.handleKeyPressInSearch.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    let filters = nextProps.filters;
    this.setState({filters});
    if(Object.keys(filters.grosse).length==1) {
        this.setState({grossenType: filters.grosse[Object.keys(filters.grosse)[0]].id, gotTheFilters:true})
    }
  }

  handleClickOnAlleLoschen() {
      let { productType } = this.state;
      var emptyPressedFiltersState = {
        kategorie: [],
        farbe: [],
        grosse: productType == "trousers" ? {
          clothing_size: [],
          inch_size: []
      } : {belt_sizes:[]},
        material: [],
        model: []
    }
          this.setState({pressedFiltersState:emptyPressedFiltersState, isSearchActive:false});
          this.props.handleClickOnAlleLoschenMain(emptyPressedFiltersState);
    $("#search-by-input").val("");
}

  handlefilterClick(e) {
    $("#search-by-input").val("");
    var {pressedFiltersState} = this.state;
    var {handleClickOnfilterMain} = this.props;
    let target = e.target.id;
    var isNewFilter;
    let filterType = target.slice(0, target.indexOf('@'));
    if (filterType == "grosse") {
      let pressedGrosseType = target.slice(target.indexOf("@") + 1, target.indexOf("+"));
      let filterId = target.slice(target.indexOf("+") + 1, target.lastIndexOf("@"));
      let filterName = target.slice(target.lastIndexOf('@') + 1);
      var tempObj = {
        filterType: filterType,
        name: filterName,
        id: filterId,
        grosseType: pressedGrosseType
      };
      if (pressedFiltersState[filterType][pressedGrosseType].filter((item) => {
        return item.id == filterId;
      }).length == 0) {
        isNewFilter = true;
        pressedFiltersState[filterType][pressedGrosseType].push(tempObj);
      } else {
        isNewFilter = false;
        pressedFiltersState[filterType][pressedGrosseType] = pressedFiltersState[filterType][pressedGrosseType].filter((element) => {
          return element.id !== filterId;
        })
      }
    } else {
      let filterId = target.slice(target.indexOf('@') + 1, target.lastIndexOf('@'));
      let filterName = target.slice(target.lastIndexOf('@') + 1);
      var tempObj = {
        filterType: filterType,
        name: filterName,
        id: filterId
      };
      if (pressedFiltersState[filterType].filter((item) => {
        return item.id == filterId;
      }).length == 0) {
        isNewFilter = true;
        pressedFiltersState[filterType].push(tempObj);
      } else {
        isNewFilter = false;
        pressedFiltersState[filterType] = pressedFiltersState[filterType].filter((element) => {
          return element.id !== filterId;
        })

      }
    }
    handleClickOnfilterMain(tempObj, pressedFiltersState, isNewFilter)
    this.setState({pressedFiltersState});
  }

  handleGrosseTypeClick(e) {
    let method = e.target.id;
    this.setState({grossenType: method});
  }

  handleArrowClick(e) {
    var {showFiltersState} = this.state;
    let currentClick = e.target.id.slice(e.target.id.indexOf('-') + 1);
    showFiltersState[currentClick] = !showFiltersState[currentClick];
    this.setState(showFiltersState);
  }

  handleClickOnSearchIcon() {
      let { productType } = this.state;
      var emptyPressedFiltersState = {
        kategorie: [],
        farbe: [],
        grosse: productType == "trousers" ? {
          clothing_size: [],
          inch_size: []
      } : {belt_sizes:[]},
        material: [],
        model: []
    }
          var closeAllFilters = {
            kategorie: false,
            farbe: false,
            grosse: false,
            material: false,
            model: false
          }
    let searchValue = $("#search-by-input").val();
    if (searchValue.length > 0) {
      this.setState({pressedFiltersState: emptyPressedFiltersState, showFiltersState: closeAllFilters, isSearchActive:false});
      this.props.handleSearchByNumber(searchValue, emptyPressedFiltersState);
      $("#search-by-input").val("");

    }
  }

  handleKeyPressInSearch(e) {
      if(e.keyCode==13) {
          this.handleClickOnSearchIcon();
      }
      else {
          let searchValue = $("#search-by-input").val();
          if(searchValue.length>0) {
              this.setState({isSearchActive:true});
          }

          else {
              this.setState({isSearchActive:false});
          }
      }
  }

  render() {
    var {
      filters,
      showFiltersState,
      grossenType,
      pressedFiltersState,
      productType,
      isSearchActive
    } = this.state;
    var {handleArrowClick, handleGrosseTypeClick, handlefilterClick, handleClickOnAlleLoschen, handleClickOnSearchIcon, handleKeyPressInSearch} = this;
    var {imagePath, categoryName} = options.props;
    var ArtikelnummerTrans = $.mage.__('Artikelnummer');
    function rederPressedNames(filterType) {
      if (filterType == "grosse") {
        if (pressedFiltersState[filterType][grossenType].length > 0) {
          let renderredNames = pressedFiltersState[filterType][grossenType].map((item, index) => {
            return (
              <p className="pressed-names" key={`pressed-names-${item.id}`}>
                {" "}{item.name}{pressedFiltersState[filterType][grossenType].length > 1 && index !== pressedFiltersState[filterType][grossenType].length - 1
                  ? ","
                  : ""}</p>
            )
          })
          return renderredNames;
        }
      } else if (pressedFiltersState[filterType].length > 0) {
        let renderredNames = pressedFiltersState[filterType].map((item, index) => {
          return (
            <p className="pressed-names" key={`pressed-names-${item.id}`}>
              {" "}{item.name}{pressedFiltersState[filterType].length > 1 && index !== pressedFiltersState[filterType].length - 1
                ? ","
                : ""}</p>
          )
        })
        return renderredNames;
      }
    }
    function modelFunc() {
      if (showFiltersState.model && filters.model.length > 0) {
        var modelOptions = filters.model.map((item) => {
          return (
            <div className={pressedFiltersState.model.filter((mod) => {
              return item.id == mod.id
            }).length > 0
              ? "filter-option-pressed"
              : "filter-option"} key={`filter-model-${item.id}`} id={`model@${item.id}@${item.name}`} onClick={handlefilterClick}>
              <p className="filter-option-name" id={`model@${item.id}@${item.name}`}>{item.name}</p>
            </div>
          )
        })
        return modelOptions;
      }
    }

    function materialFunc() {
      if (showFiltersState.material && filters.material.length > 0) {
        var materialOptions = filters.material.map((item) => {
          return (
            <div className={pressedFiltersState.material.filter((mat) => {
              return item.id == mat.id
            }).length > 0
              ? "filter-option-pressed"
              : "filter-option"} key={`filter-material-${item.id}`} id={`material@${item.id}@${item.name}`} onClick={handlefilterClick}>
              <p className="filter-option-name" id={`material@${item.id}@${item.name}`}>{item.name}</p>
            </div>
          )
        })
        return materialOptions;
      }
    }
    function kategorieFunc() {
      if (showFiltersState.kategorie && filters.kategorie.length > 0) {
        var kategorieOptions = filters.kategorie.map((item) => {
          return (
            <div className={pressedFiltersState.kategorie.filter((kat) => {
              return item.id == kat.id
            }).length > 0
              ? "filter-option-pressed"
              : "filter-option"} key={`filter-kategorie-${item.id}`} id={`kategorie@${item.id}@${item.name}`} onClick={handlefilterClick}>
              <p className="filter-option-name" id={`kategorie@${item.id}@${item.name}`}>{item.name}</p>
            </div>
          )
        })
        return kategorieOptions;
      }
    }

    function farbeFunc() {
      if (filters.farbe.length > 0 && showFiltersState.farbe) {
        var farbeOptions = filters.farbe.map((color) => {
          return (
            <div className="filter-option-farbe" onClick={handlefilterClick} id={`farbe@${color.id}@${color.name}`} key={`filters-farbe-${color.id}`}>
              <div className="filter-colorCircle" style={pressedFiltersState["farbe"].filter((farb) => {
                return farb.id == color.id
              }).length > 0
                ? {
                  backgroundColor: color.webcolor,
                  boxShadow: "-5px 5px 10px rgba(0,0,0,.35)"
                }
                : {
                  backgroundColor: color.webcolor
                }} id={`farbe@${color.id}@${color.name}`}></div>
              <h3 className="filters-colorName" id={`farbe@${color.id}@${color.name}`}>{color.name}</h3>
              <img src={`${imagePath}/checke-06.svg`} className="checkSign" style={pressedFiltersState["farbe"].filter((farb) => {
                return farb.id == color.id
              }).length > 0
                ? {
                  display: "inline-block"
                }
                : {
                  display: "none"
                }}/>
            </div>
          )
        })
        return farbeOptions;
      }
    }

    function grosseFunc() {
      if (showFiltersState.grosse &&  !jQuery.isEmptyObject(filters.grosse)) {
        var renderGrosse = filters.grosse[grossenType].groups.map((group) => {
          var renderFilterSizes = group.sizes.map((size) => {
            return (
              <div className={pressedFiltersState.grosse[grossenType].filter((gros) => {
                return size.id == gros.id
              }).length > 0
                ? "filter-option-pressed"
                : "filter-option"} id={`grosse@${grossenType}+${size.id}@${size.name}`} onClick={handlefilterClick}>
                <p className="filter-option-name" id={`grosse@${grossenType}+${size.id}@${size.name}`} key={`filter-size-${size.id}`}>{size.name}</p>
              </div>
            )
          })
          return (
            <div className="filters-group-area" key={"filter-group-" + group.name}>
              <h4 className={group.sizes.length > 0 ? "filters-group-title" : "noDisplay"}>{group.name}</h4>
              {renderFilterSizes}
            </div>
          )
        })
        return (
          <div>
            <div className={Object.keys(filters.grosse).length==1 ? "noDisplay" : "chooseTypeOfGrossen-area"}>
              <div className={grossenType == "clothing_size"
                ? "active-grosse-btn"
                : "not-active-grosse-btn"} id="clothing_size" onClick={handleGrosseTypeClick}>
                <p id="clothing_size">{$.mage.__("Konfektionsgrößen")}</p>
              </div>
              <div className={grossenType == "inch_size"
                ? "active-grosse-btn"
                : "not-active-grosse-btn"} id="inch_size" onClick={handleGrosseTypeClick}>
                <p id="inch_size">{$.mage.__("Inch-Größen")}</p>
              </div>
            </div>
            {renderGrosse}
          </div>
        )
      }
    }

    return (
      <div className="modal-container">
        <p className="filtern-text-in-container">{$.mage.__('Produkte filtern')}</p>
        <p className="allesLochen-btn" onClick={handleClickOnAlleLoschen}>{$.mage.__('Alles löschen')}</p>
        <div className="search-by-id-area">
          <input type="text" id="search-by-input" placeholder={ArtikelnummerTrans} onKeyUp={handleKeyPressInSearch}/>
          <img src={`${imagePath}/search_icon.svg`} onClick={handleClickOnSearchIcon} className="filter-search-icon"/>
        </div>
        <div className="theFiltersArea">
          <div className="filter-section" style={productType !== "trousers"
            ? {
              display: "none"
            }
            : {
              display: "block"
            }}>
            <div className={showFiltersState.kategorie
              ? "filter-title-pressed"
              : "filter-title"} onClick={this.handleArrowClick} id="title-kategorie">
              <p className="title" id="title-kategorie">
                <span style={isSearchActive==true ? {color: "#C8C8C8"} : {color: "black"}} id="title-kategorie">{$.mage.__('KATEGORIE')}
                  <div className="pressed-names-area">
                    {rederPressedNames("kategorie")}
                  </div>
                  <div className={showFiltersState.kategorie
                    ? "title-arrow-up"
                    : "title-arrow-down"} id="title-kategorie"></div>
                </span>

              </p>
            </div>
            <div className="filter-options" style={showFiltersState.kategorie
              ? {
                marginBottom: "5rem"
              }
              : {
                marginBottom: "2.8rem"
              }} id="filter-options-kategorie">
              {kategorieFunc()}
            </div>
          </div>
          <div className="filter-section">
            <div className={showFiltersState.farbe
              ? "filter-title-pressed"
              : "filter-title"} onClick={this.handleArrowClick} id="title-farbe">
              <p className="title" id="title-farbe">
                <span id="title-farbe" style={isSearchActive==true ? {color: "#C8C8C8"} : {color: "black"}}>{$.mage.__('FARBE')}
                  <div className="pressed-names-area">
                    {rederPressedNames("farbe")}
                  </div>
                  <div className={showFiltersState.farbe
                    ? "title-arrow-up"
                    : "title-arrow-down"} id="title-farbe"></div>
                </span>

              </p>
            </div>
            <div className="filter-options" id="filter-options-kategorie" style={showFiltersState.farbe
              ? {
                marginBottom: "5rem"
              }
              : {
                marginBottom: "2.8rem"
              }}>
              {farbeFunc()}
            </div>
          </div>
          <div className="filter-section" >
            <div className={showFiltersState.grosse
              ? "filter-title-pressed"
              : "filter-title"} onClick={this.handleArrowClick} id="title-grosse">
              <p className="title" id="title-grosse">
                <span id="title-grosse" style={isSearchActive==true ? {color: "#C8C8C8"} : {color: "black"}}>
                  {$.mage.__('GRÖSSE')}
                  <div className="pressed-names-area">
                    {rederPressedNames("grosse")}
                  </div>
                  <div className={showFiltersState.grosse
                    ? "title-arrow-up"
                    : "title-arrow-down"} id="title-grosse"></div>
                </span>

              </p>
            </div>
            <div className="filter-options" id="filter-options-grosse" style={showFiltersState.grosse
              ? {
                marginBottom: "5rem"
              }
              : {
                marginBottom: "2.8rem"
              }}>
              {grosseFunc()}
            </div>
          </div>
          <div className="filter-section" style={productType !== "trousers"
            ? {
              display: "none"
            }
            : {
              display: "block"
            }}>
            <div className={showFiltersState.material
              ? "filter-title-pressed"
              : "filter-title"} onClick={this.handleArrowClick} id="title-material">
              <p className="title" id="title-material">
                <span id="title-material" style={isSearchActive==true ? {color: "#C8C8C8"} : {color: "black"}}>{$.mage.__('MATERIAL').toUpperCase()}
                  <div className="pressed-names-area">
                    {rederPressedNames("material")}
                  </div>
                  <div className={showFiltersState.material
                    ? "title-arrow-up"
                    : "title-arrow-down"} id="title-material"></div>
                </span>
              </p>
            </div>
            <div className="filter-options" id="filter-options-material" style={showFiltersState.material
              ? {
                marginBottom: "5rem"
              }
              : {
                marginBottom: "2.8rem"
              }}>
              {materialFunc()}
            </div>
          </div>
          <div className="filter-section" style={productType !== "trousers"
            ? {
              display: "none"
            }
            : {
              display: "block"
            }}>
            <div className={showFiltersState.model
              ? "filter-title-pressed"
              : "filter-title"} onClick={this.handleArrowClick} id="title-model">
              <p className="title" id="title-model">
                <span id="title-model" style={isSearchActive==true ? {color: "#C8C8C8"} : {color: "black"}}>{$.mage.__('MODELL')}
                  <div className="pressed-names-area">
                    {rederPressedNames("model")}
                  </div>
                  <div className={showFiltersState.model
                    ? "title-arrow-up"
                    : "title-arrow-down"} id="title-model"></div>
                </span>
              </p>
            </div>
            <div className="filter-options" id="filter-options-model" style={showFiltersState.model
              ? {
                marginBottom: "5rem"
              }
              : {
                marginBottom: "2.8rem"
              }}>
              {modelFunc()}
            </div>
          </div>
          </div>
          </div>
    )
  }
}
