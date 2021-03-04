package infraestructure

import (
  "DialogFlowFulfilment/application"
  "fmt"
)

type ConsoleRepository struct {
}

func (receiver ConsoleRepository) InteractAsAnswer(response string) {
  fmt.Println(response)
}

func (receiver ConsoleRepository) Interact(response string) application.UserResponse {
	userResponse := 0
	fmt.Println(response + " " + "0/1?")
	_, _ = fmt.Scanln(&userResponse)
	return application.UserResponse(userResponse)
}
