package main

import (
	"DialogFlowFulfilment/domain"
	"fmt"
)

type ConsoleRepository struct {
}

func (receiver ConsoleRepository) Interact(response string) domain.UserResponse {
	userResponse := ""
	fmt.Println(response + " " + "y/n?")
	_, _ = fmt.Scanln(&userResponse)
	return domain.UserResponse(userResponse)
}
