package main

import (
	"context"
	"log"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
)

// State Sentence
type State int

// Definite state
const (
	Definitive State = 3
	Distorted        = 4
	Presumed         = 1
	Favorable        = 2
)

// Judgment by RFC
type Judgment struct {
	State          State  `json:"state"`
	ID             int    `json:"id"`
	CreatedAtBySAT string `json:"createdAtBySAT"`
	CreatedAtByDOF string `json:"createdAtByDOF"`
}

// RFC Json Response
type RFC struct {
	IsLRFC    bool       `json:"isLRFC"`
	Judgments []Judgment `json:"judgments"`
}

func where(rfc string) (response map[string]interface{}, err error) {
	client, err := App.Firestore(context.Background())
	if err != nil {
		log.Fatalln(err)
	}
	query := client.Collection("id").Where("rfc", "==", rfc)
	iter := query.Documents(context.Background())
	doc, err := iter.Next()
	if err != nil {
		return nil, err
	}
	return doc.Data(), nil
}

func handler(request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	query, err := where(request.QueryStringParameters["rfc"])
	if err != nil {
		 return JSON(401, map[string]interface{}{
			"error": "not found",
		})
	}
	return JSON(200, map[string]interface{}{
		"isLRFC": query["isLRFC"],
		"rfcBlockListStatus": query["rfcBlockListStatus"],
	})
}

func main() {
	InitAdmin()
	lambda.Start(MiddlewareAuth(MiddlewareForNoRequest(handler)))
}
