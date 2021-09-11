# lambda-expressjs
A demo of express js, that runs both locally and in lambda.

This express app has 3 features:
- Serverside rendering via ejs
- The ability to serve static assests ( gorgamel and css for example )
- An API

You might ask why would I want to serve static assets from lambda rather then s3?  
- You have an exsiting app that you want to move to lambda and off long lived infra with minimal/no code change
- You need all connetivity over a private network ( private api-gateway )
- You want to deploy your applicaiton as a whole ( front end and backedn in the same repository/infrsastructure )

This respository consists of:
- Localstack docker-compose file with DynamoDB and S3 ready for use.
- A noodejs Express application that has a view template, some demonstration API's and the ability to serve static content
- A Sam Template to provision the AWS Cloudn infrastructure
- A sample dataset
- A script to load that sample dataset

Run locally ( express app ):

```
npm install nodemon
cd api
npm i
node run dev
```

This will enable hot relading ( edit the code save and the api will be updated no need to stop and start node each file change )

Endpoints (GET) are:

http://localhost:3000/
http://localhost:3000/index
http://localhost:3000/fruitbox
http://localhost:3000/fruitbox/:boxItemId


Endpoints (POST) are:

http://localhost:3000/fruitbox

This requires contenttype set tp application/json and a body such as:

```
{
    "fruitName" : "Apple",
    "qty" : 50
}
```

Here is the curl command:
```
curl --location --request POST 'http://localhost/fruitbox' \
--header 'Content-Type: application/json' \
--data-raw '{
    "fruitName" : "Apple",
    "qty" : 50
}'
```

How to deploy to AWS Lambda?

Ensure you have SAM installed and configured: https://aws.amazon.com/serverless/sam/

Then simply run
```
sam build
```

Then:
```
sam deploy -g
```

For subsequent builds use:
```
sam build && sam deploy
```

Enjoy your Serverless express app in AWS Lambda