import { each, includes, sumBy, remove } from 'lodash';
import { currency, clearCart } from '~/config'
import Router from 'vue-router'
const router = new Router({ mode: 'history' })
import { createToken } from 'vue-stripe-elements-plus'

const state = (state) => ({
    added: [],
    items: [],
    skuArray: [],
    variantsArray: [],
    checkoutStatus: null,
    cartName: 'Sevino',
    currency: currency,
    discount: 0,
    freeShipping: false,
    shipping: {},
    showCart: false,
    deliveryServices: [],
    cartVendors: [],
    cartTotalCost: 0,
})

// getters
const getters = {
    showCart(state) {
        return state.showCart
    },
    getItems(state) {
        return (state.items && state.items.length > 0) ? state.items : []
    },
    // toNumber: (state, value, x) => {
    //     value *= 1;
    //     return isNaN(value) ? 0 : value;
    // },

    getTotalDiscount(state) {
        let amount = 0;
        let mrp = 0;
        let price = 0;
    },

    getShippingAmount(state) {
        return state.shipping;
    },

    getCartTotalCost(state) {
        return state.cartTotalCost;
    },

    getDeliveryServices(state) {
        return state.deliveryServices;
    },

    getCartVendors(state) {
        return state.cartVendors;
    },

    getDiscount(state) {
        return state.discount
    },

    getTotalCount(state) {
        const record = sumBy(state.items, function (o) { return o.qty / o.qty; });
        return record
        // return state.items.length;
    },
    getQty: state => ({ _id, vid }) => {
        for (let i in state.items) {
            if (state.items[i].productId === _id && state.items[i].vid === vid) {
                return state.items[i].qty
            }
        }
    },
    checkCart: state => ({ _id, vid }) => { // Returns true when there is item in cart
        return includes(state.skuArray, _id) && includes(state.variantsArray, vid)
    },

    getSubtotal(state) { // After discount
        if (state.items) {
            const sum = state.items.reduce((subtotal, item) => {
                return subtotal + (item.hot ? item.sellingPrice : item.originalPrice || 0) * (item.qty || 1)
            }, 0)
            return state.discount ? sum - state.discount : sum
        } else {
            return 0
        }
    },

    getTaxes(state, getters) {
        return 0;//getters.getSubtotal * 0.18
    },

    getTotal(state, getters) { //After shipping
        return getters.getSubtotal + getters.getShippingAmount
    }

}

// actions
const actions = {
    async fetch({ commit }) {
        try {
            const data = (await api.cart.me()).data
            commit('setCart', data)
            return data
        }
        catch (err) {
            commit('setErr', err, { root: true })
        }
    },

    // adds or remove an item from cart
    addToCart({ commit, state, rootState }, { product, variant, qty, vendorId }) {

        if (state.items.length === 0) state.showCart = true // User training
        const record = state.items.find(p => p.productId === product._id)
        if (record) {
            // If the product is already there in cart.
            if (parseInt(record.qty) + parseInt(qty) <= record.stock) {
                // if count is less than stock
                record.qty = parseInt(record.qty) + parseInt(qty);
                if (record.qty <= 0) {
                    remove(state.items, function (r) {
                        return r.productId === product._id;
                    });
                    state.skuArray.splice(product._id, 1)
                    state.variantsArray.splice(variant._id, 1)
                }
            } else {
                // console.log('out of stock');
                commit("setWarning", "Out of stock. Available stock is " + product.stock, { root: true });
            }
        } else {
            var item;
            if (qty <= product.stock) {
                // if qty is less than stock
                if (product.productType.key == 'single') {
                    item = { productId: product._id, vendorId: vendorId, name: product.variants[0].wineName, slug: product.slug, hot: product.hot, originalPrice: product.originalPrice, sellingPrice: product.sellingPrice, qty: qty, img: product.variants[0].img[0], category: product.variants[0].category, vid: product.variants[0]._id, stock: product.stock }
                } else {
                    item = { productId: product._id, vendorId: vendorId, name: product.bundleName, slug: product.slug, hot: product.hot, originalPrice: product.originalPrice, sellingPrice: product.sellingPrice, qty: qty, img: product.coverImg, category: product.variants[0].category, vid: product.variants[0]._id, stock: product.stock }
                }
                state.items.push(item)
            } else {
                // console.log('out of stock');
                commit("setWarning", "Out of stock. Available stock is " + product.stock, { root: true });
            }
        }
        if (state.items.length === 0) state.showCart = false // When all items are removed from cart
        // this.$cookies.set('sevino_items', state.items)

        state.skuArray = state.items.map(a => a._id);
        state.variantsArray = state.items.map(a => a.vid);

        // group cartItems by vendor
        let vendors = rootState.vendors;

        state.cartVendors = [];

        for (let i = 0; i < state.items.length; i++) {
            let isExist = false;
            for (let j = 0; j < state.cartVendors.length; j++) {
                if (state.items[i].vendorId == state.cartVendors[j]._id) {
                    isExist = true;
                    state.cartVendors[j].cartProducts.push(state.items[i]);
                }
            }

            if (!isExist) {
                // if this cartItem is not existed in cartVendors, add vendor info as well as cart item
                for (let j = 0; j < vendors.length; j++) {
                    if (state.items[i].vendorId == vendors[j]._id) {
                        let cartVendorItem = vendors[j];
                        cartVendorItem.cartProducts = [];
                        cartVendorItem.cartProducts.push(state.items[i]);
                        state.cartVendors.push(cartVendorItem);
                    }
                }
            }
        }

        // this.$cookies.set('cart_vendors', state.cartVendors)

    },

    addMoreToCart({ commit, state, rootState }, { product, variant, qty }) {
        if (state.items.length === 0) state.showCart = true // User training
        const record = state.items.find(p => p.productId === product.productId)
        if (record) {
            // If the product is already there in cart.
            if (parseInt(record.qty) + parseInt(qty) <= record.stock) {
                // if count is less than stock
                record.qty = parseInt(record.qty) + parseInt(qty);
                if (record.qty <= 0) {
                    remove(state.items, function (r) {
                        return r.productId === product.productId;
                    });
                    state.skuArray.splice(product.productId, 1)
                    state.variantsArray.splice(variant.productId, 1)
                }
            } else {
                // console.log('out of stock');
                commit("setWarning", "Out of stock. Available stock is " + product.stock, { root: true });
            }
        } else {
            var item;
            if (qty <= product.stock) {
                if (product.productType.key == 'single') {
                    item = { productId: product.productId, name: product.variants[0].wineName, slug: product.slug, hot: product.hot, originalPrice: product.originalPrice, sellingPrice: product.sellingPrice, qty: qty, img: product.variants[0].img[0], category: product.variants[0].category, vid: product.variants[0]._id }
                } else {
                    item = { productId: product.productId, name: product.bundleName, slug: product.slug, hot: product.hot, originalPrice: product.originalPrice, sellingPrice: product.sellingPrice, qty: qty, img: product.variants[0].img[0], category: product.variants[0].category, vid: product.variants[0]._id }
                }
                state.items.push(item)
            } else {
                // console.log('out of stock');
                commit("setWarning", "Out of stock. Available stock is " + product.stock, { root: true });
            }
        }
        if (state.items.length === 0) state.showCart = false // When all items are removed from cart

        // this.$cookies.set('sevino_items', state.items)
        state.skuArray = state.items.map(a => a._id);
        state.variantsArray = state.items.map(a => a.vid);

        // group cartItems by vendor
        let vendors = rootState.vendors;
        state.cartVendors = [];

        for (let i = 0; i < state.items.length; i++) {
            let isExist = false;
            for (let j = 0; j < state.cartVendors.length; j++) {
                if (state.items[i].vendorId == state.cartVendors[j]._id) {
                    isExist = true;
                    state.cartVendors[j].cartProducts.push(state.items[i]);
                }
            }

            if (!isExist) {
                // if this cartItem is not existed in cartVendors, add vendor info as well as cart item
                for (let j = 0; j < vendors.length; j++) {
                    if (state.items[i].vendorId == vendors[j]._id) {
                        let cartVendorItem = vendors[j];
                        cartVendorItem.cartProducts = [];
                        cartVendorItem.cartProducts.push(state.items[i]);
                        state.cartVendors.push(cartVendorItem);
                    }
                }
            }
        }
        // this.$cookies.set('cart_vendors', state.cartVendors)

        // calculate shippingCost based on deliveryServices
        if (state.deliveryServices.length > 0) {
            let totalPrice = 0;
            for (let i = 0; i < state.cartVendors.length; i++) {
                // calculate for current vendor's products price
                let subTotal = 0;
                for (let j = 0; j < state.cartVendors[i].cartProducts.length; j++) {
                    subTotal += state.cartVendors[i].cartProducts[j].hot
                        ? state.cartVendors[i].cartProducts[j].sellingPrice *
                        state.cartVendors[i].cartProducts[j].qty
                        : state.cartVendors[i].cartProducts[j].originalPrice *
                        state.cartVendors[i].cartProducts[j].qty;
                }

                state.cartVendors[i].subTotalCost = subTotal;
                state.cartVendors[i].deliveryCost = 0;
                state.cartVendors[i].totalCost = subTotal;

                // if current vendor's selectedService is shipping and it's price is less than freeShippingAmount, add shipping price
                if (state.deliveryServices[i] == "Versand") {
                    state.cartVendors[i].totalCost = subTotal + state.cartVendors[i].shippingCost;
                    state.cartVendors[i].deliveryCost = state.cartVendors[i].shippingCost;
                }

                // if current Vendor's selectedService is 'vendor delivery', shipping cost equals 'shippingCost' when subTotal is not met to 'minAmountForSameDayDelivery'
                if (state.deliveryServices[i] == "Lieferung" && subTotal < state.cartVendors[i].minAmountForSameDayDelivery) {
                    state.cartVendors[i].totalCost = subTotal + state.cartVendors[i].shippingCost;
                    state.cartVendors[i].deliveryCost = state.cartVendors[i].shippingCost;
                }

                totalPrice += state.cartVendors[i].totalCost;
            }

            state.cartTotalCost = totalPrice;

        }
    },

    applyDiscount({ commit }, payload) {
        commit('applyDiscount', payload)
    },
    async checkout({ commit, state, }, { name, email, phone, address, companyName, paymentMethod, amount, stripeInstance, iban, ibanSourceData }) {

        if (email == null || email == "undefined" || email == "" || email == undefined) {
            commit('setErr', 'Email address not found. Please update it at profile', { root: true })
            return
        }

        const currency_code = currency.code || '$'
        const attrs = { email, phone, name, amount }

        paymentMethod = paymentMethod || 'Barzahlung'

        let deliveryServices = state.deliveryServices;
        let cartVendors = state.cartVendors;

        switch (paymentMethod) {
            case "PayPal":
                let data = {
                    cmd: "_cart",
                    business: 'Sevino',
                    upload: "1",
                    rm: "2",
                    charset: "utf-8",
                    data: state.items,
                    options: { shipping: 0, couponAmount: 0, discount: 0, address }
                };
                let form = document.createElement('form')
                form.setAttribute("id", "paypalForm")
                form.setAttribute("action", "/api/pay/paypal")
                form.setAttribute("method", "GET")
                form.setAttribute("style", "display:none;")

                if (data !== null) {
                    each(data, function (value, name) {
                        if (value !== null) {
                            let input = document.createElement('input')
                            input.setAttribute('type', 'hidden')
                            input.setAttribute('name', name)
                            input.value = JSON.stringify(value);
                            form.append(input);
                        }
                    });
                }
                document.querySelector("body").append(form);
                form.submit();
                form.remove();
                break;
            case "Barzahlung":

                try {
                    for (let j = 0; j < cartVendors.length; j++) {
                        let items = [];
                        let totalProductCount = 0;
                        for (let ix in cartVendors[j].cartProducts) {
                            let i = cartVendors[j].cartProducts[ix];
                            totalProductCount += i.qty;
                            items.push({ vendorId: i.vendorId, vendorName: i.vendorName, vendorEmail: i.vendorEmail, productId: i.productId, sku: i.sku, name: i.name, url: '/' + i.img, description: i.slug, price: i.hot ? i.sellingPrice : i.originalPrice, qty: i.qty, currency: currency_code })
                        }

                        let orderDetails = {
                            address, items, email, name, phone, companyName, vendorId: cartVendors[j]._id, deliveryService: deliveryServices[j], paymentMethod: 'Barzahlung',
                            amount: { total: cartVendors[j].totalCost, currency: currency_code, details: { qty: totalProductCount, shipping: cartVendors[j].deliveryCost, subtotal: cartVendors[j].subTotalCost } }
                        }

                        await this.$axios.$post('orders', orderDetails)
                    }
                    this.$router.push('/success?id=Barzahlung&msg=success&amount=' + state.cartTotalCost)
                } catch (e) {
                    // console.log(e);
                    commit('setErr', err.response, { root: true })
                }
                break;

            case "Creditcard":

                try {
                    let stripeResponse = null;
                    for (let j = 0; j < cartVendors.length; j++) {
                        commit('setLoading', true, { root: true })
                        const { token } = await createToken();
                        commit('setLoading', false, { root: true })

                        let items = [];
                        let totalProductCount = 0;
                        for (let ix in cartVendors[j].cartProducts) {
                            let i = cartVendors[j].cartProducts[ix];
                            totalProductCount += i.qty;
                            items.push({ vendorId: i.vendorId, vendorName: i.vendorName, vendorEmail: i.vendorEmail, productId: i.productId, sku: i.sku, name: i.name, url: '/' + i.img, description: i.slug, price: i.hot ? i.sellingPrice : i.originalPrice, qty: i.qty, currency: currency_code })
                        }

                        let orderDetails = {
                            address, items, email, name, phone, companyName, vendorId: cartVendors[j]._id, deliveryService: deliveryServices[j], paymentMethod: 'Creditcard',
                            amount: { total: cartVendors[j].totalCost, currency: currency_code, details: { qty: totalProductCount, shipping: cartVendors[j].deliveryCost, subtotal: cartVendors[j].subTotalCost } }
                        }

                        stripeResponse = await this.$axios.$post("stripe/pay", {
                            email,
                            token,
                            orderDetails
                        });
                    }

                    this.$router.push('/success?method=Creditcard&amount=' + state.cartTotalCost + '&id=' + stripeResponse.id + '&orderNo=' + stripeResponse.metadata.orderNo + '&msg=success')

                } catch (err) {
                    commit('setErr', err.response.data.message, { root: true })
                }

                break;

            case "SEPA":

                try {
                    let stripeResponse = null;
                    for (let j = 0; j < cartVendors.length;j++) {
                        commit('setLoading', true, { root: true })

                        const result = await stripeInstance.createSource(iban, ibanSourceData);

                        let items = [];
                        let totalProductCount = 0;
                        for (let ix in cartVendors[j].cartProducts) {
                            let i = cartVendors[j].cartProducts[ix];
                            totalProductCount += i.qty;
                            items.push({ vendorId: i.vendorId, vendorName: i.vendorName, vendorEmail: i.vendorEmail, productId: i.productId, sku: i.sku, name: i.name, url: '/' + i.img, description: i.slug, price: i.hot ? i.sellingPrice : i.originalPrice, qty: i.qty, currency: currency_code })
                        }

                        let orderDetails = {
                            address, items, email, name, phone, companyName, vendorId: cartVendors[j]._id, deliveryService: deliveryServices[j], paymentMethod: 'SEPA',
                            amount: { total: cartVendors[j].totalCost, currency: currency_code, details: { qty: totalProductCount, shipping: cartVendors[j].deliveryCost, subtotal: cartVendors[j].subTotalCost } }
                        }

                        stripeResponse = await this.$axios.$post("stripe/pay", {
                            email,
                            token: result.source,
                            orderDetails
                        });
                    }

                    this.$router.push('/success?method=SEPA&amount=' + state.cartTotalCost + '&id=' + stripeResponse.id + '&orderNo=' + stripeResponse.orderNo + '&msg=success')

                } catch (err) {
                    commit('setLoading', false, { root: true })
                    commit('setErr', err.response.data, { root: true })
                }

                break;

            case "Instamojo":
                let formI = document.createElement("form");
                formI.setAttribute("id", "instamojoForm");
                formI.setAttribute("action", "/api/pay/instamojo");
                formI.setAttribute("method", "GET");
                formI.setAttribute("style", "display:none;");

                if (attrs !== null) {
                    each(attrs, function (value, name) {
                        if (value !== null) {
                            let input = document.createElement("input");
                            input.setAttribute("type", "hidden");
                            input.setAttribute("name", name);
                            input.value = value;
                            formI.append(input);
                        }
                    });
                }
                document.querySelector("body").append(formI);
                formI.submit();
                formI.remove();
                break;
            default:
                // console.log("Unknown checkout service: " + method);
                break;
        }
    },
}

// mutations
const mutations = {
    // save items to local storage
    toggleCart(state, payload) {
        state.showCart = payload
    },
    storeCart(state, items) {
        if (!items)
            return
        // items = JSON.parse(items)
        state.items = items
        state.skuArray = items.map(a => a._id);
        state.variantsArray = items.map(a => a.vid);
    },
    clearCart(state, items) {
        state.items = []
        // this.$cookies.set("sevino_items", [])
        // this.$cookies.set("cart_vendors", [])
        state.items = []
        state.skuArray = []
        state.variantsArray = []
        state.deliveryServices = []
        state.cartVendors = []
    },
    saveShippingAmount(state, payload) {
        state.shipping = payload;
    },
    saveCartTotalCost(state, amount) {
        state.cartTotalCost = amount;
    },
    saveDeliveryServices(state, payload) {
        state.deliveryServices = payload;
        let totalPrice = 0;

        // calculate shippingCost based on deliveryServices
        if (state.deliveryServices && state.deliveryServices.length > 0) {

            for (let i = 0; i < state.deliveryServices.length; i++) {
                // calculate for current vendor's products price
                let subTotal = 0;
                if (!state.cartVendors[i] || !state.cartVendors[i].cartProducts) {
                    return;
                }
                for (let j = 0; j < state.cartVendors[i].cartProducts.length; j++) {
                    subTotal += state.cartVendors[i].cartProducts[j].hot
                        ? state.cartVendors[i].cartProducts[j].sellingPrice *
                        state.cartVendors[i].cartProducts[j].qty
                        : state.cartVendors[i].cartProducts[j].originalPrice *
                        state.cartVendors[i].cartProducts[j].qty;
                }

                state.cartVendors[i].subTotalCost = subTotal;
                state.cartVendors[i].deliveryCost = 0;
                state.cartVendors[i].totalCost = subTotal;

                // if current vendor's selectedService is shipping and it's price is less than freeShippingAmount, add shipping price
                if (state.deliveryServices[i] == "Versand") {
                    state.cartVendors[i].totalCost = subTotal + state.cartVendors[i].shippingCost;
                    state.cartVendors[i].deliveryCost = state.cartVendors[i].shippingCost;
                }

                // if current Vendor's selectedService is 'vendor delivery', shipping cost equals 'shippingCost' when subTotal is not met to 'minAmountForSameDayDelivery'
                if (state.deliveryServices[i] == "Lieferung" && subTotal < state.cartVendors[i].minAmountForSameDayDelivery) {
                    state.cartVendors[i].totalCost = subTotal + state.cartVendors[i].shippingCost;
                    state.cartVendors[i].deliveryCost = state.cartVendors[i].shippingCost;
                }

                totalPrice += state.cartVendors[i].totalCost;
            }

            state.cartTotalCost = totalPrice;
        }
    },
    saveCartVendors(state, payload) {
        state.cartVendors = payload;
    },
    applyDiscount(state, amount) {
        state.discount = amount
    },
}
export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}

