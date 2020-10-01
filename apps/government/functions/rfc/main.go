package main

import (
	"bytes"
	"context"
	"encoding/json"
	"regexp"

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

func ensureRFC(rfc string) bool {
	naturalPerson, _ := regexp.MatchString("^(([A-ZÑ&]{4})([0-9]{2})([0][13578]|[1][02])(([0][1-9]|[12][\\d])|[3][01])([A-Z0-9]{3}))|(([A-ZÑ&]{4})([0-9]{2})([0][13456789]|[1][012])(([0][1-9]|[12][\\d])|[3][0])([A-Z0-9]{3}))|(([A-ZÑ&]{4})([02468][048]|[13579][26])[0][2]([0][1-9]|[12][\\d])([A-Z0-9]{3}))|(([A-ZÑ&]{4})([0-9]{2})[0][2]([0][1-9]|[1][0-9]|[2][0-8])([A-Z0-9]{3}))$", 
	rfc)
	legalPerson, _ := regexp.MatchString("^(([A-ZÑ&]{3})([0-9]{2})([0][13578]|[1][02])(([0][1-9]|[12][\\d])|[3][01])([A-Z0-9]{3}))|(([A-ZÑ&]{3})([0-9]{2})([0][13456789]|[1][012])(([0][1-9]|[12][\\d])|[3][0])([A-Z0-9]{3}))|(([A-ZÑ&]{3})([02468][048]|[13579][26])[0][2]([0][1-9]|[12][\\d])([A-Z0-9]{3}))|(([A-ZÑ&]{3})([0-9]{2})[0][2]([0][1-9]|[1][0-9]|[2][0-8])([A-Z0-9]{3}))$", 
	rfc)
    return !naturalPerson && !legalPerson
} 

func response(statusCode int, message map[string]interface{}) (Response, error) {
	var buf bytes.Buffer
	body, err := json.Marshal(message)
	if err != nil {
		return Response{StatusCode: 404}, err
	}
	json.HTMLEscape(&buf, body)

	resp := Response{
		StatusCode:      statusCode,
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
		return response(401, map[string]interface{}{
  			"error": err,
		});
	}
	if (ensureRFC(request.QueryStringParameters["rfc"])) {
		return response(400, map[string]interface{}{
  			"error": "bad RFC format",
		});
	}
	return response(200, map[string]interface{}{
		  "isBlockList": false,
		  "isLRFC": false,
	});
}

func main() {
	InitAdmin()
	lambda.Start(Handler)
}
