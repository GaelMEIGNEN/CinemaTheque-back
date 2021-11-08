const user = "user123";
const password = "user123";
const database = "CinemaTheque";
const uri =
  "mongodb+srv://" +
  user +
  ":" +
  password +
  "@cluster0.iyg1n.mongodb.net/" +
  database +
  "?retryWrites=true&w=majority";

const conf = {
  user: user,
  password: password,
  database: database,
  uri: uri,
};

export default conf;
