function getTheWarenkorb() {
    return new Promise((resolve, reject)=> {
        $.ajax({
            url: `${options.props.basePath}rest/${options.props.storeCode}/V1/b2bproducts/cart/${options.props.quoteId}`,
            type: "GET",
            headers: {
                'Content-Type': "application/json",
                'Accept': "application/json"
            },
            dataType: "json",
            success: response => {
                resolve(response);
            }
        })
    })
}


function postToTheWarenkorb(temp) {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: `${options.props.basePath}rest/${options.props.storeCode}/V1/carts/mine/items`,
            type: "POST",
            headers: {
                'Content-Type': "application/json",
                'Accept': "application/json"
            },
            data: JSON.stringify(temp),
            dataType: "json",
            success: response => {
                resolve(response);
            }
        })
    })

}


function deleteFromWarenkorb(itemId) {
    return new Promise((resolve, reject)=> {
        $.ajax({
            url: `${options.props.basePath}rest/${options.props.storeCode}/V1/carts/mine/items/${itemId}`,
            type: "DELETE",
            headers: {
                'Content-Type': "application/json",
                'Accept': "application/json"
            },
            dataType: "json",
            success: response => {
                resolve(response);
            }
        })
    })
}


function putTheBestellung(temp) {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: `${options.props.basePath}rest/${options.props.storeCode}/V1/carts/mine/order`,
            type: "PUT",
            headers: {
                'Content-Type': "application/json",
                'Accept': "application/json"
            },
            data: JSON.stringify(temp),
            dataType: "json",
            success: response => {
                resolve(response);
            },
            error: function(jq, status, message) {
                resolve("error");
            }
        })
    })

}
