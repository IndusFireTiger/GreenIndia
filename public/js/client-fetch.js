let fetchData = dataNeeded => {
  let fetchedData = fetch(dataNeeded)
    .then(function(response) {
      return response.json()
    })
    .then(function(myJSON) {
      return myJSON
    })
    .catch(function(error) {
      console.log("could not fetch : "+dataNeeded)
      console.error(error)
    })
  return fetchedData
}

module.exports.clientFetch = fetchData