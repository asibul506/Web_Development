//Exporting objects to another js page

exports.getDate = function(){
  const today = new Date();
  const options = {
    weekday: "long",
    day: "numeric",
    month: "long"
  }
  return today.toLocaleDateString("en-US", options);
}
