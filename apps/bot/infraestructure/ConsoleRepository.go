package infraestructure

import (
	"DialogFlowFulfilment/domain"
	"fmt"
)

type ConsoleRepository struct {
}

func (receiver ConsoleRepository) InteractAsAnswer(response string) {
	fmt.Println(response)
}

func (receiver ConsoleRepository) Interact(response string) domain.UserResponse {
	userResponse := 0
	fmt.Println(response + " " + "0/1?")
	_, _ = fmt.Scanln(&userResponse)
	return domain.UserResponse(userResponse)
}
