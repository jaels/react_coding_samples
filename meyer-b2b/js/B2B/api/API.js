

function getTheProducts() {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: encodeURI(`${options.props.basePath}rest/${options.props.storeCode}/V1/b2bproducts?searchCriteria[filterGroups][0][filters][0][field]=status&searchCriteria[filterGroups][0][filters][0][value]=1&searchCriteria[filterGroups][0][filters][0][conditionType]=eq&searchCriteria[filterGroups][1][filters][0][field]=type_id&searchCriteria[filterGroups][1][filters][0][value]=configurable&searchCriteria[filterGroups][2][filters][0][field]=category_id&searchCriteria[filterGroups][2][filters][0][value]=${options.props.categoryId}${options.props.query ? `&searchCriteria[filterGroups][3][filters][0][field]=sku&searchCriteria[filterGroups][3][filters][0][value]=${options.props.query}&searchCriteria[filterGroups][3][filters][0][conditionType]=like&searchCriteria[filterGroups][3][filters][1][field]=name&searchCriteria[filterGroups][3][filters][1][value]=${options.props.query}&searchCriteria[filterGroups][3][filters][1][conditionType]=like` : ""}`),
            type: "GET",
            headers: {
                'Content-Type': "application/json",
                'Accept': "application/json"
            },
            dataType: "json",
            success: response => {
                resolve(response);
            }
        });
    }).catch(err => {
        if (err) {
            console.log(err);
        }
    });
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
                triggerCartUpdate();
                resolve(response);
            },
            error: function(jq, status, message) {
                resolve("error");
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
                triggerCartUpdate();
                resolve(response);
            },
            error: function(jq, status, message) {
                resolve("error");

            }
        })
    })
}


function getQuoteId() {
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
                triggerCartUpdate();
                resolve(response);
            },
            error: function(jq, status, message) {
                resolve("error");
            }
        })
    })

}
