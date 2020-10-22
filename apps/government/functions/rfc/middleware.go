package main

import (
	"bytes"
	"encoding/json"
	"net/http"
	"regexp"

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


func ensureRFC(rfc string) bool {
	naturalPerson, _ := regexp.MatchString("^(([A-ZÑ&]{4})([0-9]{2})([0][13578]|[1][02])(([0][1-9]|[12][\\d])|[3][01])([A-Z0-9]{3}))|(([A-ZÑ&]{4})([0-9]{2})([0][13456789]|[1][012])(([0][1-9]|[12][\\d])|[3][0])([A-Z0-9]{3}))|(([A-ZÑ&]{4})([02468][048]|[13579][26])[0][2]([0][1-9]|[12][\\d])([A-Z0-9]{3}))|(([A-ZÑ&]{4})([0-9]{2})[0][2]([0][1-9]|[1][0-9]|[2][0-8])([A-Z0-9]{3}))$",
		rfc)
	legalPerson, _ := regexp.MatchString("^(([A-ZÑ&]{3})([0-9]{2})([0][13578]|[1][02])(([0][1-9]|[12][\\d])|[3][01])([A-Z0-9]{3}))|(([A-ZÑ&]{3})([0-9]{2})([0][13456789]|[1][012])(([0][1-9]|[12][\\d])|[3][0])([A-Z0-9]{3}))|(([A-ZÑ&]{3})([02468][048]|[13579][26])[0][2]([0][1-9]|[12][\\d])([A-Z0-9]{3}))|(([A-ZÑ&]{3})([0-9]{2})[0][2]([0][1-9]|[1][0-9]|[2][0-8])([A-Z0-9]{3}))$",
		rfc)
	return !naturalPerson && !legalPerson
}

// MiddlewareForNoRequest validate query
func MiddlewareForNoRequest(next Middleware) Middleware {
   return Middleware(func(request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	    if ensureRFC(request.QueryStringParameters["rfc"]) {
			return JSON(400, map[string]interface{}{
				"error": "bad RFC format",
			})
	    }
		return next(request)
	})
}