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
	userResponse := ""
	fmt.Println(response + " " + "y/n, previous (p)")
	_, _ = fmt.Scan(&userResponse)
	return mapInputToUserResponse(userResponse)
}

func mapInputToUserResponse(userType string) domain.UserResponse {
	switch userType {
	case "y":
		return domain.YES
	case "n":
		return domain.NO
	case "m":
		return domain.MAYBE
	case "p":
		return domain.PREVIOUS
	default:
		return domain.YES
	}
}
