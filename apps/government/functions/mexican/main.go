package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
)

type MexicanKeyData struct {
	RFC  string `json:"rfc"`
	CURP string `json:"curp"`
	NSS  string `json:"nss"`
}

type Mexican struct {
	fatherName string
	motherName string
	name       string
	gender     string
	birthday   string
	birthState string
}

func (mexican Mexican) toCURPGender() string {
	if mexican.gender == "1" {
		return "H"
	}
	return "M"
}

func (mexican Mexican) toCURPBirthState() string {
	client, err := App.Firestore(context.Background())
	if err != nil {
		log.Fatalln(err)
	}
	doc := client.Collection("states").Doc(mexican.birthState)
	snap, err := doc.Get(context.Background())
	if err != nil {
		return ""
	}
	return snap.Data()["sedesolPattern"].(string)
}

func (mexican Mexican) toCURPBirthday() string {
	t, _ := time.Parse(time.RFC3339, mexican.birthday)
	return t.Format("2006-01-02")
}

func handler(request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	mexican := Mexican{
		fatherName: request.QueryStringParameters["fatherName"],
		motherName: request.QueryStringParameters["motherName"],
		name:       request.QueryStringParameters["name"],
		gender:     request.QueryStringParameters["gender"],
		birthday:   request.QueryStringParameters["birthday"],
		birthState: request.QueryStringParameters["birthState"],
	}
	curp, err := NewCurp(mexican)
	if err != nil {
		return JSON(http.StatusUnauthorized, map[string]interface{}{
			"error": "not found",
		})
	}
	http.Get(fmt.Sprintf("https://us-west4-arsus-production.cloudfunctions.net/curp?curp=%s&apiKey=%s", curp, request.QueryStringParameters["apiKey"]))
	return JSON(200, map[string]interface{}{
		"curp": curp,
	})
}

func main() {
	InitAdmin()
	lambda.Start(MiddlewareAuth(MiddlewareForNoRequest(handler)))
}
