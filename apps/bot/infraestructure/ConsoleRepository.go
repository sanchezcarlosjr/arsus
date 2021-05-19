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
	fmt.Print(response + " ")
	_, _ = fmt.Scan(&userResponse)
	return mapInputToUserResponse(userResponse)
}

func mapInputToUserResponse(userType string) domain.UserResponse {
	if Translation.Yes[userType] {
		return domain.YES
	}
	if Translation.No[userType] {
		return domain.NO
	}
	if Translation.Previous[userType] {
		return domain.PREVIOUS
	}
	if Translation.Maybe[userType] {
		return domain.MAYBE
	}
	return domain.YES
}
