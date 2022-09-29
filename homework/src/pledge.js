"use strict";
/*----------------------------------------------------------------
Promises Workshop: construye la libreria de ES6 promises, pledge.js
----------------------------------------------------------------*/
class $Promise {
  constructor(executor) {
    if (typeof executor !== "function") {
      throw new TypeError("executor is not a function");
    }
    this._state = "pending";
    this._handlerGroups = [];

    this._internalResolve = (someData) => {
      if (this._state === "pending") {
        this._state = "fulfilled";
        this._value = someData;
      }
      this._callHandlers(this._value);
    };
    this._internalReject = (someReason) => {
      if (this._state === "pending") {
        this._state = "rejected";
        this._value = someReason;
      }
      this._callHandlers(this._value);
    };
    this._callHandlers = () => {
      while (this._handlerGroups.length) {
        var handler = this._handlerGroups.shift(); // h.{s, e, d}  <=[{s, e, d}, {s, e, d}, {s, e, d}] <-QUEUE
        if (this._state === "fulfilled") {
          if (!handler.successCb) {
            handler.downstreamPromise._internalResolve(this._value);
          } else {
            // tiene pero puede ser valor, promesa o ERROR -> try {} catch () {}
            try {
              const result = handler.successCb(this._value); // <- ES ERROR ?
              result instanceof $Promise // <- ES PROMESA ?
                ? result.then(
                    (value) =>
                      handler.downstreamPromise._internalResolve(value),
                    (err) => handler.downstreamPromise._internalReject(err)
                  )
                : handler.downstreamPromise._internalResolve(result);
            } catch (error) {
              handler.downstreamPromise._internalReject(error);
            }
          }
        } else {
          // this.state === "rejected"
          if (!handler.errorCb) {
            handler.downstreamPromise._internalReject(this._value);
          } else {
            // tiene pero puede ser valor, promesa o ERROR -> try {} catch () {}
            try {
              const result = handler.errorCb(this._value);
              result instanceof $Promise
                ? result.then(
                    (value) =>
                      handler.downstreamPromise._internalResolve(value),
                    (err) => handler.downstreamPromise._internalReject(err)
                  )
                : handler.downstreamPromise._internalResolve(result);
            } catch (error) {
              handler.downstreamPromise._internalReject(error);
            }
          }
        }
      }
    };
    this.then = (successCb, errorCb) => {
      if (typeof successCb !== "function") successCb = false;
      if (typeof errorCb !== "function") errorCb = false;
      const downstreamPromise = new $Promise(() => {});
      this._handlerGroups.push({
        successCb,
        errorCb,
        downstreamPromise,
      });
      if (this._state !== "pending") {
        this._callHandlers(this._value);
      }
      return downstreamPromise;
    };
    this.catch = (errorCb) => {
      return this.then(null, errorCb);
    };
    this.resolve = () => {};

    executor(this._internalResolve, this._internalReject);
  }
}
// const pA = new $Promise((resolve, reject) => {
//   reject("not");
// });
// console.log(
//   pA
//     .then(
//       (data) => data * 2,
//       (err) => {
//         console.log(err);
//       }
//     )
//     .then(
//       (data) => {
//         data * 2;
//       },
//       (err) => {
//         console.log(err);
//       }
//     )
//     .then((data) => console.log(data), null)
// );

module.exports = $Promise;
/*-------------------------------------------------------
El spec fue diseñado para funcionar con Test'Em, por lo tanto no necesitamos
realmente usar module.exports. Pero aquí está para referencia:

module.exports = $Promise;

Entonces en proyectos Node podemos esribir cosas como estas:

var Promise = require('pledge');
…
var promise = new Promise(function (resolve, reject) { … });
--------------------------------------------------------*/
