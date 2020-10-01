package main

import (
	"bytes"
	"context"
	"encoding/json"

	firebase "firebase.google.com/go"
	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"google.golang.org/api/option"
)

// Response should gateway
type Response events.APIGatewayProxyResponse

// App is frebaseAdmin
var App *firebase.App

// InitAdmin begins settings firebase
func InitAdmin() {
	ctx := context.Background()
	sa := option.WithCredentialsFile("bin/serviceAccount.json")
	App, _ = firebase.NewApp(ctx, nil, sa)
}

// EnsureAPIKey validate api key
func EnsureAPIKey(apiKey string) string {
	if apiKey == "" {
		return "invalid API Key"
	}
	client, err := App.Auth(context.Background())
	if err != nil {
		return "error 500"
	}
	_, err = client.GetUser(context.Background(), apiKey)
	if err != nil {
		return "api key not found"
	}
	return ""
}


func response(statusCode int, message map[string]interface{}) (Response, error) {
	var buf bytes.Buffer
	body, err := json.Marshal(message)
	if err != nil {
		return Response{StatusCode: 404}, err
	}
	json.HTMLEscape(&buf, body)

	resp := Response{
		StatusCode:      200,
		IsBase64Encoded: false,
		Body:            buf.String(),
		Headers: map[string]string{
			"Content-Type":           "application/json",
		},
	}
	return resp, nil
}

// Handler by AWS
func Handler(request events.APIGatewayProxyRequest) (Response, error) {
	err := EnsureAPIKey(request.QueryStringParameters["apiKey"])
	if err != "" {
		return response(400, map[string]interface{}{
  			"err": err,
		});
	}
	return response(200, map[string]interface{}{
		  "isValidRFC": true,
		  "isLRFC": true,
	});
}

func main() {
	lambda.Start(Handler)
}
