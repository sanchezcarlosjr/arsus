package main

import (
	"context"

	firebase "firebase.google.com/go"
	"github.com/aws/aws-lambda-go/events"
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
