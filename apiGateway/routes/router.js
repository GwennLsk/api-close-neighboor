let services = require('./services');
let axios = require('axios');
let _ = require('lodash');

module.exports = function (app) {
    for (let service in services) {
        if (services.hasOwnProperty(service)) {
            app.get(services[service].api, (req, res) => {
                axios.get(services[service].url, {
                    headers: req.headers
                })
                    .then((resp) => {
                        res.send(resp.data);
                    })
                    .catch((err) => res.send(err.data))
            });
            app.get(services[service].api+'/:id', (req, res) => {
                let headers = {};
                keys = Object.keys(req.headers);
                keys.forEach(key => {
                    if (key.startsWith('options-')) {
                        headers[key] = req.headers[key]
                    }
                });
                axios.get(services[service].url+'/'+req.params.id, {
                    headers: headers
                } )
                    .then((resp) => {
                        res.send(resp.data);
                    })
                    .catch((err) => res.send(err.data))
            });
            app.post(services[service].api, (req, res) => {
                axios.post(services[service].url, req.body )
                    .then((resp) => {
                        res.send(resp.data);
                    })
                    .catch((err) => res.send(err.data))
            });
            app.put(services[service].api+'/:id', (req, res) => {
                axios.put(services[service].url+'/'+req.params.id, req.body )
                    .then((resp) => {
                        res.send(resp.data);
                    })
                    .catch((err) => res.send(err.data))
            });
            app.delete(services[service].api+'/:id', (req, res) => {
                axios.delete(services[service].url+'/'+req.params.id)
                    .then((resp) => {
                        res.send(resp.data);
                    })
                    .catch((err) => res.send(err.data))
            });
        }
    }
};
