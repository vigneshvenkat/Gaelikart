var alertMessages = {
    wrongCredentials : "Please check the credentials entered",
    wrongRegisterDetails : "Check the entered details",
    correctRegisterDetails : "Please check your E-mail to verify your account",
    correctCredentials : "Login Success",
    recaptchaFailed : "Recaptcha verification failed",
    sellerProductUpdated : "Product details have been updated",
    sellerProductNotUpdated : "Product update failed",
    sellerProductRemoved : "Product has been succussfully removed",
    sellerProductNotRemoved : "Preoduct has not been removed",
    buyerRemoved : "Buyer has been deleted",
    buyerNotRemoved : "Buyer has not been deleted",
    sellerRemoved : "Buyer has been deleted",
    sellerNotRemoved : "Buyer has not been deleted",
    productAddedSuccess : "Product added successfully",
    productAddedFailed : "Product adding failed"
}

var app = new Vue({
    el : "#gaelikart",
    data : {
        tabIndex : 0,
        user: {
            register : {
                firstName : null,
                lastName : null,
                authorities : null,
                email : null,
                username : null,
                password : null,
                enabled : false,
                passwordConfirm : null
            },
            login : {
                username : null,
                password : null
            }
        },
        roles : [
            {
                value : "SELLER",
                text : "Seller"
            },
            {
                value : "BUYER",
                text : "Buyer"
            }
        ],
        seller : {
            product : {
                productName : null,
                category : null,
                quantity: null,
                description: null,
                price: null,
                image: null
            }
        },
        categories : [
            {
                value : "Whiskey",
                text : "Whiskey"
            },
            {
                value : "Rum",
                text : "Rum"
            },
            {
                value : "Vodka",
                text : "Vodka"
            },
            {
                value : "Beer",
                text : "Beer"
            }
        ],
        products : [],
        showOverlay : true,
        alertMessage : null,
        loginFailedCountDown : 0,
        registerFailedCountDown : 0,
        loginSuccessCountDown : 0,
        registerSuccessCountDown : 0,
        orderPlacedSuccessCountDown : 0,
        productUpdatedFailedCountDown :0,
        productUpdatedSuccessCountDown : 0,
        adminSuccessCountDown : 0,
        adminFailedCountDown : 0,
        addProductSuccessCountDown : 0,
        addProductFailedCountDown : 0,
        token : null,
        role : null,
        page : null,
        showCart : false,
        showProfile : false,
        showAddProduct : false,
        orderItems: [],
        orderFields : [
            {
                key : "productName",
                label : "Product Name"
            },
            {
                key : "seller",
                label : "Seller"
            },
            {
                key : "quantity",
                label : "Quantity"
            },
            {
                key : "delete",
                label : ""
            }
        ],
        orderHistoryItems : [],
        orderHistoryFields : [
            {
                key : "productName",
                label : "Product Name"
            },
            {
                key : "seller",
                label : "Seller"
            },
            {
                key : "quantity",
                label : "Quantity"
            }
        ],
        sellerProductsItems : [],
        sellerProductsFields : [
            {
                key : "id",
                label : "Id"
            },
            {
                key : "productName",
                label : "Product Name"
            },
            {
                key : "category",
                label : "Category"
            },
            {
                key : "quantity",
                label : "Quantity"
            },
            {
                key : "description",
                label : "Description"
            },
            {
                key : "price",
                label : "Price"
            },
            {
                key : "update",
                label : ""
            },
            {
                key : "delete",
                label : ""
            }
        ],
        users : {},
        sellersProducts : {},
        sellersProductsFields : [
            {
                key : "id",
                label : "Product Id"
            },
            {
                key : "productName",
                label : "Product Name"
            },
            {
                key : "category",
                label : "Category"
            },
            {
                key : "quantity",
                label : "Quantity"
            },
            {
                key : "description",
                label : "Description"
            },
            {
                key : "price",
                label : "Price"
            }
        ],
        buyersOrders : {},
        buyersOrdersFields : [
            {
                key : "id",
                label : "Order Id"
            },
            {
                key : "paymentAmount",
                label : "Payment Amount"
            }
        ]
    },
    created: () => {
        $(document).ready(()=>{
            setTimeout(()=>{
                app.showOverlay = false;
                if((app.token !== null) && (app.role !== null))
                {
                    app.page = app.role;
                }else
                {
                    app.page = "login";
                }
            },1000);
        });
    },
    computed: {
        validateEmail() {
            var emailRegex = /(.+)@(.+){2,}\.(.+){2,}/;
            return ((this.user.register.email != null) && (this.user.register.email.trim() != "")) ? emailRegex.test(this.user.register.email.toLowerCase()) : null;
        },
        validatePassword() {
            var passwordRegex = /^(?=.*[\d])(?=.*[!@#$%^&*])[\w!@#$%^&*]{6,16}$/;
            return ((this.user.register.password != null) && (this.user.register.password.trim() != "")) ? passwordRegex.test(this.user.register.password.toLowerCase()) : null;
        },
        validateConfirmPassword() {
            return (((this.user.register.password != null) && (this.user.register.passwordConfirm != null)) && (this.user.register.password.trim() != "") && (this.user.register.passwordConfirm.trim() != "")) ? this.user.register.password === this.user.register.passwordConfirm : null;
        }
    },
    methods : {
        loginSubmit () {
            if(Object.values(this.user.login).every(x => x === null || x.trim() === ''))
            {
                Gaelikart.alertMessage(alertMessages.wrongCredentials, "login","failed");
                return;
            }else
            {
                grecaptcha.ready(function() {
                    grecaptcha.execute('6LdYgpIfAAAAAHtoWbajz4Hgpw64KMl8coI-HrQZ', {action: 'submit'}).then(function(token) {
                        fetch("https://localhost/auth/signin", {
                            method: 'POST',
                            mode: 'no-cors',
                            headers: {
                                'Content-Type' : 'application/json'
                            },
                            body: JSON.stringify(
                                {
                                    "username" : app.user.login.username,
                                    "password" : app.user.login.password,
                                    "recaptcha" : token,
                                }
                            )}).then(response => response.json())
                            .then(data => {
                                if(data.token != null)
                                {
                                    Gaelikart.alertMessage(alertMessages.correctCredentials, "login", "success");
                                    setTimeout(()=>{
                                        app.showOverlay = true;
                                        app.token = data.token;
                                        app.user.login = {
                                            username : "",
                                            password : ""
                                        };
                                        Gaelikart.loginAuthenticated(data.role);
                                    },3000);
                                }else if((data.token == null) && (data.status == 401))
                                {
                                    Gaelikart.alertMessage(alertMessages.wrongCredentials, "login", "failed");
                                } else if(data.status == 409)
                                {
                                    Gaelikart.alertMessage(alertMessages.recaptchaFailed, "login", "failed");
                                }
                            }
                        ).catch(error => {
                            console.log(error);
                        });
                    }).catch(error => {
                        console.log(error);
                    });
                });
            }
        },

        registerSubmit () {
            if(Object.values(this.user.register).every(x => x === null || x.trim() === ''))
            {
                Gaelikart.alertMessage(alertMessages.wrongRegisterDetials, "register", "failed");
                return;
            }else
            {
                fetch("https://localhost/signup", {
                    method: 'POST',
                    headers: {
                      'Content-Type' : 'application/json'
                    },
                    body: JSON.stringify(
                        {
                            firstName : this.user.register.firstName,
                            lastName : this.user.register.lastName,
                            authorities : this.user.register.authorities,
                            email : this.user.register.email,
                            username : this.user.register.username,
                            password : this.user.register.password,
                            enabled : this.user.register.enabled,
                            passwordConfirm : this.user.register.passwordConfirm
                        }
                    )}).then(response => 
                        (response.status == 400) ? response.json() : (response.status == 201) ? {} : {}
                    ).then(data => {
                        if(Object.keys(data).length === 0)
                        {
                            app.user.register = {
                                firstName : "",
                                lastName : "",
                                authorities : "",
                                email : "",
                                username : "",
                                password : "",
                                enabled : "",
                                passwordConfirm : ""
                            };
                            Gaelikart.alertMessage(alertMessages.correctRegisterDetails, "register", "success");
                            setTimeout(()=>{
                                app.tabIndex = 0;
                                app.showOverlay = false;
                            },3000);
                        }else
                        {
                            Gaelikart.alertMessage(alertMessages.wrongRegisterDetails, "register", "failed");
                        }
                    }
                ).catch(error => {
                    console.log(error);
                });
            }
        },

        addToCart (product) {

            var orderQuantity = 0;
            app.orderItems.forEach((item,i)=> {
                if(item.productId == product.id)
                {
                    app.orderItems[i].quantity = item.quantity*1 + product.orderQuantity*1;
                    orderQuantity = app.orderItems[i].quantity;
                }
            });

            if(orderQuantity !== 0)
            {
                fetch("https://localhost/buyer/cart/updateQuantity", {
                    method: 'POST',
                    headers: {
                        'Content-Type' : 'application/json',
                        'Authorization' : "Bearer "+app.token
                    },
                    body: JSON.stringify(
                        {
                            "quantity": orderQuantity*1,
                            "id": product.id
                        }
                    )}).then(response =>  {}).catch(error => {
                        console.log(error);
                    });
            }else
            {
                fetch("https://localhost/buyer/addCart", {
                    method: 'POST',
                    headers: {
                        'Content-Type' : 'application/json',
                        'Authorization' : "Bearer "+app.token
                    },
                    body: JSON.stringify(
                        {
                            "quantity": product.orderQuantity,
                            "productId": product.id
                        }
                    )}).then(response =>  {}).catch(error => {
                        console.log(error);
                    });
            }
        },

        getCart () {
            fetch("https://localhost/buyer/getCart", {
                method: 'GET',
                headers: {
                    'Content-Type' : 'application/json',
                    'Authorization' : "Bearer "+app.token
                },
                }).then(response => response.json()).then(data => {
                    this.$refs['modal-cart'].show();
                    app.orderItems = [];
                    data.forEach((product)=> {
                        app.orderItems.push(
                            { 
                                productName : product.product.productName, 
                                quantity : product.quantity,
                                productId : product.product.id,
                                seller : "seller"
                            }
                        );
                    });
                }
            ).catch(error => {
                console.log(error);
            });
        },

        updateCart() {
            fetch("https://localhost/buyer/addCart", {
                method: 'POST',
                headers: {
                    'Content-Type' : 'application/json',
                    'Authorization' : "Bearer "+app.token
                },
                body: JSON.stringify(
                    {
                        "quantity": product.orderQuantity,
                        "productId": product.id
                    }
                )}).then(response =>  {}).catch(error => {
                    console.log(error);
                });
        },
        removeFromCart(index) {
            fetch("https://localhost/buyer/cart/removeProduct", {
                method: 'POST',
                headers: {
                    'Content-Type' : 'application/json',
                    'Authorization' : "Bearer "+app.token
                },
                body: app.orderItems[index].productId
                }).then(response =>  {
                    app.orderItems.splice(index,1);
                }
            ).catch(error => {
                console.log(error);
            });
        },

        orderHistory() {
            fetch("https://localhost/buyer/getOrderHistory", {
                method: 'GET',
                headers: {
                    'Content-Type' : 'application/json',
                    'Authorization' : "Bearer "+app.token
                },
                }).then(response => response.json()).then(data => {
                    this.$refs['modal-orderHistory'].show();
                    data.forEach((order)=>{
                        order.lineItems.forEach((lineItem)=> {
                            app.orderHistoryItems.push(
                                { 
                                    productName : lineItem.product.productName, 
                                    quantity : lineItem.quantity,
                                    seller : "seller"
                                }
                            );
                        });
                    });
                }
            ).catch(error => {
                console.log(error);
            });
        },

        placeOrder() {
            var orderItems = [];
            app.orderItems.forEach((orderItem)=>{
                orderItems.push({
                    productId : orderItem.productId,
                    quantity : orderItem.quantity
                })
            });
            fetch("https://localhost/buyer/order", {
                method: 'POST',
                headers: {
                    'Content-Type' : 'application/json',
                    'Authorization' : "Bearer "+app.token
                },
                body: JSON.stringify(
                    orderItems
                )}).then(response => {
                    app.orderPlacedSuccessCountDown = 3;
                    setTimeout(()=>{
                        this.$refs['modal-cart'].hide();
                        app.orderItems.forEach((order, index)=>{
                            fetch("https://localhost/buyer/cart/removeProduct", {
                                method: 'POST',
                                headers: {
                                    'Content-Type' : 'application/json',
                                    'Authorization' : "Bearer "+app.token
                                },
                                body: app.orderItems[index].productId
                                }).then(response =>  {
                                app.orderItems.splice(index,1);
                            }).catch(error => {
                                console.log(error);
                            });
                        });
                    },3000);
                }
            ).catch(error => {
                console.log(error);
            });
        },

        addSellerProduct() {
            app.seller.product.price = app.seller.product.price*1;
            app.seller.product.quantity = app.seller.product.quantity*1;

            fetch("https://localhost/seller/addProduct", {
                method: 'POST',
                headers: {
                    'Content-Type' : 'application/json',
                    'Authorization' : "Bearer "+app.token
                },
                body: JSON.stringify(
                    app.seller.product
                )}).then(response => {
                    try
                    {
                        if(response.status == 200)
                        {
                            Gaelikart.alertMessage(alertMessages.productAddedSuccess, "seller", "success");
                        }else
                        {
                            Gaelikart.alertMessage(alertMessages.productAddedFailed, "seller", "failed");
                        }
                    }catch(error)
                    {
                        console.error("Exception in addProduct");
                        console.log(error);
                    }
                }
            ).catch(error => {
                console.log(error);
            });
        },

        updateSellerProduct(id,price,quantity){
            fetch("https://localhost/seller/updateProduct", {
                method: 'POST',
                headers: {
                    'Content-Type' : 'application/json',
                    'Authorization' : "Bearer "+app.token
                },
                body: JSON.stringify(
                    {
                        "id": id,
                        "price": price,
                        "quantity": quantity
                    }
                )}).then(data => {
                    if(data.status == 200)
                    {
                        Gaelikart.alertMessage(alertMessages.sellerProductUpdated, "seller", "success");
                    }else
                    {
                        Gaelikart.alertMessage(alertMessages.sellerProductNotUpdated, "seller", "failed");
                    }
                }
            ).catch(error => {
                console.log(error);
            });
        },

        removeSellerProduct(id, index) {
            fetch("https://localhost/seller/removeProduct", {
                method: 'POST',
                headers: {
                    'Content-Type' : 'application/json',
                    'Authorization' : "Bearer "+app.token
                },
                body: JSON.stringify(
                    {
                        "id": id
                    }
                )}).then(data => {
                    app.sellerProductsItems.splice(index,1);
                    if(data.status == 200)
                    {
                        Gaelikart.alertMessage(alertMessages.sellerProductRemoved, "seller", "success");
                    }else
                    {
                        Gaelikart.alertMessage(alertMessages.sellerProductNotRemoved, "seller", "failed");
                    }
                }
            ).catch(error => {
                console.log(error);
            });
        },

        deleteBuyer(id) {
            fetch("https://localhost/admin/removeUser", {
                method: 'POST',
                headers: {
                    'Content-Type' : 'application/json',
                    'Authorization' : "Bearer "+app.token
                },
                body: JSON.stringify(
                    {
                        "id" : id
                    }
                )}).then(response =>  {
                    if(response.status === 200)
                    {
                        Gaelikart.alertMessage(alertMessages.buyerRemoved, "admin", "success");
                        delete app.buyersOrders[id];
                        delete app.users[id];
                    }else
                    {
                        Gaelikart.alertMessage(alertMessages.buyerNotRemoved, "admin", "failed");
                    }
                }
            ).catch(error => {
                console.log(error);
            });
        },

        deleteSeller(id) {
            fetch("https://localhost/admin/removeUser", {
                method: 'POST',
                headers: {
                    'Content-Type' : 'application/json',
                    'Authorization' : "Bearer "+app.token
                },
                body: JSON.stringify(
                    {
                        "id" : id
                    }
                )}).then(response =>  {
                if(response.status === 200)
                {
                    Gaelikart.alertMessage(alertMessages.sellerRemoved, "admin", "success");
                    delete app.sellersProducts[id];
                    delete app.users[id];
                }else
                {
                    Gaelikart.alertMessage(alertMessages.sellerNotRemoved, "admin", "failed");
                }
            }).catch(error => {
                console.log(error);
            });
        },

        imageValue(e){
            const image = e.target.files[0];
            const reader = new FileReader();
            reader.readAsDataURL(image);
            reader.onload = e =>{
                app.seller.product.image = (e.target.result).split(",")[1];
            };
        },

        logout() {
            app.showOverlay = true;
            setTimeout(()=> {
                app.token = null;
                location.reload();
            },3000);
        }
    }
});

var Gaelikart = {

    alertMessage : (value, func, status) => {
        app.alertMessage = value;

        switch(func) {
            case "login" :
                (status === "failed") ? app.loginFailedCountDown = 4 : app.loginSuccessCountDown = 4;
                $('html, #loginTab').animate({ scrollTop: 0 }, 'fast');
                break;
    
            case "register" :
                (status === "failed") ? app.registerFailedCountDown = 4 : app.registerSuccessCountDown = 4;
                $('html, #registerTab').animate({ scrollTop: 0 }, 'fast');
                break;
            
            case "seller" :
                (status === "failed") ? app.productUpdatedFailedCountDown = 2 : app.productUpdatedSuccessCountDown = 2;
                $('html, #sellerTab').animate({ scrollTop: 0 }, 'fast');
                break;
            
            case "admin" :
                (status === "failed") ? app.adminFailedCountDown = 2 : app.adminSuccessCountDown = 2;
                $('html, #sellerTab').animate({ scrollTop: 0 }, 'fast');
                break;
            
            case "sellertAddProduct" :
                (status === "failed") ? addProductFailedCountDown = 2 : addProductSuccessCountDown = 2;
                $('html, #sellerTab').animate({ scrollTop: 0 }, 'fast');
                break;
            
            default: throw new Error("XDR Read Error: Got '"+value+"' when trying to read a bool");
        }
    },
    loginAuthenticated : (role)=>{
        switch(role) {
            case "BUYER" :
                app.page = 'buyer';

                fetch("https://localhost/allProducts", {
                    method: 'GET',
                    headers: {
                        'Content-Type' : 'application/json',
                        'Authorization' : "Bearer "+app.token
                    }}).then(response => response.json()
                    ).then(products => {
                        app.showOverlay = false;
                        products.forEach((product)=>{
                            app.products.push({
                                id : product.id,
                                productName : product.productName,
                                url : "data:image/jpg;base64,"+product.image,
                                description : product.description,
                                quantity : product.quantity,
                                orderQuantity : 1
                            });
                        });
                    }).catch(error => {
                        console.log(error);
                    });
                break;

            case "SELLER" :
                app.page = "seller";
                fetch("https://localhost/seller/getProducts",{
                    method : "GET",
                    headers : {
                        'Content-Type' : 'application/json',
                        'Authorization' : "Bearer "+app.token
                    }}).then(response => response.json()
                    ).then(products => {
                        app.showOverlay = false;
                        app.sellerProductsItems = products;
                    }).catch(error => {
                        console.log(error);
                    });
                break;

            case "ADMIN" :
                app.page = "admin";
                fetch("https://localhost/admin/getUsers",{
                    method : "GET",
                    headers : {
                        'Content-Type' : 'application/json',
                        'Authorization' : "Bearer "+app.token
                    }}).then(response => response.json()
                    ).then(users => {
                        app.showOverlay = false;
                        
                        users.forEach((user) => {

                            //if(user.enabled)
                            //{
                                app.users[user.id] = user;
                                if(user.authorities === "SELLER")
                                {
                                    fetch("https://localhost/admin/getProducts",{
                                        method : "GET",
                                        headers : {
                                            'Content-Type' : 'application/json',
                                            'Authorization' : "Bearer "+app.token
                                        }}).then(response => response.json()
                                        ).then(sellersProducts => {
                                            app.sellersProducts = sellersProducts;
                                        }).catch(error => {
                                            console.log(error);
                                        });
                                }else if(user.authorities === "BUYER")
                                {
                                    fetch("https://localhost/admin/getOrders",{
                                        method : "GET",
                                        headers : {
                                            'Content-Type' : 'application/json',
                                            'Authorization' : "Bearer "+app.token
                                        }}).then(response => response.json()
                                        ).then(buyersOrders => {
                                            app.buyersOrders = buyersOrders;
                                        }).catch(error => {
                                            console.log(error);
                                        });
                                }
                            //}
                        });
                    }).catch(error => {
                        console.log(error);
                    });
                break;
        }

    }
}