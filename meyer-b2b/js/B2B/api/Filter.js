function getTheRenderedFilters(products) {
    let filters = {
        kategorie: [],
        farbe: [],
        grosse: {},
        material: [],
        model: []
    };
    products.map((product) => {
        if (product.categories_b2b) {
            product.categories_b2b.forEach((item) => {
                if (filters.kategorie.filter((kat) => {
                    return item.id == kat.id;
                }).length == 0) {
                    let kategorieObj = {
                        name: item.label,
                        id: item.id
                    };
                    filters.kategorie.push(kategorieObj);
                }
            });
        }

        product.colors.forEach((item) => {
            if (filters.farbe.filter((farb) => {
                return item.color.color_group_id == farb.id;
            }).length == 0 && item.color.color_group_id) {
                let colorObj = {
                    name: item.color.color_group,
                    id: item.color.color_group_id,
                    webcolor: item.color.color_group_webcolor
                };
                filters.farbe.push(colorObj);
            }

            item.systems.forEach((system) => {
                if (!filters.grosse[system.id]) {
                    filters.grosse[system.id] = {
                        name: system.name,
                        id: system.id,
                        groups: {}
                    };

                }
                system.groups.forEach((group) => {
                    if (!filters.grosse[system.id].groups[group.name]) {
                        filters.grosse[system.id].groups[group.name] = {
                            name: group.name,
                            sizes: []
                        };
                    }
                    group.sizes.forEach((size) => {
                        let sizeObj = {
                            id: size.id,
                            name: size.full_name
                        };
                        if (filters.grosse[system.id].groups[group.name].sizes.filter((item) => {
                            return item.id == size.id;
                        }).length == 0 && size.available == true) {
                            filters.grosse[system.id].groups[group.name].sizes.push(sizeObj);
                        }
                    });
                });
            });
        });
        if (product.material) {
            product.material.forEach(item => {
                let materialObj = {
                    name: item.label,
                    id: item.id
                };
                if (filters.material.filter((mat) => {
                    return mat.id == item.id;
                }).length == 0) {
                    filters.material.push(materialObj);
                }
            });
        }

        if (product.model) {
            product.model.forEach(item => {
                let modelObj = {
                    name: item.label,
                    id: item.id
                };
                if (filters.model.filter((mod) => {
                    return mod.id == item.id;
                }).length == 0) {
                    filters.model.push(modelObj);
                }
            });
        }
    });

    for (var key in filters.grosse) {
        let groupsArr = [];
        for (var hey in filters.grosse[key].groups) {
            groupsArr.push(filters.grosse[key].groups[hey]);
        }
        filters.grosse[key].groups = groupsArr;
    }
    console.log(filters);
    return filters;

}

function newFilterCalc(pressedFiltersState, products) {
    var passedProducts = [];
    var kategorie = function(product, filterItem) {
        if (product.categories_b2b) {
            if (product.categories_b2b.filter((item) => {
                return item.id == filterItem.id;
            }).length > 0) {
                return true;
            } else return false;
        } else return false;
    };

    var farbe = function(product, filterItem) {
        if (product.colors.filter((item) => {
            return item.color.color_group_id == filterItem.id;
        }).length > 0) {
            return true;
        } else return false;
    };

    var material = function(product, filterItem) {
        if (product.material) {
            if (product.material.filter((item) => {
                return item.id == filterItem.id;
            }).length > 0) {
                return true;
            } else return false;
        } else return false;
    };

    var model = function(product, filterItem) {
        if (product.model) {
            if (product.model.filter((item) => {
                return item.id == filterItem.id;
            }).length > 0) {
                return true;
            } else return false;
        } else return false;
    };

    var grosse = function(product, filterItem) {
        let check = [];
        let type = filterItem.grosseType;
        product.colors.map((color) => {
            color.systems.map((system) => {
                if (system.id == type) {
                    system.groups.map((group) => {
                        if (group.sizes.filter((size) => {
                            return size.id == filterItem.id && size.available == true;
                        }).length > 0 && (pressedFiltersState.farbe.length==0 || pressedFiltersState.farbe.filter((item) => {
                            return item.id == color.color.color_group_id;
                        }).length > 0)) {
                            check.push(filterItem);
                        }
                    });
                }
            });
        });
        return check;
    };

    var filterFunctions = {
        kategorie: kategorie,
        farbe: farbe,
        material: material,
        model: model,
        grosse: grosse
    };

    products.map((product) => {
        var counter = 0;
        var passing = false;
        for (var key in pressedFiltersState) {
            if (passing == true || counter == 0) {
                if (key !== "grosse") {
                    if (pressedFiltersState[key].length > 0) {
                        passing = false;
                        pressedFiltersState[key].map((filterItem) => {
                            if (filterFunctions[key](product, filterItem)) {
                                passing = true;
                            }
                        });
                        counter += 1;
                    }
                }
                if (key == "grosse") {
                    for (var hey in pressedFiltersState["grosse"]) {
                        if (pressedFiltersState["grosse"][hey].length > 0) {
                            passing = false;
                            pressedFiltersState["grosse"][hey].map((filterItem) => {

                                if (filterFunctions["grosse"](product, filterItem).length > 0) {
                                    passing = true;
                                }
                            });
                            counter += 1;
                        }
                    }
                }
            } else {
                passing = false;
            }
        }
        if (passing) {
            passedProducts.push(product);
        }

    });

    return passedProducts;
}



function sortTheProducts(products) {
    let sorted = [];
    let exklusive = [];
    let pocket = [];
    let cotton = [];
    let denim = [];
    let wool = [];
    let thermo = [];
    let rest = [];
    products.map(product => {
        if(product.categories_b2b) {
            product.categories_b2b.filter((cat)=>{return cat.id==486}).length>0 ?
            exklusive.push(product) : product.categories_b2b.filter((cat)=>{return cat.id==483}).length>0 ? pocket.push(product) :  product.categories_b2b.filter((cat)=>{return cat.id==481}).length>0 ? cotton.push(product) : product.categories_b2b.filter((cat)=>{return cat.id==482}).length>0 ? denim.push(product) : product.categories_b2b.filter((cat)=>{return cat.id==484}).length>0 ? wool.push(product) :product.categories_b2b.filter((cat)=>{return cat.id==485}).length>0 ? thermo.push(product) : rest.push(product);
        }
        else {
            rest.push(product);
        }
    })

    sorted = [].concat.apply([], [exklusive, pocket, cotton, denim, wool, thermo, rest]);

    return sorted;
}
