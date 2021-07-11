const mongoose = require('mongoose');

mongoose.connect(`mongodb+srv://${process.env.DB_USER_NAME}:${process.env.DB_USER_PASS}@${process.env.DB_CLUSTER_NAME}.g6ksi.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`,
	{
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useCreateIndex : true,
		useFindAndModify: false
	})
	.then(() => console.log('MongoDB connected !'))
	.catch((e) => console.log('failed to connect to MongoDB.', e));
