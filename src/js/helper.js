// In real world projects, we can have a special module that provides some common usefull functions for a task and this is helper module

import { TIMEOUT_SEC } from "./config.js";

// getJSON() is an async function and it will return a promise and the data will be the resolved value of the promise.
// if there happens any error in getJSON, still getJSON will return a fulfilled promise but not the error.
// So in order to handle the error in respective places the error needs to be rethrown again

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

export const AJAX = async function (url, uploadData = undefined) {
  try {
    const fetchPromise = uploadData
      ? fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(uploadData),
        })
      : fetch(url);

    const response = await Promise.race([fetchPromise, timeout(TIMEOUT_SEC)]);
    const data = await response.json();
    if (!response.ok)
      throw new Error(`${data.message} (${response.status})💥💥`);
    return data;
  } catch (error) {
    throw error;
  }
};

// export const getJSON = async function (url) {
//   try {
//     const fetchPromise = fetch(url);
//     const response = await Promise.race([fetchPromise, timeout(TIMEOUT_SEC)]);
//     const data = await response.json();
//     if (!response.ok)
//       throw new Error(`${data.message} (${response.status})💥💥`);
//     return data;
//   } catch (error) {
//     throw error;
//   }
// };

export const deleteJSON = async function (url) {
  try {
    const fetchPromise = fetch(url, {
      method: "DELETE",
    });
    const response = await Promise.race([fetchPromise, timeout(TIMEOUT_SEC)]);
    const data = await response.json();
    if (!response.ok)
      throw new Error(`${data.message} (${response.status})💥💥`);
    return data;
  } catch (error) {
    throw error;
  }
};
