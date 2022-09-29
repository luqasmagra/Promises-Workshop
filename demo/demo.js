const fulfil1 = new Promise((resolve, reject) => {
  resolve("Resuelto 1");
});
const fulfil2 = new Promise((resolve, reject) => {
  resolve("Resuelto 2");
});
const reject1 = new Promise((resolve, reject) => {
  reject("Rechazado 1");
});
const reject2 = new Promise((resolve, reject) => {
  reject("Rechazado 2");
});

// CASO 1
// fulfil1.then((value) => {
//   console.log(value);
// });

// CASO 2

// reject1.then(
//   (value) => {
//     console.log(value);
//   },
//   (reason) => {
//     console.log(reason);
//   }
// );

// CASO 3
// La promesa se RESUELVE y no tengo success handler
// fulfil1 // promesa => Resuelve a "Resuelto 1"
//   .then() // promesa => Resuelve a "Resuelto 1"
//   .then((value) => console.log(value));

// CASO 4
// La promesa se RECHAZA y no tengo un error handler
// reject1 // promesa => se RECHAZÓ
//   .then((value) => console.log(value)) // promesa =>
//   .then((value) => console.log(value)) // promesa =>
//   .then((value) => console.log(value)) // promesa =>
//   .then((value) => console.log(value)) // promesa =>
//   .catch((err) => console.log(err)); // Rechazado 1

// CASO 5
// La promesa se resuelve y tengo HANDLERS. El success handler retorna un valor
// fulfil1
//   .then(
//     (value) => {
//       return "Te paso este value";
//     },
//     (err) => console.log(err)
//   )
//   .then((value) => console.log(value));

// CASO 6
//
// reject1 // rechazando
//   .then(
//     (value) => {
//       return "otro value";
//     }, // successHandler
//     (err) => {
//       throw err;
//     } // errorHandler
//   )
//   .then(
//     (value) => console.log("successHandler", value),
//     (err) => console.log("errorHandler", err)
//   ); //

// CASO 7
// reject1 // resolviendo
//   .then(
//     (value) => {
//       return reject2;
//     }, // successHandler
//     (err) => {
//       throw "error";
//     } // errorHandler
//   )
//   // en el medio... estamos trabajando la promesa reject1
//   .then(
//     (value) => console.log("successHandler", value),
//     (err) => {
//       throw console.log("errorHandler", err);
//     }
//   );
