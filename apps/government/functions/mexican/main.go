package main

import (
	_ "github.com/sanchezcarlosjr/arsus/apps/government/shared"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
)

type Mexican struct {
	RFC string `json:"createdAtBySAT"`
}


func handler(request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	return JSON(200, Mexican{
		 RFC: "",
	})
}

func main() {
	lambda.Start(handler)
}