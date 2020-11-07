package main

import (
	"context"
	"fmt"
	"log"
	"time"

	"cloud.google.com/go/firestore"
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
	updateDocumentUsers(apiKey)
	return ""
}

func updateDocumentUsers(apiKey string) {
	collection := fmt.Sprintf("users/%s/quota", apiKey)
	updateCounter(collection, time.Now().Format("01-02-2006"), "quota")
}

func setDocument(collection string, doc string, document map[string]interface{}) {
	client, err := App.Firestore(context.Background())
	if err != nil {
		log.Fatalln(err)
	}
	client.Collection(collection).Doc(doc).Set(context.Background(), document)
}

func updateCounter(collection string, doc string, value string) (*firestore.WriteResult, error) {
	client, err := App.Firestore(context.Background())
	if err != nil {
		log.Fatalln(err)
	}
	return client.Collection(collection).Doc(doc).Update(context.Background(), []firestore.Update{
		{Path: "quota", Value: firestore.Increment(1)},
	})
}
