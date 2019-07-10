let services = require('./services');
let axios = require('axios/index');
let qs = require('qs')
let _ = require('lodash');
const app = require('express').Router();

module.exports = function (app) {
    for (let service in services) {
        if (services.hasOwnProperty(service)) {
            let callback = (req, res) => {
                console.log(Object.keys(req.params).length)
                let headers = {};
                let keys = Object.keys(req.headers);
                keys.forEach(key => {
                    if (key.startsWith('options-') || key === 'x-api-key') {
                        headers[key] = req.headers[key]
                        console.log(headers[key])
                    }
                });
                let route;
                if (Object.keys(req.params).length) {
                    if (req.params.path) {
                        route = services[service].url+'/'+req.params.path + '/' + req.params.id, {
                            headers: headers
                        }
                    } else {
                        route = services[service].url+'/'+req.params.id, {
                            headers: headers
                        }
                    }
                } else {

                    route = services[service].url, {
                        headers: req.headers
                    }
                }
                axios.get(route).then((resp) => {
                    res.send(resp.data);
                })
                    .catch((err) => {
                        console.log(err)
                        // res.status(err.response.status).send(err.data)
                    })
            };
            app.get(services[service].api, callback)
            app.get(services[service].api+'/find', (req, res)=> {
                let headers = {};
                let keys = Object.keys(req.headers);
                keys.forEach(key => {
                    if (key.startsWith('options-') || key === 'x-api-key') {
                        headers[key] = req.headers[key]
                        console.log(headers[key])
                    }
                });
                // require('axios-debug-log');
                // axios.interceptors.request.use((config) => console.log(config));
                axios.get(services[service].url+'/find?' + qs.stringify(req.query), {
                    headers: headers,
                }).then((resp) => {
                    res.send(resp.data);
                }).catch((err)=> res.send(err.data))
            })
            app.get(services[service].api + '(/:path)?/:id', callback);
            app.post(services[service].api, (req, res) => {
                let headers = {};
                let keys = Object.keys(req.headers);
                keys.forEach(key => {
                    if (key.startsWith('options-') || key === 'x-api-key') {
                        headers[key] = req.headers[key]
                        console.log(headers[key])
                    }
                });
                axios.post(services[service].url, req.body, {
                    headers: headers
                } )
                    .then((resp) => {
                        res.send(resp.data);
                    })
                    .catch((err) => {
                        res.status(err.response.status).send(err.data)
                    })
            });
            app.post(services[service].api+'/:uri', (req, res) => {
                console.log("post with parms")
                let headers = {};
                let keys = Object.keys(req.headers);
                keys.forEach(key => {
                    if (key.startsWith('options-') || key === 'x-api-key') {
                        headers[key] = req.headers[key]
                        console.log(headers[key])
                    }
                });
                axios.post(services[service].url + '/' + req.params.uri, req.body, {
                    headers: headers
                } )
                    .then((resp) => {
                        res.send(resp.data);
                    })
                    .catch((err) => res.send(err.data))
            });
            app.patch(services[service].api+'/:id', (req, res) => {
                let headers = {};
                let keys = Object.keys(req.headers);
                keys.forEach(key => {
                    if (key.startsWith('options-') || key === 'x-api-key') {
                        headers[key] = req.headers[key]
                        console.log(headers[key])
                    }
                });
                axios.patch(services[service].url+'/'+req.params.id, req.body, {
                    headers: headers
                } )
                    .then((resp) => {
                        res.send(resp.data);
                    })
                    .catch((err) => res.send(err.data))
            });
            app.delete(services[service].api+'/:id', (req, res) => {
                let headers = {};
                let keys = Object.keys(req.headers);
                keys.forEach(key => {
                    if (key.startsWith('options-') || key === 'x-api-key') {
                        headers[key] = req.headers[key]
                        console.log(headers[key])
                    }
                });
                axios.delete(services[service].url+'/'+req.params.id, {
                    headers: headers
                })
                    .then((resp) => {
                        res.send(resp.data);
                    })
                    .catch((err) => res.send(err.data))
            });
        }
    }
};
