package main

import (
	"bytes"
	"encoding/json"
	"net/http"

	"github.com/aws/aws-lambda-go/events"
)

// JSON by Gateway
func JSON(statusCode int, message interface{}) (events.APIGatewayProxyResponse, error) {
	var buf bytes.Buffer
	body, err := json.Marshal(message)
	if err != nil {
		return events.APIGatewayProxyResponse{StatusCode: 404}, err
	}
	json.HTMLEscape(&buf, body)
	resp := events.APIGatewayProxyResponse{
		StatusCode:      statusCode,
		IsBase64Encoded: false,
		Body:            buf.String(),
		Headers: map[string]string{
			"Content-Type": "application/json",
		},
	}
	return resp, nil
}



// Middleware is a generic JSON Lambda handler used to chain middleware.
type Middleware func(events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error)


// MiddlewareAuth ensures api key 
func MiddlewareAuth(next Middleware) Middleware {
   return Middleware(func(request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	   	err := EnsureAPIKey(request.QueryStringParameters["apiKey"])
		if err != "" {
			return JSON(http.StatusUnauthorized, map[string]interface{}{
				"error": err,
			})
		}
		return next(request)
	})
}

// MiddlewareForNoRequest validate query
func MiddlewareForNoRequest(next Middleware) Middleware {
   return Middleware(func(request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
		if request.QueryStringParameters["fatherName"] == "" ||
		   request.QueryStringParameters["motherName"] == "" ||
		   request.QueryStringParameters["name"] == "" ||
		   request.QueryStringParameters["gender"] == "" ||
		   request.QueryStringParameters["birthday"] == "" ||
		   request.QueryStringParameters["birthState"] == ""  {
			return JSON(http.StatusUnauthorized, map[string]interface{}{
				"error": "bad request",
			})
		}
		return next(request)
	})
}