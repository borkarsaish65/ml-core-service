/**
 * name : users.js
 * author : Aman Jung Karki
 * Date : 11-Nov-2019
 * Description : All users related api call.
 */

//dependencies
const request = require('request');
const userServiceUrl = process.env.USER_SERVICE_URL;
const serverTimeout = parseInt(process.env.USER_SERVICE_TIMEOUT);

const profile = function ( token,userId = "" ) {
    return new Promise(async (resolve, reject) => {
        try {

            let url = userServiceUrl + constants.endpoints.USER_READ;

            if( userId !== "" ) {
                url = url + "/" + userId;
            }

            const options = {
                headers : {
                    "content-type": "application/json",
                    "x-authenticated-user-token" : token
                }
            };

            request.post(url,options,kendraCallback);

            function kendraCallback(err, data) {

                let result = {
                    success : true
                };

                if (err) {
                    result.success = false;
                } else {

                    let response = JSON.parse(data.body);
                    if( response.status === httpStatusCode['ok'].status ) {
                        result["data"] = response.result.response;
                    } else {
                        result["message"] = response.message;
                        result.success = false;
                    }

                }

                return resolve(result);
            }

        } catch (error) {
            return reject(error);
        }
    })
}

/**
  * 
  * @function
  * @name locationSearch
  * @param {object} filterData -  bodydata .
  * @returns {Promise} returns a promise.
*/

const locationSearch = function ( filterData, pageSize = "", pageNo = "", searchKey = "" ) {
    return new Promise(async (resolve, reject) => {
        try {
          let bodyData = {};
          bodyData["request"] = {};
          bodyData["request"]["filters"] = filterData;
  
          if ( pageSize !== "" ) {
              bodyData["request"]["limit"] = pageSize;
          } 
  
          if ( pageNo !== "" ) {
              let offsetValue = pageSize * ( pageNo - 1 ); 
              bodyData["request"]["offset"] = offsetValue;
          }
  
          if ( searchKey !== "" ) {
              bodyData["request"]["query"] = searchKey
          }
          
          const url = 
          userServiceUrl + constants.endpoints.GET_LOCATION_DATA;
          const options = {
              headers : {
                "content-type": "application/json"
            },
              json : bodyData
          };
          request.post(url,options,requestCallback);
  
          let result = {
              success : true
          };
  
          function requestCallback(err, data) {
              if (err) {
                  result.success = false;
              } else {
                  let response = data.body;
                  if( response.responseCode === constants.common.OK &&
                      response.result &&
                      response.result.response &&
                      response.result.response.length > 0
                    ) {
                      result["data"] = response.result.response;
                      result["count"] = response.result.count;
                  } else {
                        result.success = false;
                  }
              }
              return resolve(result);
          }
  
          setTimeout(function () {
             return resolve (result = {
                 success : false
              });
          }, serverTimeout);
  
  
        } catch (error) {
            return reject(error);
        }
    })
  }
  
  
  
  /**
    * 
    * @function
    * @name schoolData
    * @param {String} bearerToken - autherization token.
    * @param {object} bodyData -  location id
    * @param {array} fields - set of data keys need to be fetched.
    * @param {String} searchKey - search key for fuzzy search.
    * @returns {Promise} returns a promise.
  */
  const schoolData = function ( filterData, pageSize = "", pageNo = "", searchKey = "", fields = [] ) {
        return new Promise(async (resolve, reject) => {
            try {
                
                let bodyData = {};
                bodyData["request"] = {};
                bodyData["request"]["filters"] = filterData;
    
                if ( pageSize !== "" ) {
                    bodyData["request"]["limit"] = pageSize;
                } 
        
                if ( pageNo !== "" ) {
                    let offsetValue = pageSize * ( pageNo - 1 ); 
                    bodyData["request"]["offset"] = offsetValue;
                }
        
                if ( searchKey !== "" ) {
                    bodyData["request"]["fuzzy"] = {
                        "orgName" : searchKey
                    }
                }
                
                //for getting specified key data only.
                if ( fields.length > 0 ) {
                    bodyData["request"]["fields"] = fields;
                }
  
                const url = 
                userServiceUrl + constants.endpoints.GET_SCHOOL_DATA;
                const options = {
                    headers : {
                        "content-type": "application/json"
                        },
                    json : bodyData
                };
    
                request.post(url,options,requestCallback);
                let result = {
                    success : true
                };
    
                function requestCallback(err, data) {
        
                    if (err) {
                        result.success = false;
                    } else {
                        
                        let response = data.body;
                        
                        if( response.responseCode === constants.common.OK) {
                            result["data"] = response.result;
                        } else {
                            result.success = false;
                        }
                    }
                    return resolve(result);
                }
                setTimeout(function () {
                    return resolve (result = {
                        success : false
                    });
                }, serverTimeout);
  
            } catch (error) {
                return reject(error);
            }
        })
    }
  
module.exports = {
    profile : profile,
    locationSearch : locationSearch,
    schoolData :schoolData
}
