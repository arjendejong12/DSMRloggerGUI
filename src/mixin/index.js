export default {
  methods: {
    formatDate: function(type, dateIn) {
      let date = "";
      if (type == "hours") {
        date = dateIn.substr(4, 2);
        date += "-" + dateIn.substr(2, 2);
        date += "-20" + dateIn.substr(0, 2);
        date += " [" + dateIn.substr(6, 2);
        date += "h]";
      } else if (type == "days") {
        date = "[" + dateIn.substr(4, 2);
        date += "]-" + dateIn.substr(2, 2);
        date += "-20" + dateIn.substr(0, 2);
      } else if (type == "months") {
        date = dateIn.substr(4, 2);
        date += "-[" + dateIn.substr(2, 2);
        date += "]-20" + dateIn.substr(0, 2);
      } else if (type == "timestamp") {
        date = dateIn.substr(4, 2);
        date += "-" + dateIn.substr(2, 2);
        date += "-20" + dateIn.substr(0, 2);
        date += " " + dateIn.substr(6, 2);
        date += ":" + dateIn.substr(8, 2);
        date += ":" + dateIn.substr(10, 2);
      } else {
        date =
          "20" +
          dateIn.substring(0, 2) +
          "-" +
          dateIn.substring(2, 4) +
          "-" +
          dateIn.substring(4, 6) +
          ":" +
          dateIn.substring(6, 8);
      }
      return date;
    }
  }
};
